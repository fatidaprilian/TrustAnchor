import { createHash, timingSafeEqual } from "node:crypto";

import { z } from "zod";

import { getEnvironment } from "@/modules/shared/config/env";
import { AuthenticationError } from "@/modules/shared/errors/application-error";

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

export class AuthenticationService {
  public async authenticateBootstrapAdmin(loginRequest: LoginRequest): Promise<AuthenticatedAdministrator> {
    const environment = getEnvironment();
    const expectedUsernameBuffer = Buffer.from(environment.BOOTSTRAP_ADMIN_USERNAME, "utf8");
    const providedUsernameBuffer = Buffer.from(loginRequest.username, "utf8");
    
    // The environment password is now a hex string of the SHA-256 hash
    const expectedPasswordBuffer = Buffer.from(environment.BOOTSTRAP_ADMIN_PASSWORD, "utf8");
    
    // Hash the provided password to compare
    const providedPasswordHash = createHash("sha256").update(loginRequest.password).digest("hex");
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
