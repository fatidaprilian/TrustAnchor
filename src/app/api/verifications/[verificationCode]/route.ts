import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { VerificationService } from "@/modules/verification/verification.service";

export const runtime = "nodejs";

interface VerificationRouteContext {
  params: {
    verificationCode: string;
  };
}

export async function GET(_request: Request, context: VerificationRouteContext): Promise<Response> {
  return handleRoute("verification.get", async () => {
    const verificationService = new VerificationService();
    const verificationResult = await verificationService.verifyByCode(context.params.verificationCode);

    return jsonSuccess({
      data: verificationResult
    });
  });
}
