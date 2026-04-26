import { randomUUID } from "node:crypto";

import { getDatabasePool } from "@/modules/shared/config/database";
import { decryptFieldValue, encryptFieldValue } from "@/modules/shared/security/field-encryption.service";

export interface CertificateIssuanceRecord {
  certificateNumber: string;
  createdAt: string;
  digitalSignature: string;
  documentHash: string;
  encryptedPayload: string;
  id: string;
  institutionId: string;
  issuedAt: string;
  payloadIv: string;
  payloadTag: string;
  publicClaims: Record<string, unknown>;
  recipientIdentifier: string;
  recipientName: string;
  status: string;
  templateId: string;
  verificationCode: string;
  wrappedDocumentKey: string;
  wrappedKeyIv: string;
  wrappedKeyTag: string;
}

export interface CreateCertificateIssuanceInput {
  certificateNumber: string;
  digitalSignature: string;
  documentHash: string;
  encryptedPayload: string;
  institutionId: string;
  issuedAt: string;
  payloadIv: string;
  payloadTag: string;
  publicClaims: Record<string, unknown>;
  recipientIdentifier: string;
  recipientName: string;
  status: string;
  templateId: string;
  verificationCode: string;
  wrappedDocumentKey: string;
  wrappedKeyIv: string;
  wrappedKeyTag: string;
}

interface CertificateIssuanceRow {
  certificate_number: string;
  created_at: string;
  digital_signature: string;
  document_hash: string;
  encrypted_payload: string;
  id: string;
  institution_id: string;
  issued_at: string;
  payload_iv: string;
  payload_tag: string;
  public_claims: Record<string, unknown>;
  recipient_identifier: string;
  recipient_name: string;
  status: string;
  template_id: string;
  verification_code: string;
  wrapped_document_key: string;
  wrapped_key_iv: string;
  wrapped_key_tag: string;
}

function mapCertificateIssuanceRow(row: CertificateIssuanceRow): CertificateIssuanceRecord {
  return {
    certificateNumber: row.certificate_number,
    createdAt: row.created_at,
    digitalSignature: row.digital_signature,
    documentHash: row.document_hash,
    encryptedPayload: row.encrypted_payload,
    id: row.id,
    institutionId: row.institution_id,
    issuedAt: row.issued_at,
    payloadIv: row.payload_iv,
    payloadTag: row.payload_tag,
    publicClaims: row.public_claims,
    recipientIdentifier: decryptFieldValue(row.recipient_identifier),
    recipientName: row.recipient_name,
    status: row.status,
    templateId: row.template_id,
    verificationCode: row.verification_code,
    wrappedDocumentKey: row.wrapped_document_key,
    wrappedKeyIv: row.wrapped_key_iv,
    wrappedKeyTag: row.wrapped_key_tag
  };
}

export class CertificateIssuanceRepository {
  public async createIssuance(input: CreateCertificateIssuanceInput): Promise<CertificateIssuanceRecord> {
    const { rows } = await getDatabasePool().query<CertificateIssuanceRow>(
      `
        insert into certificate_issuances (
          id,
          institution_id,
          template_id,
          verification_code,
          certificate_number,
          recipient_name,
          recipient_identifier,
          issued_at,
          document_hash,
          digital_signature,
          encrypted_payload,
          payload_iv,
          payload_tag,
          wrapped_document_key,
          wrapped_key_iv,
          wrapped_key_tag,
          public_claims,
          status,
          created_at
        )
        values (
          $1, $2, $3, $4, $5, $6, $7, $8::timestamptz, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, $18, now()
        )
        returning
          id,
          institution_id,
          template_id,
          verification_code,
          certificate_number,
          recipient_name,
          recipient_identifier,
          issued_at,
          document_hash,
          digital_signature,
          encrypted_payload,
          payload_iv,
          payload_tag,
          wrapped_document_key,
          wrapped_key_iv,
          wrapped_key_tag,
          public_claims,
          status,
          created_at
      `,
      [
        randomUUID(),
        input.institutionId,
        input.templateId,
        input.verificationCode,
        input.certificateNumber,
        input.recipientName,
        encryptFieldValue(input.recipientIdentifier),
        input.issuedAt,
        input.documentHash,
        input.digitalSignature,
        input.encryptedPayload,
        input.payloadIv,
        input.payloadTag,
        input.wrappedDocumentKey,
        input.wrappedKeyIv,
        input.wrappedKeyTag,
        JSON.stringify(input.publicClaims),
        input.status
      ]
    );

    return mapCertificateIssuanceRow(rows[0]);
  }

