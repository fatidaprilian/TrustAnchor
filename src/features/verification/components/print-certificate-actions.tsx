"use client";

interface PrintCertificateActionsProps {
  pdfDownloadUrl: string;
  qrDownloadUrl: string;
}

export function PrintCertificateActions({
  pdfDownloadUrl,
  qrDownloadUrl
}: PrintCertificateActionsProps): JSX.Element {
  return (
    <div className="print-actions" aria-label="Certificate print actions">
      <button className="button button-primary" onClick={() => window.print()} type="button">
        Print certificate
      </button>
      <a className="button button-secondary" href={pdfDownloadUrl}>
        Download PDF
      </a>
      <a className="button button-tertiary" download href={qrDownloadUrl}>
        Download QR
      </a>
    </div>
  );
}
