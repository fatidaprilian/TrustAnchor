# TrustAnchor Project Brief

## Overview
TrustAnchor is a web application for education institutions and government agencies to issue anti-counterfeit digital certificates and documents. The platform combines digital signatures, double encryption, audit logging, and instant verification to reduce document fraud and speed up validation for authorized users.

## Goals
- Issue verifiable digital certificates from a controlled institution workspace.
- Protect issued records with digital signatures and envelope-style double encryption.
- Provide instant verification through a public verification code and QR-ready lookup flow.
- Keep an audit trail for issuance, verification, and administrative actions.
- Run through Docker Compose with production deployment guidance.

## Primary Users
- Institution administrators who configure templates and issue certificates.
- Authorized officers who verify documents during review or service delivery.
- Public recipients who need to prove certificate validity.

## Core Capabilities
- Bootstrap administrator authentication.
- Academic certificate template management without requiring operators to write raw JSON.
- Certificate issuance with SHA-256 message digest generation, RSA digital signing, and tamper-evident proof storage.
- Verification endpoint and verification screen that recompute the document hash and verify the RSA signature.
- Redis rate limiting, CSRF protection, security headers, server-controlled issuance timestamps, and field-level encryption for recipient identifiers.
- Platform administrator institution management and institution-owned operator login.
- Role-based internal dashboards: platform admins manage institutions and operators, while institution admins manage templates, issuances, revocation, and audit views for their institution.
- Audit trail for sensitive actions.
- OpenAPI 3.1 contract for all HTTP endpoints.

## Academic Cryptography Fit
- Makalah scope: explain Autokey Cipher payload transformation, SHA-256 hashing, RSA digital signature generation, AES-256-GCM envelope encryption, audit logging, and verification outcomes.
- Program scope: demonstrate issuing a certificate, verifying the original record, and rejecting proof when the stored hash, signature, or encrypted payload is changed.
- Presentation scope: show signer and verifier flow, including the private key used for signing and the public key used for verification.
- Security properties covered: authentication of the issuing institution, data integrity through hash comparison, and non-repudiation through RSA signatures.

## Constraints
- Repository rules require project docs before application code.
- The initial delivery must run in Docker on WSL with `docker compose up -d`.
- Secrets must stay out of committed source files.
- The backend must follow transport, service, repository, and domain separation.
- Input validation must happen at all external boundaries.

## Assumptions To Validate
- The first release targets a single institution per deployment, with room for multi-institution expansion.
- The current multi-institution slice separates platform administrator access from institution administrator/operator access.
- The first vertical slice stores certificate payload metadata, RSA proof material, QR-ready verification links, browser print artifacts, server-side PDF output, and MinIO-stored certificate artifacts.
- Bootstrap admin credentials are platform-only; institution admins use database-backed operator accounts.
- MinIO is acceptable as the initial self-hosted, open-source object storage target.
- `issuedAt` is audit metadata owned by the server and is not editable from the admin form.

## Next Validation Action
Run the black-box test plan and capture screenshots for the final presentation.
