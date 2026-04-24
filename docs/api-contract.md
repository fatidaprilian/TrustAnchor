# API Contract

## Authentication

### `POST /api/auth/login`
Purpose: create a bootstrap admin session.

Request body:
- `username` string
- `password` string

Responses:
- `200` session established
- `400` validation error
- `401` invalid credentials
- `500` internal error

## Templates

### `POST /api/certificate-templates`
Purpose: create a certificate template for the active institution.

Auth:
- Required bootstrap admin session

Request body:
- `templateName` string
- `certificateType` string
- `schemaVersion` string
- `layoutDefinition` object

Responses:
- `201` template created
- `400` validation error
- `401` missing session
- `403` insufficient role
- `500` internal error

## Issuance

### `POST /api/certificate-issuances`
Purpose: issue a certificate and generate proof material.

Auth:
- Required bootstrap admin session

Request body:
- `templateId` string
- `recipientName` string
- `recipientIdentifier` string
- `certificateNumber` string
- `issuedAt` ISO 8601 string

Responses:
- `201` issuance created
- `400` validation error
- `401` missing session
- `403` insufficient role
- `404` template not found
- `409` duplicate certificate number
- `500` internal error

## Verification

### `GET /api/verifications/{verificationCode}`
Purpose: verify a certificate without exposing encrypted internals.

Path params:
- `verificationCode` string

Responses:
- `200` verification result
- `404` verification code not found
- `500` internal error

## System

### `GET /api/health`
Purpose: basic liveness and database readiness check.

Responses:
- `200` service healthy
- `500` degraded dependency state

### `GET /api/openapi.json`
Purpose: serve the OpenAPI 3.1 contract as JSON.

Responses:
- `200` OpenAPI document

## Assumptions To Validate
- The first release does not require a template list endpoint or an issuance list endpoint.
- Public verification response fields are acceptable for the target privacy posture.

## Next Validation Action
Expand the contract after the first issuance UI and QR download flow are defined.
