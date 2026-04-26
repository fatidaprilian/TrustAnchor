# TrustAnchor Roadmap

## Overview
This roadmap tracks the phased delivery of TrustAnchor from initial project docs through production-ready deployment. Each phase has concrete deliverables and acceptance criteria. The current progress marker shows what has been completed and what comes next.

---

## Phase 1: Foundation and Documentation
**Status: COMPLETED**

| Deliverable | Status |
|---|---|
| Project brief (`docs/project-brief.md`) | Done |
| Architecture decision record (`docs/architecture-decision-record.md`) | Done |
| Database schema plan (`docs/database-schema.md`) | Done |
| API contract (`docs/api-contract.md`) | Done |
| Flow overview (`docs/flow-overview.md`) | Done |
| Cryptography assignment fit (`docs/cryptography-assignment-fit.md`) | Done |
| Design contract (`docs/DESIGN.md`, `docs/design-intent.json`) | Done |
| Docker Compose infrastructure (PostgreSQL, Redis, MinIO) | Done |
| Next.js project scaffold with TypeScript and strict mode | Done |

---

## Phase 2: Core Backend Modules
**Status: COMPLETED**

| Deliverable | Status |
|---|---|
| Environment configuration with Zod validation | Done |
| Database pool singleton | Done |
| Application error hierarchy with typed error codes | Done |
| Structured logging with pino | Done |
| Session service (JWT with jose, signed cookies) | Done |
| Document proof service (RSA-SHA256 signing, SHA-256 hashing, AES-256-GCM double encryption) | Done |
| Authentication service (bootstrap admin, timing-safe comparison) | Done |
| Institution repository (default institution lookup) | Done |
| Certificate template repository (create, find by ID) | Done |
| Certificate issuance repository (create, find by verification code) | Done |
| Audit log repository (create) | Done |
| Certificate template service (create with audit) | Done |
| Certificate issuance service (create with proof and audit) | Done |
| Verification service (lookup with signature verification) | Done |

---

## Phase 3: API Routes
**Status: COMPLETED**

| Deliverable | Status |
|---|---|
| `POST /api/auth/login` - bootstrap admin authentication | Done |
| `POST /api/auth/logout` - session termination | Done |
| `GET /api/auth/session` - session check | Done |
| `POST /api/certificate-templates` - template creation | Done |
| `POST /api/certificate-issuances` - certificate issuance | Done |
| `GET /api/verifications/{verificationCode}` - public verification | Done |
| `GET /api/health` - liveness check | Done |
| `GET /api/openapi.json` - OpenAPI 3.1 contract | Done |
| `GET /api/admin/summary` - dashboard summary | Done |
| `GET /api/admin/templates` - template list with pagination | Done |
| `GET /api/admin/issuances` - issuance list with pagination | Done |
| `GET /api/admin/audit-logs` - audit log list with pagination | Done |

---

## Phase 4: Public Frontend
**Status: COMPLETED**

| Deliverable | Status |
|---|---|
| Design system in `globals.css` (forensic evidence bench language) | Done |
| Root layout with page background and grid overlay | Done |
| Home page (verification form, specimen, inspection passes, audience panels) | Done |
| Login page (operator credential drawer, dark evidence sheet brief) | Done |
| Verification result page (stamped evidence sheet, proof drawer) | Done |
| Not-found page | Done |
| Responsive recomposition (mobile, tablet, desktop) | Done |
| Reduced motion support | Done |
| TrustAnchor wordmark component | Done |

---

## Phase 5: Admin Dashboard
**Status: COMPLETED**

| Deliverable | Status |
|---|---|
| Next.js middleware for `/admin` route protection | Done |
| Admin layout with sidebar navigation shell | Done |
| Dashboard overview page (stats, recent issuances, recent audit events) | Done |
| Certificate templates list page with pagination | Done |
| Certificate issuances list page with pagination | Done |
| Audit trail page with timeline view and expandable detail | Done |
| Session display and logout in sidebar | Done |
| Dashboard service (aggregated queries) | Done |
| Repository list and count methods for all modules | Done |
| Admin-specific responsive CSS (sidebar collapse on mobile) | Done |
| Login redirect to `/admin` after authentication | Done |
| Roadmap documentation | Done |

