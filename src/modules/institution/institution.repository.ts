import { randomUUID } from "node:crypto";

import { getDatabasePool } from "@/modules/shared/config/database";
import { getEnvironment } from "@/modules/shared/config/env";
import { NotFoundError } from "@/modules/shared/errors/application-error";

export interface InstitutionRecord {
  code: string;
  createdAt: string;
  id: string;
  name: string;
}

export interface CreateInstitutionInput {
  code: string;
  name: string;
}

export interface UpdateInstitutionInput {
  code: string;
  institutionId: string;
  name: string;
}

interface InstitutionRow {
  code: string;
  created_at: string;
  id: string;
  name: string;
}

function mapInstitutionRow(row: InstitutionRow): InstitutionRecord {
  return {
    code: row.code,
    createdAt: row.created_at,
    id: row.id,
    name: row.name
  };
}

export class InstitutionRepository {
  public async getDefaultInstitution(): Promise<InstitutionRecord> {
    const { rows } = await getDatabasePool().query<InstitutionRow>(
      `
        select id, code, name, created_at
        from institutions
        where id = $1
        limit 1
      `,
      [getEnvironment().DEFAULT_INSTITUTION_ID]
    );

    const institutionRecord = rows[0];

    if (!institutionRecord) {
      throw new NotFoundError("Default institution is not seeded");
    }

    return mapInstitutionRow(institutionRecord);
  }

  public async findById(institutionId: string): Promise<InstitutionRecord | null> {
    const { rows } = await getDatabasePool().query<InstitutionRow>(
      `
        select id, code, name, created_at
        from institutions
        where id = $1
        limit 1
      `,
      [institutionId]
    );

    const institutionRow = rows[0];
    return institutionRow ? mapInstitutionRow(institutionRow) : null;
  }

  public async findAll(): Promise<InstitutionRecord[]> {
    const { rows } = await getDatabasePool().query<InstitutionRow>(
      `
        select id, code, name, created_at
        from institutions
        order by created_at desc
      `
    );

    return rows.map(mapInstitutionRow);
  }

  public async createInstitution(input: CreateInstitutionInput): Promise<InstitutionRecord> {
    const { rows } = await getDatabasePool().query<InstitutionRow>(
      `
        insert into institutions (id, code, name, created_at)
        values ($1, $2, $3, now())
        returning id, code, name, created_at
      `,
      [randomUUID(), input.code, input.name]
    );

    return mapInstitutionRow(rows[0]);
  }

  public async updateInstitution(input: UpdateInstitutionInput): Promise<InstitutionRecord | null> {
    const { rows } = await getDatabasePool().query<InstitutionRow>(
      `
        update institutions
        set code = $2, name = $3
        where id = $1
        returning id, code, name, created_at
      `,
      [input.institutionId, input.code, input.name]
    );

    const institutionRow = rows[0];
    return institutionRow ? mapInstitutionRow(institutionRow) : null;
  }
}
