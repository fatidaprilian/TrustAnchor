import { AuditLogRepository, type AuditLogRecord } from "@/modules/audit-log/audit-log.repository";
import {
  CertificateIssuanceRepository,
  type CertificateIssuanceRecord
} from "@/modules/certificate-issuance/certificate-issuance.repository";
import {
  CertificateTemplateRepository,
  type CertificateTemplateRecord
} from "@/modules/certificate-template/certificate-template.repository";
import { InstitutionRepository } from "@/modules/institution/institution.repository";

export interface DashboardSummary {
  institutionName: string;
  templateCount: number;
  issuanceCount: number;
  auditLogCount: number;
  recentIssuances: Array<{
    certificateNumber: string;
    createdAt: string;
    id: string;
    recipientName: string;
    status: string;
    verificationCode: string;
  }>;
  recentAuditLogs: Array<{
    action: string;
    actorId: string | null;
    createdAt: string;
    id: string;
    resourceType: string;
  }>;
}

export interface PaginatedResult<TRecord> {
  data: TRecord[];
  limit: number;
  offset: number;
  total: number;
}

export class DashboardService {
  private readonly auditLogRepository = new AuditLogRepository();

  private readonly certificateIssuanceRepository = new CertificateIssuanceRepository();

  private readonly certificateTemplateRepository = new CertificateTemplateRepository();

  private readonly institutionRepository = new InstitutionRepository();

  public async getSummary(): Promise<DashboardSummary> {
    const institution = await this.institutionRepository.getDefaultInstitution();

    const [templateCount, issuanceCount, auditLogCount, recentIssuances, recentAuditLogs] = await Promise.all([
      this.certificateTemplateRepository.countTemplatesByInstitution(institution.id),
      this.certificateIssuanceRepository.countIssuancesByInstitution(institution.id),
      this.auditLogRepository.countAuditLogs(),
      this.certificateIssuanceRepository.findIssuancesByInstitution(institution.id, 5, 0),
      this.auditLogRepository.findRecentAuditLogs(5, 0)
    ]);

    return {
      auditLogCount,
      institutionName: institution.name,
      issuanceCount,
      recentAuditLogs: recentAuditLogs.map((log) => ({
        action: log.action,
        actorId: log.actorId,
        createdAt: log.createdAt,
        id: log.id,
        resourceType: log.resourceType
      })),
      recentIssuances: recentIssuances.map((issuance) => ({
        certificateNumber: issuance.certificateNumber,
        createdAt: issuance.createdAt,
        id: issuance.id,
        recipientName: issuance.recipientName,
        status: issuance.status,
        verificationCode: issuance.verificationCode
      })),
      templateCount
    };
  }

  public async listTemplates(
    limit: number,
    offset: number
  ): Promise<PaginatedResult<CertificateTemplateRecord>> {
    const institution = await this.institutionRepository.getDefaultInstitution();
    const [data, total] = await Promise.all([
      this.certificateTemplateRepository.findTemplatesByInstitution(institution.id, limit, offset),
      this.certificateTemplateRepository.countTemplatesByInstitution(institution.id)
    ]);

    return { data, limit, offset, total };
  }

  public async listIssuances(
    limit: number,
    offset: number
  ): Promise<PaginatedResult<CertificateIssuanceRecord>> {
    const institution = await this.institutionRepository.getDefaultInstitution();
    const [data, total] = await Promise.all([
      this.certificateIssuanceRepository.findIssuancesByInstitution(institution.id, limit, offset),
      this.certificateIssuanceRepository.countIssuancesByInstitution(institution.id)
    ]);

    return { data, limit, offset, total };
  }

  public async listAuditLogs(
    limit: number,
    offset: number
  ): Promise<PaginatedResult<AuditLogRecord>> {
    const [data, total] = await Promise.all([
      this.auditLogRepository.findRecentAuditLogs(limit, offset),
      this.auditLogRepository.countAuditLogs()
    ]);

    return { data, limit, offset, total };
  }
}
