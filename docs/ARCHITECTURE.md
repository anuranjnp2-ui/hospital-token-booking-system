# Project Architecture

## Monorepo Layout
Given the scale of a production-ready application, this project utilizes a Monorepo design, separating distinct systemic concerns into top-level directories (`frontend`, `backend`, `database`, `config`, `scripts`). This structure acts as a solid baseline for microservices splitting down the line.

## Senior Engineer Best Practices Adopted

### 1. Domain-Driven Design (DDD) & API-First Backend
The `backend/` has been conceptually mapped to support:
- `api/`: Route definitions and GraphQL/REST endpoint exposures.
- `models/`: Centralized ORM data schemas, promoting a single source of truth away from isolated modules.
- `views/`: Viewsets and controllers responsible for mapping HTTP requests to internal logic.
- `serializers/`: DTOs (Data Transfer Objects) and Pydantic schemas validating external inputs.
- `services/`: Business Logic! In standard Django, logic often leaks into `views.py` or `models.py`. Placing raw business logic into `services/` ensures high testability via isolated unit testing.

*Note on Django framework compatibility:* Django natively expects features partitioned into `apps/`. It is highly recommended to bridge standard Django `apps/` to these centralized structures via importing, or gradually transition `apps/` fully to this structural hierarchy if building purely in API mode (like FastAPI).

### 2. Explicit Database Migrations
Isolated `database/` folders ensure that schemas, seed files (`seed_data/`), and database orchestration (like Supabase Edge Functions or native Postgres procedures) are independent of the backend language, allowing DBAs to manage them separately.

### 3. Separation of Configurations
`config/` centralizes DevOps environments (`docker/`, `.env` templates). This prevents accidental commitments of secrets and standardizes containerization behaviors.

### 4. Reusable Frontend Component Systems
The `frontend/` acts entirely autonomously, relying strictly on standardized APIs. With Vite, Next.js or React, organizing by `components/`, `hooks/`, and `services/` (for API calls) maintains an isolated presentation layer.
