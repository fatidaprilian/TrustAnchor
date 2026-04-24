import { CertificateIssuanceRepository } from "@/modules/certificate-issuance/certificate-issuance.repository";
import { AuditLogRepository } from "@/modules/audit-log/audit-log.repository";
import { NotFoundError } from "@/modules/shared/errors/application-error";
import { verifyStoredDocumentProof } from "@/modules/shared/security/document-proof.service";

export interface VerificationResult {
  certificateNumber: string;
  documentHash: string;
  institutionName: string;
  issuedAt: string;
  recipientName: string;
  status: string;
  templateName: string;
  verificationCode: string;
  verifiedAt: string;
}

export class VerificationService {
  private readonly auditLogRepository = new AuditLogRepository();

  private readonly certificateIssuanceRepository = new CertificateIssuanceRepository();

  public async verifyByCode(verificationCode: string): Promise<VerificationResult> {
    const issuanceRecord = await this.certificateIssuanceRepository.findByVerificationCode(verificationCode);

    if (!issuanceRecord) {
      throw new NotFoundError("Verification code was not found");
    }

    const verifiedProof = await verifyStoredDocumentProof<{
      institutionName: string;
      issuedAt: string;
      recipientName: string;
      verificationCode: string;
    }>({
      digitalSignature: issuanceRecord.digitalSignature,
      documentHash: issuanceRecord.documentHash,
      encryptedPayload: issuanceRecord.encryptedPayload,
      payloadIv: issuanceRecord.payloadIv,
      payloadTag: issuanceRecord.payloadTag,
      wrappedDocumentKey: issuanceRecord.wrappedDocumentKey,
      wrappedKeyIv: issuanceRecord.wrappedKeyIv,
      wrappedKeyTag: issuanceRecord.wrappedKeyTag
    });

    await this.auditLogRepository.createAuditLogRecord({
      action: "certificate_issuance.verified",
      actorId: null,
      detail: {
        verificationCode
      },
      resourceId: issuanceRecord.id,
      resourceType: "certificate_issuance"
    });

    return {
      certificateNumber: issuanceRecord.certificateNumber,
      documentHash: verifiedProof.documentHash,
      institutionName:
        typeof issuanceRecord.publicClaims.institutionName === "string"
          ? issuanceRecord.publicClaims.institutionName
          : verifiedProof.canonicalPayload.institutionName,
      issuedAt: issuanceRecord.issuedAt,
      recipientName: issuanceRecord.recipientName,
      status: issuanceRecord.status,
      templateName:
        typeof issuanceRecord.publicClaims.templateName === "string"
          ? issuanceRecord.publicClaims.templateName
          : "Issued certificate",
      verificationCode: issuanceRecord.verificationCode,
      verifiedAt: new Date().toISOString()
    };
  }
}
