import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

import { getEnvironment } from "@/modules/shared/config/env";
import { ConfigurationError } from "@/modules/shared/errors/application-error";

const FIELD_ENCRYPTION_PREFIX = "enc:v1";

function encodeBase64(inputBuffer: Buffer): string {
  return inputBuffer.toString("base64url");
}

function decodeBase64(inputValue: string): Buffer {
  return Buffer.from(inputValue, "base64url");
}

function getFieldEncryptionKey(): Buffer {
  const { DOCUMENT_MASTER_KEY, NODE_ENV, SESSION_SECRET } = getEnvironment();
  const sourceKey = DOCUMENT_MASTER_KEY ? Buffer.from(DOCUMENT_MASTER_KEY, "base64") : Buffer.from(SESSION_SECRET, "utf8");

  if (DOCUMENT_MASTER_KEY && sourceKey.length !== 32) {
    throw new ConfigurationError("DOCUMENT_MASTER_KEY must decode to exactly 32 bytes");
  }

  if (!DOCUMENT_MASTER_KEY && NODE_ENV === "production") {
    throw new ConfigurationError("DOCUMENT_MASTER_KEY is required for field-level encryption in production");
  }

  return createHash("sha256").update(sourceKey).update("trustanchor:field-encryption:v1").digest();
}

export function encryptFieldValue(plaintextValue: string): string {
  const initializationVector = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getFieldEncryptionKey(), initializationVector);
  const ciphertext = Buffer.concat([cipher.update(plaintextValue, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [FIELD_ENCRYPTION_PREFIX, encodeBase64(initializationVector), encodeBase64(tag), encodeBase64(ciphertext)].join(":");
}

export function decryptFieldValue(storedValue: string): string {
  if (!storedValue.startsWith(`${FIELD_ENCRYPTION_PREFIX}:`)) {
    return storedValue;
  }

  const [, , encodedInitializationVector, encodedTag, encodedCiphertext] = storedValue.split(":");

  if (!encodedInitializationVector || !encodedTag || !encodedCiphertext) {
    throw new ConfigurationError("Encrypted field value is malformed");
  }

  const decipher = createDecipheriv("aes-256-gcm", getFieldEncryptionKey(), decodeBase64(encodedInitializationVector));
  decipher.setAuthTag(decodeBase64(encodedTag));

  return Buffer.concat([decipher.update(decodeBase64(encodedCiphertext)), decipher.final()]).toString("utf8");
}
