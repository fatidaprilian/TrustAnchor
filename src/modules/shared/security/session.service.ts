import { TextEncoder } from "node:util";

import { jwtVerify, SignJWT } from "jose";
import type { NextRequest } from "next/server";

import { getEnvironment } from "@/modules/shared/config/env";
import { AuthenticationError, AuthorizationError } from "@/modules/shared/errors/application-error";

const SESSION_COOKIE_NAME = "trustanchor_session";
const SESSION_DURATION_HOURS = "8h";

const sessionPayloadSchema = {
  role: "admin"
} as const;

export interface SessionPayload {
  sub: string;
  username: string;
  role: "admin";
}

function getSessionSecret(): Uint8Array {
  const { SESSION_SECRET } = getEnvironment();
  return new TextEncoder().encode(SESSION_SECRET);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    role: payload.role,
    username: payload.username
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION_HOURS)
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, getSessionSecret());

  if (payload.role !== sessionPayloadSchema.role || typeof payload.sub !== "string" || typeof payload.username !== "string") {
    throw new AuthenticationError("Session payload is invalid");
  }

  return {
    sub: payload.sub,
    username: payload.username,
    role: payload.role
  };
}

export async function requireAdminSession(request: NextRequest): Promise<SessionPayload> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    throw new AuthenticationError("Session cookie is missing");
  }

  const session = await verifySessionToken(token);

  if (session.role !== "admin") {
    throw new AuthorizationError();
  }

  return session;
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function getSessionCookieOptions(): {
  httpOnly: true;
  maxAge: number;
  path: string;
  sameSite: "lax";
  secure: boolean;
} {
  return {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secure: getEnvironment().NODE_ENV === "production"
  };
}
