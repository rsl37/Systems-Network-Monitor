import React, { useState, useEffect } from 'react';
import { generateMockAlerts } from '../utils/mockData';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import './AlertPanel.css';

function AlertPanel({ systemType }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    setAlerts(generateMockAlerts(systemType));
  }, [systemType]);

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

  const getSeverityClass = (severity) => {
    return `alert-item ${severity}`;
  };

  return (
    <div className="alert-panel">
      <h3>Active Alerts ({alerts.length})</h3>
      <div className="alert-list">
        {alerts.length === 0 ? (
          <p className="no-alerts">No active alerts</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={getSeverityClass(alert.severity)}>
              <div className="alert-header">
                {getAlertIcon(alert.severity)}
                <span className="alert-severity">{alert.severity.toUpperCase()}</span>
              </div>
              <p className="alert-message">{alert.message}</p>
              <span className="alert-time">{alert.timestamp}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AlertPanel;
