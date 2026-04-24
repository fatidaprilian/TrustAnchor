import { describe, expect, test } from "vitest";

describe("document proof service", () => {
  test("should verify stored proof when payload is encrypted and signed", async () => {
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

    const { createDocumentProof, verifyStoredDocumentProof } = await import(
      "@/modules/shared/security/document-proof.service"
    );
    const proof = await createDocumentProof({
      certificateNumber: "TA-2026-0001",
      recipientName: "Siti Rahmawati",
      verificationCode: "TA-ABCDEF1234"
    });
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

    expect(verificationResult.digitalSignatureVerified).toBe(true);
    expect(verificationResult.canonicalPayload.certificateNumber).toBe("TA-2026-0001");
    expect(verificationResult.canonicalPayload.recipientName).toBe("Siti Rahmawati");
  });
});
