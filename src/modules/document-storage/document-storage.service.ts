import * as Minio from "minio";

import { getEnvironment } from "@/modules/shared/config/env";

let cachedMinioClient: Minio.Client | null = null;

function getMinioClient(): Minio.Client {
  if (cachedMinioClient) {
    return cachedMinioClient;
  }

  const { MINIO_ACCESS_KEY, MINIO_ENDPOINT, MINIO_SECRET_KEY } = getEnvironment();
  const endpointUrl = new URL(MINIO_ENDPOINT);

  cachedMinioClient = new Minio.Client({
    accessKey: MINIO_ACCESS_KEY,
    endPoint: endpointUrl.hostname,
    port: endpointUrl.port ? parseInt(endpointUrl.port, 10) : undefined,
    secretKey: MINIO_SECRET_KEY,
    useSSL: endpointUrl.protocol === "https:"
  });

  return cachedMinioClient;
}

export class DocumentStorageService {
  public async storeCertificatePdf(verificationCode: string, pdfBytes: Uint8Array): Promise<string> {
    const { MINIO_BUCKET_NAME } = getEnvironment();
    const objectName = `certificate-artifacts/${verificationCode}.pdf`;
    const pdfBuffer = Buffer.from(pdfBytes);

    await getMinioClient().putObject(MINIO_BUCKET_NAME, objectName, pdfBuffer, pdfBuffer.length, {
      "Content-Type": "application/pdf",
      "X-Amz-Meta-Verification-Code": verificationCode
    });

    return objectName;
  }
}
