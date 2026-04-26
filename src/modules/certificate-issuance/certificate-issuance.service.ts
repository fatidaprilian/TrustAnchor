import { randomBytes } from "node:crypto";

import type { CreateCertificateIssuanceRequest } from "@/modules/certificate-issuance/certificate-issuance.dto";
import { CertificateIssuanceRepository } from "@/modules/certificate-issuance/certificate-issuance.repository";
import { CertificateTemplateRepository } from "@/modules/certificate-template/certificate-template.repository";
import { AuditLogRepository } from "@/modules/audit-log/audit-log.repository";
import { InstitutionRepository } from "@/modules/institution/institution.repository";
import { ConflictError, NotFoundError } from "@/modules/shared/errors/application-error";
import { createDocumentProof } from "@/modules/shared/security/document-proof.service";

function createVerificationCode(): string {
  return `TA-${randomBytes(5).toString("hex").toUpperCase()}`;
}

function readStringClaim(source: Record<string, unknown>, key: string, fallback: string): string {
  const value = source[key];
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

export class CertificateIssuanceService {
  private readonly auditLogRepository = new AuditLogRepository();

  private readonly certificateIssuanceRepository = new CertificateIssuanceRepository();

  private readonly certificateTemplateRepository = new CertificateTemplateRepository();

  private readonly institutionRepository = new InstitutionRepository();

  public async createIssuance(input: CreateCertificateIssuanceRequest, actorId: string) {
    const institutionRecord = await this.institutionRepository.getDefaultInstitution();
    const templateRecord = await this.certificateTemplateRepository.findTemplateById(input.templateId);

    if (!templateRecord || templateRecord.institutionId !== institutionRecord.id) {
      throw new NotFoundError("Certificate template was not found");
    }

    const verificationCode = createVerificationCode();
    const issuedAt = new Date().toISOString();
    const templateClaims = templateRecord.layoutDefinition;
    const publicClaims = {
      academicYear: readStringClaim(templateClaims, "academicYear", ""),
      achievementLabel: readStringClaim(templateClaims, "achievementLabel", ""),
      certificateNumber: input.certificateNumber,
      institutionName: institutionRecord.name,
      issuedAt,
      programName: readStringClaim(templateClaims, "programName", templateRecord.templateName),
      recipientName: input.recipientName,
      signatoryName: readStringClaim(templateClaims, "signatoryName", ""),
      signatoryTitle: readStringClaim(templateClaims, "signatoryTitle", ""),
      templateName: templateRecord.templateName,
      verificationCode
    };
    const proof = await createDocumentProof({
      certificateNumber: input.certificateNumber,
      certificateType: templateRecord.certificateType,
      academicYear: publicClaims.academicYear,
      achievementLabel: publicClaims.achievementLabel,
      institutionId: institutionRecord.id,
      institutionName: institutionRecord.name,
      issuedAt,
      programName: publicClaims.programName,
      recipientIdentifier: input.recipientIdentifier,
      recipientName: input.recipientName,
      schemaVersion: templateRecord.schemaVersion,
      signatoryName: publicClaims.signatoryName,
      signatoryTitle: publicClaims.signatoryTitle,
      templateId: templateRecord.id,
      verificationCode
    });

    try {
      const createdIssuance = await this.certificateIssuanceRepository.createIssuance({
        certificateNumber: input.certificateNumber,
        digitalSignature: proof.digitalSignature,
        documentHash: proof.documentHash,
        encryptedPayload: proof.encryptedPayload,
        institutionId: institutionRecord.id,
        issuedAt,
        payloadIv: proof.payloadIv,
        payloadTag: proof.payloadTag,
        publicClaims,
        recipientIdentifier: input.recipientIdentifier,
        recipientName: input.recipientName,
        status: "issued",
        templateId: templateRecord.id,
        verificationCode,
        wrappedDocumentKey: proof.wrappedDocumentKey,
        wrappedKeyIv: proof.wrappedKeyIv,
        wrappedKeyTag: proof.wrappedKeyTag
      });

      await this.auditLogRepository.createAuditLogRecord({
        action: "certificate_issuance.created",
        actorId,
        detail: {
          certificateNumber: input.certificateNumber,
          templateId: templateRecord.id,
          verificationCode
        },
        resourceId: createdIssuance.id,
        resourceType: "certificate_issuance"
      });

      return createdIssuance;
    } catch (error) {
      const isDuplicateError =
        error instanceof Error && "code" in error && typeof error.code === "string" && error.code === "23505";

      if (isDuplicateError) {
        throw new ConflictError("Certificate number or verification code already exists");
      }

      throw error;
    }
  }

  public async revokeIssuance(issuanceId: string, actorId: string) {
    const issuanceRecord = await this.certificateIssuanceRepository.findById(issuanceId);

    if (!issuanceRecord) {
      throw new NotFoundError("Certificate issuance was not found");
    }

    if (issuanceRecord.status === "revoked") {
      return issuanceRecord;
    }

    const revokedIssuance = await this.certificateIssuanceRepository.updateIssuanceStatus(issuanceId, "revoked");

    await this.auditLogRepository.createAuditLogRecord({
      action: "certificate_issuance.revoked",
      actorId,
      detail: {
        certificateNumber: revokedIssuance.certificateNumber,
        verificationCode: revokedIssuance.verificationCode
      },
      resourceId: revokedIssuance.id,
      resourceType: "certificate_issuance"
    });

    return revokedIssuance;
  }
}
