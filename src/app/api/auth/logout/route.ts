import { NextRequest } from "next/server";

import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { getCsrfCookieName, requireCsrfProtection } from "@/modules/shared/security/csrf.service";
import { getSessionCookieName } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  return handleRoute("authentication.logout", async () => {
    requireCsrfProtection(request);
    const response = jsonSuccess({ message: "Session ended" });
    response.cookies.set(getSessionCookieName(), "", { maxAge: 0, path: "/" });
    response.cookies.set(getCsrfCookieName(), "", { maxAge: 0, path: "/" });

    return response;
  });
}
