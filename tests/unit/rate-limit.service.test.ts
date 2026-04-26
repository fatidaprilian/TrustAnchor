import { NextRequest } from "next/server";
import { describe, expect, test, vi } from "vitest";

const redisMocks = vi.hoisted(() => ({
  expire: vi.fn(),
  getRedisClient: vi.fn(),
  incr: vi.fn()
}));

vi.mock("@/modules/shared/config/redis", () => ({
  getRedisClient: redisMocks.getRedisClient
}));

vi.mock("@/modules/shared/logging/logger", () => ({
  logger: {
    error: vi.fn()
  }
}));

describe("rate limit service", () => {
  test("should increment and expire a fresh Redis bucket", async () => {
    redisMocks.incr.mockResolvedValueOnce(1);
    redisMocks.expire.mockResolvedValueOnce(1);
    redisMocks.getRedisClient.mockResolvedValueOnce({
      expire: redisMocks.expire,
      incr: redisMocks.incr
    });

    const { enforceRateLimit } = await import("@/modules/shared/security/rate-limit.service");
    const request = new NextRequest("http://localhost/api/auth/login", {
      headers: {
        "x-forwarded-for": "203.0.113.10"
      }
    });

    await expect(enforceRateLimit(request, { limit: 10, scope: "auth-login", windowSeconds: 60 })).resolves.toBeUndefined();
    expect(redisMocks.incr).toHaveBeenCalledWith("rate-limit:auth-login:203.0.113.10");
    expect(redisMocks.expire).toHaveBeenCalledWith("rate-limit:auth-login:203.0.113.10", 60);
  });

  test("should reject requests over the configured limit", async () => {
    redisMocks.incr.mockResolvedValueOnce(11);
    redisMocks.getRedisClient.mockResolvedValueOnce({
      expire: redisMocks.expire,
      incr: redisMocks.incr
    });

    const { enforceRateLimit } = await import("@/modules/shared/security/rate-limit.service");
    const request = new NextRequest("http://localhost/api/auth/login", {
      headers: {
        "x-forwarded-for": "203.0.113.11"
      }
    });

    await expect(enforceRateLimit(request, { limit: 10, scope: "auth-login", windowSeconds: 60 })).rejects.toThrow(
      "Too many requests"
    );
  });
});
