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
    <section className="report-frame instrument-panel reveal-surface">
      <div className="report-header">
        <div className="section-stack">
          <span className="section-kicker">Verification signal report</span>
          <h1 className="section-title section-title-large">
            {isValidRecord ? "The certificate signal is valid and active." : "The record was found but is not active."}
          </h1>
          <p className="body-copy">
            The public record matches the stored proof chain for this issuance. Metadata is shown without exposing
            encrypted internals.
          </p>
        </div>

        <div className="report-status-cluster" aria-label="Verification status">
          <div className={`status-orbit ${isValidRecord ? "status-orbit-valid" : "status-orbit-danger"}`} aria-hidden="true">
            <span />
          </div>
          <div className={`signal-chip ${isValidRecord ? "signal-chip-valid" : "signal-chip-danger"}`}>
            {isValidRecord ? "Record matched" : verificationResult.status}
          </div>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-cell">
          <span className="ledger-label">Recipient</span>
          <strong>{verificationResult.recipientName}</strong>
        </div>
        <div className="report-cell">
          <span className="ledger-label">Certificate number</span>
          <strong>{verificationResult.certificateNumber}</strong>
        </div>
        <div className="report-cell">
          <span className="ledger-label">Institution</span>
          <strong>{verificationResult.institutionName}</strong>
        </div>
        <div className="report-cell">
          <span className="ledger-label">Template</span>
          <strong>{verificationResult.templateName}</strong>
        </div>
        <div className="report-cell">
          <span className="ledger-label">Issued at</span>
          <strong>{formatDate(verificationResult.issuedAt)}</strong>
        </div>
        <div className="report-cell">
          <span className="ledger-label">Verified at</span>
          <strong>{formatDate(verificationResult.verifiedAt)}</strong>
        </div>
      </div>

      <div className="verification-band" aria-label="Verification checks">
        <article className="mini-panel">
          <span className="ledger-label">Trust check 01</span>
          <strong>Stored signature validated</strong>
          <p>The verification flow confirmed the signed proof material attached to this issuance record.</p>
        </article>
        <article className="mini-panel">
          <span className="ledger-label">Trust check 02</span>
          <strong>Document hash matched</strong>
          <p>The public result reflects the canonical document hash produced during issuance.</p>
        </article>
        <article className="mini-panel">
          <span className="ledger-label">Trust check 03</span>
          <strong>Verification event recorded</strong>
          <p>Verification attempts can be attached to the audit trail when policy requires it.</p>
        </article>
      </div>

      <div className="proof-frame instrument-panel-subtle">
        <div className="proof-frame-header">
          <div>
            <span className="section-kicker">Proof reference</span>
            <h2 className="section-title section-title-small">Verification code and document hash</h2>
          </div>
          <div className="proof-badges">
            <span className="signal-chip signal-chip-audit">Audit aware</span>
            <span className="signal-chip signal-chip-valid">Public-safe view</span>
          </div>
        </div>

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
      </div>
    </section>
  );
}
