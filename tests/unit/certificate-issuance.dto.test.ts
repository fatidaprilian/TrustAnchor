import { describe, expect, test } from "vitest";

import { createCertificateIssuanceSchema } from "@/modules/certificate-issuance/certificate-issuance.dto";

describe("certificate issuance DTO", () => {
  test("should accept issuance input without client-controlled issuedAt", () => {
    const parsedRequest = createCertificateIssuanceSchema.parse({
      certificateNumber: "CERT-2026-0001",
      recipientIdentifier: "NIM-2026-001",
      recipientName: "Siti Rahmawati",
      templateId: "2b0f3f3f-75d5-4c42-a1ef-c9d93966f05f"
    });

    expect(parsedRequest).not.toHaveProperty("issuedAt");
  });
});
