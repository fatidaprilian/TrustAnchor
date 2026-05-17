# TrustAnchor Documentation Index

Use this file as the compact routing map for project documentation. Read only the document needed for the current task.

| Document | Purpose | Read When | Status |
| --- | --- | --- | --- |
| [Project Brief](project-brief.md) | Product scope, users, goals, and assumptions. | Planning features, validating scope, or checking product intent. | Active |
| [Architecture Decision Record](architecture-decision-record.md) | Runtime, module, deployment, and boundary decisions. | Changing architecture, runtime, modules, deployment, or trust boundaries. | Active |
| [Flow Overview](flow-overview.md) | Issuance, verification, print, revocation, admin, and security flows. | Changing a workflow or tracing behavior end to end. | Active |
| [API Contract](api-contract.md) | HTTP endpoints, public responses, roles, and error behavior. | Changing API routes, web flow contracts, QR/PDF behavior, or auth behavior. | Active |
| [Database Schema](database-schema.md) | Persistent tables, indexes, invariants, and storage notes. | Changing persistence, migrations, query shape, or stored proof material. | Active |
| [Design Contract](DESIGN.md) | Human-readable UI direction, design rules, and review expectations. | UI, UX, layout, frontend, motion, responsive, or visual redesign work. | Active |
| [Design Intent](design-intent.json) | Machine-readable UI contract, research dossier, token logic, and guardrails. | UI implementation, visual review, design validation, or governance checks. | Active |
| [Cryptography Assignment Fit](cryptography-assignment-fit.md) | Academic cryptography mapping for Autokey, RSA, SHA-256, AES-GCM, and audit proof. | Preparing presentation, assignment review, or crypto-scope explanation. | Active |
| [Production Deployment](production-deployment.md) | Production Compose setup, environment rules, monitoring, and backup guidance. | Deploying or changing production runtime. | Active |
| [Black-Box Test Plan](blackbox-testing.md) | End-to-end manual and smoke validation plan. | Release validation, demo preparation, or screenshot capture. | Active |
| [Roadmap](ROADMAP.md) | Planned phases and remaining work. | Planning beyond the current vertical slice. | Active |

## Routing Rules
- Start with [Project Brief](project-brief.md) for product intent.
- Use [Architecture Decision Record](architecture-decision-record.md) and [Flow Overview](flow-overview.md) for broad system changes.
- Use [API Contract](api-contract.md) for any public route, endpoint, role, or response change.
- Use [Database Schema](database-schema.md) for persistence changes.
- Use [Design Contract](DESIGN.md) and [Design Intent](design-intent.json) for UI work.
- Use [Black-Box Test Plan](blackbox-testing.md) before release or presentation screenshots.

## Last Updated
2026-05-17
