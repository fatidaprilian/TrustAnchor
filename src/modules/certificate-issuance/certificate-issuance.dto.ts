import { z } from "zod";

export const createCertificateIssuanceSchema = z.object({
  certificateNumber: z.string().trim().min(3, "Certificate number is required"),
  recipientIdentifier: z.string().trim().min(3, "Recipient identifier is required"),
  recipientName: z.string().trim().min(3, "Recipient name is required"),
  templateId: z.string().uuid("Template identifier must be a UUID")
});

export type CreateCertificateIssuanceRequest = z.infer<typeof createCertificateIssuanceSchema>;
