import React, { useState, useEffect } from 'react';
import { generateMockNodes, generateMockConnections } from '../utils/mockData';
import './TopologyView.css';

function TopologyView({ systemType, selectedNode, onNodeSelect }) {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);

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

  return (
    <div className="topology-view">
      <h2>Network Topology - {systemType === 'supply-chain' ? 'Supply Chain' : 'Air Traffic Control'}</h2>
      <svg className="topology-svg" viewBox="0 0 800 600">
        {/* Render connections first (so they appear under nodes) */}
        <g className="connections">
          {connections.map((conn) => {
            const from = getNodePosition(conn.fromNodeId);
            const to = getNodePosition(conn.toNodeId);
            
            return (
              <g key={conn.id}>
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
                {/* Connection label at midpoint */}
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
              </g>
            );
          })}
        </g>

        {/* Render nodes */}
        <g className="nodes">
          {nodes.map((node, index) => {
            const x = (index % 5) * 150 + 100;
            const y = Math.floor(index / 5) * 150 + 100;
            
            return (
              <g key={node.id} onClick={() => onNodeSelect(node)}>
                <circle
                  cx={x}
                  cy={y}
                  r={30}
                  fill={getStatusColor(node.status)}
                  stroke={selectedNode?.id === node.id ? '#61dafb' : '#2a3f5f'}
                  strokeWidth={selectedNode?.id === node.id ? 3 : 1}
                  className="node-circle"
                />
                <text
                  x={x}
                  y={y + 50}
                  textAnchor="middle"
                  fill="#e0e0e0"
                  fontSize="12"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default TopologyView;
