// Node data model based on ERD.md specifications

export class Node {
  constructor(id, systemTypeId, name, type, status, location) {
    this.id = id;
    this.systemTypeId = systemTypeId;
    this.name = name;
    this.type = type;
    this.status = status; // 'operational', 'warning', 'critical', 'maintenance'
    this.location = location;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class NodeMetrics {
  constructor(nodeId, uptime, throughput, latency) {
    this.id = `metrics-${nodeId}`;
    this.nodeId = nodeId;
    this.uptime = uptime; // percentage
    this.throughput = throughput; // units per hour
    this.latency = latency; // milliseconds
    this.timestamp = new Date();
  }
}

export class Alert {
  constructor(nodeId, severity, message, type) {
    this.id = `alert-${Date.now()}-${Math.random()}`;
    this.nodeId = nodeId;
    this.severity = severity; // 'critical', 'warning', 'info'
    this.message = message;
    this.type = type; // 'node_failure', 'performance', 'capacity', 'communication'
    this.timestamp = new Date();
    this.acknowledged = false;
    this.resolved = false;
    this.resolvedAt = null;
  }

  acknowledge() {
    this.acknowledged = true;
  }

  resolve(notes) {
    this.resolved = true;
    this.resolvedAt = new Date();
    this.notes = notes;
  }
}

export const NodeStatus = {
  OPERATIONAL: 'operational',
  WARNING: 'warning',
  CRITICAL: 'critical',
  MAINTENANCE: 'maintenance'
};

export const AlertSeverity = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info'
};

export class NodeConnection {
  constructor(fromNodeId, toNodeId, connectionType, bandwidth, latency) {
    this.id = `conn-${fromNodeId}-${toNodeId}`;
    this.fromNodeId = fromNodeId;
    this.toNodeId = toNodeId;
    this.connectionType = connectionType; // 'supply', 'communication', 'handoff'
    this.bandwidth = bandwidth; // Mbps or units/hour
    this.latency = latency; // milliseconds
    this.createdAt = new Date();
  }
}

export const ConnectionType = {
  SUPPLY: 'supply',
  COMMUNICATION: 'communication',
  HANDOFF: 'handoff'
};
