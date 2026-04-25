import { randomUUID } from "node:crypto";

import { getDatabasePool } from "@/modules/shared/config/database";

export interface CertificateTemplateRecord {
  certificateType: string;
  createdAt: string;
  id: string;
  institutionId: string;
  isActive: boolean;
  layoutDefinition: Record<string, unknown>;
  schemaVersion: string;
  templateName: string;
}

export interface CreateCertificateTemplateInput {
  certificateType: string;
  institutionId: string;
  layoutDefinition: Record<string, unknown>;
  schemaVersion: string;
  templateName: string;
}

interface CertificateTemplateRow {
  certificate_type: string;
  created_at: string;
  id: string;
  institution_id: string;
  is_active: boolean;
  layout_definition: Record<string, unknown>;
  schema_version: string;
  template_name: string;
}

function mapCertificateTemplateRow(row: CertificateTemplateRow): CertificateTemplateRecord {
  return {
    certificateType: row.certificate_type,
    createdAt: row.created_at,
    id: row.id,
    institutionId: row.institution_id,
    isActive: row.is_active,
    layoutDefinition: row.layout_definition,
    schemaVersion: row.schema_version,
    templateName: row.template_name
  };
}

export class CertificateTemplateRepository {
  public async createTemplate(input: CreateCertificateTemplateInput): Promise<CertificateTemplateRecord> {
    const { rows } = await getDatabasePool().query<CertificateTemplateRow>(
      `
        insert into certificate_templates (
          id,
          institution_id,
          template_name,
          certificate_type,
          schema_version,
          layout_definition,
          is_active,
          created_at
        )
        values ($1, $2, $3, $4, $5, $6::jsonb, true, now())
        returning
          id,
          institution_id,
          template_name,
          certificate_type,
          schema_version,
          layout_definition,
          is_active,
          created_at
      `,
      [
        randomUUID(),
        input.institutionId,
        input.templateName,
        input.certificateType,
        input.schemaVersion,
        JSON.stringify(input.layoutDefinition)
      ]
    );

    return mapCertificateTemplateRow(rows[0]);
  }

  public async findTemplateById(templateId: string): Promise<CertificateTemplateRecord | null> {
    const { rows } = await getDatabasePool().query<CertificateTemplateRow>(
      `
        select
          id,
          institution_id,
          template_name,
          certificate_type,
          schema_version,
          layout_definition,
          is_active,
          created_at
        from certificate_templates
        where id = $1
        limit 1
      `,
      [templateId]
    );

    const templateRow = rows[0];
    return templateRow ? mapCertificateTemplateRow(templateRow) : null;
  }

  public async findTemplatesByInstitution(
    institutionId: string,
    limit: number,
    offset: number
  ): Promise<CertificateTemplateRecord[]> {
    const { rows } = await getDatabasePool().query<CertificateTemplateRow>(
      `
        select
          id, institution_id, template_name, certificate_type,
          schema_version, layout_definition, is_active, created_at
        from certificate_templates
        where institution_id = $1
        order by created_at desc
        limit $2
        offset $3
      `,
      [institutionId, limit, offset]
    );

    return rows.map(mapCertificateTemplateRow);
  }

  public async countTemplatesByInstitution(institutionId: string): Promise<number> {
    const { rows } = await getDatabasePool().query<{ total: string }>(
      `select count(*)::text as total from certificate_templates where institution_id = $1`,
      [institutionId]
    );

    return parseInt(rows[0].total, 10);
  }
}
