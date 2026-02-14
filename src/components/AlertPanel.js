import React, { useState, useEffect } from 'react';
import { generateMockAlerts } from '../utils/mockData';
import { AlertCircle, AlertTriangle, Info, Check, Eye, ArrowUpCircle, XCircle } from 'lucide-react';
import './AlertPanel.css';

function AlertPanel({ systemType }) {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'critical', 'warning', 'info'
  const [sortBy, setSortBy] = useState('time'); // 'time', 'severity'

  useEffect(() => {
    const mockAlerts = generateMockAlerts(systemType);
    // Add priority scores to alerts
    const alertsWithPriority = mockAlerts.map(alert => ({
      ...alert,
      priorityScore: calculatePriorityScore(alert)
    }));
    setAlerts(alertsWithPriority);
  }, [systemType]);

  const calculatePriorityScore = (alert) => {
    // Priority Score = Severity Weight × Impact Factor × Time Decay
    const severityWeight = {
      critical: 10,
      warning: 5,
      info: 1
    };
    
    // Simple impact factor (could be based on dependent nodes in real implementation)
    const impactFactor = alert.type === 'node_failure' ? 3 : 
                         alert.type === 'communication' ? 2.5 : 2;
    
    // Time decay (newer alerts have higher priority)
    const timeDecay = 1.0; // Simplified for mock data
    
    return severityWeight[alert.severity] * impactFactor * timeDecay;
  };

  const handleAcknowledge = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleResolve = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle size={18} />;
      case 'warning':
        return <AlertTriangle size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  const getSeverityClass = (severity, acknowledged) => {
    return `alert-item ${severity} ${acknowledged ? 'acknowledged' : ''}`;
  };

  const getFilteredAlerts = () => {
    let filtered = alerts;
    
    // Apply severity filter
    if (filter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filter);
    }
    
    // Apply sorting
    if (sortBy === 'severity') {
      filtered = [...filtered].sort((a, b) => b.priorityScore - a.priorityScore);
    }
    
    return filtered;
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="alert-panel">
      <div className="alert-panel-header">
        <h3>Active Alerts ({filteredAlerts.length})</h3>
        <div className="alert-controls">
          <select 
            className="alert-filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <select 
            className="alert-sort" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="time">By Time</option>
            <option value="severity">By Priority</option>
          </select>
        </div>
      </div>
      <div className="alert-list">
        {filteredAlerts.length === 0 ? (
          <p className="no-alerts">No active alerts</p>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className={getSeverityClass(alert.severity, alert.acknowledged)}>
              <div className="alert-content">
                <div className="alert-header">
                  {getAlertIcon(alert.severity)}
                  <span className="alert-severity">{alert.severity.toUpperCase()}</span>
                  {alert.priorityScore && (
                    <span className="alert-priority">P{Math.round(alert.priorityScore)}</span>
                  )}
                </div>
                <p className="alert-message">{alert.message}</p>
                <span className="alert-time">{alert.timestamp}</span>
              </div>
              
              {!alert.acknowledged && (
                <div className="alert-actions">
                  <button 
                    className="action-btn investigate" 
                    title="Investigate"
                    onClick={() => console.log('Investigate', alert.id)}
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    className="action-btn acknowledge" 
                    title="Acknowledge"
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    <Check size={14} />
                  </button>
                  <button 
                    className="action-btn escalate" 
                    title="Escalate"
                    onClick={() => console.log('Escalate', alert.id)}
                  >
                    <ArrowUpCircle size={14} />
                  </button>
                  <button 
                    className="action-btn resolve" 
                    title="Resolve"
                    onClick={() => handleResolve(alert.id)}
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              )}
              
              {alert.acknowledged && (
                <div className="alert-acknowledged-badge">
                  <Check size={12} />
                  <span>Acknowledged</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AlertPanel;
