import { beforeEach, describe, expect, test, vi } from "vitest";

function applyBaseEnvironment(): void {
  Object.assign(process.env, {
    APP_URL: "http://localhost:3000",
    BOOTSTRAP_ADMIN_PASSWORD: "TrustAnchorTest123!",
    BOOTSTRAP_ADMIN_USERNAME: "testadmin",
    DATABASE_URL: "postgresql://trustanchor:trustanchor@localhost:5432/trustanchor",
    DEFAULT_INSTITUTION_ID: "inst_demo",
    MINIO_ACCESS_KEY: "minio-admin",
    MINIO_BUCKET_NAME: "trustanchor-documents",
    MINIO_ENDPOINT: "http://localhost:9000",
    MINIO_SECRET_KEY: "minio-secret-key",
    NODE_ENV: "test",
    REDIS_URL: "redis://localhost:6379",
    SESSION_SECRET: "trustanchor-local-session-secret-2026"
  });
}

describe("session service", () => {
  beforeEach(() => {
    vi.resetModules();
    applyBaseEnvironment();
  });

  test("should preserve role and institution context in session tokens", async () => {
    const { createSessionToken, verifySessionToken } = await import("@/modules/shared/security/session.service");
    const token = await createSessionToken({
      institutionId: "inst_demo",
      institutionName: "TrustAnchor Demo Institution",
      role: "platform_admin",
      sub: "bootstrap-admin",
      username: "testadmin"
    });

    await expect(verifySessionToken(token)).resolves.toMatchObject({
      institutionId: "inst_demo",
      institutionName: "TrustAnchor Demo Institution",
      role: "platform_admin",
      username: "testadmin"
    });
  });
});
