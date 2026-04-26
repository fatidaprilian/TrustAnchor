import { describe, expect, test } from "vitest";

import { renderCertificatePdf } from "@/modules/verification/certificate-pdf.service";
import type { VerificationResult } from "@/modules/verification/verification.service";

describe("certificate PDF rendering", () => {
  test("should render a PDF certificate artifact", async () => {
    const verificationResult: VerificationResult = {
      academicYear: "2025/2026",
      achievementLabel: "Completion of academic requirements",
      certificateNumber: "TA-2026-0001",
      documentHash: "a".repeat(64),
      institutionName: "TrustAnchor Demo University",
      issuedAt: "2026-04-26T00:00:00.000Z",
      proofVerified: true,
      programName: "Cryptography Final Project",
      recipientName: "Siti Rahmawati",
      signatoryName: "Dr. Academic Reviewer",
      signatoryTitle: "Course Lecturer",
      status: "issued",
      templateName: "Academic Certificate",
      verificationCode: "TA-ABCDEF1234",
      verifiedAt: "2026-04-26T00:01:00.000Z"
    };

    const pdfBytes = await renderCertificatePdf(verificationResult, "http://localhost:3000/verify/TA-ABCDEF1234");
    const pdfHeader = Buffer.from(pdfBytes.slice(0, 5)).toString("utf8");

    expect(pdfHeader).toBe("%PDF-");
    expect(pdfBytes.length).toBeGreaterThan(1000);
  });
});
