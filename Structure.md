import React, { useState, useEffect } from ‘react’;
import { Network, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Activity, Layers, Map, Package, Plane, Radio, Zap, Clock, Users, Settings, BarChart3, AlertCircle, Wifi, WifiOff, ArrowRight, Filter, Search, Bell, RefreshCw, Maximize2, MessageSquare, Wrench, Database, Server, Globe, X } from ‘lucide-react’;

const SystemsNetworkMonitor = () => {
const [systemType, setSystemType] = useState(‘supply-chain’);
const [selectedNode, setSelectedNode] = useState(null);
const [alerts, setAlerts] = useState([]);
const [viewMode, setViewMode] = useState(‘topology’);
const [filterStatus, setFilterStatus] = useState(‘all’);
const [searchQuery, setSearchQuery] = useState(’’);
const [autoRefresh, setAutoRefresh] = useState(true);
const [showAlertPanel, setShowAlertPanel] = useState(true);
const [showCOFM, setShowCOFM] = useState(false);
const [selectedProject, setSelectedProject] = useState(null);

// Supply Chain Network Nodes
const supplyChainNodes = [
{ id: ‘SC001’, name: ‘Raw Materials Supplier A’, type: ‘supplier’, status: ‘healthy’, location: ‘Shanghai, CN’, connections: [‘SC002’, ‘SC003’], metrics: { uptime: 99.8, throughput: 1250, latency: 45 }, inventory: 8500 },
{ id: ‘SC002’, name: ‘Manufacturing Plant 1’, type: ‘manufacturer’, status: ‘warning’, location: ‘Seoul, KR’, connections: [‘SC004’, ‘SC005’], metrics: { uptime: 97.2, throughput: 890, latency: 78 }, inventory: 3200 },
{ id: ‘SC003’, name: ‘Manufacturing Plant 2’, type: ‘manufacturer’, status: ‘healthy’, location: ‘Taipei, TW’, connections: [‘SC004’, ‘SC006’], metrics: { uptime: 99.5, throughput: 1120, latency: 52 }, inventory: 4100 },
{ id: ‘SC004’, name: ‘Regional Distribution Center’, type: ‘distributor’, status: ‘critical’, location: ‘Los Angeles, US’, connections: [‘SC007’, ‘SC008’], metrics: { uptime: 85.3, throughput: 450, latency: 145 }, inventory: 1200 },
{ id: ‘SC005’, name: ‘Warehouse Hub East’, type: ‘warehouse’, status: ‘healthy’, location: ‘New York, US’, connections: [‘SC009’], metrics: { uptime: 98.9, throughput: 780, latency: 62 }, inventory: 5600 },
{ id: ‘SC006’, name: ‘Warehouse Hub West’, type: ‘warehouse’, status: ‘warning’, location: ‘San Francisco, US’, connections: [‘SC007’], metrics: { uptime: 96.1, throughput: 650, latency: 89 }, inventory: 2800 },
{ id: ‘SC007’, name: ‘Retail Distribution A’, type: ‘retail’, status: ‘healthy’, location: ‘Seattle, US’, connections: [], metrics: { uptime: 99.2, throughput: 340, latency: 38 }, inventory: 1900 },
{ id: ‘SC008’, name: ‘Retail Distribution B’, type: ‘retail’, status: ‘healthy’, location: ‘Dallas, US’, connections: [], metrics: { uptime: 98.7, throughput: 420, latency: 44 }, inventory: 2300 },
{ id: ‘SC009’, name: ‘Retail Distribution C’, type: ‘retail’, status: ‘warning’, location: ‘Miami, US’, connections: [], metrics: { uptime: 94.8, throughput: 280, latency: 112 }, inventory: 890 }
];

// ATC Network Nodes
const atcNodes = [
{ id: ‘ATC001’, name: ‘LAX Tower Control’, type: ‘tower’, status: ‘healthy’, location: ‘Los Angeles’, connections: [‘ATC002’, ‘ATC005’], metrics: { uptime: 99.99, aircraft: 45, frequency: ‘118.4 MHz’ }, activeFlights: 12 },
{ id: ‘ATC002’, name: ‘Southern California TRACON’, type: ‘tracon’, status: ‘healthy’, location: ‘San Diego’, connections: [‘ATC001’, ‘ATC003’, ‘ATC004’], metrics: { uptime: 99.97, aircraft: 89, frequency: ‘124.9 MHz’ }, activeFlights: 34 },
{ id: ‘ATC003’, name: ‘Oakland Center (ZOA)’, type: ‘center’, status: ‘warning’, location: ‘Oakland’, connections: [‘ATC002’, ‘ATC006’], metrics: { uptime: 98.2, aircraft: 156, frequency: ‘134.2 MHz’ }, activeFlights: 67 },
{ id: ‘ATC004’, name: ‘SFO Tower Control’, type: ‘tower’, status: ‘healthy’, location: ‘San Francisco’, connections: [‘ATC002’, ‘ATC003’], metrics: { uptime: 99.95, aircraft: 52, frequency: ‘120.5 MHz’ }, activeFlights: 18 },
{ id: ‘ATC005’, name: ‘Las Vegas TRACON’, type: ‘tracon’, status: ‘critical’, location: ‘Las Vegas’, connections: [‘ATC001’, ‘ATC007’], metrics: { uptime: 92.1, aircraft: 67, frequency: ‘119.9 MHz’ }, activeFlights: 23 },
{ id: ‘ATC006’, name: ‘Seattle Center (ZSE)’, type: ‘center’, status: ‘healthy’, location: ‘Seattle’, connections: [‘ATC003’], metrics: { uptime: 99.88, aircraft: 134, frequency: ‘132.7 MHz’ }, activeFlights: 56 },
{ id: ‘ATC007’, name: ‘Phoenix Tower Control’, type: ‘tower’, status: ‘warning’, location: ‘Phoenix’, connections: [‘ATC005’], metrics: { uptime: 97.3, aircraft: 38, frequency: ‘118.7 MHz’ }, activeFlights: 14 }
];

const currentNodes = systemType === ‘supply-chain’ ? supplyChainNodes : atcNodes;

// COFM Project Data - Example maintenance/optimization workflows
const cofmProjects = {
‘supply-chain’: {
title: ‘Supply Chain Optimization Project’,
tasks: [
{ id: 1, name: ‘Start the project’, type: ‘start’, color: ‘green’, timeline: 0, resources: 1, hierarchy: 2.0, dependencies: [] },
{ id: 2, name: ‘Define project objectives’, type: ‘middle’, color: ‘blue’, timeline: 1, resources: 2, hierarchy: 1.8, dependencies: [1] },
{ id: 3, name: ‘Research existing models’, type: ‘middle’, color: ‘blue’, timeline: 2, resources: 2.5, hierarchy: 1.5, dependencies: [2] },
{ id: 4, name: ‘Draft concept design’, type: ‘middle’, color: ‘lightblue’, timeline: 3, resources: 3, hierarchy: 1.2, slack: true, dependencies: [3] },
{ id: 5, name: ‘Select tools for the project’, type: ‘middle’, color: ‘lightblue’, timeline: 4, resources: 3, hierarchy: 0.8, slack: true, dependencies: [4] },
{ id: 6, name: ‘Create the model’, type: ‘bottleneck’, color: ‘red’, timeline: 5, resources: 3.5, hierarchy: 0.3, critical: true, dependencies: [5] },
{ id: 7, name: ‘Plan features for visualization’, type: ‘middle’, color: ‘lightblue’, timeline: 4.5, resources: 4, hierarchy: 0.7, slack: true, dependencies: [5] },
{ id: 8, name: ‘Develop prototype’, type: ‘bottleneck’, color: ‘red’, timeline: 6, resources: 4.5, hierarchy: 1.3, critical: true, dependencies: [6] },
{ id: 9, name: ‘Integrate features into the prototype’, type: ‘middle’, color: ‘lightblue’, timeline: 7, resources: 5, hierarchy: 2.0, slack: true, dependencies: [7, 8] },
{ id: 10, name: ‘Finalize and end the project’, type: ‘end’, color: ‘purple’, timeline: 8, resources: 5.5, hierarchy: 2.5, dependencies: [9] }
],
criticalPath: [1, 2, 3, 6, 8, 10]
},
‘atc’: {
title: ‘ATC System Upgrade Project’,
tasks: [
{ id: 1, name: ‘Initiate upgrade workflow’, type: ‘start’, color: ‘green’, timeline: 0, resources: 1, hierarchy: 2.0, dependencies: [] },
{ id: 2, name: ‘Audit current systems’, type: ‘middle’, color: ‘blue’, timeline: 1, resources: 2, hierarchy: 1.8, dependencies: [1] },
{ id: 3, name: ‘Identify system vulnerabilities’, type: ‘middle’, color: ‘blue’, timeline: 2, resources: 2.5, hierarchy: 1.5, dependencies: [2] },
{ id: 4, name: ‘Design redundancy architecture’, type: ‘middle’, color: ‘lightblue’, timeline: 3, resources: 3, hierarchy: 1.2, slack: true, dependencies: [3] },
{ id: 5, name: ‘Select upgrade components’, type: ‘middle’, color: ‘lightblue’, timeline: 4, resources: 3, hierarchy: 0.8, slack: true, dependencies: [4] },
{ id: 6, name: ‘Deploy critical infrastructure’, type: ‘bottleneck’, color: ‘red’, timeline: 5, resources: 3.5, hierarchy: 0.3, critical: true, dependencies: [5] },
{ id: 7, name: ‘Configure backup systems’, type: ‘middle’, color: ‘lightblue’, timeline: 4.5, resources: 4, hierarchy: 0.7, slack: true, dependencies: [5] },
{ id: 8, name: ‘Test integrated systems’, type: ‘bottleneck’, color: ‘red’, timeline: 6, resources: 4.5, hierarchy: 1.3, critical: true, dependencies: [6] },
{ id: 9, name: ‘Train controllers on new system’, type: ‘middle’, color: ‘lightblue’, timeline: 7, resources: 5, hierarchy: 2.0, slack: true, dependencies: [7, 8] },
{ id: 10, name: ‘Complete upgrade rollout’, type: ‘end’, color: ‘purple’, timeline: 8, resources: 5.5, hierarchy: 2.5, dependencies: [9] }
],
criticalPath: [1, 2, 3, 6, 8, 10]
}
};

const currentProject = cofmProjects[systemType];

// Generate dynamic alerts
useEffect(() => {
const generateAlerts = () => {
const newAlerts = [];

```
  // Only process first 3-4 critical/warning nodes to avoid spam
  const criticalNodes = currentNodes.filter(n => n.status === 'critical').slice(0, 2);
  const warningNodes = currentNodes.filter(n => n.status === 'warning').slice(0, 2);
  
  criticalNodes.forEach(node => {
    newAlerts.push({
      id: `alert-${node.id}-critical`,
      nodeId: node.id,
      nodeName: node.name,
      severity: 'critical',
      message: systemType === 'supply-chain' 
        ? `Severe throughput degradation: ${node.metrics.throughput} units/hr (below threshold)`
        : `Communication failure: Multiple aircraft handoff issues detected`,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      type: 'performance'
    });
  });
  
  warningNodes.forEach(node => {
    newAlerts.push({
      id: `alert-${node.id}-warning`,
      nodeId: node.id,
      nodeName: node.name,
      severity: 'warning',
      message: systemType === 'supply-chain'
        ? `Latency spike: ${node.metrics.latency}ms (${node.metrics.uptime}% uptime)`
        : `Increased traffic load: ${node.metrics.aircraft} aircraft (near capacity)`,
      timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
      type: 'monitoring'
    });
  });
  
  // Add one system-wide alert
  if (systemType === 'supply-chain') {
    newAlerts.push({
      id: 'sys-alert-1',
      severity: 'info',
      message: 'Scheduled maintenance: Manufacturing Plant 2 - Tonight 2-4 AM PST',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: 'maintenance'
    });
  } else {
    newAlerts.push({
      id: 'sys-alert-2',
      severity: 'info',
      message: 'Weather advisory: Moderate turbulence expected in ZOA sector',
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      type: 'weather'
    });
  }
  
  setAlerts(newAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
};

generateAlerts();
// Only regenerate when system type changes, not on every render
```

}, [systemType]);

const getStatusColor = (status) => {
switch (status) {
case ‘healthy’: return ‘text-green-600 bg-green-100’;
case ‘warning’: return ‘text-yellow-600 bg-yellow-100’;
case ‘critical’: return ‘text-red-600 bg-red-100’;
default: return ‘text-gray-600 bg-gray-100’;
}
};

const getStatusIcon = (status) => {
switch (status) {
case ‘healthy’: return <CheckCircle className="w-5 h-5" />;
case ‘warning’: return <AlertCircle className="w-5 h-5" />;
case ‘critical’: return <XCircle className="w-5 h-5" />;
default: return <Activity className="w-5 h-5" />;
}
};

const getNodeIcon = (type) => {
if (systemType === ‘supply-chain’) {
switch (type) {
case ‘supplier’: return <Database className="w-5 h-5" />;
case ‘manufacturer’: return <Settings className="w-5 h-5" />;
case ‘distributor’: return <Network className="w-5 h-5" />;
case ‘warehouse’: return <Package className="w-5 h-5" />;
case ‘retail’: return <Globe className="w-5 h-5" />;
default: return <Server className="w-5 h-5" />;
}
} else {
switch (type) {
case ‘tower’: return <Radio className="w-5 h-5" />;
case ‘tracon’: return <Layers className="w-5 h-5" />;
case ‘center’: return <Globe className="w-5 h-5" />;
default: return <Plane className="w-5 h-5" />;
}
}
};

const filteredNodes = currentNodes.filter(node => {
const matchesFilter = filterStatus === ‘all’ || node.status === filterStatus;
const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
node.location.toLowerCase().includes(searchQuery.toLowerCase());
return matchesFilter && matchesSearch;
});

const systemStats = {
total: currentNodes.length,
healthy: currentNodes.filter(n => n.status === ‘healthy’).length,
warning: currentNodes.filter(n => n.status === ‘warning’).length,
critical: currentNodes.filter(n => n.status === ‘critical’).length
};

const renderTopologyView = () => (
<div className="bg-white rounded-lg shadow p-6">
<div className="flex items-center justify-between mb-6">
<h3 className="text-lg font-semibold">Network Topology</h3>
<div className="flex gap-2">
<button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
<Maximize2 className="w-4 h-4" />
</button>
<button
onClick={() => setAutoRefresh(!autoRefresh)}
className={`p-2 border rounded-lg ${autoRefresh ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:bg-gray-50'}`}
>
<RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
</button>
</div>
</div>

```
  <div className="relative bg-gray-50 rounded-lg p-8 min-h-[500px]">
    {/* Visual network topology */}
    <div className="grid grid-cols-3 gap-8">
      {filteredNodes.map((node, idx) => (
        <div key={node.id} className="relative">
          <button
            onClick={() => setSelectedNode(node)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedNode?.id === node.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-blue-300'
            } ${node.status === 'critical' ? 'animate-pulse' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${getStatusColor(node.status)}`}>
                {getNodeIcon(node.type)}
              </div>
              {getStatusIcon(node.status)}
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm text-gray-900 mb-1">{node.name}</div>
              <div className="text-xs text-gray-600">{node.location}</div>
              <div className="text-xs text-gray-500 mt-1">ID: {node.id}</div>
            </div>
            
            {/* Connection lines */}
            {node.connections.length > 0 && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <ArrowRight className="w-4 h-4 text-blue-400 rotate-90" />
              </div>
            )}
          </button>
        </div>
      ))}
    </div>
  </div>
