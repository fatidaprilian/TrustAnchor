"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { withCsrfHeaders } from "@/features/admin/lib/csrf";

const createIssuanceFormSchema = z.object({
  certificateNumber: z.string().min(3, "Certificate number is required"),
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
        recipientIdentifier: formValues.recipientIdentifier,
        recipientName: formValues.recipientName,
        templateId: formValues.templateId
      };

      const response = await fetch("/api/certificate-issuances", {
        body: JSON.stringify(payload),
        headers: withCsrfHeaders({
          "Content-Type": "application/json"
        }),
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
              Create a certificate from an academic template. Public claims and cryptographic proofs are generated
              automatically.
            </p>
          </div>
          <Link className="button button-tertiary" href="/admin/issuances">
            Back to ledger
          </Link>
        </div>
      </header>

      <form className="access-frame register-surface reveal-surface" onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "600px", margin: "0" }}>
        <span className="register-tab">Issuance details</span>
        
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
