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
