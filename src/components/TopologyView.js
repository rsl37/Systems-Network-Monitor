import React, { useState, useEffect, useMemo } from 'react';
import { generateMockNodes, generateMockConnections, generateCOFMData } from '../utils/mockData';
import SearchBar from './SearchBar';
import './TopologyView.css';

// ── View labels / ids ────────────────────────────────────────────────────────
const VIEWS = [
  { id: 'topology', label: 'Topology' },
  { id: 'list',     label: 'List' },
  { id: 'metrics',  label: 'Metrics' },
  { id: 'cofm',     label: 'COFM' },
];

// ── COFM helpers ─────────────────────────────────────────────────────────────
// SVG coordinate space constants
const COFM_SVG_W   = 900;
const COFM_SVG_H   = 500;
const COFM_PAD_L   = 90;   // space for y-axis labels
const COFM_PAD_R   = 30;
const COFM_PAD_T   = 40;
const COFM_PAD_B   = 60;   // space for x-axis labels
const COFM_DAY_MIN = 0;
const COFM_DAY_MAX = 14;
const COFM_RES_MIN = 0;
const COFM_RES_MAX = 10;

function cofmX(day) {
  const plotW = COFM_SVG_W - COFM_PAD_L - COFM_PAD_R;
  return COFM_PAD_L + ((day - COFM_DAY_MIN) / (COFM_DAY_MAX - COFM_DAY_MIN)) * plotW;
}

function cofmY(resource) {
  const plotH = COFM_SVG_H - COFM_PAD_T - COFM_PAD_B;
  // Invert: high resource → top of chart
  return COFM_PAD_T + ((COFM_RES_MAX - resource) / (COFM_RES_MAX - COFM_RES_MIN)) * plotH;
}

// ── Sort indicator ────────────────────────────────────────────────────────────
function sortIndicator(listSort, key) {
  if (listSort.key !== key) return '';
  return listSort.dir === 'asc' ? ' ▲' : ' ▼';
}

