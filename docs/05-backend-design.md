# EdgeSync

> **Document:** Backend Design
> **Version:** 1.0
> **Status:** Draft
> **Last Updated:** YYYY-MM-DD

---

# 1. Overview

The backend is the core of EdgeSync.

Its primary responsibility is to manage resources, communicate with other server nodes, maintain local data, and coordinate replication across the distributed cluster.

The backend is designed to be modular, scalable, and easy to maintain.

Every server node runs the same backend application.

Only configuration values determine the identity of each node.

---

# 2. Backend Responsibilities

The backend is responsible for:

- Authenticating users
- Managing resources
- Managing local database operations
- Communicating with peer nodes
- Replicating resources
- Authenticating server-to-server requests
- Recording replication activities
- Providing monitoring information

---

# 3. Request Lifecycle

Every incoming request follows the same lifecycle.

```

                Client

                   │

                   ▼

               HTTP Request

                   │

                   ▼

                 Route

                   │

                   ▼

             Validation

                   │

                   ▼

          Authentication

                   │

                   ▼

              Controller

                   │

                   ▼

                Service

                   │

         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼

   Repository         Replication

         │                   │
         ▼                   ▼

      Database        Peer Servers

         │
         ▼

     Response Builder

         │
         ▼

      HTTP Response

```

Every request must pass through the layers in this order.

Business logic should never exist inside routes or controllers.

---

# 4. Backend Layers

The backend follows a layered architecture.

## Route Layer

Responsibilities:

- Register API endpoints
- Attach middleware
- Forward requests to controllers

Routes should never contain business logic.

---

## Validation Layer

Responsibilities:

- Validate request data
- Reject invalid requests
- Return validation errors

No business logic should exist here.

---

## Authentication Layer

Responsibilities:

- Verify JWT
- Verify user permissions
- Verify trusted server requests

---

## Controller Layer

Responsibilities:

- Receive validated requests
- Call application services
- Return HTTP responses

Controllers should remain thin.

---

## Service Layer

Responsibilities:

- Execute business logic
- Coordinate multiple operations
- Handle workflows

The majority of backend logic belongs here.

---

## Repository Layer

Responsibilities:

- Interact with MongoDB
- Perform CRUD operations
- Hide database implementation

Business logic should never exist inside repositories.

---

## Replication Layer

Responsibilities:

- Send replication requests
- Receive replicated resources
- Validate replication
- Track replication status

The replication layer is independent of controllers.

---

# 5. Communication Rules

The backend follows these communication rules.

Routes communicate only with Controllers.

Controllers communicate only with Services.

Services communicate with:

- Repositories
- Replication Services

Repositories communicate only with the database.

Replication communicates only with trusted server nodes.

No layer may bypass another layer.

---

# 6. Error Handling

Every layer is responsible for handling only its own errors.

Examples:

Validation Layer

- Invalid input

Authentication Layer

- Unauthorized access

Repository Layer

- Database failures

Replication Layer

- Network failures

Service Layer

- Business rule violations

Errors should propagate upward until they are converted into HTTP responses.

---

# 7. Backend Principles

The backend follows these principles.

## Single Responsibility

Every class or module has one responsibility.

---

## Separation of Concerns

Business logic, database logic, networking, and authentication remain independent.

---

## Configuration Driven

Server identity is determined through configuration rather than code changes.

---

## Stateless APIs

Each request contains all information required for processing.

No request should depend on previous requests.

---

## Modular Development

Features should be added as independent modules.

Existing modules should require minimal modification.

---

# 8. Current Backend Scope

Version 1 includes:

- Authentication
- Resource Management
- Replication
- Server Authentication

Future versions will introduce:

- Retry Queue
- Monitoring
- Failure Simulation
- Versioning
- Conflict Detection

These features are intentionally postponed until the core backend is stable.

---

# Conclusion

The backend architecture of EdgeSync is designed around layered responsibilities, modular components, and clear communication rules.

This structure provides a maintainable foundation for building a production-inspired distributed system while allowing the architecture to evolve incrementally as new capabilities are introduced.