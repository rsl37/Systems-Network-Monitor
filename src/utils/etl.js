// ETL: Extract, Transform, Load utilities for importing data into the app.
// Supports JSON (nodes + connections + alerts) and CSV (nodes only).

const VALID_STATUSES = ['operational', 'healthy', 'warning', 'critical', 'maintenance'];
const VALID_SEVERITIES = ['critical', 'warning', 'info'];
const VALID_ALERT_TYPES = ['node_failure', 'performance', 'capacity', 'communication'];

// Normalise node status – the ERD uses 'healthy', the app uses 'operational'
function normaliseStatus(raw) {
  const s = (raw || '').toLowerCase().trim();
  return s === 'healthy' ? 'operational' : s;
}

// ── Extract ──────────────────────────────────────────────────────────────────

// Parse a CSV string into an array of plain objects using the first row as headers.
export function parseCSV(text) {
  const lines = text.trim().split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV must have a header row and at least one data row');
  }
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line, idx) => {
    // Simple CSV – split on comma, strip surrounding quotes
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length !== headers.length) {
      throw new Error(
        `Row ${idx + 2} has ${values.length} column(s) but the header has ${headers.length}`
      );
    }
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
}

// ── Transform ────────────────────────────────────────────────────────────────

function transformNode(raw, index) {
  const errors = [];
  if (!raw.id || !String(raw.id).trim()) {
    errors.push(`Node ${index + 1}: missing or empty "id"`);
  }
  if (!raw.name || !String(raw.name).trim()) {
    errors.push(`Node ${index + 1}: missing or empty "name"`);
  }
  if (!raw.type || !String(raw.type).trim()) {
    errors.push(`Node ${index + 1}: missing or empty "type"`);
  }
  const status = normaliseStatus(raw.status);
  if (!VALID_STATUSES.includes(status)) {
    errors.push(
      `Node ${index + 1}: status "${raw.status}" must be one of: operational, warning, critical, maintenance`
    );
  }
  if (errors.length) return { errors };
  return {
    node: {
      id: String(raw.id).trim(),
      name: String(raw.name).trim(),
      type: String(raw.type).trim().toLowerCase(),
      status,
      location: raw.location ? String(raw.location).trim() : 'Unknown',
    },
  };
}

function transformConnection(raw, index, nodeIds) {
  const errors = [];
  if (!raw.id || !String(raw.id).trim()) {
    errors.push(`Connection ${index + 1}: missing or empty "id"`);
  }
  const fromId = raw.fromNodeId ? String(raw.fromNodeId).trim() : '';
  const toId = raw.toNodeId ? String(raw.toNodeId).trim() : '';
  if (!fromId || !nodeIds.has(fromId)) {
    errors.push(`Connection ${index + 1}: "fromNodeId" "${raw.fromNodeId}" not found in nodes`);
  }
  if (!toId || !nodeIds.has(toId)) {
    errors.push(`Connection ${index + 1}: "toNodeId" "${raw.toNodeId}" not found in nodes`);
  }
  if (errors.length) return { errors };
  return {
    connection: {
      id: String(raw.id).trim(),
      fromNodeId: fromId,
      toNodeId: toId,
      type: raw.type ? String(raw.type).trim().toLowerCase() : 'supply',
      bandwidth: parseInt(raw.bandwidth, 10) || 0,
      latency: parseInt(raw.latency, 10) || 0,
    },
  };
}

function transformAlert(raw, index, nodeIds) {
  const errors = [];
  if (!raw.id || !String(raw.id).trim()) {
    errors.push(`Alert ${index + 1}: missing or empty "id"`);
  }
  const severity = (raw.severity || '').toLowerCase().trim();
  if (!VALID_SEVERITIES.includes(severity)) {
    errors.push(
      `Alert ${index + 1}: severity "${raw.severity}" must be one of: critical, warning, info`
    );
  }
  if (!raw.message || !String(raw.message).trim()) {
    errors.push(`Alert ${index + 1}: missing or empty "message"`);
  }
  const alertType = (raw.type || '').toLowerCase().trim();
  if (!VALID_ALERT_TYPES.includes(alertType)) {
    errors.push(
      `Alert ${index + 1}: type "${raw.type}" must be one of: node_failure, performance, capacity, communication`
    );
  }
  if (raw.nodeId && !nodeIds.has(String(raw.nodeId).trim())) {
    errors.push(`Alert ${index + 1}: "nodeId" "${raw.nodeId}" not found in nodes`);
  }
  if (errors.length) return { errors };
  return {
    alert: {
      id: String(raw.id).trim(),
      nodeId: raw.nodeId ? String(raw.nodeId).trim() : null,
      severity,
      message: String(raw.message).trim(),
      type: alertType,
      timestamp: new Date(),
      acknowledged: false,
    },
  };
}

