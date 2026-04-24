import { z } from "zod";

export const createCertificateIssuanceSchema = z.object({
  certificateNumber: z.string().min(3, "Certificate number is required"),
  issuedAt: z.string().datetime(),
  recipientIdentifier: z.string().min(3, "Recipient identifier is required"),
  recipientName: z.string().min(3, "Recipient name is required"),
  templateId: z.string().uuid("Template identifier must be a UUID")
});

export type CreateCertificateIssuanceRequest = z.infer<typeof createCertificateIssuanceSchema>;
