import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "trustanchor_session";

function applySecurityHeaders(response: NextResponse): NextResponse {
  const scriptDirectives =
    process.env.NODE_ENV === "development"
      ? "'self' 'unsafe-inline' 'unsafe-eval'"
      : "'self' 'unsafe-inline'";
  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self'",
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data: blob:",
    "object-src 'none'",
    `script-src ${scriptDirectives}`,
    "style-src 'self' 'unsafe-inline'"
  ];

  if (process.env.NODE_ENV === "production") {
    contentSecurityPolicy.push("upgrade-insecure-requests");
  }

  response.headers.set("Content-Security-Policy", contentSecurityPolicy.join("; "));
  response.headers.set("Permissions-Policy", "camera=(), geolocation=(), microphone=(), payment=(), usb=()");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");

  return response;
}

function redirectWithSecurityHeaders(url: URL): NextResponse {
  return applySecurityHeaders(NextResponse.redirect(url));
}

function getRoleHomePath(role: unknown): string | null {
  if (role === "platform_admin" || role === "admin") {
    return "/admin/institutions";
  }

  if (role === "institution_admin") {
    return "/admin";
  }

  return null;
}

function getSessionSecretForMiddleware(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    return new TextEncoder().encode("__middleware_skip_no_secret__padding_32_chars_min__");
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (pathname === "/login" && sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, getSessionSecretForMiddleware());
      const roleHomePath = getRoleHomePath(payload.role);

      if (roleHomePath) {
        return redirectWithSecurityHeaders(new URL(roleHomePath, request.url));
      }
    } catch {
      // invalid token, keep serving the public/login page
    }
  }

  if (pathname === "/login") {
    return applySecurityHeaders(NextResponse.next());
  }

  if (pathname.startsWith("/admin/institutions")) {
    if (sessionToken) {
      try {
        const { payload } = await jwtVerify(sessionToken, getSessionSecretForMiddleware());
        if (payload.role === "institution_admin") {
          return redirectWithSecurityHeaders(new URL("/admin", request.url));
        }
      } catch {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return redirectWithSecurityHeaders(loginUrl);
      }
    }
  }

  if (!pathname.startsWith("/admin")) {
    return applySecurityHeaders(NextResponse.next());
  }

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return redirectWithSecurityHeaders(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(sessionToken, getSessionSecretForMiddleware());

    if (payload.role !== "admin" && payload.role !== "platform_admin" && payload.role !== "institution_admin") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return redirectWithSecurityHeaders(loginUrl);
    }

    return applySecurityHeaders(NextResponse.next());
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return redirectWithSecurityHeaders(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
