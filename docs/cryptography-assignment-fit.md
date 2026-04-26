# Cryptography Assignment Fit

## Verdict
TrustAnchor fits the final cryptography assignment because it has a written system design, a working program, and a demonstrable signer-verifier flow for digital certificates.

## Required Output
| Requirement | Project Evidence | Status |
|---|---|---|
| Makalah | `docs/project-brief.md`, `docs/architecture-decision-record.md`, `docs/flow-overview.md`, and `docs/api-contract.md` explain the theory and implementation scope. | Ready to adapt into paper |
| Program | Next.js application supports template creation, certificate issuance, public verification, audit logging, and QR-backed verification pages. | Implemented |
| Presentasi | The app can demonstrate issuance, verification success, and tamper rejection through the proof service tests. | Demo-ready with local setup |

## Signer Flow
1. The issuance service builds a canonical certificate payload.
2. The proof service calculates a SHA-256 message digest.
3. The proof service signs the digest with an RSA private key using RSA-PSS SHA-256 (`PS256`).
4. The proof service encrypts the canonical payload with AES-256-GCM and wraps the document key with the platform master key.
5. The system stores the original public claims, document hash, digital signature, encrypted proof material, and an encrypted recipient identifier.

## Verifier Flow
1. The verifier opens `/verify/{verificationCode}` or scans the QR code.
2. The verification service loads the issuance record.
3. The proof service verifies the stored signature with the RSA public key.
4. The proof service compares the signed digest with the stored SHA-256 document hash.
5. The proof service decrypts the payload and recalculates SHA-256.
6. If the hashes match, the certificate is authentic and unchanged. If the hash, signature, or encrypted payload changes, verification fails.

## Security Properties
| Property | How TrustAnchor Covers It |
|---|---|
| Authentication | Admin session is required for issuance, and the RSA signature identifies proof created by the issuer key. |
| Data integrity | SHA-256 digest comparison detects changed certificate content or proof material. |
| Non-repudiation | The issuer private key signs the digest, while the public key verifies it without exposing the private key. |

## Demo Script
1. Create or select a certificate template in the admin dashboard.
2. Issue one certificate and record its verification code.
3. Open `/verify/{verificationCode}` and show the verified result plus QR code.
4. Open `/verify/{verificationCode}/print` and show the printable certificate artifact with the same hash and QR verification link.
5. Download `/api/verifications/{verificationCode}/certificate-pdf` and show the generated PDF artifact.
6. Revoke one issuance from the admin ledger and show that verification no longer counts it as active.
7. Run the document proof test that changes the stored hash and encrypted payload.
8. Show that the tampered proof is rejected instead of being marked verified.

## Remaining Academic Polish
- Convert these docs into a formal paper with theory, implementation screenshots, test evidence, and conclusion.
- Prepare presentation slides around the signer flow, verifier flow, PDF/QR artifact, revocation, and tamper-detection demo.
