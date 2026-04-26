import { getEnvironment } from "@/modules/shared/config/env";
import { DocumentStorageService } from "@/modules/document-storage/document-storage.service";
import { handleRoute } from "@/modules/shared/http/api-response";
import { renderCertificatePdf } from "@/modules/verification/certificate-pdf.service";
import { VerificationService } from "@/modules/verification/verification.service";

export const runtime = "nodejs";

interface CertificatePdfRouteContext {
  params: {
    verificationCode: string;
  };
}

export async function GET(_request: Request, context: CertificatePdfRouteContext): Promise<Response> {
  return handleRoute("verification.certificate-pdf", async () => {
    const verificationService = new VerificationService();
    const verificationResult = await verificationService.verifyByCode(context.params.verificationCode);
    const verificationUrl = new URL(
      `/verify/${encodeURIComponent(verificationResult.verificationCode)}`,
      getEnvironment().APP_URL
    ).toString();
    const pdfBytes = await renderCertificatePdf(verificationResult, verificationUrl);
    await new DocumentStorageService().storeCertificatePdf(verificationResult.verificationCode, pdfBytes);

    return new Response(Buffer.from(pdfBytes), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `inline; filename="${verificationResult.verificationCode}-certificate.pdf"`,
        "Content-Type": "application/pdf"
      },
      status: 200
    });
  });
}
