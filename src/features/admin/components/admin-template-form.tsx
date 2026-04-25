"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createTemplateFormSchema = z.object({
  certificateType: z.string().min(1, "Certificate type is required"),
  layoutDefinition: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "Must be a valid JSON object" }),
  schemaVersion: z.string().min(1, "Schema version is required"),
  templateName: z.string().min(3, "Template name must be at least 3 characters")
});

type CreateTemplateFormValues = z.infer<typeof createTemplateFormSchema>;

export function AdminTemplateForm(): JSX.Element {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    formState: { errors },
    register,
    handleSubmit
  } = useForm<CreateTemplateFormValues>({
    defaultValues: {
      certificateType: "diploma",
      layoutDefinition: "{\n  \"fields\": []\n}",
      schemaVersion: "1.0.0",
      templateName: ""
    },
    resolver: zodResolver(createTemplateFormSchema)
  });

  async function onSubmit(formValues: CreateTemplateFormValues): Promise<void> {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        certificateType: formValues.certificateType,
        layoutDefinition: JSON.parse(formValues.layoutDefinition),
        schemaVersion: formValues.schemaVersion,
        templateName: formValues.templateName
      };

      const response = await fetch("/api/certificate-templates", {
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

        setErrorMessage(responseBody.error?.message ?? "Failed to create template");
        return;
      }

      router.push("/admin/templates");
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
            <span className="section-kicker">Template register</span>
            <h1 className="admin-page-title">Create Template</h1>
            <p className="body-copy">
              Define a new certificate template structure to be used for future issuances.
            </p>
          </div>
          <Link className="button button-tertiary" href="/admin/templates">
            Back to list
          </Link>
        </div>
      </header>

      <form className="access-frame evidence-sheet reveal-surface" onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "600px", margin: "0" }}>
        <span className="sheet-clamp">Template definition</span>
        
        <label className="field-block" htmlFor="templateName">
          <span className="field-label">Template Name</span>
          <input
            {...register("templateName")}
            aria-invalid={errors.templateName ? "true" : "false"}
            className="field-input"
            id="templateName"
            placeholder="e.g. University Degree 2026"
            type="text"
          />
          {errors.templateName ? <span className="field-error">{errors.templateName.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="certificateType">
          <span className="field-label">Certificate Type</span>
          <input
            {...register("certificateType")}
            aria-invalid={errors.certificateType ? "true" : "false"}
            className="field-input"
            id="certificateType"
            placeholder="e.g. diploma, certificate, transcript"
            type="text"
          />
          {errors.certificateType ? <span className="field-error">{errors.certificateType.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="schemaVersion">
          <span className="field-label">Schema Version</span>
          <input
            {...register("schemaVersion")}
            aria-invalid={errors.schemaVersion ? "true" : "false"}
            className="field-input"
            id="schemaVersion"
            placeholder="e.g. 1.0.0"
            type="text"
          />
          {errors.schemaVersion ? <span className="field-error">{errors.schemaVersion.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="layoutDefinition">
          <span className="field-label">Layout Definition (JSON)</span>
          <textarea
            {...register("layoutDefinition")}
            aria-invalid={errors.layoutDefinition ? "true" : "false"}
            className="field-input"
            id="layoutDefinition"
            rows={6}
            style={{ fontFamily: "monospace", resize: "vertical" }}
          />
          {errors.layoutDefinition ? <span className="field-error">{errors.layoutDefinition.message}</span> : null}
        </label>

        <div aria-live="polite" className="status-region">
          {errorMessage ? <div className="status-panel status-panel-danger">{errorMessage}</div> : null}
        </div>

        <button className="button button-primary button-block" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating..." : "Create template"}
        </button>
      </form>
    </div>
  );
}
