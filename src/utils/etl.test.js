import { parseCSV, processETL, getJSONTemplate, getCSVTemplate } from './etl';

// ── parseCSV ─────────────────────────────────────────────────────────────────

test('parseCSV parses a simple CSV into objects', () => {
  const csv = 'id,name,type,status,location\nn-1,Supplier A,supplier,operational,Shanghai';
  const rows = parseCSV(csv);
  expect(rows).toHaveLength(1);
  expect(rows[0]).toEqual({ id: 'n-1', name: 'Supplier A', type: 'supplier', status: 'operational', location: 'Shanghai' });
});

test('parseCSV trims whitespace and strips surrounding quotes', () => {
  const csv = 'id,name,type,status,location\n "n-1" , "Supplier A" , supplier , operational , Shanghai ';
  const rows = parseCSV(csv);
  expect(rows[0].id).toBe('n-1');
  expect(rows[0].name).toBe('Supplier A');
});

test('parseCSV throws when header-only CSV is provided', () => {
  expect(() => parseCSV('id,name,type,status,location')).toThrow(/header row.*data row/i);
});

test('parseCSV throws when a row has the wrong number of columns', () => {
  const csv = 'id,name,type,status,location\nn-1,Supplier A,supplier';
  expect(() => parseCSV(csv)).toThrow(/3 column/);
});

// ── processETL – unsupported format ──────────────────────────────────────────

test('processETL rejects unsupported file extensions', () => {
  const { errors } = processETL('{}', 'data.xlsx');
  expect(errors.length).toBeGreaterThan(0);
  expect(errors[0]).toMatch(/unsupported/i);
});

// ── processETL – JSON happy path ─────────────────────────────────────────────

test('processETL processes valid JSON with nodes only', () => {
  const content = JSON.stringify({
    nodes: [{ id: 'n-1', name: 'Supplier A', type: 'supplier', status: 'operational', location: 'Shanghai' }],
  });
  const { nodes, connections, alerts, errors } = processETL(content, 'data.json');
  expect(errors).toHaveLength(0);
  expect(nodes).toHaveLength(1);
  expect(connections).toHaveLength(0);
  expect(alerts).toHaveLength(0);
});

test('processETL processes valid JSON with nodes, connections, and alerts', () => {
  const content = JSON.stringify({
    nodes: [
      { id: 'n-1', name: 'Supplier A', type: 'supplier', status: 'operational', location: 'Shanghai' },
      { id: 'n-2', name: 'Factory A', type: 'manufacturer', status: 'warning', location: 'Shenzhen' },
    ],
    connections: [
      { id: 'c-1', fromNodeId: 'n-1', toNodeId: 'n-2', type: 'supply', bandwidth: 1000, latency: 45 },
    ],
    alerts: [
      { id: 'a-1', nodeId: 'n-1', severity: 'warning', message: 'Degraded throughput', type: 'performance' },
    ],
  });
  const { nodes, connections, alerts, errors } = processETL(content, 'data.json');
  expect(errors).toHaveLength(0);
  expect(nodes).toHaveLength(2);
  expect(connections).toHaveLength(1);
  expect(connections[0]).toMatchObject({ fromNodeId: 'n-1', toNodeId: 'n-2', latency: 45 });
  expect(alerts).toHaveLength(1);
  expect(alerts[0].timestamp).toBeInstanceOf(Date);
});

// ── processETL – status normalisation ────────────────────────────────────────

test('processETL normalises "healthy" status to "operational"', () => {
  const content = JSON.stringify({
    nodes: [{ id: 'n-1', name: 'Tower A', type: 'tower', status: 'healthy', location: 'NYC' }],
  });
  const { nodes, errors } = processETL(content, 'data.json');
  expect(errors).toHaveLength(0);
  expect(nodes[0].status).toBe('operational');
});

// ── processETL – JSON validation errors ──────────────────────────────────────

test('processETL returns error for JSON array root', () => {
  const { errors } = processETL('[]', 'data.json');
  expect(errors.length).toBeGreaterThan(0);
});

test('processETL returns error when nodes array is missing', () => {
  const { errors } = processETL(JSON.stringify({ connections: [] }), 'data.json');
  expect(errors.length).toBeGreaterThan(0);
  expect(errors[0]).toMatch(/nodes/i);
});

