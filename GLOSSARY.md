# Systems Network Monitor - Glossary

**Version 1.0 | December 2025**

This document provides canonical definitions for all technical terms used in Systems Network Monitor documentation. When a term appears in README.md, WHITEPAPER.md, or ERD.md, it references the definition provided here.

-----

## Core Concepts

**Systems Network Monitor (SNM)**  
Real-time monitoring platform for managing complex networked systems including supply chains and Air Traffic Control facilities. Combines intelligent alerting, multi-dimensional visualization, and decision support.

**Node**  
Individual entity in a network (supplier, tower, warehouse, TRACON, etc.). Each node has a status (healthy, warning, critical), location, connections to other nodes, and performance metrics.

**Status**  
Health indicator for nodes with three levels:
- **Healthy**: Normal operations, all metrics within acceptable ranges
- **Warning**: Degraded performance, metrics approaching thresholds
- **Critical**: Severe issues, immediate operator attention required

-----

## Visualization

**COFM (Complexly Organized Flexibly Manageable)**  
Unified project visualization methodology that compresses four traditional project management approaches into a single graph:
- **WBS (Work Breakdown Structure)**: Encoded as node size (Z-axis/hierarchy)
- **PERT (Program Evaluation Review Technique)**: Shown as red lines (critical path)
- **Gantt Chart**: Represented on X-axis (timeline)
- **Scatterplot**: Represented on Y-axis (resources)

**Critical Path**  
Sequence of dependent tasks determining minimum project duration. In COFM graphs, shown as red solid lines connecting nodes.

**Bottleneck**  
Task or node that constrains overall system throughput. In COFM, displayed as red nodes.

**Slack**  
Scheduling flexibility for non-critical tasks. In COFM, shown as light blue nodes off the critical path.

-----

## Air Traffic Control Terms

**ATC (Air Traffic Control)**  
System managing aircraft movement through controlled airspace and on airport surfaces.

**Tower**  
Airport traffic control facility managing aircraft within an approximately five-mile radius of an airport.

**TRACON (Terminal Radar Approach Control)**  
Facility controlling aircraft approaching and departing major airports, typically within a thirty- to fifty-mile radius.

**Center**  
Air route traffic control center managing high-altitude en route traffic over large geographic regions.

**Handoff**  
Transfer of aircraft control responsibility from one ATC facility to another.

-----

## Supply Chain Terms

**Supplier**  
Entity providing raw materials or components to manufacturers.

**Manufacturer**  
Entity transforming raw materials into finished or semi-finished products.

**Distributor**  
Entity moving products from manufacturers to warehouses or retail locations.

**Warehouse**  
Storage facility holding inventory between manufacturing and retail distribution.

**Retail Endpoint**  
Final distribution point where products reach end consumers.

**Throughput**  
Volume of units processed per time period (measured in units per hour).

-----

## Alert System

**Alert**  
System-generated notification of node status changes or metric threshold violations.

**Severity Levels**:
- **Critical**: Requires immediate action, system health at risk
- **Warning**: Attention needed soon, degraded performance detected
- **Info**: Informational, scheduled events or general advisories

**Alert Actions**:
- **Investigate**: Opens node details panel with diagnostic information
- **Acknowledge**: Marks alert as seen, reduces visual noise
- **Escalate**: Routes alert to on-call team or higher authority
- **Resolve**: Closes alert with resolution notes for audit trail

-----

## Performance Metrics

**Uptime**  
Percentage of time a node is operational and responsive. Measured as ratio of operational time to total time, expressed as percentage (zero to one hundred).

**Latency**  
Time delay for data or requests to traverse between nodes. Measured in milliseconds.

**Frequency**  
Radio communication frequency for ATC facilities. Measured in megahertz (MHz).

**Aircraft Capacity**  
Maximum number of aircraft an ATC facility can safely manage simultaneously.

-----

## System Architecture

**Component Architecture**  
Organizational structure of React components including Dashboard, Topology, COFM, Alerts, and NodeDetails modules.

**State Management**  
In-memory data handling using React useState and useEffect hooks. Future versions will add WebSocket for real-time updates and REST API for persistence.

**View Modes**:
- **Topology View**: Network graph showing nodes and connections
- **List View**: Tabular display of all nodes with key metrics
- **Metrics View**: Time-series charts and performance analytics
- **COFM View**: Project management visualization

-----

## Data Model

**Entity**  
Database table or data structure representing a distinct concept (Node, Alert, Maintenance, etc.).

**Relationship**  
Connection between entities. Can be one-to-many (SystemType to Node) or many-to-many (Node to Node via NodeConnection).

**Primary Key (PK)**  
Unique identifier for each entity instance.

**Foreign Key (FK)**  
Reference to primary key in another entity, establishing relationships.

-----

## Institutional Technologies

**Smart Contracts**  
Automated enforcement mechanisms for reciprocal obligations between network participants.

**Tokenized Incentives**  
Programmatic reward systems aligning individual node behavior with overall system health.

**Soulbound Credentials**  
Non-transferable attestations of maintenance compliance, operational history, and stewardship.

**Polycentric Governance**  
Distributed decision-making structures preventing single points of governance failure.

-----

## Kolmogorov Complexity

**Description Length**  
Minimum information required to fully specify a system or concept.

**Compression**  
Reduction in description length by exploiting shared structure. COFM achieves compression by encoding four methodologies in one visualization: K(COFM) < K(WBS) + K(PERT) + K(Gantt) + K(Scatterplot).

-----

## Future Terms (v2.0 and beyond)

**WebSocket**  
Bi-directional communication protocol enabling real-time data updates without polling.

**Multi-Tenant Architecture**  
System design supporting multiple independent organizations (tenants) on shared infrastructure with data isolation.

**RBAC (Role-Based Access Control)**  
Security model assigning permissions based on user roles rather than individual users.

**OAuth2 / OIDC**  
Authentication and authorization protocols for secure user identity verification.

**Virtual Scrolling**  
Performance optimization rendering only visible items in large lists.

**WebWorker**  
Background JavaScript thread for computationally intensive tasks without blocking user interface.

**IndexedDB**  
Browser-based database for local data caching and offline capability.

-----

**Document Version**: 1.0  
**Last Updated**: December 21, 2025  
**Authors**: rsl37  
**Contact**: roselleroberts@pm.me
