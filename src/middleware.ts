import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "trustanchor_session";

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

  if (pathname === "/login") {
    if (sessionToken) {
      try {
        const { payload } = await jwtVerify(sessionToken, getSessionSecretForMiddleware());
        if (payload.role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch {
        // invalid token, just continue to login page
      }
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(sessionToken, getSessionSecretForMiddleware());

    if (payload.role !== "admin") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/login"]
};
