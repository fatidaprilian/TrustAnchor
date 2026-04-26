import { createHash } from "node:crypto";

import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/modules/institution/institution.repository", () => ({
  InstitutionRepository: class {
    public async getDefaultInstitution() {
      return {
        code: "DEMO",
        createdAt: "2026-04-26T00:00:00.000Z",
        id: "inst_demo",
        name: "TrustAnchor Demo Institution"
      };
    }
  }
}));

function applyBaseEnvironment(password: string, nodeEnvironment = "test"): void {
  Object.assign(process.env, {
    APP_URL: "http://localhost:3000",
    BOOTSTRAP_ADMIN_PASSWORD: password,
    BOOTSTRAP_ADMIN_USERNAME: "testadmin",
    DATABASE_URL: "postgresql://trustanchor:trustanchor@localhost:5432/trustanchor",
    DEFAULT_INSTITUTION_ID: "inst_demo",
    MINIO_ACCESS_KEY: "minio-admin",
    MINIO_BUCKET_NAME: "trustanchor-documents",
    MINIO_ENDPOINT: "http://localhost:9000",
    MINIO_SECRET_KEY: "minio-secret-key",
    NODE_ENV: nodeEnvironment,
    REDIS_URL: "redis://localhost:6379",
    SESSION_SECRET: "trustanchor-local-session-secret-2026"
  });
}

describe("authentication service", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test("should accept plaintext bootstrap password outside production", async () => {
    applyBaseEnvironment("TrustAnchorTest123!");
    const { AuthenticationService } = await import("@/modules/authentication/authentication.service");

    const administrator = await new AuthenticationService().authenticateBootstrapAdmin({
      password: "TrustAnchorTest123!",
      username: "testadmin"
    });

    expect(administrator.username).toBe("testadmin");
  });

  test("should accept SHA-256 hex bootstrap password", async () => {
    const passwordHash = createHash("sha256").update("TrustAnchorTest123!").digest("hex");
    applyBaseEnvironment(passwordHash);
    const { AuthenticationService } = await import("@/modules/authentication/authentication.service");

    const administrator = await new AuthenticationService().authenticateBootstrapAdmin({
      password: "TrustAnchorTest123!",
      username: "testadmin"
    });

    expect(administrator.username).toBe("testadmin");
  });

  test("should reject plaintext bootstrap password in production", async () => {
    applyBaseEnvironment("TrustAnchorTest123!", "production");
    const { AuthenticationService } = await import("@/modules/authentication/authentication.service");

    await expect(
      new AuthenticationService().authenticateBootstrapAdmin({
        password: "TrustAnchorTest123!",
        username: "testadmin"
      })
    ).rejects.toThrow("BOOTSTRAP_ADMIN_PASSWORD must be a SHA-256 hex string in production");
  });
});
