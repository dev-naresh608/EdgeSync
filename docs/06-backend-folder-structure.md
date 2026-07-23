# EdgeSync

> **Document:** Backend Folder Structure
> **Version:** 1.0
> **Status:** Draft
> **Last Updated:** YYYY-MM-DD

---

# 1. Overview

This document defines the backend folder structure for EdgeSync.

The architecture follows a **feature-first modular approach**, where each business feature owns its own implementation.

Instead of grouping files globally by type (controllers, services, models), related files are grouped together inside their respective feature modules.

This improves maintainability, readability, and scalability as the project grows.

---

# 2. Design Principles

The backend folder structure follows these principles.

- Feature-first organization
- Single Responsibility Principle
- High cohesion
- Low coupling
- Modular development
- Incremental scalability

Every folder must have a clearly defined responsibility.

No folder should become a dumping ground for unrelated code.

---

# 3. Initial Backend Structure

```
backend/
│
├── src/
│
│── app.js
│── server.js
│
├── config/
│
├── modules/
│
├── middlewares/
│
└── shared/
```

---

# 4. Folder Responsibilities

## src/

Contains the application entry point and bootstrapping logic.

Responsibilities:

- Initialize Express
- Register middleware
- Register routes
- Start application

---

## config/

Contains all application configuration.

Examples:

- Database configuration
- Environment configuration
- Cluster configuration

Configuration should never contain business logic.

---

## modules/

Contains all business features.

Each feature is isolated from others.

Examples:

- Authentication
- User
- Resource
- Replication

Every module owns its own implementation.

---

## middlewares/

Contains reusable Express middleware.

Examples:

- Authentication
- Validation
- Error handling
- Server authentication

Middleware should remain generic and reusable.

---

## shared/

Contains reusable components used across multiple modules.

Examples:

- Constants
- Utility functions
- Common errors
- Response helpers

Business logic should never be placed inside shared.

---

# 5. Module Structure

Each feature module follows the same internal organization.

Example:

```
resource/

├── controllers/
├── services/
├── repositories/
├── models/
├── routes/
└── validations/
```

Every module remains self-contained.

---

# 6. Layer Responsibilities

## Route

Defines API endpoints.

Responsibilities:

- Register endpoints
- Apply middleware
- Forward requests

---

## Controller

Handles HTTP requests.

Responsibilities:

- Receive request
- Call service
- Return response

Controllers should remain thin.

---

## Service

Contains business logic.

Responsibilities:

- Execute workflows
- Coordinate repositories
- Call replication

Most application logic belongs here.

---

## Repository

Responsible for data persistence.

Responsibilities:

- CRUD operations
- MongoDB queries
- Database abstraction

Repositories should never contain business rules.

---

## Model

Defines MongoDB schema.

Responsibilities:

- Collection structure
- Validation rules
- Index definitions

---

## Validation

Defines request validation rules.

Responsibilities:

- Validate request body
- Validate parameters
- Reject invalid requests

---

# 7. Communication Rules

The backend follows strict communication rules.

```
Route

↓

Controller

↓

Service

↓

Repository

↓

Database
```

Only the Service layer may coordinate multiple repositories or communicate with external systems.

Controllers must never directly access the database.

Repositories must never call controllers or services.

---

# 8. Future Expansion

As new features are introduced, new modules will be added without modifying existing modules.

Possible future modules include:

- Queue
- Monitoring
- Failure Simulation
- Audit
- Notifications

These modules will follow the same folder organization.

---

# 9. Current Scope

Version 1 includes only the following modules:

- Authentication
- User
- Resource
- Replication

Additional modules will only be introduced when required by future development phases.

---

# Conclusion

The backend folder structure is designed to support incremental growth while maintaining clear ownership and separation of responsibilities.

Every feature remains isolated, every layer has a defined purpose, and the architecture can evolve naturally as EdgeSync expands.