</div>
```

);

const renderListView = () => (
<div className="bg-white rounded-lg shadow">
<div className="p-6 border-b">
<h3 className="text-lg font-semibold">Network Nodes</h3>
</div>
<div className="divide-y">
{filteredNodes.map(node => (
<button
key={node.id}
onClick={() => setSelectedNode(node)}
className={`w-full p-6 hover:bg-gray-50 transition-colors text-left ${ selectedNode?.id === node.id ? 'bg-blue-50' : '' }`}
>
<div className="flex items-start justify-between">
<div className="flex items-start gap-4 flex-1">
<div className={`p-3 rounded-lg ${getStatusColor(node.status)}`}>
{getNodeIcon(node.type)}
</div>
<div className="flex-1">
<div className="flex items-center gap-3 mb-2">
<h4 className="font-semibold text-gray-900">{node.name}</h4>
<span className="text-xs text-gray-500">({node.id})</span>
</div>
<div className="grid grid-cols-2 gap-4 text-sm">
<div>
<span className="text-gray-600">Location: </span>
<span className="font-medium">{node.location}</span>
</div>
<div>
<span className="text-gray-600">Type: </span>
<span className="font-medium capitalize">{node.type}</span>
</div>
{systemType === ‘supply-chain’ ? (
<>
<div>
<span className="text-gray-600">Uptime: </span>
<span className="font-medium">{node.metrics.uptime}%</span>
</div>
<div>
<span className="text-gray-600">Throughput: </span>
<span className="font-medium">{node.metrics.throughput} units/hr</span>
</div>
</>
) : (
<>
<div>
<span className="text-gray-600">Uptime: </span>
<span className="font-medium">{node.metrics.uptime}%</span>
</div>
<div>
<span className="text-gray-600">Active Flights: </span>
<span className="font-medium">{node.activeFlights}</span>
</div>
</>
)}
</div>
</div>
</div>
<div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(node.status)}`}>
{getStatusIcon(node.status)}
<span className="capitalize">{node.status}</span>
</div>
</div>
</button>
))}
</div>
</div>
);

