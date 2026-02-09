# Systems Network Monitor - Entity Relationship Diagram

**Version 1.0 | December 2025**

-----

## Overview

This document defines the data model and entity relationships for Systems Network Monitor. Current version (v1.0) uses in-memory state management, but this ERD provides the foundation for future database-backed implementations.

For architectural context, see WHITEPAPER.md. For term definitions, see GLOSSARY.md.

-----

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE ENTITIES                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐                    ┌──────────────────┐
│   SystemType     │                    │      Node        │
├──────────────────┤                    ├──────────────────┤
│ PK id            │                    │ PK id            │
│    name          │◄───────has─────────┤ FK systemType_id │
│    description   │         many       │    name          │
│    icon          │                    │    type          │
│    created_at    │                    │    status        │
└──────────────────┘                    │    location      │
                                        │    created_at    │
                                        │    updated_at    │
                                        └──────────────────┘
                                               │
                                               │ has
                                               │ many
                                               ▼
                                        ┌──────────────────┐
                                        │  NodeMetrics     │
                                        ├──────────────────┤
                                        │ PK id            │
                                        │ FK node_id       │
                                        │    uptime        │
                                        │    throughput    │
                                        │    latency       │
                                        │    timestamp     │
                                        └──────────────────┘

┌──────────────────┐         many                  many   ┌──────────────────┐
│      Node        │◄────────────────────────────────────►│      Node        │
│      (from)      │         NodeConnection               │       (to)       │
└──────────────────┘              │                       └──────────────────┘
                                  │
                                  ▼
                           ┌──────────────────┐
                           │ NodeConnection   │
                           ├──────────────────┤
                           │ PK id            │
                           │ FK from_node_id  │
                           │ FK to_node_id    │
                           │    connection_   │
                           │      type        │
                           │    bandwidth     │
                           │    latency       │
                           │    created_at    │
                           └──────────────────┘

┌──────────────────┐
│      Alert       │
├──────────────────┤
│ PK id            │
│ FK node_id       │         ┌──────────────────┐
│    severity      │────has──►│  AlertAction     │
│    message       │   many  ├──────────────────┤
│    type          │         │ PK id            │
│    timestamp     │         │ FK alert_id      │
│    acknowledged  │         │    action_type   │
│    resolved      │         │    performed_by  │
│    resolved_at   │         │    timestamp     │
└──────────────────┘         │    notes         │
                             └──────────────────┘

┌──────────────────┐
│  COFMProject     │
├──────────────────┤
│ PK id            │
│ FK systemType_id │
│    title         │
│    description   │         ┌──────────────────┐
│    created_at    │────has──►│   COFMTask       │
│    updated_at    │   many  ├──────────────────┤
└──────────────────┘         │ PK id            │
                             │ FK project_id    │
                             │    name          │
                             │    type          │
                             │    color         │
                             │    timeline      │
                             │    resources     │
                             │    hierarchy     │
                             │    is_critical   │
                             │    has_slack     │
                             │    created_at    │
                             └──────────────────┘
                                     │
                                     │ has
                                     │ many
                                     ▼
                              ┌──────────────────┐
                              │ TaskDependency   │
                              ├──────────────────┤
                              │ PK id            │
                              │ FK task_id       │
                              │ FK depends_on_id │
                              │    dependency_   │
                              │      type        │
                              └──────────────────┘

┌──────────────────┐
│  Maintenance     │
├──────────────────┤
│ PK id            │
│ FK node_id       │
│    type          │
│    scheduled_at  │
│    duration      │
│    status        │
│    assigned_to   │
│    notes         │
│    completed_at  │
└──────────────────┘

