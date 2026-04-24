import { getDatabasePool } from "@/modules/shared/config/database";
import { getEnvironment } from "@/modules/shared/config/env";
import { NotFoundError } from "@/modules/shared/errors/application-error";

export interface InstitutionRecord {
  code: string;
  id: string;
  name: string;
}

export class InstitutionRepository {
  public async getDefaultInstitution(): Promise<InstitutionRecord> {
    const { rows } = await getDatabasePool().query<InstitutionRecord>(
      `
        select id, code, name
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

    return institutionRecord;
  }
}
