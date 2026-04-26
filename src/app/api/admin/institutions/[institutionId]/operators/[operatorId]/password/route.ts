import { NextRequest } from "next/server";

import { resetInstitutionOperatorPasswordSchema } from "@/modules/institution/institution.dto";
import { InstitutionService } from "@/modules/institution/institution.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { requireCsrfProtection } from "@/modules/shared/security/csrf.service";
import { enforceRateLimit } from "@/modules/shared/security/rate-limit.service";
import { requirePlatformAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface OperatorPasswordRouteContext {
  params: {
    institutionId: string;
    operatorId: string;
  };
}

export async function PATCH(request: NextRequest, context: OperatorPasswordRouteContext): Promise<Response> {
  return handleRoute("admin.institution-operators.password-reset", async () => {
    const session = await requirePlatformAdminSession(request);
    requireCsrfProtection(request);
    await enforceRateLimit(request, { limit: 60, scope: "admin-mutation", windowSeconds: 60 });
    const requestBody = resetInstitutionOperatorPasswordSchema.parse(await request.json());
    const institutionService = new InstitutionService();
    const operator = await institutionService.resetInstitutionOperatorPassword(
      context.params.institutionId,
      context.params.operatorId,
      requestBody,
      session.sub
    );

    return jsonSuccess({ data: operator });
  });
}
