import { randomBytes, timingSafeEqual } from "node:crypto";

import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

import { AuthorizationError } from "@/modules/shared/errors/application-error";

const CSRF_COOKIE_NAME = "trustanchor_csrf";
const CSRF_HEADER_NAME = "x-csrf-token";

export function createCsrfToken(): string {
  return randomBytes(32).toString("base64url");
}

export function getCsrfCookieName(): string {
  return CSRF_COOKIE_NAME;
}

export function setCsrfCookie(response: NextResponse, token = createCsrfToken()): string {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return token;
}

export function requireCsrfProtection(request: NextRequest): void {
  const csrfCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const csrfHeader = request.headers.get(CSRF_HEADER_NAME);

  if (!csrfCookie || !csrfHeader) {
    throw new AuthorizationError("CSRF token is missing");
  }

  const cookieBuffer = Buffer.from(csrfCookie, "utf8");
  const headerBuffer = Buffer.from(csrfHeader, "utf8");
  const isTokenValid = cookieBuffer.length === headerBuffer.length && timingSafeEqual(cookieBuffer, headerBuffer);

  if (!isTokenValid) {
    throw new AuthorizationError("CSRF token is invalid");
  }
}
