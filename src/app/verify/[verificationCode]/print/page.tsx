import Link from "next/link";
import { notFound } from "next/navigation";

import { TrustAnchorWordmark } from "@/components/trustanchor-wordmark";
import { PrintableCertificate } from "@/features/verification/components/printable-certificate";
import { getEnvironment } from "@/modules/shared/config/env";
import { NotFoundError } from "@/modules/shared/errors/application-error";
import { VerificationService } from "@/modules/verification/verification.service";

interface PrintCertificatePageProps {
  params: {
    verificationCode: string;
  };
}

export default async function PrintCertificatePage({
  params
}: PrintCertificatePageProps): Promise<JSX.Element> {
  const verificationService = new VerificationService();

  try {
    const verificationResult = await verificationService.verifyByCode(params.verificationCode);
    const verificationUrl = new URL(
      `/verify/${encodeURIComponent(verificationResult.verificationCode)}`,
      getEnvironment().APP_URL
    ).toString();
    const qrDownloadUrl = `/api/verifications/${encodeURIComponent(verificationResult.verificationCode)}/qr`;
    const pdfDownloadUrl = `/api/verifications/${encodeURIComponent(verificationResult.verificationCode)}/certificate-pdf`;

    return (
      <main className="page-shell page-shell-verify page-shell-print">
        <section className="masthead masthead-compact no-print">
          <TrustAnchorWordmark detail="Print-ready evidence artifact" />
          <div className="masthead-actions">
            <Link className="text-link" href={`/verify/${encodeURIComponent(verificationResult.verificationCode)}`}>
              Back to verification
            </Link>
          </div>
        </section>

        <PrintableCertificate
          pdfDownloadUrl={pdfDownloadUrl}
          qrDownloadUrl={qrDownloadUrl}
          verificationResult={verificationResult}
          verificationUrl={verificationUrl}
        />
      </main>
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }

    throw error;
  }
}
