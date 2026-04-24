import type { CreateCertificateTemplateRequest } from "@/modules/certificate-template/certificate-template.dto";
import {
  CertificateTemplateRepository,
  type CertificateTemplateRecord
} from "@/modules/certificate-template/certificate-template.repository";
import { AuditLogRepository } from "@/modules/audit-log/audit-log.repository";
import { InstitutionRepository } from "@/modules/institution/institution.repository";

export class CertificateTemplateService {
  private readonly auditLogRepository = new AuditLogRepository();

  private readonly certificateTemplateRepository = new CertificateTemplateRepository();

  private readonly institutionRepository = new InstitutionRepository();

  public async createTemplate(
    input: CreateCertificateTemplateRequest,
    actorId: string
  ): Promise<CertificateTemplateRecord> {
    const institutionRecord = await this.institutionRepository.getDefaultInstitution();
    const createdTemplate = await this.certificateTemplateRepository.createTemplate({
      certificateType: input.certificateType,
      institutionId: institutionRecord.id,
      layoutDefinition: input.layoutDefinition,
      schemaVersion: input.schemaVersion,
      templateName: input.templateName
    });

    await this.auditLogRepository.createAuditLogRecord({
      action: "certificate_template.created",
      actorId,
      detail: {
        institutionId: institutionRecord.id,
        schemaVersion: input.schemaVersion,
        templateId: createdTemplate.id
      },
      resourceId: createdTemplate.id,
      resourceType: "certificate_template"
    });

    return createdTemplate;
  }
}
