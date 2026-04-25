import { NextRequest } from "next/server";

import { DashboardService } from "@/modules/dashboard/dashboard.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { requireAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePaginationParams(url: URL): { limit: number; offset: number } {
  const rawLimit = parseInt(url.searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);
  const rawOffset = parseInt(url.searchParams.get("offset") ?? "0", 10);

  return {
    limit: Math.min(Math.max(rawLimit, 1), MAX_LIMIT),
    offset: Math.max(rawOffset, 0)
  };
}

export async function GET(request: NextRequest): Promise<Response> {
  return handleRoute("admin.templates.list", async () => {
    await requireAdminSession(request);
    const { limit, offset } = parsePaginationParams(new URL(request.url));
    const dashboardService = new DashboardService();
    const result = await dashboardService.listTemplates(limit, offset);

    return jsonSuccess({ data: result.data, meta: { limit: result.limit, offset: result.offset, total: result.total } });
  });
}
