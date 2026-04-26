import { NextRequest } from "next/server";

import { createInstitutionOperatorSchema } from "@/modules/institution/institution.dto";
import { InstitutionService } from "@/modules/institution/institution.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { requireCsrfProtection } from "@/modules/shared/security/csrf.service";
import { enforceRateLimit } from "@/modules/shared/security/rate-limit.service";
import { requirePlatformAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface InstitutionOperatorsRouteContext {
  params: {
    institutionId: string;
  };
}

export async function GET(request: NextRequest, context: InstitutionOperatorsRouteContext): Promise<Response> {
  return handleRoute("admin.institution-operators.list", async () => {
    await requirePlatformAdminSession(request);
    const institutionService = new InstitutionService();
    const operators = await institutionService.listInstitutionOperators(context.params.institutionId);

    return jsonSuccess({ data: operators });
  });
}

export async function POST(request: NextRequest, context: InstitutionOperatorsRouteContext): Promise<Response> {
  return handleRoute("admin.institution-operators.create", async () => {
    const session = await requirePlatformAdminSession(request);
    requireCsrfProtection(request);
    await enforceRateLimit(request, { limit: 60, scope: "admin-mutation", windowSeconds: 60 });
    const requestBody = createInstitutionOperatorSchema.parse(await request.json());
    const institutionService = new InstitutionService();
    const operator = await institutionService.createInstitutionOperator(
      context.params.institutionId,
      requestBody,
      session.sub
    );

    return jsonSuccess({ data: operator }, 201);
  });
}
