import { randomUUID } from "node:crypto";

import { getDatabasePool } from "@/modules/shared/config/database";
import type { AdminRole } from "@/modules/shared/security/session.service";

export interface InstitutionUserRecord {
  createdAt: string;
  id: string;
  institutionCode: string;
  institutionId: string;
  institutionName: string;
  passwordHash: string;
  role: AdminRole;
  username: string;
}

export interface CreateInstitutionUserInput {
  institutionId: string;
  passwordHash: string;
  username: string;
}

export interface PublicInstitutionUserRecord {
  createdAt: string;
  id: string;
  institutionCode: string;
  institutionId: string;
  institutionName: string;
  role: AdminRole;
  username: string;
}

interface InstitutionUserRow {
  created_at: string;
  id: string;
  institution_code: string;
  institution_id: string;
  institution_name: string;
  password_hash: string;
  role: AdminRole;
  username: string;
}

function mapInstitutionUserRow(row: InstitutionUserRow): InstitutionUserRecord {
  return {
    createdAt: row.created_at,
    id: row.id,
    institutionCode: row.institution_code,
    institutionId: row.institution_id,
    institutionName: row.institution_name,
    passwordHash: row.password_hash,
    role: row.role,
    username: row.username
  };
}

function toPublicInstitutionUserRecord(row: InstitutionUserRecord): PublicInstitutionUserRecord {
  return {
    createdAt: row.createdAt,
    id: row.id,
    institutionCode: row.institutionCode,
    institutionId: row.institutionId,
    institutionName: row.institutionName,
    role: row.role,
    username: row.username
  };
}

export class InstitutionUserRepository {
  private async ensureSchema(): Promise<void> {
    await getDatabasePool().query(`
      create table if not exists institution_users (
        id text primary key,
        institution_id text not null references institutions(id),
        username text not null unique,
        password_hash text not null,
        role text not null default 'institution_admin',
        created_at timestamptz not null default now()
      )
    `);
    await getDatabasePool().query(`
      create index if not exists institution_users_institution_created_at_idx
      on institution_users (institution_id, created_at desc)
    `);
  }

  public async createInstitutionUser(input: CreateInstitutionUserInput): Promise<InstitutionUserRecord> {
    await this.ensureSchema();

    const { rows } = await getDatabasePool().query<InstitutionUserRow>(
      `
        with created_user as (
          insert into institution_users (id, institution_id, username, password_hash, role, created_at)
          values ($1, $2, $3, $4, 'institution_admin', now())
          returning id, institution_id, username, password_hash, role, created_at
        )
        select
          created_user.id,
          created_user.institution_id,
          institutions.code as institution_code,
          institutions.name as institution_name,
          created_user.username,
          created_user.password_hash,
          created_user.role,
          created_user.created_at
        from created_user
        join institutions on institutions.id = created_user.institution_id
      `,
      [randomUUID(), input.institutionId, input.username, input.passwordHash]
    );

    return mapInstitutionUserRow(rows[0]);
  }

  public async findByInstitution(institutionId: string): Promise<PublicInstitutionUserRecord[]> {
    await this.ensureSchema();

    const { rows } = await getDatabasePool().query<InstitutionUserRow>(
      `
        select
          institution_users.id,
          institution_users.institution_id,
          institutions.code as institution_code,
          institutions.name as institution_name,
          institution_users.username,
          institution_users.password_hash,
          institution_users.role,
          institution_users.created_at
        from institution_users
        join institutions on institutions.id = institution_users.institution_id
        where institution_users.institution_id = $1
        order by institution_users.created_at desc
      `,
      [institutionId]
    );

    return rows.map((row) => toPublicInstitutionUserRecord(mapInstitutionUserRow(row)));
  }

  public async findByUsername(username: string): Promise<InstitutionUserRecord | null> {
    await this.ensureSchema();

    const { rows } = await getDatabasePool().query<InstitutionUserRow>(
      `
        select
          institution_users.id,
          institution_users.institution_id,
          institutions.code as institution_code,
          institutions.name as institution_name,
          institution_users.username,
          institution_users.password_hash,
          institution_users.role,
          institution_users.created_at
        from institution_users
        join institutions on institutions.id = institution_users.institution_id
        where institution_users.username = $1
        limit 1
      `,
      [username]
    );

    const userRow = rows[0];
    return userRow ? mapInstitutionUserRow(userRow) : null;
  }

  public async updatePassword(
    operatorId: string,
    institutionId: string,
    passwordHash: string
  ): Promise<PublicInstitutionUserRecord | null> {
    await this.ensureSchema();

    const { rows } = await getDatabasePool().query<InstitutionUserRow>(
      `
        with updated_user as (
          update institution_users
          set password_hash = $3
          where id = $1 and institution_id = $2
          returning id, institution_id, username, password_hash, role, created_at
        )
        select
          updated_user.id,
          updated_user.institution_id,
          institutions.code as institution_code,
          institutions.name as institution_name,
          updated_user.username,
          updated_user.password_hash,
          updated_user.role,
          updated_user.created_at
        from updated_user
        join institutions on institutions.id = updated_user.institution_id
      `,
      [operatorId, institutionId, passwordHash]
    );

    const userRow = rows[0];
    return userRow ? toPublicInstitutionUserRecord(mapInstitutionUserRow(userRow)) : null;
  }
}
