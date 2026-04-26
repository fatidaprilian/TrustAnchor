# Database Schema Plan

## Database
PostgreSQL 16 is the source of truth for operational data.

## Tables

### `institutions`
- `id` `TEXT` primary key
- `code` `TEXT` unique not null
- `name` `TEXT` not null
- `created_at` `TIMESTAMPTZ` not null

Usage:
- Platform administrators can create and update institution workspaces.
- Institution operators sign in with accounts tied to one institution; admin dashboard queries are scoped to that session institution.

### `institution_users`
- `id` `TEXT` primary key
- `institution_id` `TEXT` not null references `institutions(id)`
- `username` `TEXT` unique not null
- `password_hash` `TEXT` not null
- `role` `TEXT` not null default `institution_admin`
- `created_at` `TIMESTAMPTZ` not null

Indexes:
- `institution_users_institution_created_at_idx` on `(institution_id, created_at desc)`

### `certificate_templates`
- `id` `TEXT` primary key
- `institution_id` `TEXT` not null references `institutions(id)`
- `template_name` `TEXT` not null
- `certificate_type` `TEXT` not null
- `schema_version` `TEXT` not null
- `layout_definition` `JSONB` not null
- `is_active` `BOOLEAN` not null default `TRUE`
- `created_at` `TIMESTAMPTZ` not null

Indexes:
- `certificate_templates_institution_created_at_idx` on `(institution_id, created_at desc)`

### `certificate_issuances`
- `id` `TEXT` primary key
- `institution_id` `TEXT` not null references `institutions(id)`
- `template_id` `TEXT` not null references `certificate_templates(id)`
- `verification_code` `TEXT` unique not null
- `certificate_number` `TEXT` unique not null
- `recipient_name` `TEXT` not null
- `recipient_identifier` `TEXT` not null; stores a versioned AES-256-GCM encrypted value (`enc:v1:...`) for new records
- `issued_at` `TIMESTAMPTZ` not null
- `document_hash` `TEXT` not null
- `digital_signature` `TEXT` not null
- `encrypted_payload` `TEXT` not null
- `payload_iv` `TEXT` not null
- `payload_tag` `TEXT` not null
- `wrapped_document_key` `TEXT` not null
- `wrapped_key_iv` `TEXT` not null
- `wrapped_key_tag` `TEXT` not null
- `public_claims` `JSONB` not null
- `status` `TEXT` not null
- `created_at` `TIMESTAMPTZ` not null

Indexes:
- `certificate_issuances_verification_lookup_idx` on `(verification_code)`
- `certificate_issuances_institution_created_at_idx` on `(institution_id, created_at desc)`

### `audit_logs`
- `id` `TEXT` primary key
- `actor_id` `TEXT`
- `action` `TEXT` not null
- `resource_type` `TEXT` not null
- `resource_id` `TEXT` not null
- `detail` `JSONB` not null
- `created_at` `TIMESTAMPTZ` not null

Indexes:
- `audit_logs_resource_lookup_idx` on `(resource_type, resource_id, created_at desc)`

## Data Integrity Notes
- Foreign keys are enforced at the database level.
- Verification codes and certificate numbers are globally unique in the first release.
- Multi-institution dashboard reads filter templates, issuances, and audit logs by the session institution.
- Soft delete is deferred for the first slice because issuance records are append-only and must stay immutable.
- `document_hash` stores the SHA-256 digest of the canonical certificate payload.
- `digital_signature` stores the compact RSA-SHA256 signature over that digest.
- `encrypted_payload` and key-wrapping fields store AES-256-GCM envelope encryption output and must remain server-only.
- `recipient_identifier` uses field-level AES-256-GCM encryption before persistence. Legacy plaintext values can still be read for compatibility, but new records are encrypted.
- `status` supports revocation through the value `revoked`; revoked records stay immutable and verifiable but are no longer active.
- Generated PDF artifacts are stored in MinIO under `certificate-artifacts/{verificationCode}.pdf`; the database remains the proof source of truth for this phase.

## Assumptions To Validate
- Template layout definition as `JSONB` is flexible enough before a richer template editor exists.

## Next Validation Action
Run the production migration baseline against a fresh PostgreSQL volume before final presentation.