  public async findByVerificationCode(verificationCode: string): Promise<CertificateIssuanceRecord | null> {
    const { rows } = await getDatabasePool().query<CertificateIssuanceRow>(
      `
        select
          id,
          institution_id,
          template_id,
          verification_code,
          certificate_number,
          recipient_name,
          recipient_identifier,
          issued_at,
          document_hash,
          digital_signature,
          encrypted_payload,
          payload_iv,
          payload_tag,
          wrapped_document_key,
          wrapped_key_iv,
          wrapped_key_tag,
          public_claims,
          status,
          created_at
        from certificate_issuances
        where verification_code = $1
        limit 1
      `,
      [verificationCode]
    );

    const issuanceRow = rows[0];
    return issuanceRow ? mapCertificateIssuanceRow(issuanceRow) : null;
  }

  public async findById(issuanceId: string): Promise<CertificateIssuanceRecord | null> {
    const { rows } = await getDatabasePool().query<CertificateIssuanceRow>(
      `
        select
          id,
          institution_id,
          template_id,
          verification_code,
          certificate_number,
          recipient_name,
          recipient_identifier,
          issued_at,
          document_hash,
          digital_signature,
          encrypted_payload,
          payload_iv,
          payload_tag,
          wrapped_document_key,
          wrapped_key_iv,
          wrapped_key_tag,
          public_claims,
          status,
          created_at
        from certificate_issuances
        where id = $1
        limit 1
      `,
      [issuanceId]
    );

    const issuanceRow = rows[0];
    return issuanceRow ? mapCertificateIssuanceRow(issuanceRow) : null;
  }

  public async updateIssuanceStatus(issuanceId: string, status: string): Promise<CertificateIssuanceRecord> {
    const { rows } = await getDatabasePool().query<CertificateIssuanceRow>(
      `
        update certificate_issuances
        set status = $2
        where id = $1
        returning
          id,
          institution_id,
          template_id,
          verification_code,
          certificate_number,
          recipient_name,
          recipient_identifier,
          issued_at,
          document_hash,
          digital_signature,
          encrypted_payload,
          payload_iv,
          payload_tag,
          wrapped_document_key,
          wrapped_key_iv,
          wrapped_key_tag,
          public_claims,
          status,
          created_at
      `,
      [issuanceId, status]
    );

    return mapCertificateIssuanceRow(rows[0]);
  }

  public async findIssuancesByInstitution(
    institutionId: string,
    limit: number,
    offset: number
  ): Promise<CertificateIssuanceRecord[]> {
    const { rows } = await getDatabasePool().query<CertificateIssuanceRow>(
      `
        select
          id, institution_id, template_id, verification_code,
          certificate_number, recipient_name, recipient_identifier,
          issued_at, document_hash, digital_signature, encrypted_payload,
          payload_iv, payload_tag, wrapped_document_key, wrapped_key_iv,
          wrapped_key_tag, public_claims, status, created_at
        from certificate_issuances
        where institution_id = $1
        order by created_at desc
        limit $2
        offset $3
      `,
      [institutionId, limit, offset]
    );

    return rows.map(mapCertificateIssuanceRow);
  }

  public async countIssuancesByInstitution(institutionId: string): Promise<number> {
    const { rows } = await getDatabasePool().query<{ total: string }>(
      `select count(*)::text as total from certificate_issuances where institution_id = $1`,
      [institutionId]
    );

    return parseInt(rows[0].total, 10);
  }
}
