import { getEnvironment } from "@/modules/shared/config/env";
import { handleRoute } from "@/modules/shared/http/api-response";
import { buildQrSvg } from "@/modules/verification/verification-qr";

export const runtime = "nodejs";

interface VerificationQrRouteContext {
  params: {
    verificationCode: string;
  };
}

export async function GET(_request: Request, context: VerificationQrRouteContext): Promise<Response> {
  return handleRoute("verification.qr", async () => {
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
