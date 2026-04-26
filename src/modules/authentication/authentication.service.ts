import { createHash, timingSafeEqual } from "node:crypto";

import { z } from "zod";

import { getEnvironment } from "@/modules/shared/config/env";
import { AuthenticationError, ConfigurationError } from "@/modules/shared/errors/application-error";

export const loginRequestSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export interface AuthenticatedAdministrator {
  id: string;
  role: "admin";
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

export class AuthenticationService {
  public async authenticateBootstrapAdmin(loginRequest: LoginRequest): Promise<AuthenticatedAdministrator> {
    const environment = getEnvironment();
    const expectedUsernameBuffer = Buffer.from(environment.BOOTSTRAP_ADMIN_USERNAME, "utf8");
    const providedUsernameBuffer = Buffer.from(loginRequest.username, "utf8");
    const expectedPasswordHash = resolveExpectedPasswordHash(environment.BOOTSTRAP_ADMIN_PASSWORD, environment.NODE_ENV);
    const expectedPasswordBuffer = Buffer.from(expectedPasswordHash, "utf8");
    const providedPasswordHash = hashPassword(loginRequest.password);
    const providedPasswordBuffer = Buffer.from(providedPasswordHash, "utf8");
    const isUsernameValid =
      expectedUsernameBuffer.length === providedUsernameBuffer.length &&
      timingSafeEqual(expectedUsernameBuffer, providedUsernameBuffer);
    const isPasswordValid =
      expectedPasswordBuffer.length === providedPasswordBuffer.length &&
      timingSafeEqual(expectedPasswordBuffer, providedPasswordBuffer);

    if (!isUsernameValid || !isPasswordValid) {
      throw new AuthenticationError("Invalid username or password");
    }

    return {
      id: "bootstrap-admin",
      role: "admin",
      username: loginRequest.username
    };
  }
}
