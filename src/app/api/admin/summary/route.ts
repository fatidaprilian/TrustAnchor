import { NextRequest } from "next/server";

import { DashboardService } from "@/modules/dashboard/dashboard.service";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";
import { requireAdminSession } from "@/modules/shared/security/session.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<Response> {
  return handleRoute("dashboard.summary", async () => {
    await requireAdminSession(request);
    const dashboardService = new DashboardService();
    const summary = await dashboardService.getSummary();

    return jsonSuccess({ data: summary });
  });
}
