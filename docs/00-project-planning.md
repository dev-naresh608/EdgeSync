# EdgeSync - Project Planning

> Version: 1.0
> Status: Planning
> Owner: Naresh
> Project Type: Distributed Systems | Backend | Full Stack
> Tech Stack: Node.js, Express.js, MongoDB, React

---

# 1. Project Overview

## What is EdgeSync?

EdgeSync is a distributed content replication platform that simulates how geographically distributed systems synchronize resources across multiple server nodes.

The project focuses on designing and implementing a reliable distributed replication system instead of building a traditional CRUD application.

Every server acts as an independent node capable of storing resources, communicating with peer nodes, and maintaining eventual consistency across the cluster.

Although inspired by CDN architecture, this project is **NOT** a CDN clone.

Instead, it is an educational distributed systems project that demonstrates:

- Distributed architecture
- Multi-node communication
- Data replication
- Retry mechanisms
- Failure handling
- Monitoring
- Eventual consistency

---

# 2. Project Goals

The primary goal is to understand how distributed systems work internally.

The project should demonstrate:

- Clean Architecture
- Scalable Code Structure
- Reliable Replication
- Server Authentication
- Failure Recovery
- Production-oriented Design

---

# 3. High Level Architecture

Initially the cluster contains three nodes.

India
Singapore
Germany

Each node runs independently.

Every node has:

- Express Server
- MongoDB Database
- Storage
- REST APIs

Nodes communicate only through HTTP APIs.

No server accesses another server's database directly.

---

# 4. Project Scope

Current Scope

✔ User Authentication

✔ Resource Management

✔ Resource Replication

✔ Multi Node Communication

✔ Retry Mechanism

✔ Monitoring Dashboard

✔ Failure Simulation

Out Of Scope (Current Version)

❌ Kubernetes

❌ RabbitMQ

❌ Kafka

❌ Redis Cluster

❌ gRPC

These technologies may be explored in future versions after the core distributed system is complete.

---

# 5. Development Strategy

The project will be developed incrementally.

Architecture will evolve naturally.

Only required modules will be introduced.

No unnecessary abstraction.

No premature optimization.

---

# 6. Development Phases

---

# Phase 1

## Foundation

Goal

Build the project foundation.

Tasks

- Create repository
- Configure backend
- Configure frontend
- Environment configuration
- Database connection
- Basic project structure
- API setup

Deliverable

Running backend and frontend.

Status

⬜ Pending

---

# Phase 2

## Authentication

Goal

Secure dashboard access.

Tasks

- Admin Login
- JWT Authentication
- User Roles
- Protected Routes
- Logout

Deliverable

Authenticated users can access dashboard.

Status

⬜ Pending

---

# Phase 3

## Resource Management

Goal

Allow CRUD operations on resources.

Tasks

- Upload Resource
- Update Resource
- Delete Resource
- List Resources
- Resource Metadata

Deliverable

Resources stored successfully.

Status

⬜ Pending

---

# Phase 4

## Cluster Configuration

Goal

Configure multiple independent servers.

Tasks

- India Node
- Singapore Node
- Germany Node
- Node Configuration
- Cluster Configuration

Deliverable

Three independent servers running locally.

Status

⬜ Pending

---

# Phase 5

## Resource Replication

Goal

Synchronize resources across nodes.

Tasks

- Replication API
- Send Resource
- Receive Resource
- Metadata Sync
- Replication Logs

Deliverable

Resources replicated successfully.

Status

⬜ Pending

---

# Phase 6

## Server Authentication

Goal

Prevent unauthorized replication requests.

Tasks

- Server Identity
- API Secret
- Authorization Middleware
- Trusted Nodes

Deliverable

Only trusted servers communicate.

Status

⬜ Pending

---

# Phase 7

## Retry Mechanism

Goal

Recover from temporary failures.

Tasks

- Retry Queue
- Retry Worker
- Retry Policy
- Retry History

Deliverable

Failed replications retry automatically.

Status

⬜ Pending

---

# Phase 8

## Monitoring

Goal

Observe system health.

Tasks

- Replication History
- Logs
- Request Metrics
- Success Rate
- Failure Rate

Deliverable

Monitoring Dashboard.

Status

⬜ Pending

---

# Phase 9

## Failure Simulation

Goal

Test system reliability.

Tasks

- Offline Node
- Random Failure
- Artificial Delay
- Packet Loss

Deliverable

Replication survives failures.

Status

⬜ Pending

---

# Phase 10

## Dashboard Improvements

Goal

Improve user experience.

Tasks

- Server Status
- Live Activity
- Replication Timeline
- Queue Status

Deliverable

Production-like dashboard.

Status

⬜ Pending

---

# Phase 11

## Deployment

Goal

Deploy the project.

Tasks

- Backend Deployment
- Frontend Deployment
- Environment Variables
- Production Configuration

Deliverable

Public project.

Status

⬜ Pending

---

# Phase 12

## Future Improvements

Potential features

- Conflict Detection
- Resource Versioning
- Leader Election
- WebSockets
- Docker
- Kubernetes
- Distributed Cache
- Event Streaming
- Object Storage
- gRPC Communication

---

# 7. Engineering Principles

The following rules will be followed throughout the project.

- Single Responsibility Principle
- Feature First Architecture
- Modular Development
- No Premature Optimization
- Independent Services
- Clean Code
- Meaningful Naming
- Configuration Driven Design

---

# 8. Current Folder Strategy

The folder structure will evolve during development.

Only folders required for the current phase will be created.

The project will avoid unnecessary complexity.

---

# 9. Success Criteria

The project is considered successful when:

- Three servers run independently.
- Resources replicate successfully.
- Failed replications retry automatically.
- Monitoring shows system activity.
- Server authentication is implemented.
- The architecture is modular and scalable.
- The project is deployment ready.

---

# 10. Learning Objectives

This project aims to strengthen knowledge in:

- Distributed Systems
- System Design
- Node.js
- Express.js
- MongoDB
- REST APIs
- Backend Architecture
- Replication Algorithms
- Failure Recovery
- Monitoring
- Production Engineering

---

# 11. Notes

This document is a living document.

New phases, decisions, and improvements will be added as the project evolves.

The objective is to understand engineering concepts while building a production-quality distributed system from scratch.