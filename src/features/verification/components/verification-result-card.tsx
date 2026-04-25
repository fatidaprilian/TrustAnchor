import type { VerificationResult } from "@/modules/verification/verification.service";

interface VerificationResultCardProps {
  verificationResult: VerificationResult;
}

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(dateValue));
}

export function VerificationResultCard({
  verificationResult
}: VerificationResultCardProps): JSX.Element {
  const isValidRecord = verificationResult.status.toLowerCase() === "issued";

  return (
    <section className="result-bench" aria-labelledby="verification-result-heading">
      <div className="result-sheet evidence-sheet evidence-sheet-strong reveal-surface">
        <span className="sheet-clamp">{isValidRecord ? "Public evidence sheet" : "Record inspection sheet"}</span>
        <div className="result-header">
          <div className="section-stack">
            <span className="section-kicker">Verification result</span>
            <h1 className="section-title section-title-large" id="verification-result-heading">
              {isValidRecord ? "Certificate proof matched the stored record." : "The record was found, but is not active."}
            </h1>
            <p className="body-copy">
              This public sheet shows safe claims from the certificate record while private encrypted proof material
              remains server-side.
            </p>
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

        <div className="inspection-grid inspection-grid-compact" aria-label="Verification checks">
          <article className="inspection-pass">
            <div className="pass-index">
              <code>01</code>
              <span>Signature</span>
            </div>
            <h3>Proof signature matched</h3>
            <p>The stored digital signature validates the proof material attached to this record.</p>
          </article>
          <article className="inspection-pass">
            <div className="pass-index">
              <code>02</code>
              <span>Hash</span>
            </div>
            <h3>Document hash matched</h3>
            <p>The public result reflects the canonical hash produced during issuance.</p>
          </article>
          <article className="inspection-pass">
            <div className="pass-index">
              <code>03</code>
              <span>Audit</span>
            </div>
            <h3>Verification was recorded</h3>
            <p>Verification activity can be attached to the audit trail when policy requires it.</p>
          </article>
        </div>
      </aside>
    </section>
  );
}
