import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  MINIO_ENDPOINT: z.string().url(),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_BUCKET_NAME: z.string().min(1),
  SESSION_SECRET: z.string().min(32),
  DOCUMENT_MASTER_KEY: z.string().optional(),
  BOOTSTRAP_ADMIN_USERNAME: z.string().min(1),
  BOOTSTRAP_ADMIN_PASSWORD: z.string().min(8),
  SIGNATURE_PRIVATE_KEY_PEM: z.string().optional(),
  SIGNATURE_PUBLIC_KEY_PEM: z.string().optional(),
  DEFAULT_INSTITUTION_ID: z.string().min(1)
});

export type Environment = z.infer<typeof environmentSchema>;

let cachedEnvironment: Environment | null = null;

export function getEnvironment(): Environment {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }

  cachedEnvironment = environmentSchema.parse(process.env);
  return cachedEnvironment;
}
