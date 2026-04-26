import type { NextRequest } from "next/server";

import { getRedisClient } from "@/modules/shared/config/redis";
import { RateLimitError } from "@/modules/shared/errors/application-error";
import { logger } from "@/modules/shared/logging/logger";

interface RateLimitOptions {
  limit: number;
  scope: string;
  windowSeconds: number;
}

function getRequestIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function enforceRateLimit(request: NextRequest, options: RateLimitOptions): Promise<void> {
  const redisKey = `rate-limit:${options.scope}:${getRequestIp(request)}`;

  try {
    const redisClient = await getRedisClient();
    const requestCount = await redisClient.incr(redisKey);

    if (requestCount === 1) {
      await redisClient.expire(redisKey, options.windowSeconds);
    }

    if (requestCount > options.limit) {
      throw new RateLimitError();
    }
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }

    logger.error({ error, scope: options.scope }, "Rate limit check failed open");
  }
}
