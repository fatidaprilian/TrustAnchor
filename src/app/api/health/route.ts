import { getDatabasePool } from "@/modules/shared/config/database";
import { handleRoute, jsonSuccess } from "@/modules/shared/http/api-response";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  return handleRoute("health.check", async () => {
    await getDatabasePool().query("select 1");

    return jsonSuccess({
      services: {
        database: "up"
      },
      status: "ok"
    });
  });
}
