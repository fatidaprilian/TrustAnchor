import { NextRequest } from "next/server";

import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { requireAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<Response> {
  return handleRoute("authentication.session", async () => {
    const session = await requireAdminSession(request);

    return jsonSuccess({
      data: {
        role: session.role,
        username: session.username
      }
    });
  });
}