const renderMetricsView = () => (
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<div className="bg-white rounded-lg shadow p-6">
<h3 className="text-lg font-semibold mb-4">System Performance</h3>
<div className="space-y-4">
{filteredNodes.slice(0, 5).map(node => (
<div key={node.id}>
<div className="flex items-center justify-between mb-2">
<span className="text-sm font-medium text-gray-700">{node.name}</span>
<span className="text-sm text-gray-600">{node.metrics.uptime}%</span>
</div>
<div className="w-full bg-gray-200 rounded-full h-2">
<div
className={`h-2 rounded-full ${ node.metrics.uptime >= 98 ? 'bg-green-500' : node.metrics.uptime >= 95 ? 'bg-yellow-500' : 'bg-red-500' }`}
style={{ width: `${node.metrics.uptime}%` }}
/>
</div>
</div>
))}
</div>
</div>

```
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">
      {systemType === 'supply-chain' ? 'Throughput Analysis' : 'Traffic Load Analysis'}
    </h3>
    <div className="space-y-4">
      {filteredNodes.slice(0, 5).map(node => (
        <div key={node.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">{node.name}</div>
            <div className="text-sm text-gray-600">
              {systemType === 'supply-chain' 
                ? `${node.metrics.throughput} units/hr` 
                : `${node.activeFlights} active flights`}
            </div>
          </div>
          {systemType === 'supply-chain' ? (
            node.metrics.throughput > 1000 ? 
              <TrendingUp className="w-5 h-5 text-green-600" /> : 
              <TrendingDown className="w-5 h-5 text-red-600" />
          ) : (
            node.activeFlights > 20 ? 
              <TrendingUp className="w-5 h-5 text-yellow-600" /> : 
              <Activity className="w-5 h-5 text-green-600" />
          )}
        </div>
      ))}
    </div>
  </div>
</div>
```

);

