import { randomUUID } from "node:crypto";

import { getDatabasePool } from "@/modules/shared/config/database";

export interface CreateAuditLogRecordInput {
  action: string;
  actorId: string | null;
  detail: Record<string, unknown>;
  resourceId: string;
  resourceType: string;
}

export interface AuditLogRecord {
  action: string;
  actorId: string | null;
  createdAt: string;
  detail: Record<string, unknown>;
  id: string;
  resourceId: string;
  resourceType: string;
}

interface AuditLogRow {
  action: string;
  actor_id: string | null;
  created_at: string;
  detail: Record<string, unknown>;
  id: string;
  resource_id: string;
  resource_type: string;
}

function mapAuditLogRow(row: AuditLogRow): AuditLogRecord {
  return {
    action: row.action,
    actorId: row.actor_id,
    createdAt: row.created_at,
    detail: row.detail,
    id: row.id,
    resourceId: row.resource_id,
    resourceType: row.resource_type
  };
}

export class AuditLogRepository {
  public async findRecentAuditLogsByInstitution(
    institutionId: string,
    limit: number,
    offset: number
  ): Promise<AuditLogRecord[]> {
    const { rows } = await getDatabasePool().query<AuditLogRow>(
      `
        select id, actor_id, action, resource_type, resource_id, detail, created_at
        from audit_logs
        where detail->>'institutionId' = $1
        order by created_at desc
        limit $2
        offset $3
      `,
      [institutionId, limit, offset]
    );

    return rows.map(mapAuditLogRow);
  }

  public async findRecentAuditLogs(limit: number, offset: number): Promise<AuditLogRecord[]> {
    const { rows } = await getDatabasePool().query<AuditLogRow>(
      `
        select id, actor_id, action, resource_type, resource_id, detail, created_at
        from audit_logs
        order by created_at desc
        limit $1
        offset $2
      `,
      [limit, offset]
    );

    return rows.map(mapAuditLogRow);
  }

  public async countAuditLogs(): Promise<number> {
    const { rows } = await getDatabasePool().query<{ total: string }>(
      `select count(*)::text as total from audit_logs`
    );

    return parseInt(rows[0].total, 10);
  }

  public async countAuditLogsByInstitution(institutionId: string): Promise<number> {
    const { rows } = await getDatabasePool().query<{ total: string }>(
      `select count(*)::text as total from audit_logs where detail->>'institutionId' = $1`,
      [institutionId]
    );

    return parseInt(rows[0].total, 10);
  }

  public async createAuditLogRecord(input: CreateAuditLogRecordInput): Promise<void> {
    await getDatabasePool().query(
      `
        insert into audit_logs (
          id,
          actor_id,
          action,
          resource_type,
          resource_id,
          detail,
          created_at
        )
        values ($1, $2, $3, $4, $5, $6::jsonb, now())
      `,
      [
        randomUUID(),
        input.actorId,
        input.action,
        input.resourceType,
        input.resourceId,
        JSON.stringify(input.detail)
      ]
    );
  }
}
