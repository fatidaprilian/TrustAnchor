# TrustAnchor Project Brief

## Overview
TrustAnchor is a web application for education institutions and government agencies to issue anti-counterfeit digital certificates and documents. The platform combines digital signatures, double encryption, audit logging, and instant verification to reduce document fraud and speed up validation for authorized users.

## Goals
- Issue verifiable digital certificates from a controlled institution workspace.
- Protect issued records with digital signatures and envelope-style double encryption.
- Provide instant verification through a public verification code and QR-ready lookup flow.
- Keep an audit trail for issuance, verification, and administrative actions.
- Run locally through Docker Compose in a developer-friendly way.

## Primary Users
- Institution administrators who configure templates and issue certificates.
- Authorized officers who verify documents during review or service delivery.
- Public recipients who need to prove certificate validity.

## Core Capabilities
- Bootstrap administrator authentication.
- Certificate template management.
- Certificate issuance with tamper-evident proof generation.
- Verification endpoint and verification screen.
- Audit trail for sensitive actions.
- OpenAPI 3.1 contract for all HTTP endpoints.

## Constraints
- Repository rules require project docs before application code.
- The initial delivery must run in Docker on WSL with `docker compose up -d`.
- Secrets must stay out of committed source files.
- The backend must follow transport, service, repository, and domain separation.
- Input validation must happen at all external boundaries.

## Assumptions To Validate
- The first release targets a single institution per deployment, with room for multi-institution expansion.
- The first vertical slice stores certificate payload metadata and proof material before full PDF rendering is added.
- Bootstrap admin credentials are acceptable for local development until a full identity module is added.
- MinIO is acceptable as the initial encrypted object storage target.

## Next Validation Action
Build the first vertical slice that creates templates, issues certificates, and verifies them through a public verification code.
