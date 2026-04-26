import { z } from "zod";

export const createCertificateTemplateSchema = z.object({
  certificateType: z.string().trim().min(1, "Certificate type is required"),
  layoutDefinition: z.record(z.unknown()),
  schemaVersion: z.string().trim().min(1, "Schema version is required"),
  templateName: z.string().trim().min(3, "Template name must be at least 3 characters")
});

export type CreateCertificateTemplateRequest = z.infer<typeof createCertificateTemplateSchema>;
