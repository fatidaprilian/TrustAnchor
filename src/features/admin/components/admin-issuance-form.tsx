"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createIssuanceFormSchema = z.object({
  certificateNumber: z.string().min(3, "Certificate number is required"),
  issuedAt: z.string().datetime({ message: "Must be a valid ISO datetime (e.g. 2026-04-25T14:30:00Z)" }),
  publicClaims: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "Must be a valid JSON object" }),
  recipientIdentifier: z.string().min(3, "Recipient identifier is required"),
  recipientName: z.string().min(3, "Recipient name is required"),
  templateId: z.string().uuid("Please select a valid template")
});

type CreateIssuanceFormValues = z.infer<typeof createIssuanceFormSchema>;

interface TemplateRecord {
  id: string;
  templateName: string;
}

export function AdminIssuanceForm(): JSX.Element {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue
  } = useForm<CreateIssuanceFormValues>({
    defaultValues: {
      certificateNumber: "",
      issuedAt: new Date().toISOString(),
      publicClaims: "{\n  \"course\": \"\",\n  \"grade\": \"\"\n}",
      recipientIdentifier: "",
      recipientName: "",
      templateId: ""
    },
    resolver: zodResolver(createIssuanceFormSchema)
  });

  useEffect(() => {
    async function loadTemplates(): Promise<void> {
      try {
        const response = await fetch("/api/admin/templates?limit=100");
        if (response.ok) {
          const body = (await response.json()) as { data: TemplateRecord[] };
          setTemplates(body.data);
          if (body.data.length > 0) {
            setValue("templateId", body.data[0].id);
          }
        }
      } catch {
        setErrorMessage("Failed to load templates");
      } finally {
        setIsLoadingTemplates(false);
      }
    }
    void loadTemplates();
  }, [setValue]);

  async function onSubmit(formValues: CreateIssuanceFormValues): Promise<void> {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        certificateNumber: formValues.certificateNumber,
        issuedAt: formValues.issuedAt,
        publicClaims: JSON.parse(formValues.publicClaims),
        recipientIdentifier: formValues.recipientIdentifier,
        recipientName: formValues.recipientName,
        templateId: formValues.templateId
      };

      const response = await fetch("/api/certificate-issuances", {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        const responseBody = (await response.json()) as {
          error?: {
            message?: string;
          };
        };

        setErrorMessage(responseBody.error?.message ?? "Failed to issue certificate");
        return;
      }

      router.push("/admin/issuances");
      router.refresh();
    } catch {
      setErrorMessage("The service is unavailable right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="section-stack" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span className="section-kicker">Issuance ledger</span>
            <h1 className="admin-page-title">Issue Certificate</h1>
            <p className="body-copy">
              Create a new certificate issuance record tied to a specific template. Cryptographic proofs will be
              automatically generated and sealed.
            </p>
          </div>
          <Link className="button button-tertiary" href="/admin/issuances">
            Back to ledger
          </Link>
        </div>
      </header>

      <form className="access-frame evidence-sheet reveal-surface" onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "600px", margin: "0" }}>
        <span className="sheet-clamp">Issuance details</span>
        
        <label className="field-block" htmlFor="templateId">
          <span className="field-label">Template</span>
          <select
            {...register("templateId")}
            aria-invalid={errors.templateId ? "true" : "false"}
            className="field-input"
            disabled={isLoadingTemplates}
            id="templateId"
          >
            {isLoadingTemplates ? (
              <option value="">Loading templates...</option>
            ) : templates.length === 0 ? (
              <option value="">No templates available</option>
            ) : (
              templates.map((t) => (
                <option key={t.id} value={t.id}>{t.templateName}</option>
              ))
            )}
          </select>
          {errors.templateId ? <span className="field-error">{errors.templateId.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="recipientName">
          <span className="field-label">Recipient Name</span>
          <input
            {...register("recipientName")}
            aria-invalid={errors.recipientName ? "true" : "false"}
            className="field-input"
            id="recipientName"
            placeholder="e.g. John Doe"
            type="text"
          />
          {errors.recipientName ? <span className="field-error">{errors.recipientName.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="recipientIdentifier">
          <span className="field-label">Recipient Identifier</span>
          <input
            {...register("recipientIdentifier")}
            aria-invalid={errors.recipientIdentifier ? "true" : "false"}
            className="field-input"
            id="recipientIdentifier"
            placeholder="e.g. ID, Email, or Student Number"
            type="text"
          />
          {errors.recipientIdentifier ? <span className="field-error">{errors.recipientIdentifier.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="certificateNumber">
          <span className="field-label">Certificate Number</span>
          <input
            {...register("certificateNumber")}
            aria-invalid={errors.certificateNumber ? "true" : "false"}
            className="field-input"
            id="certificateNumber"
            placeholder="e.g. CERT-2026-0001"
            type="text"
          />
          {errors.certificateNumber ? <span className="field-error">{errors.certificateNumber.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="issuedAt">
          <span className="field-label">Issued At (ISO Datetime)</span>
          <input
            {...register("issuedAt")}
            aria-invalid={errors.issuedAt ? "true" : "false"}
            className="field-input"
            id="issuedAt"
            placeholder="e.g. 2026-04-25T14:30:00Z"
            type="text"
          />
          {errors.issuedAt ? <span className="field-error">{errors.issuedAt.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="publicClaims">
          <span className="field-label">Public Claims (JSON)</span>
          <textarea
            {...register("publicClaims")}
            aria-invalid={errors.publicClaims ? "true" : "false"}
            className="field-input"
            id="publicClaims"
            rows={5}
            style={{ fontFamily: "monospace", resize: "vertical" }}
          />
          {errors.publicClaims ? <span className="field-error">{errors.publicClaims.message}</span> : null}
        </label>

        <div aria-live="polite" className="status-region">
          {errorMessage ? <div className="status-panel status-panel-danger">{errorMessage}</div> : null}
        </div>

        <button className="button button-primary button-block" disabled={isSubmitting || templates.length === 0} type="submit">
          {isSubmitting ? "Issuing..." : "Issue certificate"}
        </button>
      </form>
    </div>
  );
}
