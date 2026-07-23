# EdgeSync

> **Document:** Functional Requirements
> **Version:** 1.0
> **Status:** Draft
> **Last Updated:** YYYY-MM-DD

---

# 1. Overview

This document defines the functional and non-functional requirements of EdgeSync.

A requirement describes what the system must do without describing how it will be implemented.

The implementation details will be covered in later design documents.

---

# 2. Actors

The system currently consists of two primary actors.

## 2.1 Administrator

The administrator is responsible for managing resources and monitoring the distributed system.

## 2.2 Server Node

A server node is an independent backend instance responsible for storing resources and synchronizing them with other trusted nodes.

---

# 3. Functional Requirements

## FR-01 User Authentication

The system shall allow administrators to authenticate using secure credentials.

Requirements:

- Administrator login
- JWT generation
- Protected APIs
- Logout

---

## FR-02 Resource Management

The system shall allow administrators to manage resources.

Requirements:

- Create resource
- View resource
- Update resource
- Delete resource
- View resource details

---

## FR-03 Resource Storage

The system shall store uploaded resources in the local node.

Requirements:

- Store metadata
- Store uploaded file
- Generate unique resource identifier

---

## FR-04 Multi-Node Operation

The system shall support multiple independent server nodes.

Requirements:

- Every node runs independently
- Every node has its own database
- Every node has its own storage

---

## FR-05 Resource Replication

The system shall replicate newly created resources to all trusted nodes.

Requirements:

- Replicate metadata
- Replicate files
- Track replication status

---

## FR-06 Server Authentication

The system shall authenticate all internal server communication.

Requirements:

- Verify server identity
- Reject unauthorized requests
- Allow only trusted nodes

---

## FR-07 Replication Logging

The system shall record replication activity.

Requirements:

- Replication start
- Replication success
- Replication failure
- Timestamp
- Source node
- Target node

---

## FR-08 Retry Mechanism

The system shall retry failed replication requests.

Requirements:

- Store failed replication
- Retry automatically
- Record retry attempts

---

## FR-09 Monitoring

The system shall provide visibility into system activity.

Requirements:

- View cluster status
- View replication logs
- View server status
- View retry history

---

## FR-10 Failure Simulation

The system shall support simulated failures during development.

Requirements:

- Offline mode
- Artificial delay
- Random failures

---

# 4. Non-Functional Requirements

## Reliability

The system should continue operating even if one node becomes temporarily unavailable.

---

## Scalability

The architecture should support adding additional nodes with minimal code changes.

---

## Maintainability

The project should follow a modular architecture where each module has a single responsibility.

---

## Security

Internal APIs must only accept requests from trusted server nodes.

Protected APIs must require authentication.

---

## Performance

Replication should begin immediately after a successful resource upload.

---

## Simplicity

The project should prioritize clear architecture over unnecessary complexity.

---

# 5. Assumptions

The following assumptions apply to Version 1.

- The cluster consists of three nodes.
- Nodes communicate through REST APIs.
- Every node owns its own database.
- Files are replicated completely.
- No conflict resolution is required in Version 1.

---

# 6. Current Limitations

The following capabilities are intentionally excluded from the first version.

- Leader Election
- Conflict Resolution
- Distributed Locking
- WebSockets
- Docker
- Kubernetes
- gRPC
- Event Streaming

These may be introduced in future versions.

---

# 7. Requirement Traceability

| Requirement | Planned Phase |
|-------------|---------------|
| Authentication | Phase 2 |
| Resource Management | Phase 3 |
| Multi-Node Cluster | Phase 4 |
| Resource Replication | Phase 5 |
| Server Authentication | Phase 6 |
| Retry Mechanism | Phase 7 |
| Monitoring | Phase 8 |
| Failure Simulation | Phase 9 |

---

# Conclusion

The requirements defined in this document establish the expected behavior of EdgeSync.

All future architectural decisions and implementation details should satisfy these requirements while maintaining simplicity, modularity, and scalability.