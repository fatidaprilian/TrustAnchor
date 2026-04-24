import { openApiDocument } from "@/modules/shared/openapi/spec";
import { jsonSuccess } from "@/modules/shared/http/api-response";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  return jsonSuccess(openApiDocument);
}
