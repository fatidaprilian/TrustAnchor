import { z } from "zod";

export const createInstitutionSchema = z.object({
  adminPassword: z.string().min(8, "Initial operator password must be at least 8 characters"),
  adminUsername: z.string().trim().min(3, "Initial operator username is required"),
  code: z.string().trim().min(2, "Institution code is required").max(32, "Institution code is too long"),
  name: z.string().trim().min(3, "Institution name is required").max(160, "Institution name is too long")
});

export const updateInstitutionSchema = createInstitutionSchema.omit({
  adminPassword: true,
  adminUsername: true
});

export const createInstitutionOperatorSchema = z.object({
  password: z.string().min(8, "Operator password must be at least 8 characters"),
  username: z.string().trim().min(3, "Operator username is required")
});

export const resetInstitutionOperatorPasswordSchema = z.object({
  password: z.string().min(8, "Operator password must be at least 8 characters")
});

export type CreateInstitutionRequest = z.infer<typeof createInstitutionSchema>;
export type CreateInstitutionOperatorRequest = z.infer<typeof createInstitutionOperatorSchema>;
export type ResetInstitutionOperatorPasswordRequest = z.infer<typeof resetInstitutionOperatorPasswordSchema>;
export type UpdateInstitutionRequest = z.infer<typeof updateInstitutionSchema>;
