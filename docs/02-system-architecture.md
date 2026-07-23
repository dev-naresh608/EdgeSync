# EdgeSync

> **Document:** System Architecture  
> **Version:** 1.0  
> **Status:** Draft  
> **Last Updated:** YYYY-MM-DD

---

# 1. Overview

EdgeSync is a distributed resource replication platform built around the concept of independent server nodes.

Each node operates independently while collaborating with other nodes through secure HTTP communication to synchronize resources across the cluster.

Every node is capable of handling client requests, storing data locally, and participating in resource replication.

---

# 2. High-Level Architecture

The system consists of three primary layers.

```
                        Client
                           │
                    HTTP / REST API
                           │
                   ┌────────────────┐
                   │  EdgeSync Node │
                   └────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   Authentication     Resource Module    Replication
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                     Local Database
                           │
                 Secure Server Communication
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     India Node      Singapore Node     Germany Node
```

---

# 3. System Components

The system is divided into the following major components.

## Client

The client is responsible for:

- User authentication
- Uploading resources
- Viewing resources
- Monitoring replication status
- Viewing cluster information

The client communicates only with one server node.

It never communicates with multiple nodes directly.

---

## EdgeSync Node

A node represents an independent server instance.

Every node contains:

- REST API
- Authentication
- Resource Management
- Replication Engine
- Local Database
- Server Authentication
- Monitoring

Every node runs independently.

---

## Local Database

Each node maintains its own database.

No database is shared between servers.

Each server is completely responsible for its own data.

---

## Replication Engine

The replication engine is responsible for synchronizing resources between nodes.

Responsibilities include:

- Sending replication requests
- Receiving replicated resources
- Validating incoming requests
- Tracking replication status
- Handling replication failures

---

# 4. Cluster Architecture

Initially, the cluster consists of three nodes.

```
                 +----------------+
                 |     India      |
                 +----------------+
                   /            \
                  /              \
                 /                \
+----------------+                +----------------+
|  Singapore     |                |    Germany     |
+----------------+                +----------------+
```

Every node is aware of every other node.

Nodes communicate directly using secure HTTP APIs.

---

# 5. Node Responsibilities

Every node has identical responsibilities.

Each node can:

- Accept client requests
- Store resources locally
- Replicate resources
- Receive replicated resources
- Authenticate peer nodes
- Report health information

No node has higher priority than another.

Initially, all nodes are treated equally.

---

# 6. Communication Model

Communication between nodes follows a peer-to-peer model.

Example:

```
India
   │
   ├────────► Singapore
   │
   └────────► Germany
```

Nodes communicate only through REST APIs.

No node directly accesses another node's database.

This isolation improves reliability and maintainability.

---

# 7. Resource Lifecycle

The lifecycle of a resource is:

```
Client

↓

Upload Resource

↓

Server Validates Request

↓

Store Resource Locally

↓

Start Replication

↓

Replicate To Other Nodes

↓

Receive Confirmation

↓

Replication Complete
```

---

# 8. Server-to-Server Communication

Internal communication occurs only between trusted nodes.

Every replication request includes:

- Server Identity
- Authentication Token / Secret
- Request Identifier

Receiving servers validate the request before processing it.

Unauthorized requests are rejected.

---

# 9. Failure Handling Philosophy

Failures are expected in distributed systems.

The system should never assume that every node is always available.

Temporary failures should be recoverable.

The architecture is designed so that individual node failures do not prevent the entire system from operating.

---

# 10. Design Principles

The architecture follows the following principles.

## Independent Nodes

Every node can operate independently.

---

## Database Isolation

Each server owns its own database.

No cross-database access is allowed.

---

## API-Based Communication

Nodes communicate only through HTTP APIs.

---

## Modular Design

Business logic is separated into independent modules.

---

## Incremental Growth

New features should be added without affecting existing architecture.

---

# 11. Current System Scope

The initial implementation includes:

- Three server nodes
- Independent databases
- Resource replication
- Authentication
- Server authentication
- Monitoring foundation

Advanced distributed system concepts will be introduced in later phases.

---

# 12. Architecture Goals

The architecture is designed to achieve:

- Simplicity
- Scalability
- Maintainability
- Reliability
- Clear separation of responsibilities

The focus is to build a strong foundation that can evolve into a more advanced distributed system over time.

---

# Conclusion

EdgeSync is built as a cluster of independent server nodes that communicate through secure APIs to replicate resources while maintaining isolated databases.

The architecture prioritizes simplicity, modularity, and production-inspired engineering practices, allowing the system to evolve incrementally without major structural changes.