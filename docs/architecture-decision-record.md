# Architecture Decision Record

## Decision
TrustAnchor will start as a TypeScript modular monolith built with Next.js App Router. The codebase will serve the web interface and HTTP API from one deployment unit while preserving strict module boundaries inside the repository.

## Why This Stack
- Next.js gives us a single runtime for the admin web app, public verification page, and API routes.
- TypeScript supports shared schemas, typed DTOs, and explicit service contracts.
- A modular monolith is the default architecture from repository rules and fits the current scope better than microservices.
- PostgreSQL fits the audit-heavy data model and supports strong relational integrity.
- Redis gives a path for rate limiting and background work without forcing early complexity.
- MinIO fits encrypted document storage and mirrors an object storage deployment model.

## Architecture Shape
- Transport: Next.js route handlers and page entry points.
- Application: feature services per domain module.
- Domain: DTO schemas, pure proof helpers, and typed contracts.
- Infrastructure: PostgreSQL repositories and storage adapters.

## Initial Modules
- `authentication`
- `institution`
- `certificate-template`
- `certificate-issuance`
- `verification`
- `signature`
- `document-storage`
- `audit-log`
- `shared`

## Security Decisions
- External input is validated with Zod at every route boundary.
- Session handling uses signed JSON Web Tokens (JWT) through `jose`.
- Certificate payloads use a two-layer envelope encryption model:
  - The canonical payload is encrypted with a random document key by `AES-256-GCM`.
  - The document key is encrypted again with a platform master key.
- Digital signatures use Ed25519 keys when available, with development-only fallback keys outside production.

## Data Decisions
- PostgreSQL is the system of record for templates, issuance records, and audit logs.
- MinIO is reserved for encrypted document binaries and future rendered artifacts.
- Audit-sensitive tables use append-heavy writes and keep timestamps in `TIMESTAMPTZ`.

## Trade-Offs
- A monolith is simpler to ship now, but service extraction remains possible later if domain boundaries stay clean.
- Route handlers inside Next.js are convenient, but business logic must remain outside the transport layer.
- Development fallback signing keys reduce setup friction, but production will require explicit key material.

## Assumptions To Validate
- PDF generation can land after the proof-generation and verification slice without blocking the architecture.
- Verification throughput in the first release is low enough to stay in the monolith.

## Next Validation Action
Implement the first vertical slice with repository-backed template creation, certificate issuance, and verification lookup.
