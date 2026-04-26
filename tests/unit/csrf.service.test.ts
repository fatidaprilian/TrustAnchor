import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";

import { requireCsrfProtection } from "@/modules/shared/security/csrf.service";

describe("CSRF service", () => {
  test("should allow matching CSRF cookie and header", () => {
    const token = "test-csrf-token";
    const request = new NextRequest("http://localhost/api/certificate-templates", {
      headers: {
        cookie: `trustanchor_csrf=${token}`,
        "x-csrf-token": token
      }
    });

    expect(() => requireCsrfProtection(request)).not.toThrow();
  });

  test("should reject missing CSRF header", () => {
    const request = new NextRequest("http://localhost/api/certificate-templates", {
      headers: {
        cookie: "trustanchor_csrf=test-csrf-token"
      }
    });

    expect(() => requireCsrfProtection(request)).toThrow("CSRF token is missing");
  });
});
