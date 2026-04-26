import { NextRequest } from "next/server";

import { CertificateIssuanceService } from "@/modules/certificate-issuance/certificate-issuance.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { requireCsrfProtection } from "@/modules/shared/security/csrf.service";
import { enforceRateLimit } from "@/modules/shared/security/rate-limit.service";
import { requireAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";

interface RevokeIssuanceRouteContext {
  params: {
    issuanceId: string;
  };
}

export async function POST(request: NextRequest, context: RevokeIssuanceRouteContext): Promise<Response> {
  return handleRoute("certificate-issuance.revoke", async () => {
    const session = await requireAdminSession(request);
    requireCsrfProtection(request);
    await enforceRateLimit(request, { limit: 60, scope: "admin-mutation", windowSeconds: 60 });
    const certificateIssuanceService = new CertificateIssuanceService();
    const revokedIssuance = await certificateIssuanceService.revokeIssuance(context.params.issuanceId, session.sub);

    return jsonSuccess({
      data: revokedIssuance
    });
  });
}
