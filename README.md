# TrustAnchor

TrustAnchor is a web application for issuing and verifying anti-counterfeit digital certificates.  
It combines RSA-SHA256 digital signatures, SHA-256 hashing, envelope-style double encryption, QR-backed verification, and audit logging to help institutions validate documents with confidence.

## Core Capabilities
- Bootstrap admin authentication
- Platform admin and institution admin role separation
- Certificate template creation
- Certificate issuance with tamper-evident proof material
- Public verification endpoint, verification page, QR SVG download, print-ready certificate page, and server-side PDF output
- Redis-backed rate limiting, CSRF protection for admin mutations, CSP/security headers, and field-level encryption for recipient identifiers
- Health check and OpenAPI JSON endpoint

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- PostgreSQL
- Redis
- MinIO
- Docker Compose

## Production Start (Docker)
1. Copy the production environment template:
   ```bash
   cp .env.production.example .env.production
   ```
2. Fill required values in `.env.production`.
   `BOOTSTRAP_ADMIN_PASSWORD` must be a SHA-256 hex hash, and RSA signing keys must be explicit PEM values.
3. Build and start services:
   ```bash
   docker compose -f docker-compose.production.yml --env-file .env.production up -d --build
   ```
4. Open the HTTPS origin configured in `APP_URL`.

If port `3000` is already used on the host, set `WEB_PORT=3001` and update `APP_URL` to the matching public origin before starting the stack.

After changing `package.json` or `package-lock.json`, rebuild the production image:
   ```bash
   docker compose -f docker-compose.production.yml --env-file .env.production up -d --build web
   ```

## Operator Verification
1. Install dependencies:
   ```bash
   npm install
   ```
2. Validate the codebase:
   ```bash
   npm run validate
   ```
3. Run the black-box plan in [Black-Box Test Plan](docs/blackbox-testing.md).

## NPM Scripts
- `npm run dev` - start local server
- `npm run build` - build production bundle
- `npm run start` - run production server
- `npm run lint` - run lint checks
- `npm run typecheck` - run TypeScript checks
- `npm run test` - run test suite

## Project Docs
- [Project Brief](docs/project-brief.md)
- [Architecture Decision Record](docs/architecture-decision-record.md)
- [Flow Overview](docs/flow-overview.md)
- [Database Schema](docs/database-schema.md)
- [API Contract](docs/api-contract.md)
- [Cryptography Assignment Fit](docs/cryptography-assignment-fit.md)
- [Design Contract](docs/DESIGN.md)
- [Design Intent](docs/design-intent.json)
- [Production Deployment](docs/production-deployment.md)
- [Black-Box Test Plan](docs/blackbox-testing.md)

## Current Scope
This repository currently focuses on the first vertical slice: template creation, certificate issuance, and verification lookup.
Phase 8 is complete with QR verification, browser print output, server-side PDF rendering, MinIO artifact storage, revocation, Redis rate limiting, CSRF protection, security headers, server-owned issuance timestamps, and encrypted recipient identifiers.
Phase 9 is complete with platform-admin institution management, institution-owned operator login, role-based redirects, operator list/reset flows, and institution-scoped dashboard data.
Phase 10 is complete with production Docker configuration, health checks, migration baseline, environment documentation, monitoring guidance, backup guidance, and black-box test coverage.
