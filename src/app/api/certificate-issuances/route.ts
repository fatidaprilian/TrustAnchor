import { NextRequest } from "next/server";

import { createCertificateIssuanceSchema } from "@/modules/certificate-issuance/certificate-issuance.dto";
import { CertificateIssuanceService } from "@/modules/certificate-issuance/certificate-issuance.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { requireCsrfProtection } from "@/modules/shared/security/csrf.service";
import { enforceRateLimit } from "@/modules/shared/security/rate-limit.service";
import { requireAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  return handleRoute("certificate-issuance.create", async () => {
    const session = await requireAdminSession(request);
    requireCsrfProtection(request);
    await enforceRateLimit(request, { limit: 60, scope: "admin-mutation", windowSeconds: 60 });
    const requestBody = createCertificateIssuanceSchema.parse(await request.json());
    const certificateIssuanceService = new CertificateIssuanceService();
    const createdIssuance = await certificateIssuanceService.createIssuance(
      requestBody,
      session.sub,
      session.institutionId,
      session.institutionName
    );

    return jsonSuccess(
      {
        data: createdIssuance
      },
      201
    );
  });
}
