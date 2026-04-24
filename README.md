# TrustAnchor

TrustAnchor is a web application for issuing and verifying anti-counterfeit digital certificates.  
It combines digital signatures, envelope-style double encryption, and audit logging to help institutions validate documents with confidence.

## Core Capabilities
- Bootstrap admin authentication
- Certificate template creation
- Certificate issuance with tamper-evident proof material
- Public verification endpoint and verification page
- Health check and OpenAPI JSON endpoint

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- PostgreSQL
- Redis
- MinIO
- Docker Compose

## Quick Start (Local)
1. Copy environment template:
   ```bash
   cp .env.example .env
   ```
2. Fill required values in `.env`.
3. Start services:
   ```bash
   docker compose up -d
   ```
4. Run app:
   ```bash
   npm install
   npm run dev
   ```
5. Open `http://localhost:3000`.

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
- [Design Contract](docs/DESIGN.md)
- [Design Intent](docs/design-intent.json)

## Current Scope
This repository currently focuses on the first vertical slice: template creation, certificate issuance, and verification lookup.
