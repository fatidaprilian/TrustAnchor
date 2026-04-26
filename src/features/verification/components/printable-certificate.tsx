import type { VerificationResult } from "@/modules/verification/verification.service";
import { PrintCertificateActions } from "@/features/verification/components/print-certificate-actions";
import { VerificationQrCode } from "@/features/verification/components/verification-qr-code";

interface PrintableCertificateProps {
  pdfDownloadUrl: string;
  qrDownloadUrl: string;
  verificationResult: VerificationResult;
  verificationUrl: string;
}

function formatCertificateDate(dateValue: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long"
  }).format(new Date(dateValue));
}

export function PrintableCertificate({
  pdfDownloadUrl,
  qrDownloadUrl,
  verificationResult,
  verificationUrl
}: PrintableCertificateProps): JSX.Element {
  return (
    <section className="certificate-print-frame" aria-labelledby="certificate-print-heading">
      <div className="certificate-print-toolbar no-print">
        <div>
          <span className="section-kicker">Print-ready certificate</span>
          <h1 className="admin-page-title" id="certificate-print-heading">
            Certificate Artifact
          </h1>
        </div>
        <PrintCertificateActions pdfDownloadUrl={pdfDownloadUrl} qrDownloadUrl={qrDownloadUrl} />
      </div>

      <article className="certificate-artifact" aria-label="Printable certificate">
        <div className="certificate-artifact-ruler" aria-hidden="true" />
        <header className="certificate-artifact-header">
          <div>
            <span className="section-kicker">TrustAnchor Verified Record</span>
            <h2>{verificationResult.templateName}</h2>
          </div>
          <div className="certificate-artifact-seal">
            <span>{verificationResult.proofVerified ? "Verified" : "Hold"}</span>
          </div>
        </header>

        <div className="certificate-artifact-body">
          <p className="certificate-prelude">This certificate record is issued to</p>
          <strong className="certificate-recipient">{verificationResult.recipientName}</strong>
          <p className="certificate-copy">
            {verificationResult.achievementLabel || "Completion of academic requirements"} for{" "}
            <strong>{verificationResult.programName}</strong>
            {verificationResult.academicYear ? `, academic year ${verificationResult.academicYear}` : ""}. Certificate
            number <strong>{verificationResult.certificateNumber}</strong> was issued by{" "}
            <strong>{verificationResult.institutionName}</strong> on{" "}
            <strong>{formatCertificateDate(verificationResult.issuedAt)}</strong>.
          </p>
          {verificationResult.signatoryName ? (
            <div className="certificate-signatory">
              <span className="ledger-label">Authorized signatory</span>
              <strong>{verificationResult.signatoryName}</strong>
              <span>{verificationResult.signatoryTitle}</span>
            </div>
          ) : null}
        </div>

        <footer className="certificate-artifact-footer">
          <div className="certificate-proof-strip">
            <div>
              <span className="ledger-label">Verification code</span>
              <code>{verificationResult.verificationCode}</code>
            </div>
            <div>
              <span className="ledger-label">Document hash</span>
              <code>{verificationResult.documentHash}</code>
            </div>
          </div>

          <VerificationQrCode
            verificationCode={verificationResult.verificationCode}
            verificationUrl={verificationUrl}
          />
        </footer>
      </article>
    </section>
  );
}
