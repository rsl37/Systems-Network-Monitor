// Mock data generation for development

export function generateMockNodes(systemType) {
  if (systemType === 'supply-chain') {
    return [
      { id: 'sc-1', name: 'Supplier A', type: 'supplier', status: 'operational', location: 'Shanghai' },
      { id: 'sc-2', name: 'Supplier B', type: 'supplier', status: 'warning', location: 'Tokyo' },
      { id: 'sc-3', name: 'Factory 1', type: 'manufacturer', status: 'operational', location: 'Shenzhen' },
      { id: 'sc-4', name: 'Factory 2', type: 'manufacturer', status: 'critical', location: 'Vietnam' },
      { id: 'sc-5', name: 'Dist Center A', type: 'distributor', status: 'operational', location: 'LA' },
      { id: 'sc-6', name: 'Warehouse 1', type: 'warehouse', status: 'operational', location: 'Chicago' },
      { id: 'sc-7', name: 'Warehouse 2', type: 'warehouse', status: 'warning', location: 'NYC' },
      { id: 'sc-8', name: 'Store A', type: 'retail', status: 'operational', location: 'Boston' },
      { id: 'sc-9', name: 'Store B', type: 'retail', status: 'operational', location: 'Miami' },
      { id: 'sc-10', name: 'Store C', type: 'retail', status: 'operational', location: 'Seattle' },
    ];
  } else {
    return [
      { id: 'atc-1', name: 'JFK Tower', type: 'tower', status: 'operational', location: 'New York' },
      { id: 'atc-2', name: 'LAX Tower', type: 'tower', status: 'warning', location: 'Los Angeles' },
      { id: 'atc-3', name: 'ORD Tower', type: 'tower', status: 'operational', location: 'Chicago' },
      { id: 'atc-4', name: 'N90 TRACON', type: 'tracon', status: 'operational', location: 'NY Area' },
      { id: 'atc-5', name: 'SCT TRACON', type: 'tracon', status: 'critical', location: 'SoCal' },
      { id: 'atc-6', name: 'C90 TRACON', type: 'tracon', status: 'operational', location: 'Chicago' },
      { id: 'atc-7', name: 'ZNY Center', type: 'center', status: 'operational', location: 'New York' },
      { id: 'atc-8', name: 'ZLA Center', type: 'center', status: 'warning', location: 'Los Angeles' },
      { id: 'atc-9', name: 'ZAU Center', type: 'center', status: 'operational', location: 'Chicago' },
      { id: 'atc-10', name: 'ZDC Center', type: 'center', status: 'operational', location: 'Washington' },
    ];
  }
}

export function generateMockAlerts(systemType) {
  const now = new Date();
  
  if (systemType === 'supply-chain') {
    return [
      {
        id: 'alert-1',
        nodeId: 'sc-4',
        severity: 'critical',
        message: 'Factory 2 offline due to power outage',
        type: 'node_failure',
        timestamp: new Date(now - 5 * 60000).toLocaleTimeString(),
        acknowledged: false
      },
      {
        id: 'alert-2',
        nodeId: 'sc-2',
        severity: 'warning',
        message: 'Supplier B experiencing throughput degradation (45%)',
        type: 'performance',
        timestamp: new Date(now - 15 * 60000).toLocaleTimeString(),
        acknowledged: false
      },
      {
        id: 'alert-3',
        nodeId: 'sc-7',
        severity: 'warning',
        message: 'Warehouse 2 approaching capacity threshold (87%)',
        type: 'capacity',
        timestamp: new Date(now - 30 * 60000).toLocaleTimeString(),
        acknowledged: false
      }
    ];
  } else {
    return [
      {
        id: 'alert-1',
        nodeId: 'atc-5',
        severity: 'critical',
        message: 'SCT TRACON communication system failure',
        type: 'communication',
        timestamp: new Date(now - 3 * 60000).toLocaleTimeString(),
        acknowledged: false
      },
      {
        id: 'alert-2',
        nodeId: 'atc-2',
        severity: 'warning',
        message: 'LAX Tower approaching capacity (67 aircraft)',
        type: 'capacity',
        timestamp: new Date(now - 10 * 60000).toLocaleTimeString(),
        acknowledged: false
      },
      {
        id: 'alert-3',
        nodeId: 'atc-8',
        severity: 'warning',
        message: 'ZLA Center experiencing increased latency (125ms)',
        type: 'performance',
        timestamp: new Date(now - 20 * 60000).toLocaleTimeString(),
        acknowledged: false
      }
    ];
  }
}

