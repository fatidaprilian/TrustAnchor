import { NextRequest } from "next/server";

import { createInstitutionSchema } from "@/modules/institution/institution.dto";
import { InstitutionService } from "@/modules/institution/institution.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { requireCsrfProtection } from "@/modules/shared/security/csrf.service";
import { enforceRateLimit } from "@/modules/shared/security/rate-limit.service";
import { requirePlatformAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  return handleRoute("admin.institutions.list", async () => {
    await requirePlatformAdminSession(request);
    const institutionService = new InstitutionService();
    const institutions = await institutionService.listInstitutions();

    return jsonSuccess({ data: institutions });
  });
}

export async function POST(request: NextRequest): Promise<Response> {
  return handleRoute("admin.institutions.create", async () => {
    const session = await requirePlatformAdminSession(request);
    requireCsrfProtection(request);
    await enforceRateLimit(request, { limit: 60, scope: "admin-mutation", windowSeconds: 60 });
    const requestBody = createInstitutionSchema.parse(await request.json());
    const institutionService = new InstitutionService();
    const institution = await institutionService.createInstitution(requestBody, session.sub);

    return jsonSuccess({ data: institution }, 201);
  });
}
