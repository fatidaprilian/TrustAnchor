# TrustAnchor

TrustAnchor is a web application for issuing and verifying anti-counterfeit digital certificates.  
It combines RSA-SHA256 digital signatures, SHA-256 hashing, envelope-style double encryption, QR-backed verification, and audit logging to help institutions validate documents with confidence.

## Core Capabilities
- Bootstrap admin authentication
- Certificate template creation
- Certificate issuance with tamper-evident proof material
- Public verification endpoint, verification page, QR SVG download, print-ready certificate page, and server-side PDF output
- Health check and OpenAPI JSON endpoint

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- PostgreSQL
- Redis
- MinIO
- Docker Compose

## Quick Start (Docker Development)
1. Copy environment template:
   ```bash
   cp .env.example .env
   ```
2. Fill required values in `.env`.
   For local development, `BOOTSTRAP_ADMIN_PASSWORD` may be plaintext. In production it must be a SHA-256 hex hash.
3. Start services:
   ```bash
   docker compose up -d
   ```
4. Open `http://localhost:3000`.

The development image installs dependencies during the Docker build with `npm ci`.
The running `web` container starts Next.js directly, so `docker compose up -d` does not run `npm install` on every create.
If port `3000` is already used on the host, set `WEB_PORT=3001` and update `APP_URL=http://localhost:3001` in `.env`, then run `docker compose up -d` again.

After changing `package.json` or `package-lock.json`, rebuild the web image and refresh the dependency volume:
   ```bash
   docker compose down
   docker volume rm trustanchor_trustanchor_node_modules
   docker compose up -d --build
   ```

## Quick Start (Host Node.js)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start infrastructure services:
   ```bash
   docker compose up -d postgres redis minio minio-init
   ```
3. Start the app on the host:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

## NPM Scripts
- `npm run dev` - start development server
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

## Current Scope
This repository currently focuses on the first vertical slice: template creation, certificate issuance, and verification lookup.
Phase 7 is complete with QR verification, browser print output, server-side PDF rendering, MinIO artifact storage, and revocation.
