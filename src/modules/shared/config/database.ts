import { Pool } from "pg";

import { getEnvironment } from "@/modules/shared/config/env";

declare global {
  var trustAnchorDatabasePool: Pool | undefined;
}

export function getDatabasePool(): Pool {
  if (!globalThis.trustAnchorDatabasePool) {
    globalThis.trustAnchorDatabasePool = new Pool({
      connectionString: getEnvironment().DATABASE_URL,
      max: 10
    });
  }

  return globalThis.trustAnchorDatabasePool;
}
