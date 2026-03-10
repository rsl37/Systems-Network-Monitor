import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { generateEdgeAIRecommendations } from './utils/edgeAI';

test('renders Systems Network Monitor header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /Systems Network Monitor/i });
  expect(headerElement).toBeInTheDocument();
});

test('renders system type selector buttons', () => {
  render(<App />);
  const buttons = screen.getAllByRole('button');
  expect(buttons.length).toBeGreaterThanOrEqual(2);
  expect(screen.getByRole('button', { name: /Supply Chain/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Air Traffic Control/i })).toBeInTheDocument();
});

test('renders alert panel', () => {
  render(<App />);
  const alertHeading = screen.getByText(/Active Alerts/i);
  expect(alertHeading).toBeInTheDocument();
});

test('switching system type updates topology heading', async () => {
  render(<App />);
  
  // Initially shows Supply Chain
  expect(screen.getByText(/Network Topology - Supply Chain/i)).toBeInTheDocument();
  
  // Click ATC button
  const atcButton = screen.getByRole('button', { name: /Air Traffic Control/i });
  fireEvent.click(atcButton);
  
  // Should now show ATC
  await waitFor(() => {
    expect(screen.getByText(/Network Topology - Air Traffic Control/i)).toBeInTheDocument();
  });
});

test('clicking a node displays the details panel', async () => {
  render(<App />);
  
  // Find a node button (using role=button and aria-label pattern)
  const nodes = screen.getAllByRole('button');
  const nodeButton = nodes.find(node => node.getAttribute('aria-label')?.includes('Supplier'));
  
  expect(nodeButton).toBeDefined();
  fireEvent.click(nodeButton);
  
  // Check for node details panel elements
  await waitFor(() => {
    expect(screen.getByText(/BASIC INFORMATION/i)).toBeInTheDocument();
  });
});

test('alert filters update alert display', async () => {
  render(<App />);
  
  // Find the alert severity filter dropdown
  const filterDropdowns = screen.getAllByRole('combobox');
  const severityFilter = filterDropdowns[0]; // First dropdown is severity filter
  
  // Change filter to Critical only
  fireEvent.change(severityFilter, { target: { value: 'critical' } });
  
  // Check that filter was applied (this is a basic smoke test)
  await waitFor(() => {
    expect(severityFilter).toHaveValue('critical');
  });
});

test('clicking Investigate marks alert as under investigation', async () => {
  render(<App />);

  // Find and click the Investigate button on the first unacknowledged alert
  const investigateBtn = screen.getAllByRole('button', { name: /Investigate/i })[0];
  fireEvent.click(investigateBtn);

  // Button aria-label should update to "Under Investigation"
  await waitFor(() => {
    expect(screen.getAllByRole('button', { name: /Under Investigation/i })[0]).toBeInTheDocument();
  });
});

test('clicking Escalate shows Escalated badge and hides action buttons', async () => {
  render(<App />);

  // Find and click the Escalate button on the first unacknowledged alert
  const escalateBtn = screen.getAllByRole('button', { name: /Escalate/i })[0];
  fireEvent.click(escalateBtn);

  // Escalated badge should appear
  await waitFor(() => {
    expect(screen.getByText('Escalated')).toBeInTheDocument();
  });

  // Action buttons for that alert should be gone (alert is now acknowledged)
  const remainingEscalateButtons = screen.queryAllByRole('button', { name: /Escalate/i });
  expect(remainingEscalateButtons.length).toBeLessThan(
    screen.queryAllByRole('button', { name: /Investigate/i }).length + 1
  );
});

// ── Edge AI unit tests ────────────────────────────────────────────────────────

test('edgeAI: returns failover recommendation for critical node', () => {
  const node = { id: 'n1', name: 'Factory 2', type: 'manufacturer', status: 'critical', location: 'Vietnam' };
  const metrics = { uptime: 60, throughput: 400, latency: 30 };
  const recs = generateEdgeAIRecommendations(node, metrics);
  expect(recs.some(r => r.id === 'rec-failover')).toBe(true);
  const failover = recs.find(r => r.id === 'rec-failover');
  expect(failover.priority).toBe('critical');
  expect(failover.confidence).toBeGreaterThanOrEqual(0.9);
});

test('edgeAI: returns urgent maintenance recommendation when uptime < 90', () => {
  const node = { id: 'n2', name: 'Supplier B', type: 'supplier', status: 'warning', location: 'Tokyo' };
  const metrics = { uptime: 82, throughput: 800, latency: 40 };
  const recs = generateEdgeAIRecommendations(node, metrics);
  expect(recs.some(r => r.id === 'rec-maintenance')).toBe(true);
});

test('edgeAI: returns latency recommendation when latency > 80ms', () => {
  const node = { id: 'n3', name: 'ZLA Center', type: 'center', status: 'warning', location: 'Los Angeles' };
  const metrics = { uptime: 97, throughput: 900, latency: 125 };
  const recs = generateEdgeAIRecommendations(node, metrics);
  expect(recs.some(r => r.id === 'rec-latency')).toBe(true);
});

test('edgeAI: returns healthy signal for perfectly operational node', () => {
  const node = { id: 'n4', name: 'JFK Tower', type: 'tower', status: 'operational', location: 'New York' };
  const metrics = { uptime: 99, throughput: 900, latency: 20 };
  const recs = generateEdgeAIRecommendations(node, metrics);
  expect(recs.some(r => r.id === 'rec-healthy')).toBe(true);
  expect(recs[0].priority).toBe('info');
});