test('processETL returns error for invalid node status', () => {
  const content = JSON.stringify({
    nodes: [{ id: 'n-1', name: 'Supplier A', type: 'supplier', status: 'unknown', location: 'NYC' }],
  });
  const { errors } = processETL(content, 'data.json');
  expect(errors.length).toBeGreaterThan(0);
  expect(errors[0]).toMatch(/status/i);
});

test('processETL returns error for node with missing id', () => {
  const content = JSON.stringify({
    nodes: [{ name: 'Supplier A', type: 'supplier', status: 'operational', location: 'NYC' }],
  });
  const { errors } = processETL(content, 'data.json');
  expect(errors.length).toBeGreaterThan(0);
  expect(errors[0]).toMatch(/"id"/i);
});

test('processETL returns error when connection references unknown node', () => {
  const content = JSON.stringify({
    nodes: [{ id: 'n-1', name: 'Supplier A', type: 'supplier', status: 'operational', location: 'NYC' }],
    connections: [{ id: 'c-1', fromNodeId: 'n-1', toNodeId: 'n-999', type: 'supply', bandwidth: 100, latency: 10 }],
  });
  const { errors } = processETL(content, 'data.json');
  expect(errors.length).toBeGreaterThan(0);
  expect(errors[0]).toMatch(/n-999/);
});

test('processETL returns error for invalid alert severity', () => {
  const content = JSON.stringify({
    nodes: [{ id: 'n-1', name: 'Supplier A', type: 'supplier', status: 'operational', location: 'NYC' }],
    alerts: [{ id: 'a-1', nodeId: 'n-1', severity: 'urgent', message: 'Problem', type: 'performance' }],
  });
  const { errors } = processETL(content, 'data.json');
  expect(errors.length).toBeGreaterThan(0);
  expect(errors[0]).toMatch(/severity/i);
});

test('processETL returns error for invalid alert type', () => {
  const content = JSON.stringify({
    nodes: [{ id: 'n-1', name: 'Supplier A', type: 'supplier', status: 'operational', location: 'NYC' }],
    alerts: [{ id: 'a-1', nodeId: 'n-1', severity: 'warning', message: 'Problem', type: 'unknown_type' }],
  });
  const { errors } = processETL(content, 'data.json');
  expect(errors.length).toBeGreaterThan(0);
  expect(errors[0]).toMatch(/type/i);
});

// ── processETL – CSV happy path ───────────────────────────────────────────────

test('processETL processes valid CSV (nodes only)', () => {
  const csv = 'id,name,type,status,location\nn-1,Supplier A,supplier,operational,Shanghai';
  const { nodes, connections, alerts, errors } = processETL(csv, 'data.csv');
  expect(errors).toHaveLength(0);
  expect(nodes).toHaveLength(1);
  expect(nodes[0].name).toBe('Supplier A');
  expect(connections).toHaveLength(0);
  expect(alerts).toHaveLength(0);
});

test('processETL returns error for CSV with wrong column count', () => {
  const csv = 'id,name,type,status,location\nn-1,Supplier A';
  const { errors } = processETL(csv, 'data.csv');
  expect(errors.length).toBeGreaterThan(0);
});

// ── Template helpers ──────────────────────────────────────────────────────────

test('getJSONTemplate returns valid JSON for supply-chain', () => {
  const tpl = getJSONTemplate('supply-chain');
  const parsed = JSON.parse(tpl);
  expect(Array.isArray(parsed.nodes)).toBe(true);
  expect(Array.isArray(parsed.connections)).toBe(true);
  expect(Array.isArray(parsed.alerts)).toBe(true);
});

test('getJSONTemplate returns valid JSON for atc', () => {
  const tpl = getJSONTemplate('atc');
  const parsed = JSON.parse(tpl);
  expect(parsed.nodes[0].type).toBe('tower');
});

test('getCSVTemplate includes header row', () => {
  const tpl = getCSVTemplate('supply-chain');
  expect(tpl.startsWith('id,name,type,status,location')).toBe(true);
});

test('getJSONTemplate is itself importable by processETL', () => {
  const tpl = getJSONTemplate('supply-chain');
  const { errors } = processETL(tpl, 'template.json');
  expect(errors).toHaveLength(0);
});

test('getCSVTemplate is itself importable by processETL', () => {
  const tpl = getCSVTemplate('atc');
  const { errors } = processETL(tpl, 'template.csv');
  expect(errors).toHaveLength(0);
});
