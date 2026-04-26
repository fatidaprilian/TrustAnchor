# Production Deployment Guide

## Scope
This guide describes the production operating shape for TrustAnchor: a Next.js standalone container, PostgreSQL, Redis, MinIO object storage, signed sessions, RSA signing keys, and encrypted document proof material.

## Required Environment
- `NODE_ENV=production`
- `APP_URL` public HTTPS origin, for example `https://trustanchor.example.edu`
- `DATABASE_URL` PostgreSQL connection string
- `REDIS_URL` Redis connection string
- `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET_NAME`
- `SESSION_SECRET` at least 32 random characters
- `DOCUMENT_MASTER_KEY` base64 encoded 32-byte key
- `BOOTSTRAP_ADMIN_USERNAME`
- `BOOTSTRAP_ADMIN_PASSWORD` SHA-256 hex hash, never plaintext
- `SIGNATURE_PRIVATE_KEY_PEM` RSA private key in PKCS#8 PEM format
- `SIGNATURE_PUBLIC_KEY_PEM` RSA public key in SPKI PEM format
- `DEFAULT_INSTITUTION_ID`

Use [.env.production.example](../.env.production.example) as the production environment template.

## Container Build
The production Docker target uses Next.js standalone output and runs as an unprivileged `trustanchor` user.

Build:

```bash
docker compose -f docker-compose.production.yml --env-file .env.production build web
```

Start:

```bash
docker compose -f docker-compose.production.yml --env-file .env.production up -d
```

Check:

```bash
docker compose -f docker-compose.production.yml --env-file .env.production ps
docker compose -f docker-compose.production.yml --env-file .env.production logs --tail 100 web
```

## Database Migrations
The baseline schema is versioned at [001_initial_schema.sql](../docker/postgres/migrations/001_initial_schema.sql).

For the current Docker deployment, PostgreSQL still uses [init.sql](../docker/postgres/init.sql) for first boot seeding. Production operators should treat `docker/postgres/migrations/` as the authoritative migration history when moving beyond an empty database.

Migration policy:
- Add one numbered SQL file per schema change.
- Never edit an already-applied migration.
- Back up PostgreSQL before applying a migration.
- Apply migrations during a maintenance window.
- Verify `/api/health` and a login smoke test after migration.

## Health Checks
- Web: `GET /api/health`
- PostgreSQL: `pg_isready`
- Redis: container process health and rate-limit smoke tests
- MinIO: `/minio/health/live`

The production compose file includes a web health check that calls `/api/health`.

## Monitoring And Alerts
Minimum alerts:
- Web health check failure
- PostgreSQL unavailable
- Redis unavailable or repeated rate-limit fail-open logs
- MinIO unavailable
- Repeated `AUTHENTICATION_ERROR` or `AUTHORIZATION_ERROR` spikes
- Any `CONFIGURATION_ERROR`
- Disk usage above 80% for PostgreSQL and MinIO volumes

Log fields to retain:
- `actionName`
- `code`
- `statusCode`
- `traceId`
- timestamp

## Backup And Recovery
PostgreSQL:

```bash
docker compose -f docker-compose.production.yml --env-file .env.production exec postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > trustanchor-postgres-backup.sql
```

MinIO:

```bash
docker compose -f docker-compose.production.yml --env-file .env.production run --rm minio-init \
  mc mirror trustanchor/"$MINIO_BUCKET_NAME" /backup/trustanchor-documents
```

Recovery order:
1. Restore PostgreSQL.
2. Restore MinIO artifacts.
3. Restore `.env.production` secrets from the secret manager.
4. Start services.
5. Run black-box verification checks.

## Production Acceptance
- `docker compose -f docker-compose.production.yml --env-file .env.production up -d` starts all services.
- `/api/health` returns `200`.
- Login works for `platform_admin`.
- A platform admin can create an institution and operator.
- Institution operator login redirects to `/admin`.
- Institution operator cannot access `/admin/institutions`.
- Certificate issuance, QR verification, PDF generation, revocation, and public verification all work.
