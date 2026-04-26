import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

import type { VerificationResult } from "@/modules/verification/verification.service";
import { buildQrMatrix } from "@/modules/verification/verification-qr";

const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;

function drawWrappedText(
  page: PDFPage,
  text: string,
  options: {
    font: PDFFont;
    fontSize: number;
    lineHeight: number;
    maxChars: number;
    x: number;
    y: number;
  }
): void {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length > options.maxChars && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.forEach((line, lineIndex) => {
    page.drawText(line, {
      color: rgb(0.23, 0.26, 0.34),
      font: options.font,
      size: options.fontSize,
      x: options.x,
      y: options.y - lineIndex * options.lineHeight
    });
  });
}

function drawQrCode(
  page: PDFPage,
  verificationUrl: string,
  options: {
    size: number;
    x: number;
    y: number;
  }
): void {
  const quietZone = 4;
  const qrMatrix = buildQrMatrix(verificationUrl);
  const moduleSize = options.size / (qrMatrix.moduleCount + quietZone * 2);

  page.drawRectangle({
    color: rgb(0.99, 0.98, 0.94),
    height: options.size,
    width: options.size,
    x: options.x,
    y: options.y
  });

  for (const { column, row } of qrMatrix.darkModules) {
    page.drawRectangle({
      color: rgb(0.12, 0.14, 0.18),
      height: moduleSize,
      width: moduleSize,
      x: options.x + (column + quietZone) * moduleSize,
      y: options.y + options.size - (row + quietZone + 1) * moduleSize
    });
  }
}

export async function renderCertificatePdf(
  verificationResult: VerificationResult,
  verificationUrl: string
): Promise<Uint8Array> {
  const pdfDocument = await PDFDocument.create();
  pdfDocument.setTitle(`${verificationResult.certificateNumber} TrustAnchor Certificate`);
  pdfDocument.setSubject("TrustAnchor verified certificate artifact");
  pdfDocument.setCreator("TrustAnchor");
  pdfDocument.setProducer("TrustAnchor pdf-lib renderer");

  const page = pdfDocument.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const headingFont = await pdfDocument.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDocument.embedFont(StandardFonts.Helvetica);
  const codeFont = await pdfDocument.embedFont(StandardFonts.Courier);

  page.drawRectangle({
    color: rgb(0.99, 0.98, 0.94),
    height: PAGE_HEIGHT,
    width: PAGE_WIDTH,
    x: 0,
    y: 0
  });
  page.drawRectangle({
    borderColor: rgb(0.31, 0.33, 0.39),
    borderWidth: 1.2,
    height: PAGE_HEIGHT - 56,
    width: PAGE_WIDTH - 56,
    x: 28,
    y: 28
  });

  page.drawText("TRUSTANCHOR VERIFIED RECORD", {
    color: rgb(0.33, 0.36, 0.43),
    font: codeFont,
    size: 11,
    x: 58,
    y: 525
  });
  page.drawText(verificationResult.templateName.toUpperCase(), {
    color: rgb(0.12, 0.14, 0.18),
    font: headingFont,
    size: 34,
    x: 58,
    y: 482
  });
  page.drawText("This certificate record is issued to", {
    color: rgb(0.33, 0.36, 0.43),
    font: bodyFont,
    size: 14,
    x: 58,
    y: 398
  });
  page.drawText(verificationResult.recipientName.toUpperCase(), {
    color: rgb(0.12, 0.14, 0.18),
    font: headingFont,
    size: 42,
    x: 58,
    y: 348
  });

  const certificateCopy = `${verificationResult.achievementLabel || "Completion of academic requirements"} for ${
    verificationResult.programName
  }${verificationResult.academicYear ? `, academic year ${verificationResult.academicYear}` : ""}. Certificate ${
    verificationResult.certificateNumber
  } was issued by ${verificationResult.institutionName}.`;

  drawWrappedText(page, certificateCopy, {
    font: bodyFont,
    fontSize: 13,
    lineHeight: 18,
    maxChars: 92,
    x: 58,
    y: 292
  });

  page.drawText(`Status: ${verificationResult.proofVerified ? verificationResult.status : "proof_invalid"}`, {
    color: verificationResult.proofVerified ? rgb(0.16, 0.48, 0.32) : rgb(0.7, 0.19, 0.13),
    font: headingFont,
    size: 14,
    x: 58,
    y: 210
  });
  page.drawText(`Verification code: ${verificationResult.verificationCode}`, {
    color: rgb(0.12, 0.14, 0.18),
    font: codeFont,
    size: 11,
    x: 58,
    y: 168
  });
  drawWrappedText(page, `Document hash: ${verificationResult.documentHash}`, {
    font: codeFont,
    fontSize: 8,
    lineHeight: 11,
    maxChars: 92,
    x: 58,
    y: 140
  });

  if (verificationResult.signatoryName) {
    page.drawText("Authorized signatory", {
      color: rgb(0.33, 0.36, 0.43),
      font: codeFont,
      size: 9,
      x: 58,
      y: 86
    });
    page.drawText(verificationResult.signatoryName, {
      color: rgb(0.12, 0.14, 0.18),
      font: headingFont,
      size: 13,
      x: 58,
      y: 66
    });
    page.drawText(verificationResult.signatoryTitle, {
      color: rgb(0.33, 0.36, 0.43),
      font: bodyFont,
      size: 10,
      x: 58,
      y: 50
    });
  }

  drawQrCode(page, verificationUrl, {
    size: 142,
    x: 640,
    y: 72
  });
  page.drawText("Scan to verify", {
    color: rgb(0.33, 0.36, 0.43),
    font: bodyFont,
    size: 11,
    x: 674,
    y: 48
  });

  return pdfDocument.save();
}
