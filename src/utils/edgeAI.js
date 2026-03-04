/**
 * Edge AI Engine
 *
 * All inference runs entirely on-device (in the browser) with no external API
 * calls, satisfying the core Edge AI requirements:
 *   • Instant decisions  – synchronous, zero-network-latency inference
 *   • Privacy & safety   – node metrics never leave the device
 *   • Reliable operation – works fully offline
 *
 * The engine uses a rule-based expert system that mirrors the kind of
 * lightweight model that ships on embedded/edge hardware. Each rule maps a
 * set of observable conditions to an actionable recommendation together with a
 * confidence score (0–1) derived from how strongly the conditions are met.
 */

/**
 * Generate on-device AI recommendations for a given node and its metrics.
 *
 * @param {object} node    – node object (id, name, type, status, location)
 * @param {object} metrics – metrics object (uptime, throughput, latency)
 * @returns {Array<{id, recommendation, confidence, priority, category}>}
 */
export function generateEdgeAIRecommendations(node, metrics) {
  if (!node || !metrics) return [];

  const recommendations = [];

  // ── Critical-status rules ──────────────────────────────────────────────────
  if (node.status === 'critical') {
    recommendations.push({
      id: 'rec-failover',
      recommendation: `Initiate failover protocol for ${node.name}. Reroute dependent traffic immediately.`,
      confidence: 0.97,
      priority: 'critical',
      category: 'Resilience',
    });
  }

  // ── Uptime rules ───────────────────────────────────────────────────────────
  if (metrics.uptime < 90) {
    const uptimeConfidence = parseFloat(((90 - metrics.uptime) / 90).toFixed(2));
    recommendations.push({
      id: 'rec-maintenance',
      recommendation: `Uptime at ${metrics.uptime}%. Schedule urgent maintenance within 4 hours to prevent service disruption.`,
      confidence: Math.min(uptimeConfidence + 0.6, 0.99),
      priority: 'high',
      category: 'Maintenance',
    });
  } else if (metrics.uptime < 97) {
    recommendations.push({
      id: 'rec-maintenance-schedule',
      recommendation: `Uptime at ${metrics.uptime}%. Plan preventive maintenance in the next 48 hours.`,
      confidence: 0.78,
      priority: 'medium',
      category: 'Maintenance',
    });
  }

  // ── Latency rules ──────────────────────────────────────────────────────────
  if (metrics.latency > 80) {
    const conf = parseFloat(Math.min((metrics.latency - 80) / 100 + 0.6, 0.95).toFixed(2));
    recommendations.push({
      id: 'rec-latency',
      recommendation: `Latency spike detected (${metrics.latency} ms). Investigate network path and consider load-balancing.`,
      confidence: conf,
      priority: metrics.latency > 120 ? 'high' : 'medium',
      category: 'Performance',
    });
  }

  // ── Throughput rules ───────────────────────────────────────────────────────
  if (metrics.throughput > 1500) {
    recommendations.push({
      id: 'rec-capacity',
      recommendation: `High throughput (${metrics.throughput} units/hr). Consider distributing load to adjacent nodes.`,
      confidence: 0.82,
      priority: 'medium',
      category: 'Capacity',
    });
  } else if (metrics.throughput < 600 && node.status !== 'critical') {
    recommendations.push({
      id: 'rec-throughput-low',
      recommendation: `Low throughput (${metrics.throughput} units/hr). Run diagnostics to identify potential bottleneck.`,
      confidence: 0.71,
      priority: 'low',
      category: 'Performance',
    });
  }

  // ── Node-type-specific rules ───────────────────────────────────────────────
  if (node.type === 'manufacturer' || node.type === 'tracon') {
    if (node.status === 'warning') {
      recommendations.push({
        id: 'rec-dependency',
        recommendation: `${node.name} is a high-dependency node in warning state. Notify downstream operators and pre-stage backup capacity.`,
        confidence: 0.88,
        priority: 'high',
        category: 'Risk Management',
      });
    }
  }

  // ── Healthy-node positive signal ───────────────────────────────────────────
  if (
    node.status === 'operational' &&
    metrics.uptime >= 97 &&
    metrics.latency <= 50 &&
    recommendations.length === 0
  ) {
    recommendations.push({
      id: 'rec-healthy',
      recommendation: `${node.name} is performing optimally. No action required.`,
      confidence: 0.99,
      priority: 'info',
      category: 'Status',
    });
  }

  // Sort: critical first, then by confidence descending
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  recommendations.sort(
    (a, b) =>
      (priorityOrder[a.priority] ?? 5) - (priorityOrder[b.priority] ?? 5) ||
      b.confidence - a.confidence
  );

  return recommendations;
}

/**
 * Return a human-readable label and CSS class for a recommendation priority.
 */
export function getRecommendationMeta(priority) {
  switch (priority) {
    case 'critical':
      return { label: 'Critical', className: 'rec-priority-critical' };
    case 'high':
      return { label: 'High', className: 'rec-priority-high' };
    case 'medium':
      return { label: 'Medium', className: 'rec-priority-medium' };
    case 'low':
      return { label: 'Low', className: 'rec-priority-low' };
    default:
      return { label: 'Info', className: 'rec-priority-info' };
  }
}
