import { NextRequest } from "next/server";

import { AuthenticationService, loginRequestSchema } from "@/modules/authentication/authentication.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import {
  createSessionToken,
  getSessionCookieName,
  getSessionCookieOptions
} from "@/modules/shared/security/session.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  return handleRoute("authentication.login", async () => {
    const requestBody = loginRequestSchema.parse(await request.json());
    const authenticationService = new AuthenticationService();
    const administrator = await authenticationService.authenticateBootstrapAdmin(requestBody);
    const sessionToken = await createSessionToken({
      role: administrator.role,
      sub: administrator.id,
      username: administrator.username
    });
    const response = jsonSuccess({
      message: "Session created",
      user: {
        role: administrator.role,
        username: administrator.username
      }
    });

    response.cookies.set(getSessionCookieName(), sessionToken, getSessionCookieOptions());

    return response;
  });
}
