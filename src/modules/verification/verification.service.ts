import { CertificateIssuanceRepository } from "@/modules/certificate-issuance/certificate-issuance.repository";
import { AuditLogRepository } from "@/modules/audit-log/audit-log.repository";
import { NotFoundError } from "@/modules/shared/errors/application-error";
import { verifyStoredDocumentProof } from "@/modules/shared/security/document-proof.service";

export interface VerificationResult {
  academicYear: string;
  achievementLabel: string;
  certificateNumber: string;
  documentHash: string;
  institutionName: string;
  issuedAt: string;
  proofVerified: boolean;
  programName: string;
  recipientName: string;
  signatoryName: string;
  signatoryTitle: string;
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

    let proofVerified = true;
    let verifiedCanonicalPayload: {
      institutionName?: string;
      issuedAt?: string;
      recipientName?: string;
      verificationCode?: string;
    } = {};
    let verifiedDocumentHash = issuanceRecord.documentHash;

    try {
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

      verifiedCanonicalPayload = verifiedProof.canonicalPayload;
      verifiedDocumentHash = verifiedProof.documentHash;
    } catch {
      proofVerified = false;
    }

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
      academicYear:
        typeof issuanceRecord.publicClaims.academicYear === "string" ? issuanceRecord.publicClaims.academicYear : "",
      achievementLabel:
        typeof issuanceRecord.publicClaims.achievementLabel === "string" ? issuanceRecord.publicClaims.achievementLabel : "",
      certificateNumber: issuanceRecord.certificateNumber,
      documentHash: verifiedDocumentHash,
      institutionName:
        typeof issuanceRecord.publicClaims.institutionName === "string"
          ? issuanceRecord.publicClaims.institutionName
          : verifiedCanonicalPayload.institutionName ?? "Unknown institution",
      issuedAt: issuanceRecord.issuedAt,
      proofVerified,
      programName:
        typeof issuanceRecord.publicClaims.programName === "string"
          ? issuanceRecord.publicClaims.programName
          : "Academic program",
      recipientName: issuanceRecord.recipientName,
      signatoryName:
        typeof issuanceRecord.publicClaims.signatoryName === "string" ? issuanceRecord.publicClaims.signatoryName : "",
      signatoryTitle:
        typeof issuanceRecord.publicClaims.signatoryTitle === "string" ? issuanceRecord.publicClaims.signatoryTitle : "",
      status: proofVerified ? issuanceRecord.status : "proof_invalid",
      templateName:
        typeof issuanceRecord.publicClaims.templateName === "string"
          ? issuanceRecord.publicClaims.templateName
          : "Issued certificate",
      verificationCode: issuanceRecord.verificationCode,
      verifiedAt: new Date().toISOString()
    };
  }
}
