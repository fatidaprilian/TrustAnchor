import { beforeEach, describe, expect, test, vi } from "vitest";

describe("document proof service", () => {
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
    delete process.env.SIGNATURE_PRIVATE_KEY_PEM;
    delete process.env.SIGNATURE_PUBLIC_KEY_PEM;
    delete (globalThis as { __trustanchorSigningKeys?: unknown }).__trustanchorSigningKeys;
  });

  test("should verify stored proof when payload is encrypted and signed with RSA-SHA256", async () => {
    const { createDocumentProof, verifyStoredDocumentProof } = await import(
      "@/modules/shared/security/document-proof.service"
    );
    const proof = await createDocumentProof({
      certificateNumber: "TA-2026-0001",
      recipientName: "Siti Rahmawati",
      verificationCode: "TA-ABCDEF1234"
    });
    const signatureHeader = JSON.parse(Buffer.from(proof.digitalSignature.split(".")[0], "base64url").toString("utf8"));
    const verificationResult = await verifyStoredDocumentProof<{
      certificateNumber: string;
      recipientName: string;
      verificationCode: string;
    }>({
      digitalSignature: proof.digitalSignature,
      documentHash: proof.documentHash,
      encryptedPayload: proof.encryptedPayload,
      payloadIv: proof.payloadIv,
      payloadTag: proof.payloadTag,
      wrappedDocumentKey: proof.wrappedDocumentKey,
      wrappedKeyIv: proof.wrappedKeyIv,
      wrappedKeyTag: proof.wrappedKeyTag
    });

    expect(signatureHeader.alg).toBe("PS256");
    expect(verificationResult.digitalSignatureVerified).toBe(true);
    expect(verificationResult.canonicalPayload.certificateNumber).toBe("TA-2026-0001");
    expect(verificationResult.canonicalPayload.recipientName).toBe("Siti Rahmawati");
  });

  test("should reject proof when the stored hash no longer matches the signature", async () => {
    const { createDocumentProof, verifyStoredDocumentProof } = await import(
      "@/modules/shared/security/document-proof.service"
    );
    const proof = await createDocumentProof({
      certificateNumber: "TA-2026-0002",
      recipientName: "Budi Santoso",
      verificationCode: "TA-TAMPER001"
    });

    await expect(
      verifyStoredDocumentProof({
        digitalSignature: proof.digitalSignature,
        documentHash: "0".repeat(64),
        encryptedPayload: proof.encryptedPayload,
        payloadIv: proof.payloadIv,
        payloadTag: proof.payloadTag,
        wrappedDocumentKey: proof.wrappedDocumentKey,
        wrappedKeyIv: proof.wrappedKeyIv,
        wrappedKeyTag: proof.wrappedKeyTag
      })
    ).rejects.toThrow("Stored digital signature does not match the stored document hash");
  });

  test("should reject proof when encrypted payload is modified", async () => {
    const { createDocumentProof, verifyStoredDocumentProof } = await import(
      "@/modules/shared/security/document-proof.service"
    );
    const proof = await createDocumentProof({
      certificateNumber: "TA-2026-0003",
      recipientName: "Dewi Lestari",
      verificationCode: "TA-TAMPER002"
    });
    const tamperedPayload = `A${proof.encryptedPayload.slice(1)}`;

    await expect(
      verifyStoredDocumentProof({
        digitalSignature: proof.digitalSignature,
        documentHash: proof.documentHash,
        encryptedPayload: tamperedPayload,
        payloadIv: proof.payloadIv,
        payloadTag: proof.payloadTag,
        wrappedDocumentKey: proof.wrappedDocumentKey,
        wrappedKeyIv: proof.wrappedKeyIv,
        wrappedKeyTag: proof.wrappedKeyTag
      })
    ).rejects.toThrow();
  });
});
