import {
  createCipheriv,
  createDecipheriv,
  createHash,
  generateKeyPairSync,
  randomBytes
} from "node:crypto";

import { CompactSign, compactVerify, importPKCS8, importSPKI, type KeyLike } from "jose";

import { getEnvironment } from "@/modules/shared/config/env";
import { ConfigurationError } from "@/modules/shared/errors/application-error";

export interface DocumentProof {
  canonicalPayload: string;
  digitalSignature: string;
  documentHash: string;
  encryptedPayload: string;
  payloadIv: string;
  payloadTag: string;
  wrappedDocumentKey: string;
  wrappedKeyIv: string;
  wrappedKeyTag: string;
}

export interface StoredDocumentProof {
  digitalSignature: string;
  documentHash: string;
  encryptedPayload: string;
  payloadIv: string;
  payloadTag: string;
  wrappedDocumentKey: string;
  wrappedKeyIv: string;
  wrappedKeyTag: string;
}

export interface VerifiedDocumentProof<TPayload extends Record<string, unknown>> {
  canonicalPayload: TPayload;
  digitalSignatureVerified: boolean;
  documentHash: string;
}

type JsonRecord = Record<string, unknown>;

let cachedSigningKeys: { privateKey: KeyLike; publicKey: KeyLike } | null = null;

function getGlobalSigningKeyCache(): {
  __trustanchorSigningKeys?: { privateKey: KeyLike; publicKey: KeyLike };
} {
  return globalThis as typeof globalThis & {
    __trustanchorSigningKeys?: { privateKey: KeyLike; publicKey: KeyLike };
  };
}

function canonicalizeValue(inputValue: unknown): unknown {
  if (Array.isArray(inputValue)) {
    return inputValue.map((item) => canonicalizeValue(item));
  }

  if (inputValue && typeof inputValue === "object") {
    const sortedEntries = Object.entries(inputValue as JsonRecord)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .map(([entryKey, entryValue]) => [entryKey, canonicalizeValue(entryValue)]);

    return Object.fromEntries(sortedEntries);
  }

  return inputValue;
}

function encodeBase64(inputBuffer: Buffer): string {
  return inputBuffer.toString("base64");
}

function decodeBase64(inputValue: string): Buffer {
  return Buffer.from(inputValue, "base64");
}

function encryptBuffer(plaintextBuffer: Buffer, keyBuffer: Buffer): { ciphertext: string; iv: string; tag: string } {
  const initializationVector = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyBuffer, initializationVector);
  const encryptedBuffer = Buffer.concat([cipher.update(plaintextBuffer), cipher.final()]);
  const authenticationTag = cipher.getAuthTag();

  return {
    ciphertext: encodeBase64(encryptedBuffer),
    iv: encodeBase64(initializationVector),
    tag: encodeBase64(authenticationTag)
  };
}

function decryptBuffer(ciphertext: string, iv: string, tag: string, keyBuffer: Buffer): Buffer {
  const decipher = createDecipheriv("aes-256-gcm", keyBuffer, decodeBase64(iv));
  decipher.setAuthTag(decodeBase64(tag));

  return Buffer.concat([decipher.update(decodeBase64(ciphertext)), decipher.final()]);
}

function getMasterKey(): Buffer {
  const { DOCUMENT_MASTER_KEY, NODE_ENV, SESSION_SECRET } = getEnvironment();

  if (DOCUMENT_MASTER_KEY) {
    const masterKeyBuffer = decodeBase64(DOCUMENT_MASTER_KEY);

    if (masterKeyBuffer.length !== 32) {
      throw new ConfigurationError("DOCUMENT_MASTER_KEY must decode to exactly 32 bytes");
    }

    return masterKeyBuffer;
  }

  if (NODE_ENV === "production") {
    throw new ConfigurationError("DOCUMENT_MASTER_KEY is required in production");
  }

  return createHash("sha256").update(SESSION_SECRET).digest();
}

