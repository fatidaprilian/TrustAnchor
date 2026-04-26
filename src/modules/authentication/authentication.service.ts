import { createHash, timingSafeEqual } from "node:crypto";
import { TextEncoder } from "node:util";

import { z } from "zod";

import { InstitutionRepository } from "@/modules/institution/institution.repository";
import { InstitutionUserRepository, type InstitutionUserRecord } from "@/modules/institution/institution-user.repository";
import { getEnvironment } from "@/modules/shared/config/env";
import { AuthenticationError, ConfigurationError } from "@/modules/shared/errors/application-error";
import type { AdminRole } from "@/modules/shared/security/session.service";

const textEncoder = new TextEncoder();

export const loginRequestSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export interface AuthenticatedAdministrator {
  id: string;
  institutionId: string;
  institutionName: string;
  role: AdminRole;
  username: string;
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function resolveExpectedPasswordHash(rawEnvironmentPassword: string, nodeEnvironment: string): string {
  const isSha256Hex = /^[a-f0-9]{64}$/i.test(rawEnvironmentPassword);

  if (isSha256Hex) {
    return rawEnvironmentPassword.toLowerCase();
  }

  if (nodeEnvironment === "production") {
    throw new ConfigurationError("BOOTSTRAP_ADMIN_PASSWORD must be a SHA-256 hex string in production");
  }

  return hashPassword(rawEnvironmentPassword);
}

function isHashMatch(expectedHash: string, providedPassword: string): boolean {
  const expectedPasswordBuffer = textEncoder.encode(expectedHash);
  const providedPasswordHash = hashPassword(providedPassword);
  const providedPasswordBuffer = textEncoder.encode(providedPasswordHash);

  return (
    expectedPasswordBuffer.length === providedPasswordBuffer.length &&
    timingSafeEqual(expectedPasswordBuffer, providedPasswordBuffer)
  );
}

export class AuthenticationService {
  private readonly institutionRepository = new InstitutionRepository();

  private readonly institutionUserRepository = new InstitutionUserRepository();

  public async authenticateAdministrator(loginRequest: LoginRequest): Promise<AuthenticatedAdministrator> {
    const bootstrapAdmin = await this.tryAuthenticateBootstrapAdmin(loginRequest);

    if (bootstrapAdmin) {
      return bootstrapAdmin;
    }

    const institutionUser = await this.institutionUserRepository.findByUsername(loginRequest.username);

    if (!institutionUser || !isHashMatch(institutionUser.passwordHash, loginRequest.password)) {
      throw new AuthenticationError("Invalid username or password");
    }

    return this.toAuthenticatedInstitutionAdmin(institutionUser);
  }

  public async authenticateBootstrapAdmin(loginRequest: LoginRequest): Promise<AuthenticatedAdministrator> {
    const bootstrapAdmin = await this.tryAuthenticateBootstrapAdmin(loginRequest);

    if (!bootstrapAdmin) {
      throw new AuthenticationError("Invalid username or password");
    }

    return bootstrapAdmin;
  }

  private async tryAuthenticateBootstrapAdmin(loginRequest: LoginRequest): Promise<AuthenticatedAdministrator | null> {
    const environment = getEnvironment();
    const expectedUsernameBuffer = textEncoder.encode(environment.BOOTSTRAP_ADMIN_USERNAME);
    const providedUsernameBuffer = textEncoder.encode(loginRequest.username);
    const expectedPasswordHash = resolveExpectedPasswordHash(environment.BOOTSTRAP_ADMIN_PASSWORD, environment.NODE_ENV);
    const isUsernameValid =
      expectedUsernameBuffer.length === providedUsernameBuffer.length &&
      timingSafeEqual(expectedUsernameBuffer, providedUsernameBuffer);
    const isPasswordValid = isHashMatch(expectedPasswordHash, loginRequest.password);

    if (!isUsernameValid || !isPasswordValid) {
      return null;
    }
    const defaultInstitution = await this.institutionRepository.getDefaultInstitution();

    return {
      id: "bootstrap-admin",
      institutionId: defaultInstitution.id,
      institutionName: defaultInstitution.name,
      role: "platform_admin",
      username: loginRequest.username
    };
  }

  private toAuthenticatedInstitutionAdmin(institutionUser: InstitutionUserRecord): AuthenticatedAdministrator {
    return {
      id: institutionUser.id,
      institutionId: institutionUser.institutionId,
      institutionName: institutionUser.institutionName,
      role: "institution_admin",
      username: institutionUser.username
    };
  }
}
