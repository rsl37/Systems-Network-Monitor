import React from 'react';
import { generateMockMetrics } from '../utils/mockData';
import { TrendingUp, TrendingDown, Activity, MapPin, Clock } from 'lucide-react';
import './NodeDetailsPanel.css';

function NodeDetailsPanel({ node, onClose }) {
  if (!node) return null;

  const metrics = generateMockMetrics(node.id);
  
  const getStatusBadgeClass = (status) => {
    return `status-badge ${status}`;
  };

  const getUptimeColor = (uptime) => {
    if (uptime >= 97) return '#4ade80';
    if (uptime >= 90) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <div className="node-details-panel">
      <div className="panel-header">
        <h3>{node.name}</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="panel-content">
        {/* Basic Info Section */}
        <section className="details-section">
          <h4>Basic Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value">{node.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">{node.type}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={getStatusBadgeClass(node.status)}>
                {node.status}
              </span>
            </div>
            <div className="info-item">
              <MapPin size={14} className="info-icon" />
              <span className="info-value">{node.location}</span>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="details-section">
          <h4>Performance Metrics</h4>
          
          <div className="metric-card">
            <div className="metric-header">
              <Activity size={16} />
              <span>Uptime</span>
            </div>
            <div className="metric-value" style={{ color: getUptimeColor(metrics.uptime) }}>
              {metrics.uptime}%
            </div>
            <div className="metric-bar">
              <div 
                className="metric-bar-fill" 
                style={{ 
                  width: `${metrics.uptime}%`,
                  backgroundColor: getUptimeColor(metrics.uptime)
                }}
              />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <TrendingUp size={16} />
              <span>Throughput</span>
            </div>
            <div className="metric-value">
              {metrics.throughput} <span className="metric-unit">units/hr</span>
            </div>
            <div className="metric-indicator">
              {metrics.throughput > 1000 ? (
                <span className="trend-up">
                  <TrendingUp size={14} /> High traffic
                </span>
              ) : (
                <span className="trend-normal">Normal</span>
              )}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <Clock size={16} />
              <span>Latency</span>
            </div>
            <div className="metric-value">
              {metrics.latency} <span className="metric-unit">ms</span>
            </div>
            <div className="metric-indicator">
              {metrics.latency > 80 ? (
                <span className="trend-down">
                  <TrendingDown size={14} /> High latency
                </span>
              ) : (
                <span className="trend-normal">Normal</span>
              )}
            </div>
          </div>
        </section>

        {/* Status History Section */}
        <section className="details-section">
          <h4>Recent Activity</h4>
          <div className="activity-timeline">
            <div className="activity-item">
              <div className="activity-dot operational"></div>
              <div className="activity-content">
                <span className="activity-time">2 hours ago</span>
                <span className="activity-desc">Status changed to {node.status}</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot operational"></div>
              <div className="activity-content">
                <span className="activity-time">6 hours ago</span>
                <span className="activity-desc">Metrics updated</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot operational"></div>
              <div className="activity-content">
                <span className="activity-time">1 day ago</span>
                <span className="activity-desc">System check completed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions Section */}
        <section className="details-section">
          <h4>Quick Actions</h4>
          <div className="action-buttons">
            <button className="action-btn primary">View Full Details</button>
            <button className="action-btn secondary">Run Diagnostics</button>
            <button className="action-btn secondary">Schedule Maintenance</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NodeDetailsPanel;