┌──────────────────┐
│   ActivityLog    │
├──────────────────┤
│ PK id            │
│ FK node_id       │
│    action        │
│    description   │
│    performed_by  │
│    timestamp     │
│    status        │
└──────────────────┘
```

-----

## Entity Specifications

### SystemType

Represents the type of network system being monitored.

|Column     |Type        |Constraints                 |Description         |
|-----------|------------|----------------------------|--------------------|
|id         |VARCHAR(50) |PRIMARY KEY                 |Unique identifier   |
|name       |VARCHAR(100)|NOT NULL, UNIQUE            |Display name        |
|description|TEXT        |                            |System description  |
|icon       |VARCHAR(50) |                            |Icon identifier     |
|created_at |TIMESTAMP   |NOT NULL, DEFAULT CURRENT_TS|Record creation time|

**Values**: `supply-chain`, `atc`

-----

### Node

Represents individual entities in the network (suppliers, towers, etc.).

|Column       |Type        |Constraints                 |Description                     |
|-------------|------------|----------------------------|--------------------------------|
|id           |VARCHAR(50) |PRIMARY KEY                 |Unique identifier (e.g., SC001) |
|systemType_id|VARCHAR(50) |FOREIGN KEY → SystemType.id |Parent system type              |
|name         |VARCHAR(200)|NOT NULL                    |Human-readable name             |
|type         |VARCHAR(50) |NOT NULL                    |Node type (supplier, tower, etc)|
|status       |ENUM        |NOT NULL                    |healthy, warning, critical      |
|location     |VARCHAR(200)|                            |Geographic location             |
|created_at   |TIMESTAMP   |NOT NULL, DEFAULT CURRENT_TS|Record creation time            |
|updated_at   |TIMESTAMP   |NOT NULL, DEFAULT CURRENT_TS|Last update time                |

**Indexes**: `idx_node_status`, `idx_node_type`, `idx_node_system`

-----

### NodeMetrics

Time-series performance metrics for nodes.

|Column       |Type        |Constraints                 |Description                  |
|-------------|------------|----------------------------|-----------------------------|
|id           |BIGINT      |PRIMARY KEY, AUTO_INCREMENT |Unique identifier            |
|node_id      |VARCHAR(50) |FOREIGN KEY → Node.id       |Parent node                  |
|uptime       |DECIMAL(5,2)|NOT NULL, CHECK (0-100)     |Uptime percentage            |
|throughput   |INTEGER     |                            |Units per hour (supply chain)|
|latency      |INTEGER     |                            |Milliseconds (supply chain)  |
|aircraft     |INTEGER     |                            |Total capacity (ATC)         |
|activeFlights|INTEGER     |                            |Current flights (ATC)        |
|frequency    |VARCHAR(20) |                            |Radio frequency (ATC)        |
|timestamp    |TIMESTAMP   |NOT NULL, DEFAULT CURRENT_TS|Metric capture time          |

**Indexes**: `idx_metrics_node_timestamp`, `idx_metrics_timestamp`

-----

### NodeConnection

Represents connections between nodes (dependencies, routes, handoffs).

|Column         |Type       |Constraints                 |Description            |
|---------------|-----------|----------------------------|-----------------------|
|id             |BIGINT     |PRIMARY KEY, AUTO_INCREMENT |Unique identifier      |
|from_node_id   |VARCHAR(50)|FOREIGN KEY → Node.id       |Source node            |
|to_node_id     |VARCHAR(50)|FOREIGN KEY → Node.id       |Destination node       |
|connection_type|VARCHAR(50)|                            |Type of connection     |
|bandwidth      |INTEGER    |                            |Connection capacity    |
|latency        |INTEGER    |                            |Connection latency (ms)|
|created_at     |TIMESTAMP  |NOT NULL, DEFAULT CURRENT_TS|Connection established |

**Constraints**: `UNIQUE(from_node_id, to_node_id)`  
**Indexes**: `idx_connection_from`, `idx_connection_to`

-----

### Alert

System-generated alerts for operators.

|Column      |Type        |Constraints                 |Description                 |
|------------|------------|----------------------------|----------------------------|
|id          |VARCHAR(100)|PRIMARY KEY                 |Unique identifier           |
|node_id     |VARCHAR(50) |FOREIGN KEY → Node.id, NULL |Related node (if applicable)|
|severity    |ENUM        |NOT NULL                    |critical, warning, info     |
|message     |TEXT        |NOT NULL                    |Alert message               |
|type        |VARCHAR(50) |NOT NULL                    |Alert category              |
|timestamp   |TIMESTAMP   |NOT NULL, DEFAULT CURRENT_TS|Alert generation time       |
|acknowledged|BOOLEAN     |DEFAULT FALSE               |Operator acknowledged       |
|resolved    |BOOLEAN     |DEFAULT FALSE               |Alert resolved              |
|resolved_at |TIMESTAMP   |NULL                        |Resolution time             |

**Indexes**: `idx_alert_severity`, `idx_alert_timestamp`, `idx_alert_node`

-----

### AlertAction

Actions taken in response to alerts.

|Column      |Type        |Constraints                 |Description                   |
|------------|------------|----------------------------|------------------------------|
|id          |BIGINT      |PRIMARY KEY, AUTO_INCREMENT |Unique identifier             |
|alert_id    |VARCHAR(100)|FOREIGN KEY → Alert.id      |Parent alert                  |
|action_type |VARCHAR(50) |NOT NULL                    |investigate, acknowledge, etc.|
|performed_by|VARCHAR(100)|                            |User identifier               |
|timestamp   |TIMESTAMP   |NOT NULL, DEFAULT CURRENT_TS|Action timestamp              |
|notes       |TEXT        |                            |Action notes                  |

**Indexes**: `idx_action_alert`, `idx_action_timestamp`

-----

### COFMProject

Project definitions for COFM visualization.

|Column       |Type        |Constraints                 |Description           |
|-------------|------------|----------------------------|----------------------|
|id           |VARCHAR(100)|PRIMARY KEY                 |Unique identifier     |
|systemType_id|VARCHAR(50) |FOREIGN KEY → SystemType.id |Associated system type|
|title        |VARCHAR(200)|NOT NULL                    |Project title         |
|description  |TEXT        |                            |Project description   |
|created_at   |TIMESTAMP   |NOT NULL, DEFAULT CURRENT_TS|Record creation time  |
|updated_at   |TIMESTAMP   |NOT NULL, DEFAULT CURRENT_TS|Last update time      |

-----

### COFMTask

Individual tasks within COFM projects.

|Column     |Type        |Constraints                 |Description                   |
|-----------|------------|----------------------------|------------------------------|
|id         |INTEGER     |PRIMARY KEY                 |Task number (1-10, etc.)      |
|project_id |VARCHAR(100)|FOREIGN KEY → COFMProject.id|Parent project                |
|name       |VARCHAR(200)|NOT NULL                    |Task name                     |
|type       |VARCHAR(50) |NOT NULL                    |start, middle, end, bottleneck|
|color      |VARCHAR(20) |NOT NULL                    |Visual color code             |
|timeline   |DECIMAL(5,2)|NOT NULL                    |X-axis position               |
|resources  |DECIMAL(5,2)|NOT NULL                    |Y-axis position               |
|hierarchy  |DECIMAL(5,2)|NOT NULL                    |Z-axis (size) value           |
|is_critical|BOOLEAN     |DEFAULT FALSE               |On critical path              |
|has_slack  |BOOLEAN     |DEFAULT FALSE               |Has scheduling flexibility    |
|created_at |TIMESTAMP   |NOT NULL, DEFAULT CURRENT_TS|Record creation time          |

**Composite PK**: `(project_id, id)`

-----

### TaskDependency

Dependencies between COFM tasks.

|Column         |Type       |Constraints                |Description       |
|---------------|-----------|---------------------------|------------------|
|id             |BIGINT     |PRIMARY KEY, AUTO_INCREMENT|Unique identifier |
|task_id        |INTEGER    |FOREIGN KEY → COFMTask.id  |Dependent task    |
|depends_on_id  |INTEGER    |FOREIGN KEY → COFMTask.id  |Prerequisite task |
|dependency_type|VARCHAR(50)|                           |Type of dependency|

**Constraints**: `task_id != depends_on_id`  
**Indexes**: `idx_dependency_task`, `idx_dependency_depends`

-----

### Maintenance

Scheduled and completed maintenance records.

|Column      |Type        |Constraints                |Description                     |
|------------|------------|---------------------------|--------------------------------|
|id          |BIGINT      |PRIMARY KEY, AUTO_INCREMENT|Unique identifier               |
|node_id     |VARCHAR(50) |FOREIGN KEY → Node.id      |Target node                     |
|type        |VARCHAR(50) |NOT NULL                   |Maintenance type                |
|scheduled_at|TIMESTAMP   |NOT NULL                   |Scheduled start time            |
|duration    |INTEGER     |NOT NULL                   |Duration in minutes             |
|status      |ENUM        |NOT NULL                   |scheduled, in_progress, complete|
|assigned_to |VARCHAR(100)|                           |Assigned technician             |
|notes       |TEXT        |                           |Maintenance notes               |
|completed_at|TIMESTAMP   |NULL                       |Actual completion time          |

**Indexes**: `idx_maintenance_node`, `idx_maintenance_scheduled`, `idx_maintenance_status`

-----

### ActivityLog

Audit log of all system activities.

|Column      |Type        |Constraints                 |Description                 |
|------------|------------|----------------------------|----------------------------|
|id          |BIGINT      |PRIMARY KEY, AUTO_INCREMENT |Unique identifier           |
|node_id     |VARCHAR(50) |FOREIGN KEY → Node.id, NULL |Related node (if applicable)|
|action      |VARCHAR(100)|NOT NULL                    |Action type                 |
|description |TEXT        |NOT NULL                    |Action description          |
|performed_by|VARCHAR(100)|                            |User identifier             |
|timestamp   |TIMESTAMP   |NOT NULL, DEFAULT CURRENT_TS|Action timestamp            |
|status      |VARCHAR(50) |                            |Action result               |

**Indexes**: `idx_log_timestamp`, `idx_log_node`, `idx_log_user`

-----

## Relationships Summary

### One-to-Many Relationships

1. **SystemType → Node**: One system type has many nodes
1. **Node → NodeMetrics**: One node has many metric snapshots
1. **Node → Alert**: One node can generate many alerts
1. **Alert → AlertAction**: One alert can have many actions
1. **COFMProject → COFMTask**: One project has many tasks
1. **Node → Maintenance**: One node can have many maintenance records

### Many-to-Many Relationships

1. **Node ↔ Node (via NodeConnection)**: Nodes connect to other nodes
1. **COFMTask ↔ COFMTask (via TaskDependency)**: Tasks depend on other tasks

-----

## Data Integrity Rules

### Constraints

1. **Status Enum**: `('healthy', 'warning', 'critical')`
1. **Severity Enum**: `('critical', 'warning', 'info')`
1. **Maintenance Status Enum**: `('scheduled', 'in_progress', 'complete', 'cancelled')`
1. **Uptime Range**: `0.00 ≤ uptime ≤ 100.00`
1. **Timeline Range**: `timeline ≥ 0`
1. **Resources Range**: `resources > 0`
1. **Hierarchy Range**: `hierarchy ≥ 0`

### Cascading Deletes

- Deleting a **Node** cascades to: NodeMetrics, Alert, NodeConnection, Maintenance, ActivityLog
- Deleting a **COFMProject** cascades to: COFMTask, TaskDependency
- Deleting an **Alert** cascades to: AlertAction

### Triggers

1. **Node Status Change**: Generate alert on status transition to ‘warning’ or ‘critical’
1. **Metric Threshold**: Generate alert when metrics exceed thresholds
1. **Activity Logging**: Auto-log all CRUD operations
1. **Timestamp Update**: Auto-update `updated_at` on record modification

-----

## Future Enhancements (v2.0)

### Planned Entities

1. **User**: User accounts and authentication
1. **Team**: User teams and access control
1. **Permission**: Role-based access control
1. **Notification**: Push/email notification preferences
1. **Report**: Saved report configurations
1. **Dashboard**: Custom dashboard layouts
1. **Integration**: External system integrations
1. **AIRecommendation**: ML-generated recommendations

### Planned Relationships

- User → Alert (ownership)
- Team → Node (monitoring responsibility)
- User → ActivityLog (audit trail)
- Dashboard → Widget (custom views)

-----

**Document Version**: 1.0  
**Last Updated**: December 21, 2025  
**Authors**: rsl37  
**Contact**: roselleroberts@pm.me
