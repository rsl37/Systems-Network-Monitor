import React, { useState, useEffect } from 'react';
import { generateMockNodes, generateMockConnections } from '../utils/mockData';
import SearchBar from './SearchBar';
import './TopologyView.css';

function TopologyView({ systemType, selectedNode, onNodeSelect }) {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: [], type: [] });

  useEffect(() => {
    setNodes(generateMockNodes(systemType));
    setConnections(generateMockConnections(systemType));
  }, [systemType]);

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

  return (
    <div className="topology-view">
      <div className="topology-header">
        <h2>Network Topology - {systemType === 'supply-chain' ? 'Supply Chain' : 'Air Traffic Control'}</h2>
        <SearchBar 
          onSearch={handleSearch}
          onFilter={handleFilter}
          filters={filters}
          onClearFilters={handleClearFilters}
        />
      </div>
      
      {hasFilters && (
        <div className="filter-summary">
          Showing {visibleNodes.length} of {nodes.length} nodes
        </div>
      )}

      <svg className="topology-svg" viewBox="0 0 800 600">
        {/* Render connections first (so they appear under nodes) */}
        <g className="connections">
          {connections.map((conn) => {
            const from = getNodePosition(conn.fromNodeId);
            const to = getNodePosition(conn.toNodeId);
            const fromNode = nodes.find(n => n.id === conn.fromNodeId);
            const toNode = nodes.find(n => n.id === conn.toNodeId);
            const isVisible = isNodeVisible(fromNode) && isNodeVisible(toNode);
            
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

        {/* Render nodes */}
        <g className="nodes">
          {nodes.map((node, index) => {
            const x = (index % 5) * 150 + 100;
            const y = Math.floor(index / 5) * 150 + 100;
            const visible = isNodeVisible(node);
            
            return (
              <g key={node.id} onClick={() => onNodeSelect(node)} opacity={visible ? 1 : 0.3}>
                <circle
                  cx={x}
                  cy={y}
                  r={30}
                  fill={getStatusColor(node.status)}
                  stroke={selectedNode?.id === node.id ? '#61dafb' : visible ? '#2a3f5f' : '#1a1f3a'}
                  strokeWidth={selectedNode?.id === node.id ? 3 : visible ? 1 : 1}
                  className={`node-circle ${visible ? 'visible' : 'dimmed'}`}
                />
                {visible && (
                  <>
                    <text
                      x={x}
                      y={y + 50}
                      textAnchor="middle"
                      fill="#e0e0e0"
                      fontSize="12"
                    >
                      {node.name}
                    </text>
                    {hasFilters && (
                      <circle
                        cx={x + 20}
                        cy={y - 20}
                        r={4}
                        fill="#61dafb"
                        className="highlight-dot"
                      />
                    )}
                  </>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default TopologyView;
