import { NextRequest } from "next/server";

import { createCertificateIssuanceSchema } from "@/modules/certificate-issuance/certificate-issuance.dto";
import { CertificateIssuanceService } from "@/modules/certificate-issuance/certificate-issuance.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { requireAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  return handleRoute("certificate-issuance.create", async () => {
    const session = await requireAdminSession(request);
    const requestBody = createCertificateIssuanceSchema.parse(await request.json());
    const certificateIssuanceService = new CertificateIssuanceService();
    const createdIssuance = await certificateIssuanceService.createIssuance(requestBody, session.sub);

    return jsonSuccess(
      {
        data: createdIssuance
      },
      201
    );
  });
}
