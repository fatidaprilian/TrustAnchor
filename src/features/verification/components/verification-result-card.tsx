import type { VerificationResult } from "@/modules/verification/verification.service";
import { VerificationQrCode } from "@/features/verification/components/verification-qr-code";

interface VerificationResultCardProps {
  verificationResult: VerificationResult;
  verificationUrl: string;
}

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(dateValue));
}

export function VerificationResultCard({
  verificationResult,
  verificationUrl
}: VerificationResultCardProps): JSX.Element {
  const isValidRecord = verificationResult.status.toLowerCase() === "issued" && verificationResult.proofVerified;
  const encodedVerificationCode = encodeURIComponent(verificationResult.verificationCode);
  const resultTitle = verificationResult.proofVerified
    ? isValidRecord
      ? "Certificate proof matched the stored record."
      : "The record was found, but is not active."
    : "Proof mismatch detected.";
  const resultSummary = verificationResult.proofVerified
    ? "This public sheet shows safe claims from the certificate record while private encrypted proof material remains server-side."
    : "The record exists, but its stored signature, hash, or encrypted payload did not validate.";

  return (
    <section className="result-bench" aria-labelledby="verification-result-heading">
      <div className="result-sheet evidence-sheet evidence-sheet-strong reveal-surface">
        <span className="sheet-clamp">{isValidRecord ? "Public evidence sheet" : "Record inspection sheet"}</span>
        <div className="result-header">
          <div className="section-stack">
            <span className="section-kicker">Verification result</span>
            <h1 className="section-title section-title-large" id="verification-result-heading">
              {resultTitle}
            </h1>
            <p className="body-copy">{resultSummary}</p>
          </div>

          <div className={`stamp ${isValidRecord ? "stamp-verified" : "stamp-danger"}`} aria-label="Verification status">
            {isValidRecord ? "Verified" : verificationResult.status}
          </div>
        </div>

        <div className="result-grid">
          <div className="evidence-field">
            <span className="ledger-label">Recipient</span>
            <strong>{verificationResult.recipientName}</strong>
          </div>
          <div className="evidence-field">
            <span className="ledger-label">Certificate number</span>
            <strong>{verificationResult.certificateNumber}</strong>
          </div>
          <div className="evidence-field">
            <span className="ledger-label">Institution</span>
            <strong>{verificationResult.institutionName}</strong>
          </div>
          <div className="evidence-field">
            <span className="ledger-label">Template</span>
            <strong>{verificationResult.templateName}</strong>
          </div>
          <div className="evidence-field">
            <span className="ledger-label">Issued at</span>
            <strong>{formatDate(verificationResult.issuedAt)}</strong>
          </div>
          <div className="evidence-field">
            <span className="ledger-label">Verified at</span>
            <strong>{formatDate(verificationResult.verifiedAt)}</strong>
          </div>
        </div>
      </div>

      <aside className="proof-drawer evidence-sheet reveal-surface" aria-label="Proof reference">
        <span className="sheet-clamp">Proof reference</span>
        <div className="proof-grid">
          <div className="proof-block">
            <span className="ledger-label">Verification code</span>
            <code>{verificationResult.verificationCode}</code>
          </div>
          <div className="proof-block">
            <span className="ledger-label">Document hash</span>
            <code>{verificationResult.documentHash}</code>
          </div>
        </div>

        <VerificationQrCode
          verificationCode={verificationResult.verificationCode}
          verificationUrl={verificationUrl}
        />

        <div className="proof-actions" aria-label="Certificate artifact actions">
          <a className="button button-secondary" href={`/verify/${encodedVerificationCode}/print`}>
            Print certificate
          </a>
          <a className="button button-tertiary" download href={`/api/verifications/${encodedVerificationCode}/qr`}>
            Download QR
          </a>
          <a className="button button-tertiary" href={`/api/verifications/${encodedVerificationCode}/certificate-pdf`}>
            Download PDF
          </a>
        </div>

        <div className="inspection-grid inspection-grid-compact" aria-label="Verification checks">
          <article className="inspection-pass">
            <div className="pass-index">
              <code>01</code>
              <span>Signature</span>
            </div>
            <h3>Proof signature matched</h3>
            <p>
              {verificationResult.proofVerified
                ? "The stored digital signature validates the proof material attached to this record."
                : "The stored digital signature or signed hash no longer matches this record."}
            </p>
          </article>
          <article className="inspection-pass">
            <div className="pass-index">
              <code>02</code>
              <span>Hash</span>
            </div>
            <h3>Document hash matched</h3>
            <p>
              {verificationResult.proofVerified
                ? "The public result reflects the canonical hash produced during issuance."
                : "The canonical payload hash could not be confirmed against the stored proof."}
            </p>
          </article>
          <article className="inspection-pass">
            <div className="pass-index">
              <code>03</code>
              <span>Cipher</span>
            </div>
            <h3>Autokey layer reversed</h3>
            <p>
              The encrypted proof payload is decoded through the Autokey Cipher layer before the hash is recalculated.
            </p>
          </article>
        </div>
      </aside>
    </section>
  );
}