export function generateMockConnections(systemType) {
  if (systemType === 'supply-chain') {
    // Supply chain: Suppliers -> Manufacturers -> Distributors -> Warehouses -> Retail
    return [
      // Suppliers to Manufacturers
      { id: 'conn-1', fromNodeId: 'sc-1', toNodeId: 'sc-3', type: 'supply', bandwidth: 1000, latency: 45 },
      { id: 'conn-2', fromNodeId: 'sc-2', toNodeId: 'sc-3', type: 'supply', bandwidth: 800, latency: 52 },
      { id: 'conn-3', fromNodeId: 'sc-1', toNodeId: 'sc-4', type: 'supply', bandwidth: 1200, latency: 48 },
      { id: 'conn-4', fromNodeId: 'sc-2', toNodeId: 'sc-4', type: 'supply', bandwidth: 950, latency: 55 },
      // Manufacturers to Distributors
      { id: 'conn-5', fromNodeId: 'sc-3', toNodeId: 'sc-5', type: 'supply', bandwidth: 2000, latency: 120 },
      { id: 'conn-6', fromNodeId: 'sc-4', toNodeId: 'sc-5', type: 'supply', bandwidth: 1800, latency: 115 },
      // Distributors to Warehouses
      { id: 'conn-7', fromNodeId: 'sc-5', toNodeId: 'sc-6', type: 'supply', bandwidth: 1500, latency: 35 },
      { id: 'conn-8', fromNodeId: 'sc-5', toNodeId: 'sc-7', type: 'supply', bandwidth: 1600, latency: 40 },
      // Warehouses to Retail
      { id: 'conn-9', fromNodeId: 'sc-6', toNodeId: 'sc-8', type: 'supply', bandwidth: 500, latency: 15 },
      { id: 'conn-10', fromNodeId: 'sc-6', toNodeId: 'sc-9', type: 'supply', bandwidth: 600, latency: 18 },
      { id: 'conn-11', fromNodeId: 'sc-7', toNodeId: 'sc-8', type: 'supply', bandwidth: 550, latency: 12 },
      { id: 'conn-12', fromNodeId: 'sc-7', toNodeId: 'sc-10', type: 'supply', bandwidth: 700, latency: 25 }
    ];
  } else {
    // ATC: Towers <-> TRACONs <-> Centers (bidirectional communication)
    return [
      // Towers to TRACONs
      { id: 'conn-1', fromNodeId: 'atc-1', toNodeId: 'atc-4', type: 'communication', bandwidth: 100, latency: 5 },
      { id: 'conn-2', fromNodeId: 'atc-2', toNodeId: 'atc-5', type: 'communication', bandwidth: 100, latency: 8 },
      { id: 'conn-3', fromNodeId: 'atc-3', toNodeId: 'atc-6', type: 'communication', bandwidth: 100, latency: 4 },
      // TRACONs to Centers
      { id: 'conn-4', fromNodeId: 'atc-4', toNodeId: 'atc-7', type: 'handoff', bandwidth: 200, latency: 10 },
      { id: 'conn-5', fromNodeId: 'atc-5', toNodeId: 'atc-8', type: 'handoff', bandwidth: 200, latency: 12 },
      { id: 'conn-6', fromNodeId: 'atc-6', toNodeId: 'atc-9', type: 'handoff', bandwidth: 200, latency: 8 },
      // Centers interconnections
      { id: 'conn-7', fromNodeId: 'atc-7', toNodeId: 'atc-8', type: 'communication', bandwidth: 500, latency: 25 },
      { id: 'conn-8', fromNodeId: 'atc-8', toNodeId: 'atc-9', type: 'communication', bandwidth: 500, latency: 30 },
      { id: 'conn-9', fromNodeId: 'atc-7', toNodeId: 'atc-10', type: 'communication', bandwidth: 500, latency: 15 },
      { id: 'conn-10', fromNodeId: 'atc-9', toNodeId: 'atc-10', type: 'communication', bandwidth: 500, latency: 20 }
    ];
  }
}

export function generateMockMetrics(nodeId) {
  // Generate random but realistic metrics
  const uptime = 85 + Math.random() * 14; // 85-99%
  const throughput = 500 + Math.random() * 1500; // 500-2000 units/hour
  const latency = 10 + Math.random() * 90; // 10-100ms
  
  return {
    id: `metrics-${nodeId}`,
    nodeId: nodeId,
    uptime: parseFloat(uptime.toFixed(2)),
    throughput: Math.floor(throughput),
    latency: Math.floor(latency),
    timestamp: new Date()
  };
}
