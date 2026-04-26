import { AuditLogRepository, type AuditLogRecord } from "@/modules/audit-log/audit-log.repository";
import {
  CertificateIssuanceRepository,
  type CertificateIssuanceRecord
} from "@/modules/certificate-issuance/certificate-issuance.repository";
import {
  CertificateTemplateRepository,
  type CertificateTemplateRecord
} from "@/modules/certificate-template/certificate-template.repository";

export interface DashboardSummary {
  institutionId: string;
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

  public async getSummary(institutionId: string, institutionName: string): Promise<DashboardSummary> {
    const [templateCount, issuanceCount, auditLogCount, recentIssuances, recentAuditLogs] = await Promise.all([
      this.certificateTemplateRepository.countTemplatesByInstitution(institutionId),
      this.certificateIssuanceRepository.countIssuancesByInstitution(institutionId),
      this.auditLogRepository.countAuditLogsByInstitution(institutionId),
      this.certificateIssuanceRepository.findIssuancesByInstitution(institutionId, 5, 0),
      this.auditLogRepository.findRecentAuditLogsByInstitution(institutionId, 5, 0)
    ]);

    return {
      auditLogCount,
      institutionId,
      institutionName,
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
    institutionId: string,
    limit: number,
    offset: number
  ): Promise<PaginatedResult<CertificateTemplateRecord>> {
    const [data, total] = await Promise.all([
      this.certificateTemplateRepository.findTemplatesByInstitution(institutionId, limit, offset),
      this.certificateTemplateRepository.countTemplatesByInstitution(institutionId)
    ]);

    return { data, limit, offset, total };
  }

  public async listIssuances(
    institutionId: string,
    limit: number,
    offset: number
  ): Promise<PaginatedResult<CertificateIssuanceRecord>> {
    const [data, total] = await Promise.all([
      this.certificateIssuanceRepository.findIssuancesByInstitution(institutionId, limit, offset),
      this.certificateIssuanceRepository.countIssuancesByInstitution(institutionId)
    ]);

    return { data, limit, offset, total };
  }

  public async listAuditLogs(
    institutionId: string,
    limit: number,
    offset: number
  ): Promise<PaginatedResult<AuditLogRecord>> {
    const [data, total] = await Promise.all([
      this.auditLogRepository.findRecentAuditLogsByInstitution(institutionId, limit, offset),
      this.auditLogRepository.countAuditLogsByInstitution(institutionId)
    ]);

    return { data, limit, offset, total };
  }
}
