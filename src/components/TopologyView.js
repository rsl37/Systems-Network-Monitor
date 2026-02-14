import React, { useState, useEffect } from 'react';
import { generateMockNodes } from '../utils/mockData';
import './TopologyView.css';

function TopologyView({ systemType, selectedNode, onNodeSelect }) {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    setNodes(generateMockNodes(systemType));
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

  return (
    <div className="topology-view">
      <h2>Network Topology - {systemType === 'supply-chain' ? 'Supply Chain' : 'Air Traffic Control'}</h2>
      <svg className="topology-svg" viewBox="0 0 800 600">
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
      </svg>
    </div>
  );
}

export default TopologyView;