// ── Load (main entry point) ───────────────────────────────────────────────────

/**
 * Process an uploaded file through the ETL pipeline.
 * @param {string} fileContent – raw text content of the file
 * @param {string} fileName    – original file name, used to detect format
 * @returns {{ nodes: object[], connections: object[], alerts: object[], errors: string[] }}
 */
export function processETL(fileContent, fileName) {
  const errors = [];
  let raw = {};

  // ── Extract ──
  try {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'json') {
      const parsed = JSON.parse(fileContent);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        errors.push('JSON root must be an object with a "nodes" array');
        return { nodes: [], connections: [], alerts: [], errors };
      }
      raw = parsed;
    } else if (ext === 'csv') {
      // CSV supports nodes only
      raw = { nodes: parseCSV(fileContent) };
    } else {
      errors.push('Unsupported format. Upload a .json or .csv file.');
      return { nodes: [], connections: [], alerts: [], errors };
    }
  } catch (e) {
    errors.push(`Parse error: ${e.message}`);
    return { nodes: [], connections: [], alerts: [], errors };
  }

  if (!Array.isArray(raw.nodes) || raw.nodes.length === 0) {
    errors.push('Data must include a non-empty "nodes" array');
    return { nodes: [], connections: [], alerts: [], errors };
  }

  // ── Transform nodes ──
  const nodes = [];
  raw.nodes.forEach((rawNode, i) => {
    const result = transformNode(rawNode, i);
    if (result.errors) {
      errors.push(...result.errors);
    } else {
      nodes.push(result.node);
    }
  });
  if (errors.length) return { nodes: [], connections: [], alerts: [], errors };

  const nodeIds = new Set(nodes.map(n => n.id));

  // ── Transform connections (optional) ──
  const connections = [];
  if (Array.isArray(raw.connections)) {
    raw.connections.forEach((rawConn, i) => {
      const result = transformConnection(rawConn, i, nodeIds);
      if (result.errors) {
        errors.push(...result.errors);
      } else {
        connections.push(result.connection);
      }
    });
  }
  if (errors.length) return { nodes: [], connections: [], alerts: [], errors };

  // ── Transform alerts (optional) ──
  const alerts = [];
  if (Array.isArray(raw.alerts)) {
    raw.alerts.forEach((rawAlert, i) => {
      const result = transformAlert(rawAlert, i, nodeIds);
      if (result.errors) {
        errors.push(...result.errors);
      } else {
        alerts.push(result.alert);
      }
    });
  }
  if (errors.length) return { nodes: [], connections: [], alerts: [], errors };

  return { nodes, connections, alerts, errors: [] };
}

// ── Template helpers ──────────────────────────────────────────────────────────

export function getJSONTemplate(systemType) {
  if (systemType === 'supply-chain') {
    return JSON.stringify(
      {
        nodes: [
          { id: 'n-1', name: 'Supplier Alpha', type: 'supplier', status: 'operational', location: 'Shanghai' },
          { id: 'n-2', name: 'Factory Alpha', type: 'manufacturer', status: 'operational', location: 'Shenzhen' },
        ],
        connections: [
          { id: 'c-1', fromNodeId: 'n-1', toNodeId: 'n-2', type: 'supply', bandwidth: 1000, latency: 45 },
        ],
        alerts: [
          { id: 'a-1', nodeId: 'n-1', severity: 'warning', message: 'Throughput degradation detected', type: 'performance' },
        ],
      },
      null,
      2
    );
  }
  return JSON.stringify(
    {
      nodes: [
        { id: 'n-1', name: 'Tower Alpha', type: 'tower', status: 'operational', location: 'New York' },
        { id: 'n-2', name: 'TRACON Alpha', type: 'tracon', status: 'operational', location: 'NY Area' },
      ],
      connections: [
        { id: 'c-1', fromNodeId: 'n-1', toNodeId: 'n-2', type: 'communication', bandwidth: 100, latency: 5 },
      ],
      alerts: [
        { id: 'a-1', nodeId: 'n-2', severity: 'critical', message: 'Communication system failure', type: 'communication' },
      ],
    },
    null,
    2
  );
}

export function getCSVTemplate(systemType) {
  const header = 'id,name,type,status,location';
  if (systemType === 'supply-chain') {
    return `${header}\nn-1,Supplier Alpha,supplier,operational,Shanghai\nn-2,Factory Alpha,manufacturer,warning,Shenzhen`;
  }
  return `${header}\nn-1,Tower Alpha,tower,operational,New York\nn-2,TRACON Alpha,tracon,warning,NY Area`;
}
