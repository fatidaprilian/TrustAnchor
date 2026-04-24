import { randomUUID } from "node:crypto";

import { getDatabasePool } from "@/modules/shared/config/database";

export interface CreateAuditLogRecordInput {
  action: string;
  actorId: string | null;
  detail: Record<string, unknown>;
  resourceId: string;
  resourceType: string;
}

export class AuditLogRepository {
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