const renderCOFMView = () => {
if (!currentProject) return null;

```
const getTaskColor = (task) => {
  if (task.color === 'green') return '#10b981';
  if (task.color === 'blue') return '#3b82f6';
  if (task.color === 'purple') return '#a855f7';
  if (task.color === 'red') return '#ef4444';
  if (task.color === 'lightblue') return '#93c5fd';
  return '#6b7280';
};

const isCriticalPath = (taskId) => currentProject.criticalPath.includes(taskId);

// Scale factors for positioning
const width = 800;
const height = 500;
const xScale = width / 9;
const yScale = height / 7;

return (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">{currentProject.title}</h3>
        <p className="text-sm text-gray-600 mt-1">COFM: WBS + PERT + Scatterplot + Gantt Unified Visualization</p>
      </div>
      <button 
        onClick={() => setShowCOFM(false)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="w-6 h-6" />
      </button>
    </div>

    {/* Legend */}
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="text-sm font-semibold text-gray-700 mb-3">Legend</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Start Task (Green)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Middle Task (Blue)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span>End Task (Purple)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Bottleneck (Red)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-300"></div>
          <span>Slack Task (Light Blue)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-red-600"></div>
          <span>Critical Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-gray-400"></div>
          <span>Full Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-black border-t-2 border-dashed"></div>
          <span>Dependencies</span>
        </div>
      </div>
    </div>

    {/* SVG Graph */}
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-8 overflow-x-auto">
      <svg width={width} height={height} className="mx-auto">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Axes */}
        <line x1="50" y1={height - 50} x2={width - 50} y2={height - 50} stroke="#374151" strokeWidth="2" />
        <line x1="50" y1="50" x2="50" y2={height - 50} stroke="#374151" strokeWidth="2" />
        
        {/* Axis labels */}
        <text x={width / 2} y={height - 15} textAnchor="middle" className="text-xs fill-gray-700 font-semibold">Timeline (X-axis)</text>
        <text x="20" y={height / 2} textAnchor="middle" transform={`rotate(-90, 20, ${height / 2})`} className="text-xs fill-gray-700 font-semibold">Resources (Y-axis)</text>
        <text x={width - 100} y="30" textAnchor="middle" className="text-xs fill-gray-700 font-semibold">Hierarchy (Z-axis / size)</text>

        {/* Draw dependency lines (dotted black) */}
        {currentProject.tasks.map(task => 
          task.dependencies.map(depId => {
            const depTask = currentProject.tasks.find(t => t.id === depId);
            if (!depTask) return null;
            const x1 = 50 + depTask.timeline * xScale;
            const y1 = height - 50 - (depTask.resources * yScale);
            const x2 = 50 + task.timeline * xScale;
            const y2 = height - 50 - (task.resources * yScale);
            return (
              <line
                key={`dep-${task.id}-${depId}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="black"
                strokeWidth="1"
                strokeDasharray="4 2"
                opacity="0.4"
              />
            );
          })
        )}

        {/* Draw full project path (gray line) */}
        {currentProject.tasks.slice(0, -1).map((task, idx) => {
          const nextTask = currentProject.tasks[idx + 1];
          const x1 = 50 + task.timeline * xScale;
          const y1 = height - 50 - (task.resources * yScale);
          const x2 = 50 + nextTask.timeline * xScale;
          const y2 = height - 50 - (nextTask.resources * yScale);
          return (
            <line
              key={`path-${task.id}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#9ca3af"
              strokeWidth="2"
              opacity="0.5"
            />
          );
        })}

        {/* Draw critical path (solid red line) */}
        {currentProject.criticalPath.slice(0, -1).map((taskId, idx) => {
          const task1 = currentProject.tasks.find(t => t.id === taskId);
          const task2 = currentProject.tasks.find(t => t.id === currentProject.criticalPath[idx + 1]);
          if (!task1 || !task2) return null;
          const x1 = 50 + task1.timeline * xScale;
          const y1 = height - 50 - (task1.resources * yScale);
          const x2 = 50 + task2.timeline * xScale;
          const y2 = height - 50 - (task2.resources * yScale);
          return (
            <line
              key={`critical-${taskId}-${task2.id}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#dc2626"
              strokeWidth="3"
              opacity="0.8"
            />
          );
        })}

        {/* Task nodes */}
        {currentProject.tasks.map(task => {
          const x = 50 + task.timeline * xScale;
          const y = height - 50 - (task.resources * yScale);
          const radius = 8 + (task.hierarchy * 4);

          return (
            <g key={task.id} className="cursor-pointer" onClick={() => setSelectedProject(task.id)}>
              {/* Node circle */}
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill={getTaskColor(task)}
                stroke={selectedProject === task.id ? '#2563eb' : '#1f2937'}
                strokeWidth={selectedProject === task.id ? 3 : 2}
                opacity="0.9"
              />
              {/* X marker */}
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                className="fill-white font-bold text-xs pointer-events-none"
              >
                ×
              </text>
              {/* Task label */}
              <text
                x={x}
                y={y - radius - 5}
                textAnchor="middle"
                className="fill-gray-900 text-xs font-semibold pointer-events-none"
              >
                Task {task.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>

    {/* Task Details Panel */}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Task Definitions</h4>
        <div className="space-y-2 text-xs max-h-64 overflow-y-auto">
          {currentProject.tasks.map(task => (
            <div 
              key={task.id}
              className={`p-2 rounded cursor-pointer transition-colors ${
                selectedProject === task.id ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedProject(task.id)}
            >
              <div className="font-medium text-gray-900">Task {task.id}: {task.name}</div>
              <div className="text-gray-600 mt-1">
                Timeline: {task.timeline} | Resources: {task.resources} | Hierarchy: {task.hierarchy}
                {task.critical && <span className="ml-2 px-1 bg-red-100 text-red-800 rounded">Critical</span>}
                {task.slack && <span className="ml-2 px-1 bg-blue-100 text-blue-800 rounded">Slack</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">COFM Insights</h4>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-white rounded border border-gray-200">
            <div className="font-medium text-gray-900 mb-1">📊 Multi-Dimensional View</div>
            <div className="text-gray-600 text-xs">
              X-axis = Timeline (Gantt), Y-axis = Resources (Scatterplot), Size = Hierarchy (WBS)
            </div>
          </div>
          <div className="p-3 bg-white rounded border border-gray-200">
            <div className="font-medium text-gray-900 mb-1">🎯 Critical Path</div>
            <div className="text-gray-600 text-xs">
              Red line shows PERT critical path: Tasks {currentProject.criticalPath.join(' → ')}
            </div>
          </div>
          <div className="p-3 bg-white rounded border border-gray-200">
            <div className="font-medium text-gray-900 mb-1">⚡ Bottlenecks</div>
            <div className="text-gray-600 text-xs">
              Red nodes = Critical bottlenecks requiring immediate attention
            </div>
          </div>
          <div className="p-3 bg-white rounded border border-gray-200">
            <div className="font-medium text-gray-900 mb-1">💡 Slack Tasks</div>
            <div className="text-gray-600 text-xs">
              Light blue nodes = Tasks with scheduling flexibility
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
```

};

return (
<div className="min-h-screen bg-gray-100">
{/* Header */}
<header className="bg-white shadow-sm border-b">
<div className="max-w-7xl mx-auto px-6 py-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
<Network className="w-6 h-6 text-white" />
</div>
<div>
<h1 className="text-2xl font-bold text-gray-900">Systems Network Monitor</h1>
<p className="text-sm text-gray-600">Real-time ecosystem management & maintenance</p>
</div>
</div>

```
        <div className="flex items-center gap-3">
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {alerts.filter(a => a.severity === 'critical').length}
            </span>
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  </header>

  {/* System Type Selector */}
  <div className="bg-white border-b">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">System Type:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setSystemType('supply-chain')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              systemType === 'supply-chain'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            Supply Chain Network
          </button>
          <button
            onClick={() => setSystemType('atc')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              systemType === 'atc'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Plane className="w-4 h-4" />
            Air Traffic Control
          </button>
        </div>
      </div>
    </div>
  </div>

  <div className="max-w-7xl mx-auto px-6 py-6">
    {/* System Overview Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Total Nodes</span>
          <Network className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-3xl font-bold text-gray-900">{systemStats.total}</div>
      </div>
      <div className="bg-green-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-700">Healthy</span>
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div className="text-3xl font-bold text-green-900">{systemStats.healthy}</div>
      </div>
      <div className="bg-yellow-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-yellow-700">Warning</span>
          <AlertCircle className="w-5 h-5 text-yellow-600" />
        </div>
        <div className="text-3xl font-bold text-yellow-900">{systemStats.warning}</div>
      </div>
      <div className="bg-red-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-red-700">Critical</span>
          <XCircle className="w-5 h-5 text-red-600" />
        </div>
        <div className="text-3xl font-bold text-red-900">{systemStats.critical}</div>
      </div>
    </div>

    {/* Controls */}
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search nodes by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('topology')}
              className={`px-4 py-2 ${viewMode === 'topology' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <Network className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 border-l ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('metrics')}
              className={`px-4 py-2 border-l ${viewMode === 'metrics' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main View */}
      <div className="lg:col-span-2">
        {showCOFM ? renderCOFMView() : (
          <>
            {viewMode === 'topology' && renderTopologyView()}
            {viewMode === 'list' && renderListView()}
            {viewMode === 'metrics' && renderMetricsView()}
          </>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Selected Node Details */}
        {selectedNode && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Node Details</h3>
              <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${getStatusColor(selectedNode.status)}`}>
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedNode.name}</div>
                  <div className="text-sm text-gray-600">{selectedNode.id}</div>
                </div>
              </div>

              <div className={`p-3 rounded-lg flex items-center gap-2 ${getStatusColor(selectedNode.status)}`}>
                {getStatusIcon(selectedNode.status)}
                <span className="font-medium capitalize">{selectedNode.status}</span>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Location</div>
                  <div className="font-medium text-gray-900">{selectedNode.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Type</div>
                  <div className="font-medium text-gray-900 capitalize">{selectedNode.type}</div>
                </div>
                {systemType === 'supply-chain' ? (
                  <>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Uptime</div>
                      <div className="font-medium text-gray-900">{selectedNode.metrics.uptime}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Throughput</div>
                      <div className="font-medium text-gray-900">{selectedNode.metrics.throughput} units/hr</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Latency</div>
                      <div className="font-medium text-gray-900">{selectedNode.metrics.latency}ms</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Inventory Level</div>
                      <div className="font-medium text-gray-900">{selectedNode.inventory} units</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">System Uptime</div>
                      <div className="font-medium text-gray-900">{selectedNode.metrics.uptime}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Radio Frequency</div>
                      <div className="font-medium text-gray-900">{selectedNode.metrics.frequency}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Active Flights</div>
                      <div className="font-medium text-gray-900">{selectedNode.activeFlights} aircraft</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Total Capacity</div>
                      <div className="font-medium text-gray-900">{selectedNode.metrics.aircraft} aircraft</div>
                    </div>
                  </>
                )}
                <div>
                  <div className="text-sm text-gray-600 mb-1">Connected Nodes</div>
                  <div className="font-medium text-gray-900">{selectedNode.connections.length} connections</div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Running diagnostics on ${selectedNode.name}...\n\n🔍 Node ID: ${selectedNode.id}\n📍 Location: ${selectedNode.location}\n⏱️ Uptime: ${selectedNode.metrics.uptime}%\n📊 Status: ${selectedNode.status}\n\n${systemType === 'supply-chain' ? `Throughput: ${selectedNode.metrics.throughput} units/hr\nLatency: ${selectedNode.metrics.latency}ms\nInventory: ${selectedNode.inventory} units` : `Frequency: ${selectedNode.metrics.frequency}\nActive Flights: ${selectedNode.activeFlights}\nCapacity: ${selectedNode.metrics.aircraft} aircraft`}\n\n✓ Diagnostics complete`);
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  Run Diagnostics
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Contacting support for ${selectedNode.name}\n\n📧 Support Ticket Created\n🆔 Ticket #${Math.floor(Math.random() * 10000)}\n📍 Location: ${selectedNode.location}\n🔗 Node ID: ${selectedNode.id}\n⚠️ Status: ${selectedNode.status}\n\n👤 Assigned Engineer: John Smith\n📞 Response time: < 15 minutes\n\nSupport team has been notified.`);
                  }}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact Support
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Performance History: ${selectedNode.name}\n\n📊 Past 24 Hours:\n• Average Uptime: ${selectedNode.metrics.uptime}%\n• Peak Load: ${systemType === 'supply-chain' ? `${Math.round(selectedNode.metrics.throughput * 1.2)} units/hr` : `${selectedNode.activeFlights + 5} flights`}\n• Incidents: ${selectedNode.status === 'critical' ? '3' : selectedNode.status === 'warning' ? '1' : '0'}\n\n📅 Last Maintenance: 2 weeks ago\n🔧 Next Scheduled: ${selectedNode.status === 'critical' ? 'Urgent' : '1 week'}\n\nView detailed logs in system dashboard.`);
                  }}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  View History
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Panel */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Active Alerts</h3>
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                {alerts.filter(a => a.severity === 'critical').length} Critical
              </span>
            </div>
            <button 
              onClick={() => setShowAlertPanel(!showAlertPanel)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showAlertPanel ? '−' : '+'}
            </button>
          </div>
          
          {showAlertPanel && (
            <div className="divide-y max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div>No active alerts</div>
                </div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        alert.severity === 'critical' ? 'bg-red-100' :
                        alert.severity === 'warning' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        {alert.severity === 'critical' ? <XCircle className="w-4 h-4 text-red-600" /> :
                         alert.severity === 'warning' ? <AlertCircle className="w-4 h-4 text-yellow-600" /> :
                         <CheckCircle className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        {alert.nodeName && (
                          <div className="text-sm font-semibold text-gray-900 mb-1">
                            {alert.nodeName}
                          </div>
                        )}
                        <div className="text-sm text-gray-700 mb-2">{alert.message}</div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                            {alert.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    {alert.severity !== 'info' && (
                      <div className="mt-3 flex gap-2">
                        <button 
                          onClick={() => alert.nodeId && setSelectedNode(currentNodes.find(n => n.id === alert.nodeId))}
                          className="flex-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                        >
                          Investigate
                        </button>
                        <button className="flex-1 text-xs border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors">
                          Acknowledge
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setShowCOFM(true)}
              className="w-full text-left p-3 border-2 border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-3"
            >
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-semibold text-blue-900">View COFM Graph</div>
                <div className="text-xs text-blue-700">WBS+PERT+Gantt+Scatter unified view</div>
              </div>
            </button>
            <button 
              onClick={() => alert('Running system health check...\n\n✓ Scanning all nodes\n✓ Checking connectivity\n✓ Analyzing performance metrics\n✓ Identifying maintenance needs\n\nResults: ' + systemStats.healthy + ' healthy, ' + systemStats.warning + ' warnings, ' + systemStats.critical + ' critical')}
              className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">System Health Check</span>
            </button>
            <button 
              onClick={() => alert('Schedule Maintenance\n\nSelect maintenance type:\n• Routine inspection\n• System upgrade\n• Emergency repair\n\nChoose date/time and affected nodes.\nTeams will be notified automatically.')}
              className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <Wrench className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Schedule Maintenance</span>
            </button>
            <button 
              onClick={() => alert('Contact Team\n\n📞 On-Call Engineers: Available\n👥 System Administrators: 3 online\n🚨 Emergency Response: Ready\n\nConnecting you to the support channel...')}
              className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Contact Team</span>
            </button>
            <button 
              onClick={() => alert('Generate Report\n\nReport will include:\n\n📊 Network Topology Overview\n📈 Performance Metrics (24hr)\n⚠️ Alert History & Trends\n🔧 Maintenance Schedule\n💡 Optimization Recommendations\n\nGenerating PDF report...')}
              className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Generate Report</span>
            </button>
            {systemType === 'supply-chain' ? (
              <button 
                onClick={() => {
                  const shipmentId = prompt('Enter Shipment ID:');
                  if (shipmentId) {
                    alert(`Tracking Shipment: ${shipmentId}\n\n📦 Status: In Transit\n📍 Current Location: Distribution Center\n🚚 Next Stop: Warehouse Hub\n⏱️ ETA: 2 hours\n\nView detailed route on topology map.`);
                  }
                }}
                className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Track Shipment</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  const flightNum = prompt('Enter Flight Number:');
                  if (flightNum) {
                    alert(`Flight Status: ${flightNum}\n\n✈️ Status: En Route\n📍 Position: Over Nevada\n📊 Altitude: 35,000 ft\n⚡ Speed: 520 mph\n🛬 ETA LAX: 45 minutes\n\nHandoff: Oakland Center → SoCal TRACON`);
                  }
                }}
                className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <Plane className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Flight Status</span>
              </button>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            {systemType === 'supply-chain' ? 
              <Package className="w-6 h-6" /> : 
              <Plane className="w-6 h-6" />
            }
            <h3 className="text-lg font-semibold">
              {systemType === 'supply-chain' ? 'Supply Chain Status' : 'ATC Network Status'}
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-100">Overall Health</span>
              <span className="font-bold">
                {Math.round((systemStats.healthy / systemStats.total) * 100)}%
              </span>
            </div>
            <div className="w-full bg-blue-400 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${(systemStats.healthy / systemStats.total) * 100}%` }}
              />
            </div>
            <div className="text-sm text-blue-100 pt-2">
              {systemType === 'supply-chain' ? 
                'End-to-end supply chain visibility across all nodes' :
                'Real-time airspace management and traffic coordination'}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Network Connections Map */}
    <div className="mt-6 bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Network Connection Map</h3>
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="space-y-4">
          {currentNodes.slice(0, 6).map(node => (
            <div key={node.id} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                node.status === 'healthy' ? 'bg-green-500' :
                node.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{node.name}</div>
                <div className="text-sm text-gray-600">{node.location}</div>
              </div>
              <div className="flex items-center gap-2">
                {node.connections.length > 0 ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">{node.connections.length} connections</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">No connections</span>
                  </>
                )}
              </div>
              <button 
                onClick={() => setSelectedNode(node)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Maintenance Schedule */}
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upcoming Maintenance</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Schedule New
          </button>
        </div>
        <div className="space-y-3">
          {[
            { node: currentNodes[2]?.name, time: 'Tonight 2:00 AM', duration: '2 hours', type: 'Routine' },
            { node: currentNodes[5]?.name, time: 'Tomorrow 1:00 AM', duration: '1 hour', type: 'Update' },
            { node: currentNodes[1]?.name, time: 'Friday 3:00 AM', duration: '3 hours', type: 'Inspection' }
          ].map((maintenance, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium text-gray-900">{maintenance.node}</div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {maintenance.type}
                </span>
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {maintenance.time}
                </span>
                <span>Duration: {maintenance.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity Log</h3>
        <div className="space-y-3">
          {[
            { action: 'System diagnostics completed', node: currentNodes[0]?.name, time: '5 minutes ago', status: 'success' },
            { action: 'Alert acknowledged', node: currentNodes[3]?.name, time: '12 minutes ago', status: 'info' },
            { action: 'Maintenance scheduled', node: currentNodes[2]?.name, time: '25 minutes ago', status: 'success' },
            { action: 'Performance degradation detected', node: currentNodes[4]?.name, time: '1 hour ago', status: 'warning' }
          ].map((log, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-1.5 rounded-full ${
                log.status === 'success' ? 'bg-green-100' :
                log.status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                {log.status === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                 log.status === 'warning' ? <AlertCircle className="w-4 h-4 text-yellow-600" /> :
                 <Activity className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{log.action}</div>
                <div className="text-xs text-gray-600">{log.node}</div>
                <div className="text-xs text-gray-500 mt-1">{log.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recommendations Panel */}
    <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-100 rounded-lg">
          <Zap className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Recommendations</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="font-medium text-gray-900 mb-1">
                ⚠️ Consider load balancing for {currentNodes[3]?.name}
              </div>
              <div className="text-sm text-gray-600">
                Performance metrics indicate high stress. Recommend redistributing traffic to alternate nodes.
              </div>
              <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                View Analysis →
              </button>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="font-medium text-gray-900 mb-1">
                💡 Optimize routing for {currentNodes[1]?.name}
              </div>
              <div className="text-sm text-gray-600">
                {systemType === 'supply-chain' ? 
                  'Alternative shipping routes available with 15% faster delivery time.' :
                  'Alternate flight paths available to reduce congestion in this sector.'}
              </div>
              <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                Apply Suggestion →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

);
};

export default SystemsNetworkMonitor;
