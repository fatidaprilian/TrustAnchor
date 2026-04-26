import type { CreateCertificateTemplateRequest } from "@/modules/certificate-template/certificate-template.dto";
import {
  CertificateTemplateRepository,
  type CertificateTemplateRecord
} from "@/modules/certificate-template/certificate-template.repository";
import { AuditLogRepository } from "@/modules/audit-log/audit-log.repository";

export class CertificateTemplateService {
  private readonly auditLogRepository = new AuditLogRepository();

  private readonly certificateTemplateRepository = new CertificateTemplateRepository();

  public async createTemplate(
    input: CreateCertificateTemplateRequest,
    actorId: string,
    institutionId: string
  ): Promise<CertificateTemplateRecord> {
    const createdTemplate = await this.certificateTemplateRepository.createTemplate({
      certificateType: input.certificateType,
      institutionId,
      layoutDefinition: input.layoutDefinition,
      schemaVersion: input.schemaVersion,
      templateName: input.templateName
    });

    await this.auditLogRepository.createAuditLogRecord({
      action: "certificate_template.created",
      actorId,
      detail: {
        institutionId,
        schemaVersion: input.schemaVersion,
        templateId: createdTemplate.id
      },
      resourceId: createdTemplate.id,
      resourceType: "certificate_template"
    });

    return createdTemplate;
  }
}
