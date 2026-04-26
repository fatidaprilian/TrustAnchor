import { NextRequest } from "next/server";

import {
  createCertificateTemplateSchema
} from "@/modules/certificate-template/certificate-template.dto";
import { CertificateTemplateService } from "@/modules/certificate-template/certificate-template.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { requireCsrfProtection } from "@/modules/shared/security/csrf.service";
import { enforceRateLimit } from "@/modules/shared/security/rate-limit.service";
import { requireAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  return handleRoute("certificate-template.create", async () => {
    const session = await requireAdminSession(request);
    requireCsrfProtection(request);
    await enforceRateLimit(request, { limit: 60, scope: "admin-mutation", windowSeconds: 60 });
    const requestBody = createCertificateTemplateSchema.parse(await request.json());
    const certificateTemplateService = new CertificateTemplateService();
    const createdTemplate = await certificateTemplateService.createTemplate(requestBody, session.sub);

    return jsonSuccess(
      {
        data: createdTemplate
      },
      201
    );
  });
}
