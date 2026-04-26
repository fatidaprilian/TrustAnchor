import { describe, expect, test } from "vitest";

import { buildQrMatrix, buildQrSvg } from "@/modules/verification/verification-qr";

describe("verification QR generation", () => {
  test("should create a real QR matrix for a verification URL", () => {
    const qrMatrix = buildQrMatrix("http://localhost:3000/verify/TA-ABCDEF1234");

    expect(qrMatrix.moduleCount).toBeGreaterThan(0);
    expect(qrMatrix.darkModules.length).toBeGreaterThan(qrMatrix.moduleCount);
  });

  test("should return downloadable SVG markup", () => {
    const svgMarkup = buildQrSvg("http://localhost:3000/verify/TA-ABCDEF1234");

    expect(svgMarkup).toContain("<svg");
    expect(svgMarkup).toContain("shape-rendering=\"crispEdges\"");
    expect(svgMarkup).toContain("<rect");
  });
});
