# Flow Overview

## Issuance Flow
1. An administrator signs in with bootstrap credentials.
2. The administrator creates or selects a certificate template.
3. The administrator submits recipient and certificate-number data. The server assigns the issuance timestamp.
4. The issuance service builds a canonical payload for the document.
5. The proof service calculates a SHA-256 message digest from the canonical payload.
6. The proof service signs the digest with the issuer RSA private key to produce the digital signature.
7. The proof service encrypts the canonical payload with a random AES-256-GCM document key, then encrypts that document key with the platform master key.
8. The issuance repository encrypts the recipient identifier, then stores proof material and public claims.
9. The audit log records the issuance event.
10. The system returns a verification code, QR-ready verification URL, QR SVG endpoint, and proof summary.

## Verification Flow
1. A recipient or officer opens the public verification page.
2. The user submits a verification code or scans the QR code printed with the certificate.
3. The verification service loads the issuance record.
4. The proof service verifies the stored digital signature with the issuer RSA public key and reads the signed digest.
5. The proof service compares the signed digest with the stored document hash.
6. The proof service decrypts the canonical payload and recomputes SHA-256.
7. If both hash comparisons match, the certificate is authentic and unmodified.
8. If the signature, hash, or encrypted payload was changed, verification returns `proofVerified: false` and `status: "proof_invalid"` instead of a valid proof.
9. The system returns a safe public verification response.
10. The audit log records the verification attempt when required by policy.

## Print Artifact Flow
1. A user opens `/verify/{verificationCode}/print` from the verification result page.
2. The system verifies the same proof material used by the public verification page.
3. The print view renders public certificate claims, the document hash, the verification code, and a scannable QR code.
4. The user can print the page through the browser or download the QR SVG from `/api/verifications/{verificationCode}/qr`.
5. The user can download `/api/verifications/{verificationCode}/certificate-pdf`.
6. The PDF endpoint renders the certificate server-side and stores the generated artifact in MinIO.

## Revocation Flow
1. An administrator opens the issuance ledger.
2. The administrator revokes an issuance record.
3. The revocation endpoint changes the immutable issuance record status to `revoked`.
4. The audit log records `certificate_issuance.revoked`.
5. Public verification still checks the cryptographic proof, but the result no longer counts as an active issued certificate.

## Admin Configuration Flow
1. An administrator signs in.
2. The administrator creates an academic template with institution, program, academic year, achievement text, and signatory fields.
3. The admin form converts those academic fields into a structured `layoutDefinition` object.
4. The template becomes available for issuance workflows.

## Security Hardening Flow
1. Login, admin mutations, public verification, QR, and PDF endpoints pass through Redis-backed rate limits.
2. Admin mutation requests require a session cookie plus an `x-csrf-token` header that matches the readable CSRF cookie.
3. Middleware attaches CSP, referrer, frame, permissions, and content-type security headers.
4. Production proof generation requires explicit RSA signing keys and a document master key.

## Trust Boundaries
- Browser to HTTP API: untrusted input, always validated.
- HTTP API to service layer: typed DTOs only.
- Service layer to repository: trusted contracts with explicit parameters.
- Repository to database: parameterized queries only.
- Proof material and storage secrets: server-only.

## Assumptions To Validate
- Public verification can expose recipient name and certificate number without violating privacy requirements.
- Audit logging for public verification attempts is acceptable in the first release.
- Course demonstration should include one valid verification and one tampered proof case, such as modifying the stored hash or encrypted payload in a test fixture.

## Next Validation Action
Begin Phase 9 by validating platform admin and institution-scoped dashboard boundaries.
