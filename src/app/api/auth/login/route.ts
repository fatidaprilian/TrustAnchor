import { NextRequest } from "next/server";

import { AuthenticationService, loginRequestSchema } from "@/modules/authentication/authentication.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { setCsrfCookie } from "@/modules/shared/security/csrf.service";
import { enforceRateLimit } from "@/modules/shared/security/rate-limit.service";
import {
  createSessionToken,
  getSessionCookieName,
  getSessionCookieOptions
} from "@/modules/shared/security/session.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  return handleRoute("authentication.login", async () => {
    await enforceRateLimit(request, { limit: 10, scope: "auth-login", windowSeconds: 60 });
    const requestBody = loginRequestSchema.parse(await request.json());
    const authenticationService = new AuthenticationService();
    const administrator = await authenticationService.authenticateAdministrator(requestBody);
    const sessionToken = await createSessionToken({
      institutionId: administrator.institutionId,
      institutionName: administrator.institutionName,
      role: administrator.role,
      sub: administrator.id,
      username: administrator.username
    });
    const response = jsonSuccess({
      message: "Session created",
      user: {
        institutionId: administrator.institutionId,
        institutionName: administrator.institutionName,
        role: administrator.role,
        username: administrator.username
      }
    });

    response.cookies.set(getSessionCookieName(), sessionToken, getSessionCookieOptions());
    setCsrfCookie(response);

    return response;
  });
}
