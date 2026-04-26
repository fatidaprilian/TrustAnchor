import { createHash } from "node:crypto";

import type {
  CreateInstitutionOperatorRequest,
  CreateInstitutionRequest,
  ResetInstitutionOperatorPasswordRequest,
  UpdateInstitutionRequest
} from "@/modules/institution/institution.dto";
import { InstitutionRepository, type InstitutionRecord } from "@/modules/institution/institution.repository";
import {
  InstitutionUserRepository,
  type PublicInstitutionUserRecord
} from "@/modules/institution/institution-user.repository";
import { AuditLogRepository } from "@/modules/audit-log/audit-log.repository";
import { ConflictError, NotFoundError } from "@/modules/shared/errors/application-error";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export class InstitutionService {
  private readonly auditLogRepository = new AuditLogRepository();

  private readonly institutionRepository = new InstitutionRepository();

  private readonly institutionUserRepository = new InstitutionUserRepository();

  public async listInstitutions(): Promise<InstitutionRecord[]> {
    return this.institutionRepository.findAll();
  }

  public async listInstitutionOperators(institutionId: string): Promise<PublicInstitutionUserRecord[]> {
    await this.requireInstitution(institutionId);

    return this.institutionUserRepository.findByInstitution(institutionId);
  }

  public async createInstitution(input: CreateInstitutionRequest, actorId: string): Promise<InstitutionRecord> {
    try {
      const createdInstitution = await this.institutionRepository.createInstitution({
        code: input.code.toUpperCase(),
        name: input.name
      });
      await this.institutionUserRepository.createInstitutionUser({
        institutionId: createdInstitution.id,
        passwordHash: hashPassword(input.adminPassword),
        username: input.adminUsername
      });

      await this.auditLogRepository.createAuditLogRecord({
        action: "institution.created",
        actorId,
        detail: {
          adminUsername: input.adminUsername,
          institutionCode: createdInstitution.code,
          institutionId: createdInstitution.id
        },
        resourceId: createdInstitution.id,
        resourceType: "institution"
      });

      return createdInstitution;
    } catch (error) {
      const isDuplicateError =
        error instanceof Error && "code" in error && typeof error.code === "string" && error.code === "23505";

      if (isDuplicateError) {
        throw new ConflictError("Institution code already exists");
      }

      throw error;
    }
  }

  public async updateInstitution(
    institutionId: string,
    input: UpdateInstitutionRequest,
    actorId: string
  ): Promise<InstitutionRecord> {
    try {
      const updatedInstitution = await this.institutionRepository.updateInstitution({
        code: input.code.toUpperCase(),
        institutionId,
        name: input.name
      });

      if (!updatedInstitution) {
        throw new NotFoundError("Institution was not found");
      }

      await this.auditLogRepository.createAuditLogRecord({
        action: "institution.updated",
        actorId,
        detail: {
          institutionCode: updatedInstitution.code,
          institutionId: updatedInstitution.id
        },
        resourceId: updatedInstitution.id,
        resourceType: "institution"
      });

      return updatedInstitution;
    } catch (error) {
      const isDuplicateError =
        error instanceof Error && "code" in error && typeof error.code === "string" && error.code === "23505";

      if (isDuplicateError) {
        throw new ConflictError("Institution code already exists");
      }

      throw error;
    }
  }

  public async createInstitutionOperator(
    institutionId: string,
    input: CreateInstitutionOperatorRequest,
    actorId: string
  ): Promise<PublicInstitutionUserRecord> {
    await this.requireInstitution(institutionId);

    try {
      const createdOperator = await this.institutionUserRepository.createInstitutionUser({
        institutionId,
        passwordHash: hashPassword(input.password),
        username: input.username
      });

      await this.auditLogRepository.createAuditLogRecord({
        action: "institution_operator.created",
        actorId,
        detail: {
          institutionId,
          operatorId: createdOperator.id,
          username: createdOperator.username
        },
        resourceId: createdOperator.id,
        resourceType: "institution_operator"
      });

      return {
        createdAt: createdOperator.createdAt,
        id: createdOperator.id,
        institutionCode: createdOperator.institutionCode,
        institutionId: createdOperator.institutionId,
        institutionName: createdOperator.institutionName,
        role: createdOperator.role,
        username: createdOperator.username
      };
    } catch (error) {
      const isDuplicateError =
        error instanceof Error && "code" in error && typeof error.code === "string" && error.code === "23505";

      if (isDuplicateError) {
        throw new ConflictError("Operator username already exists");
      }

      throw error;
    }
  }

  public async resetInstitutionOperatorPassword(
    institutionId: string,
    operatorId: string,
    input: ResetInstitutionOperatorPasswordRequest,
    actorId: string
  ): Promise<PublicInstitutionUserRecord> {
    await this.requireInstitution(institutionId);
    const updatedOperator = await this.institutionUserRepository.updatePassword(
      operatorId,
      institutionId,
      hashPassword(input.password)
    );

    if (!updatedOperator || updatedOperator.institutionId !== institutionId) {
      throw new NotFoundError("Institution operator was not found");
    }

    await this.auditLogRepository.createAuditLogRecord({
      action: "institution_operator.password_reset",
      actorId,
      detail: {
        institutionId,
        operatorId: updatedOperator.id,
        username: updatedOperator.username
      },
      resourceId: updatedOperator.id,
      resourceType: "institution_operator"
    });

    return updatedOperator;
  }

  private async requireInstitution(institutionId: string): Promise<InstitutionRecord> {
    const institution = await this.institutionRepository.findById(institutionId);

    if (!institution) {
      throw new NotFoundError("Institution was not found");
    }

    return institution;
  }
}