async function resolveSigningKeys(): Promise<{ privateKey: KeyLike; publicKey: KeyLike }> {
  if (cachedSigningKeys) {
    return cachedSigningKeys;
  }

  const globalSigningKeyCache = getGlobalSigningKeyCache();

  if (globalSigningKeyCache.__trustanchorSigningKeys) {
    cachedSigningKeys = globalSigningKeyCache.__trustanchorSigningKeys;
    return cachedSigningKeys;
  }

  const { SIGNATURE_PRIVATE_KEY_PEM, SIGNATURE_PUBLIC_KEY_PEM, NODE_ENV } = getEnvironment();

  if (SIGNATURE_PRIVATE_KEY_PEM && SIGNATURE_PUBLIC_KEY_PEM) {
    cachedSigningKeys = {
      privateKey: await importPKCS8(SIGNATURE_PRIVATE_KEY_PEM, "EdDSA"),
      publicKey: await importSPKI(SIGNATURE_PUBLIC_KEY_PEM, "EdDSA")
    };
    globalSigningKeyCache.__trustanchorSigningKeys = cachedSigningKeys;

    return cachedSigningKeys;
  }

  if (NODE_ENV === "production") {
    throw new ConfigurationError("Signature key material is required in production");
  }

  const generatedKeyPair = generateKeyPairSync("ed25519");
  const exportedPrivateKey = generatedKeyPair.privateKey.export({ format: "pem", type: "pkcs8" }).toString();
  const exportedPublicKey = generatedKeyPair.publicKey.export({ format: "pem", type: "spki" }).toString();

  cachedSigningKeys = {
    privateKey: await importPKCS8(exportedPrivateKey, "EdDSA"),
    publicKey: await importSPKI(exportedPublicKey, "EdDSA")
  };
  globalSigningKeyCache.__trustanchorSigningKeys = cachedSigningKeys;

  return cachedSigningKeys;
}

export function buildCanonicalPayloadString(payload: JsonRecord): string {
  return JSON.stringify(canonicalizeValue(payload));
}

export async function createDocumentProof(payload: JsonRecord): Promise<DocumentProof> {
  const canonicalPayload = buildCanonicalPayloadString(payload);
  const documentHash = createHash("sha256").update(canonicalPayload).digest("hex");
  const documentKey = randomBytes(32);
  const payloadEncryption = encryptBuffer(Buffer.from(canonicalPayload, "utf8"), documentKey);
  const wrappedDocumentKey = encryptBuffer(documentKey, getMasterKey());
  const signingKeys = await resolveSigningKeys();
  const digitalSignature = await new CompactSign(Buffer.from(documentHash, "utf8"))
    .setProtectedHeader({ alg: "EdDSA", typ: "JWT" })
    .sign(signingKeys.privateKey);

  return {
    canonicalPayload,
    digitalSignature,
    documentHash,
    encryptedPayload: payloadEncryption.ciphertext,
    payloadIv: payloadEncryption.iv,
    payloadTag: payloadEncryption.tag,
    wrappedDocumentKey: wrappedDocumentKey.ciphertext,
    wrappedKeyIv: wrappedDocumentKey.iv,
    wrappedKeyTag: wrappedDocumentKey.tag
  };
}

export async function verifyStoredDocumentProof<TPayload extends JsonRecord>(
  storedProof: StoredDocumentProof
): Promise<VerifiedDocumentProof<TPayload>> {
  const signingKeys = await resolveSigningKeys();
  const verifiedSignature = await compactVerify(storedProof.digitalSignature, signingKeys.publicKey);
  const signedHash = Buffer.from(verifiedSignature.payload).toString("utf8");

  if (signedHash !== storedProof.documentHash) {
    throw new ConfigurationError("Stored digital signature does not match the stored document hash");
  }

  const documentKey = decryptBuffer(
    storedProof.wrappedDocumentKey,
    storedProof.wrappedKeyIv,
    storedProof.wrappedKeyTag,
    getMasterKey()
  );
  const canonicalPayload = decryptBuffer(
    storedProof.encryptedPayload,
    storedProof.payloadIv,
    storedProof.payloadTag,
    documentKey
  ).toString("utf8");
  const recalculatedHash = createHash("sha256").update(canonicalPayload).digest("hex");

  if (recalculatedHash !== storedProof.documentHash) {
    throw new ConfigurationError("Stored proof hash does not match the decrypted payload");
  }

  return {
    canonicalPayload: JSON.parse(canonicalPayload) as TPayload,
    digitalSignatureVerified: true,
    documentHash: recalculatedHash
  };
}
