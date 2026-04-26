import { beforeEach, describe, expect, test, vi } from "vitest";

describe("field encryption service", () => {
  beforeEach(() => {
    vi.resetModules();
    Object.assign(process.env, {
      APP_URL: "http://localhost:3000",
      BOOTSTRAP_ADMIN_PASSWORD: "trustanchor-admin",
      BOOTSTRAP_ADMIN_USERNAME: "admin",
      DATABASE_URL: "postgresql://trustanchor:trustanchor@localhost:5432/trustanchor",
      DEFAULT_INSTITUTION_ID: "inst_demo",
      DOCUMENT_MASTER_KEY: "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=",
      MINIO_ACCESS_KEY: "minio-admin",
      MINIO_BUCKET_NAME: "trustanchor-documents",
      MINIO_ENDPOINT: "http://localhost:9000",
      MINIO_SECRET_KEY: "minio-secret-key",
      NODE_ENV: "test",
      REDIS_URL: "redis://localhost:6379",
      SESSION_SECRET: "trustanchor-local-session-secret-2026"
    });
  });

  test("should encrypt and decrypt recipient identifiers", async () => {
    const { decryptFieldValue, encryptFieldValue } = await import("@/modules/shared/security/field-encryption.service");
    const encryptedValue = encryptFieldValue("NIM-2026-001");

    expect(encryptedValue).toMatch(/^enc:v1:/);
    expect(encryptedValue).not.toContain("NIM-2026-001");
    expect(decryptFieldValue(encryptedValue)).toBe("NIM-2026-001");
  });

  test("should preserve legacy plaintext values", async () => {
    const { decryptFieldValue } = await import("@/modules/shared/security/field-encryption.service");

    expect(decryptFieldValue("NIM-LEGACY-001")).toBe("NIM-LEGACY-001");
  });
});