---

## Phase 6: Template and Issuance Admin Forms
**Status: COMPLETED**

| Deliverable | Status |
|---|---|
| Create template form in admin dashboard | Done |
| Create issuance form in admin dashboard | Done |
| Form validation with react-hook-form and zod | Done |
| Success and error feedback after creation | Done |
| Template selector dropdown for issuance form | Done |

---

## Phase 7: Enhanced Verification
**Status: COMPLETED**

| Deliverable | Status |
|---|---|
| QR code generation for verification codes | Done |
| QR code download or print-ready view | Done |
| PDF certificate rendering (server-side) | Done |
| Document storage integration with MinIO | Done |
| Certificate revocation workflow | Done |

---

## Phase 8: Security Hardening
**Status: COMPLETED**

| Deliverable | Status |
|---|---|
| Rate limiting with Redis | Done |
| CSRF protection for admin forms | Done |
| Recipient identifier field-level encryption | Done |
| Production signing key management (non-fallback RSA key pair) | Done |
| Content Security Policy headers | Done |
| Input sanitization audit | Done |
| Session rotation and forced expiration | Done |
| Server-controlled issuance timestamp | Done |

---

## Phase 9: Multi-Institution Support  <-- CURRENT
**Status: NOT STARTED**

| Deliverable | Status |
|---|---|
| Institution CRUD endpoints | Planned |
| Institution selection during login | Planned |
| Data isolation enforcement per institution | Planned |
| Institution-scoped template and issuance queries | Planned |

---

## Phase 10: Production Deployment
**Status: NOT STARTED**

| Deliverable | Status |
|---|---|
| Production Docker image optimization | Planned |
| Health check integration for container orchestration | Planned |
| Database migration strategy and versioned schema files | Planned |
| Environment variable documentation for operators | Planned |
| Monitoring and alerting integration | Planned |
| Backup and recovery plan for PostgreSQL | Planned |

---

## Progress Summary

```
Phase 1: Foundation         ████████████████████ 100%
Phase 2: Core Backend       ████████████████████ 100%
Phase 3: API Routes         ████████████████████ 100%
Phase 4: Public Frontend    ████████████████████ 100%
Phase 5: Admin Dashboard    ████████████████████ 100%
Phase 6: Admin Forms        ████████████████████ 100%
Phase 7: Verification+      ████████████████████ 100%
Phase 8: Security           ████████████████████ 100%
Phase 9: Multi-Institution  ░░░░░░░░░░░░░░░░░░░░   0%
Phase 10: Production        ░░░░░░░░░░░░░░░░░░░░   0%
```

Overall progress: **8 of 10 phases completed (80%)**

## Assumptions To Validate
- Phase 9 should avoid overbuilding identity; start with role and institution boundaries that unlock the academic/institution demo.
- QR code rendering uses `qrcode-generator` to produce a real QR matrix as SVG without adding a binary dependency.
- Browser print output is acceptable before server-side PDF rendering because it lets the team validate certificate content and QR placement first.
- Server-side PDF rendering uses `pdf-lib`, then stores the generated artifact in MinIO through the official MinIO JavaScript SDK.
- Multi-institution support can be deferred until the single-institution vertical slice is validated with a real institution.
- The current authenticated role is a single bootstrap `admin`; Phase 9 will split this into platform admin and institution-scoped operator/admin roles.
- The academic cryptography rubric is best met with RSA-SHA256, SHA-256 digest comparison, and a tamper-detection demo.

## Next Validation Action
Begin Phase 9 by introducing institution records, role-scoped dashboards, and institution-level data isolation.
