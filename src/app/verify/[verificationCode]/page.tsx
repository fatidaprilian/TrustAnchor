import Link from "next/link";
import { notFound } from "next/navigation";

import { TrustAnchorWordmark } from "@/components/trustanchor-wordmark";
import { VerificationResultCard } from "@/features/verification/components/verification-result-card";
import { getEnvironment } from "@/modules/shared/config/env";
import { NotFoundError } from "@/modules/shared/errors/application-error";
import { VerificationService } from "@/modules/verification/verification.service";

interface VerificationPageProps {
  params: {
    verificationCode: string;
  };
}

export default async function VerificationPage({
  params
}: VerificationPageProps): Promise<JSX.Element> {
  const verificationService = new VerificationService();

  try {
    const verificationResult = await verificationService.verifyByCode(params.verificationCode);
    const verificationUrl = new URL(
      `/verify/${encodeURIComponent(verificationResult.verificationCode)}`,
      getEnvironment().APP_URL
    ).toString();

    return (
      <main className="page-shell page-shell-verify">
        <section className="masthead masthead-compact">
          <TrustAnchorWordmark detail="Public serial register" />
          <div className="masthead-actions">
            <span className="status-pill status-pill-verified">Record matched</span>
            <Link className="text-link" href="/">
              Verify another code
            </Link>
          </div>
        </section>

        <VerificationResultCard verificationResult={verificationResult} verificationUrl={verificationUrl} />
      </main>
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }

    throw error;
  }
}
