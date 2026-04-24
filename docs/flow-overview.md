# Flow Overview

## Issuance Flow
1. An administrator signs in with bootstrap credentials.
2. The administrator creates or selects a certificate template.
3. The administrator submits recipient and issuance data.
4. The issuance service builds a canonical payload for the document.
5. The signature service hashes the payload, signs the hash, and performs double encryption.
6. The issuance repository stores the proof material and public claims.
7. The audit log records the issuance event.
8. The system returns a verification code and proof summary.

## Verification Flow
1. A recipient or officer opens the public verification page.
2. The user submits a verification code or scans a QR-ready code in a later phase.
3. The verification service loads the issuance record.
4. The signature service verifies the stored digital signature and document hash.
5. The system returns a safe public verification response.
6. The audit log records the verification attempt when required by policy.

## Admin Configuration Flow
1. An administrator signs in.
2. The administrator creates a template with a schema version and layout definition.
3. The template becomes available for issuance workflows.

## Trust Boundaries
- Browser to HTTP API: untrusted input, always validated.
- HTTP API to service layer: typed DTOs only.
- Service layer to repository: trusted contracts with explicit parameters.
- Repository to database: parameterized queries only.
- Proof material and storage secrets: server-only.

## Assumptions To Validate
- Public verification can expose recipient name and certificate number without violating privacy requirements.
- Audit logging for public verification attempts is acceptable in the first release.

## Next Validation Action
Validate the exposed verification fields with the target institution before expanding the public response payload.