function TopologyView({ systemType, selectedNode, onNodeSelect, importedNodes, importedConnections }) {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: [], type: [] });
  const [activeView, setActiveView] = useState('topology');
  const [listSort, setListSort] = useState({ key: 'name', dir: 'asc' });

  useEffect(() => {
    if (importedNodes) {
      setNodes(importedNodes);
      setConnections(importedConnections || []);
    } else {
      setNodes(generateMockNodes(systemType));
      setConnections(generateMockConnections(systemType));
    }
    setFilters({ status: [], type: [] });
    setSearchTerm('');
  }, [systemType, importedNodes, importedConnections]);

  // COFM enriched nodes computed once per nodes/systemType change
  const cofmNodes = useMemo(() => generateCOFMData(nodes), [nodes]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return '#4ade80';
      case 'warning':
        return '#fbbf24';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getNodePosition = (nodeId) => {
    const index = nodes.findIndex(n => n.id === nodeId);
    if (index === -1) return { x: 0, y: 0 };
    const x = (index % 5) * 150 + 100;
    const y = Math.floor(index / 5) * 150 + 100;
    return { x, y };
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({ status: [], type: [] });
    setSearchTerm('');
  };

  const isNodeVisible = (node) => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        node.name.toLowerCase().includes(term) ||
        node.type.toLowerCase().includes(term) ||
        node.location.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(node.status)) {
      return false;
    }

    // Type filter
    if (filters.type.length > 0 && !filters.type.includes(node.type)) {
      return false;
    }

    return true;
  };

  const visibleNodes = nodes.filter(isNodeVisible);
  const hasFilters = searchTerm || filters.status.length > 0 || filters.type.length > 0;

  // ── List-view sort ────────────────────────────────────────────────────────
  const handleListSort = (key) => {
    setListSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  };

  // List view always sorts the currently visible (filtered) nodes
  const sortedNodes = useMemo(() => {
    return [...visibleNodes].sort((a, b) => {
      const av = (a[listSort.key] || '').toString().toLowerCase();
      const bv = (b[listSort.key] || '').toString().toLowerCase();
      return listSort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [visibleNodes, listSort]);

  // ── Metrics summary data ──────────────────────────────────────────────────
  const metricsSummary = useMemo(() => {
    const counts = { operational: 0, warning: 0, critical: 0 };
    nodes.forEach(n => { if (counts[n.status] !== undefined) counts[n.status]++; });
    const byType = {};
    nodes.forEach(n => { byType[n.type] = (byType[n.type] || 0) + 1; });
    return { counts, byType };
  }, [nodes]);

  // ── System label helper ───────────────────────────────────────────────────
  const systemLabel = systemType === 'supply-chain' ? 'Supply Chain' : 'Air Traffic Control';

  // ── COFM: derive critical-path connection ids ─────────────────────────────
  const criticalNodeIds = useMemo(
    () => new Set(cofmNodes.filter(n => n.onCriticalPath).map(n => n.id)),
    [cofmNodes]
  );
  const cofmNodeMap = useMemo(
    () => Object.fromEntries(cofmNodes.map(n => [n.id, n])),
    [cofmNodes]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="topology-view">
      {/* Header */}
      <div className="topology-header">
        <h2>Network Topology - {systemLabel}</h2>
        {(activeView === 'topology' || activeView === 'list') && (
          <SearchBar
            value={searchTerm}
            onSearch={handleSearch}
            onFilter={handleFilter}
            filters={filters}
            onClearFilters={handleClearFilters}
            systemType={systemType}
          />
        )}
      </div>

      {/* View tabs */}
      <div className="view-tabs" role="tablist" aria-label="Analysis views">
        {VIEWS.map(v => (
          <button
            key={v.id}
            role="tab"
            aria-selected={activeView === v.id}
            className={`view-tab${activeView === v.id ? ' active' : ''}`}
            onClick={() => setActiveView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* ── TOPOLOGY VIEW ────────────────────────────────────────────────── */}
      {activeView === 'topology' && (
        <>
          {hasFilters && (
            <div className="filter-summary">
              Showing {visibleNodes.length} of {nodes.length} nodes
            </div>
          )}
          <svg className="topology-svg" viewBox="0 0 800 600">
            <g className="connections">
              {connections.map((conn) => {
                const from = getNodePosition(conn.fromNodeId);
                const to = getNodePosition(conn.toNodeId);
                const fromNode = nodes.find(n => n.id === conn.fromNodeId);
                const toNode = nodes.find(n => n.id === conn.toNodeId);
                const isVisible = !!fromNode && !!toNode && isNodeVisible(fromNode) && isNodeVisible(toNode);
                return (
                  <g key={conn.id} opacity={isVisible ? 1 : 0.2}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#3a5f8f"
                      strokeWidth="2"
                      strokeDasharray={conn.type === 'communication' ? '5,5' : 'none'}
                      className="connection-line"
                    />
                    {isVisible && (
                      <text
                        x={(from.x + to.x) / 2}
                        y={(from.y + to.y) / 2 - 5}
                        textAnchor="middle"
                        fill="#6b7280"
                        fontSize="9"
                        className="connection-label"
                      >
                        {conn.latency}ms
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
            <g className="nodes">
              {nodes.map((node, index) => {
                const x = (index % 5) * 150 + 100;
                const y = Math.floor(index / 5) * 150 + 100;
                const visible = isNodeVisible(node);
                return (
                  <g
                    key={node.id}
                    onClick={() => onNodeSelect(node)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onNodeSelect(node);
                      }
                    }}
                    role="button"
                    tabIndex={visible ? 0 : -1}
                    aria-label={`${node.name}, ${node.type}, status: ${node.status}, location: ${node.location}`}
                    opacity={visible ? 1 : 0.3}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={30}
                      fill={getStatusColor(node.status)}
                      stroke={selectedNode?.id === node.id ? '#61dafb' : visible ? '#2a3f5f' : '#1a1f3a'}
                      strokeWidth={selectedNode?.id === node.id ? 3 : 1}
                      className={`node-circle ${visible ? 'visible' : 'dimmed'}`}
                    />
                    {visible && (
                      <>
                        <text x={x} y={y + 50} textAnchor="middle" fill="#e0e0e0" fontSize="12">
                          {node.name}
                        </text>
                        {hasFilters && (
                          <circle cx={x + 20} cy={y - 20} r={4} fill="#61dafb" className="highlight-dot" />
                        )}
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </>
      )}

      {/* ── LIST VIEW ────────────────────────────────────────────────────── */}
      {activeView === 'list' && (
        <div className="list-view">
          {hasFilters && (
            <div className="filter-summary">
              Showing {visibleNodes.length} of {nodes.length} nodes
            </div>
          )}
          <table className="node-table" aria-label="Node list">
            <thead>
              <tr>
                {[
                  { key: 'name',     label: 'Name' },
                  { key: 'type',     label: 'Type' },
                  { key: 'status',   label: 'Status' },
                  { key: 'location', label: 'Location' },
                ].map(col => (
                  <th
                    key={col.key}
                    className="sortable-th"
                    onClick={() => handleListSort(col.key)}
                    aria-sort={listSort.key === col.key ? (listSort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    {col.label}{sortIndicator(listSort, col.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedNodes.map(node => (
                <tr
                  key={node.id}
                  className={`node-row${selectedNode?.id === node.id ? ' selected' : ''}`}
                  onClick={() => onNodeSelect(node)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNodeSelect(node);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.name}, ${node.type}, status: ${node.status}, location: ${node.location}`}
                >
                  <td className="node-table-name">{node.name}</td>
                  <td className="node-table-type">{node.type}</td>
                  <td>
                    <span className={`status-pill ${node.status}`}>{node.status}</span>
                  </td>
                  <td className="node-table-location">{node.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── METRICS VIEW ─────────────────────────────────────────────────── */}
      {activeView === 'metrics' && (
        <div className="metrics-view">
          {/* Status summary cards */}
          <div className="metrics-cards">
            <div className="metrics-card operational">
              <span className="metrics-card-count">{metricsSummary.counts.operational}</span>
              <span className="metrics-card-label">Operational</span>
            </div>
            <div className="metrics-card warning">
              <span className="metrics-card-count">{metricsSummary.counts.warning}</span>
              <span className="metrics-card-label">Warning</span>
            </div>
            <div className="metrics-card critical">
              <span className="metrics-card-count">{metricsSummary.counts.critical}</span>
              <span className="metrics-card-label">Critical</span>
            </div>
            <div className="metrics-card total">
              <span className="metrics-card-count">{nodes.length}</span>
              <span className="metrics-card-label">Total Nodes</span>
            </div>
          </div>

          {/* Nodes by type bar chart */}
          <div className="metrics-section">
            <h3 className="metrics-section-title">Nodes by Type</h3>
            <div className="metrics-bar-chart">
              {Object.entries(metricsSummary.byType).map(([type, count]) => {
                const pct = Math.round((count / nodes.length) * 100);
                return (
                  <div key={type} className="metrics-bar-row">
                    <span className="metrics-bar-label">{type}</span>
                    <div className="metrics-bar-track">
                      <div
                        className="metrics-bar-fill"
                        style={{ width: `${pct}%` }}
                        aria-valuenow={pct}
                        role="progressbar"
                        aria-label={`${type}: ${count} nodes`}
                      />
                    </div>
                    <span className="metrics-bar-value">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status distribution donut-style SVG */}
          <div className="metrics-section">
            <h3 className="metrics-section-title">Status Distribution</h3>
            <div className="metrics-status-distribution">
              {nodes.map(node => (
                <span
                  key={node.id}
                  className={`status-dot-small ${node.status}`}
                  title={`${node.name}: ${node.status}`}
                />
              ))}
            </div>
            <p className="metrics-hint">
              Each dot represents one node. Click a node in Topology or List view to see details.
            </p>
          </div>
        </div>
      )}

      {/* ── COFM VIEW ────────────────────────────────────────────────────── */}
      {activeView === 'cofm' && (
        <div className="cofm-view">
          <p className="cofm-subtitle">
            <strong>C</strong>omplexly <strong>O</strong>rganized <strong>F</strong>lexibly{' '}
            <strong>M</strong>anageable · WBS (size) · PERT (red lines) · Gantt (X) · Resources (Y)
          </p>
          <svg
            className="cofm-svg"
            viewBox={`0 0 ${COFM_SVG_W} ${COFM_SVG_H}`}
            role="img"
            aria-label="COFM visualization"
          >
            {/* Grid lines */}
            {[2, 4, 6, 8, 10, 12, 14].map(day => (
              <line
                key={`grid-x-${day}`}
                x1={cofmX(day)} y1={COFM_PAD_T}
                x2={cofmX(day)} y2={COFM_SVG_H - COFM_PAD_B}
                stroke="#1e2d4a" strokeWidth="1"
              />
            ))}
            {[2, 4, 6, 8, 10].map(res => (
              <line
                key={`grid-y-${res}`}
                x1={COFM_PAD_L} y1={cofmY(res)}
                x2={COFM_SVG_W - COFM_PAD_R} y2={cofmY(res)}
                stroke="#1e2d4a" strokeWidth="1"
              />
            ))}

            {/* X-axis (Gantt / Timeline) */}
            <line
              x1={COFM_PAD_L} y1={COFM_SVG_H - COFM_PAD_B}
              x2={COFM_SVG_W - COFM_PAD_R} y2={COFM_SVG_H - COFM_PAD_B}
              stroke="#3a5f8f" strokeWidth="2"
            />
            {[0, 2, 4, 6, 8, 10, 12, 14].map(day => (
              <text
                key={`x-label-${day}`}
                x={cofmX(day)} y={COFM_SVG_H - COFM_PAD_B + 20}
                textAnchor="middle" fill="#6b7280" fontSize="11"
              >
                D{day}
              </text>
            ))}
            <text
              x={(COFM_PAD_L + COFM_SVG_W - COFM_PAD_R) / 2}
              y={COFM_SVG_H - 8}
              textAnchor="middle" fill="#6b7280" fontSize="12" fontStyle="italic"
            >
              ← Gantt Timeline (days) →
            </text>

            {/* Y-axis (Resources) */}
            <line
              x1={COFM_PAD_L} y1={COFM_PAD_T}
              x2={COFM_PAD_L} y2={COFM_SVG_H - COFM_PAD_B}
              stroke="#3a5f8f" strokeWidth="2"
            />
            {[0, 2, 4, 6, 8, 10].map(res => (
              <text
                key={`y-label-${res}`}
                x={COFM_PAD_L - 10} y={cofmY(res) + 4}
                textAnchor="end" fill="#6b7280" fontSize="11"
              >
                {res}
              </text>
            ))}
            <text
              x={18}
              y={(COFM_PAD_T + COFM_SVG_H - COFM_PAD_B) / 2}
              textAnchor="middle" fill="#6b7280" fontSize="12" fontStyle="italic"
              transform={`rotate(-90, 18, ${(COFM_PAD_T + COFM_SVG_H - COFM_PAD_B) / 2})`}
            >
              ↑ Resources ↓
            </text>

            {/* PERT connections – critical path in red, normal in muted blue */}
            {connections.map(conn => {
              const fromC = cofmNodeMap[conn.fromNodeId];
              const toC   = cofmNodeMap[conn.toNodeId];
              if (!fromC || !toC) return null;
              // PERT visualisation: highlight connections that touch any bottleneck node
              // (critical or warning status) so operators can see the full blast radius.
              const isCritical = criticalNodeIds.has(conn.fromNodeId) || criticalNodeIds.has(conn.toNodeId);
              return (
                <line
                  key={`cofm-conn-${conn.id}`}
                  x1={cofmX(fromC.cofmDay)} y1={cofmY(fromC.cofmResource)}
                  x2={cofmX(toC.cofmDay)}   y2={cofmY(toC.cofmResource)}
                  stroke={isCritical ? '#ef4444' : '#2a3f5f'}
                  strokeWidth={isCritical ? 2 : 1}
                  strokeDasharray={isCritical ? 'none' : '4,3'}
                  opacity={isCritical ? 0.85 : 0.5}
                />
              );
            })}

            {/* WBS nodes (size = hierarchy weight) */}
            {cofmNodes.map(node => {
              const cx = cofmX(node.cofmDay);
              const cy = cofmY(node.cofmResource);
              const r  = node.wbsRadius;
              const isSelected = selectedNode?.id === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => onNodeSelect(node)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNodeSelect(node);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.name}, ${node.type}, status: ${node.status}`}
                >
                  <circle
                    cx={cx} cy={cy} r={r}
                    fill={getStatusColor(node.status)}
                    stroke={isSelected ? '#61dafb' : node.onCriticalPath ? '#ef4444' : '#2a3f5f'}
                    strokeWidth={isSelected ? 3 : node.onCriticalPath ? 2 : 1}
                    className="node-circle visible"
                    opacity={0.9}
                  />
                  <text
                    x={cx} y={cy + r + 14}
                    textAnchor="middle" fill="#c0c8e0" fontSize="10"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform={`translate(${COFM_SVG_W - COFM_PAD_R - 190}, ${COFM_PAD_T})`}>
              <rect x={-8} y={-8} width={198} height={100} rx={4}
                fill="#0d1630" stroke="#2a3f5f" strokeWidth="1" opacity={0.9} />
              <text x={0} y={8} fill="#61dafb" fontSize="11" fontWeight="bold">Legend</text>
              {[
                { color: '#4ade80', label: 'Operational' },
                { color: '#fbbf24', label: 'Warning' },
                { color: '#ef4444', label: 'Critical' },
              ].map(({ color, label }, i) => (
                <g key={label} transform={`translate(0, ${24 + i * 20})`}>
                  <circle r={6} fill={color} />
                  <text x={14} y={4} fill="#e0e0e0" fontSize="11">{label}</text>
                </g>
              ))}
              <g transform="translate(0, 84)">
                <line x1={0} y1={0} x2={18} y2={0} stroke="#ef4444" strokeWidth="2" />
                <text x={22} y={4} fill="#e0e0e0" fontSize="11">Critical path (PERT)</text>
              </g>
            </g>

            {/* WBS size legend */}
            <g transform={`translate(${COFM_PAD_L}, ${COFM_PAD_T - 4})`}>
              <text x={0} y={0} fill="#6b7280" fontSize="10">Circle size = WBS hierarchy weight</text>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}

export default TopologyView;
