"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createTemplateFormSchema = z.object({
  certificateType: z.string().min(1, "Certificate type is required"),
  academicYear: z.string().min(4, "Academic year is required"),
  achievementLabel: z.string().min(3, "Achievement label is required"),
  institutionDisplayName: z.string().min(3, "Institution name is required"),
  programName: z.string().min(3, "Program or course name is required"),
  signatoryName: z.string().min(3, "Signatory name is required"),
  signatoryTitle: z.string().min(3, "Signatory title is required"),
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
      academicYear: "2025/2026",
      achievementLabel: "Completion of academic requirements",
      certificateType: "academic-certificate",
      institutionDisplayName: "TrustAnchor Demo University",
      programName: "Cryptography Final Project",
      schemaVersion: "1.0.0",
      signatoryName: "Dr. Academic Reviewer",
      signatoryTitle: "Course Lecturer",
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
        layoutDefinition: {
          academicYear: formValues.academicYear,
          achievementLabel: formValues.achievementLabel,
          format: "academic-certificate-v1",
          institutionDisplayName: formValues.institutionDisplayName,
          programName: formValues.programName,
          signatoryName: formValues.signatoryName,
          signatoryTitle: formValues.signatoryTitle,
          verificationPlacement: "bottom-right",
          visibleFields: [
            "recipientName",
            "certificateNumber",
            "programName",
            "academicYear",
            "issuedAt",
            "verificationCode",
            "documentHash"
          ]
        },
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
              Define an academic certificate template without writing raw JSON.
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
          <select
            {...register("certificateType")}
            aria-invalid={errors.certificateType ? "true" : "false"}
            className="field-input"
            id="certificateType"
          >
            <option value="academic-certificate">Academic Certificate</option>
            <option value="course-completion">Course Completion</option>
            <option value="seminar-certificate">Seminar Certificate</option>
            <option value="transcript-proof">Transcript Proof</option>
          </select>
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

        <label className="field-block" htmlFor="institutionDisplayName">
          <span className="field-label">Institution Name</span>
          <input
            {...register("institutionDisplayName")}
            aria-invalid={errors.institutionDisplayName ? "true" : "false"}
            className="field-input"
            id="institutionDisplayName"
            placeholder="e.g. Universitas Contoh Indonesia"
            type="text"
          />
          {errors.institutionDisplayName ? <span className="field-error">{errors.institutionDisplayName.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="programName">
          <span className="field-label">Program or Course</span>
          <input
            {...register("programName")}
            aria-invalid={errors.programName ? "true" : "false"}
            className="field-input"
            id="programName"
            placeholder="e.g. Final Project - Cryptography"
            type="text"
          />
          {errors.programName ? <span className="field-error">{errors.programName.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="academicYear">
          <span className="field-label">Academic Year</span>
          <input
            {...register("academicYear")}
            aria-invalid={errors.academicYear ? "true" : "false"}
            className="field-input"
            id="academicYear"
            placeholder="e.g. 2025/2026"
            type="text"
          />
          {errors.academicYear ? <span className="field-error">{errors.academicYear.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="achievementLabel">
          <span className="field-label">Achievement Text</span>
          <input
            {...register("achievementLabel")}
            aria-invalid={errors.achievementLabel ? "true" : "false"}
            className="field-input"
            id="achievementLabel"
            placeholder="e.g. Has completed the final cryptography project"
            type="text"
          />
          {errors.achievementLabel ? <span className="field-error">{errors.achievementLabel.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="signatoryName">
          <span className="field-label">Signatory Name</span>
          <input
            {...register("signatoryName")}
            aria-invalid={errors.signatoryName ? "true" : "false"}
            className="field-input"
            id="signatoryName"
            placeholder="e.g. Dr. Nama Dosen"
            type="text"
          />
          {errors.signatoryName ? <span className="field-error">{errors.signatoryName.message}</span> : null}
        </label>

        <label className="field-block" htmlFor="signatoryTitle">
          <span className="field-label">Signatory Title</span>
          <input
            {...register("signatoryTitle")}
            aria-invalid={errors.signatoryTitle ? "true" : "false"}
            className="field-input"
            id="signatoryTitle"
            placeholder="e.g. Dosen Pengampu Mata Kuliah"
            type="text"
          />
          {errors.signatoryTitle ? <span className="field-error">{errors.signatoryTitle.message}</span> : null}
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