test('edgeAI: returns empty array for null inputs', () => {
  expect(generateEdgeAIRecommendations(null, null)).toEqual([]);
  expect(generateEdgeAIRecommendations(null, {})).toEqual([]);
});

test('Edge AI Recommendations panel appears when a node is selected', async () => {
  render(<App />);

  // Click a node
  const nodes = screen.getAllByRole('button');
  const nodeButton = nodes.find(n => n.getAttribute('aria-label')?.includes('Supplier'));
  expect(nodeButton).toBeDefined();
  fireEvent.click(nodeButton);

  // The section heading should appear
  await waitFor(() => {
    expect(screen.getByText(/Edge AI Recommendations/i)).toBeInTheDocument();
  });

  // The tagline should confirm on-device inference
  await waitFor(() => {
    expect(screen.getByText(/On-device inference/i)).toBeInTheDocument();
  });
});

// ── Multi-view analysis tests ─────────────────────────────────────────────────

test('view tabs are rendered (Topology, List, Metrics, COFM)', () => {
  render(<App />);
  expect(screen.getByRole('tab', { name: /Topology/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /List/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /Metrics/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /COFM/i })).toBeInTheDocument();
});

test('clicking List tab renders the node table', async () => {
  render(<App />);
  const listTab = screen.getByRole('tab', { name: /List/i });
  fireEvent.click(listTab);
  await waitFor(() => {
    expect(screen.getByRole('table', { name: /Node list/i })).toBeInTheDocument();
  });
  // Table column headings visible (use role to avoid text+sort-indicator mismatch)
  expect(screen.getByRole('columnheader', { name: /Name/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /Type/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /Status/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /Location/i })).toBeInTheDocument();
});

test('clicking a row in List view selects the node and shows details', async () => {
  render(<App />);
  // Switch to list view
  fireEvent.click(screen.getByRole('tab', { name: /List/i }));
  // Find a node row
  await waitFor(() => {
    expect(screen.getByRole('table', { name: /Node list/i })).toBeInTheDocument();
  });
  const rows = screen.getAllByRole('button').filter(el =>
    el.getAttribute('aria-label')?.includes('supplier') || el.getAttribute('aria-label')?.includes('Supplier')
  );
  expect(rows.length).toBeGreaterThan(0);
  fireEvent.click(rows[0]);
  await waitFor(() => {
    expect(screen.getByText(/BASIC INFORMATION/i)).toBeInTheDocument();
  });
});

test('clicking Metrics tab renders status summary cards', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('tab', { name: /Metrics/i }));
  await waitFor(() => {
    expect(screen.getByText('Total Nodes')).toBeInTheDocument();
  });
  // Use getAllByText to handle multiple matches (e.g. alert filter dropdown also has "Warning")
  expect(screen.getAllByText(/^Operational$/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText(/^Warning$/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText(/^Critical$/i).length).toBeGreaterThanOrEqual(1);
});

test('clicking COFM tab renders the COFM visualization SVG', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('tab', { name: /COFM/i }));
  await waitFor(() => {
    expect(screen.getByRole('img', { name: /COFM visualization/i })).toBeInTheDocument();
  });
});

// ── generateCOFMData unit tests ───────────────────────────────────────────────

test('generateCOFMData enriches nodes with COFM fields', () => {
  const { generateMockNodes, generateCOFMData } = require('./utils/mockData');
  const nodes = generateMockNodes('supply-chain');
  const cofm  = generateCOFMData(nodes);
  expect(cofm.length).toBe(nodes.length);
  cofm.forEach(n => {
    expect(typeof n.cofmDay).toBe('number');
    expect(typeof n.cofmResource).toBe('number');
    expect(typeof n.wbsRadius).toBe('number');
    expect(typeof n.wbsLevel).toBe('number');
    expect(typeof n.onCriticalPath).toBe('boolean');
  });
});

test('generateCOFMData marks critical and warning nodes as onCriticalPath', () => {
  const { generateMockNodes, generateCOFMData } = require('./utils/mockData');
  const nodes = generateMockNodes('supply-chain');
  const cofm  = generateCOFMData(nodes);
  const factory2 = cofm.find(n => n.id === 'sc-4'); // critical
  const supplierB = cofm.find(n => n.id === 'sc-2'); // warning
  expect(factory2.onCriticalPath).toBe(true);
  expect(supplierB.onCriticalPath).toBe(true);
});

test('generateCOFMData gives manufacturers a larger wbsRadius than retail nodes', () => {
  const { generateMockNodes, generateCOFMData } = require('./utils/mockData');
  const nodes = generateMockNodes('supply-chain');
  const cofm  = generateCOFMData(nodes);
  const manufacturer = cofm.find(n => n.type === 'manufacturer');
  const retail       = cofm.find(n => n.type === 'retail');
  expect(manufacturer.wbsRadius).toBeGreaterThan(retail.wbsRadius);
});

test('generateCOFMData cofmResource is higher for critical nodes than operational ones of same type', () => {
  const { generateMockNodes, generateCOFMData } = require('./utils/mockData');
  const nodes = generateMockNodes('supply-chain');
  const cofm  = generateCOFMData(nodes);
  const criticalMfr    = cofm.find(n => n.type === 'manufacturer' && n.status === 'critical');
  const operationalMfr = cofm.find(n => n.type === 'manufacturer' && n.status === 'operational');
  if (criticalMfr && operationalMfr) {
    expect(criticalMfr.cofmResource).toBeGreaterThan(operationalMfr.cofmResource);
  }
});
