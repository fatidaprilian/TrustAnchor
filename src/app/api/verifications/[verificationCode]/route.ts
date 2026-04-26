import { NextRequest } from "next/server";

import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { enforceRateLimit } from "@/modules/shared/security/rate-limit.service";
import { VerificationService } from "@/modules/verification/verification.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface VerificationRouteContext {
  params: {
    verificationCode: string;
  };
}

export async function GET(request: NextRequest, context: VerificationRouteContext): Promise<Response> {
  return handleRoute("verification.get", async () => {
    await enforceRateLimit(request, { limit: 120, scope: "verification", windowSeconds: 60 });
    const verificationService = new VerificationService();
    const verificationResult = await verificationService.verifyByCode(context.params.verificationCode);

    return jsonSuccess({
      data: verificationResult
    });
  });
}
