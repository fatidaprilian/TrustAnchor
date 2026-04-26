import { NextRequest } from "next/server";

import { updateInstitutionSchema } from "@/modules/institution/institution.dto";
import { InstitutionService } from "@/modules/institution/institution.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { requireCsrfProtection } from "@/modules/shared/security/csrf.service";
import { enforceRateLimit } from "@/modules/shared/security/rate-limit.service";
import { requirePlatformAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface InstitutionRouteContext {
  params: {
    institutionId: string;
  };
}

export async function PATCH(request: NextRequest, context: InstitutionRouteContext): Promise<Response> {
  return handleRoute("admin.institutions.update", async () => {
    const session = await requirePlatformAdminSession(request);
    requireCsrfProtection(request);
    await enforceRateLimit(request, { limit: 60, scope: "admin-mutation", windowSeconds: 60 });
    const requestBody = updateInstitutionSchema.parse(await request.json());
    const institutionService = new InstitutionService();
    const institution = await institutionService.updateInstitution(context.params.institutionId, requestBody, session.sub);

    return jsonSuccess({ data: institution });
  });
}
