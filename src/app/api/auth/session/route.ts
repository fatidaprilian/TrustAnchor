import { NextRequest } from "next/server";

import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { getCsrfCookieName, setCsrfCookie } from "@/modules/shared/security/csrf.service";
import { requireAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<Response> {
  return handleRoute("authentication.session", async () => {
    const session = await requireAdminSession(request);

    const response = jsonSuccess({
      data: {
        role: session.role,
        username: session.username
      }
    });

    if (!request.cookies.get(getCsrfCookieName())?.value) {
      setCsrfCookie(response);
    }

    return response;
  });
}
