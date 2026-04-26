import { createClient, type RedisClientType } from "redis";

import { getEnvironment } from "@/modules/shared/config/env";
import { logger } from "@/modules/shared/logging/logger";

declare global {
  var trustAnchorRedisClient: RedisClientType | undefined;
}

export async function getRedisClient(): Promise<RedisClientType> {
  if (!globalThis.trustAnchorRedisClient) {
    const redisClient = createClient({
      url: getEnvironment().REDIS_URL
    });

    redisClient.on("error", (error) => {
      logger.error({ error }, "Redis client error");
    });

    globalThis.trustAnchorRedisClient = redisClient as RedisClientType;
  }

  if (!globalThis.trustAnchorRedisClient.isOpen) {
    await globalThis.trustAnchorRedisClient.connect();
  }

  return globalThis.trustAnchorRedisClient;
}
