import { NextRequest } from "next/server";

import { getEnvironment } from "@/modules/shared/config/env";
import { handleRoute } from "@/modules/shared/http/api-response";
import { enforceRateLimit } from "@/modules/shared/security/rate-limit.service";
import { buildQrSvg } from "@/modules/verification/verification-qr";

export const runtime = "nodejs";

interface VerificationQrRouteContext {
  params: {
    verificationCode: string;
  };
}

export async function GET(request: NextRequest, context: VerificationQrRouteContext): Promise<Response> {
  return handleRoute("verification.qr", async () => {
    await enforceRateLimit(request, { limit: 120, scope: "verification-asset", windowSeconds: 60 });
    const verificationUrl = new URL(
      `/verify/${encodeURIComponent(context.params.verificationCode)}`,
      getEnvironment().APP_URL
    ).toString();

    return new Response(buildQrSvg(verificationUrl), {
      headers: {
        "Cache-Control": "public, max-age=300",
        "Content-Disposition": `inline; filename="${context.params.verificationCode}-qr.svg"`,
        "Content-Type": "image/svg+xml; charset=utf-8"
      },
      status: 200
    });
  });
}
