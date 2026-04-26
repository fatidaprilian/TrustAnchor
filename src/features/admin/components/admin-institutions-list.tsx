"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { withCsrfHeaders } from "@/features/admin/lib/csrf";

const institutionFormSchema = z.object({
  adminPassword: z.string().min(8, "Initial operator password must be at least 8 characters"),
  adminUsername: z.string().min(3, "Initial operator username is required"),
  code: z.string().min(2, "Code is required").max(32, "Code is too long"),
  name: z.string().min(3, "Name is required").max(160, "Name is too long")
});

type InstitutionFormValues = z.infer<typeof institutionFormSchema>;

interface InstitutionRecord {
  code: string;
  createdAt: string;
  id: string;
  name: string;
}

interface InstitutionOperatorRecord {
  createdAt: string;
  id: string;
  role: string;
  username: string;
}

export function AdminInstitutionsList(): JSX.Element {
  const [institutions, setInstitutions] = useState<InstitutionRecord[]>([]);
  const [operators, setOperators] = useState<InstitutionOperatorRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOperatorPassword, setNewOperatorPassword] = useState("");
  const [newOperatorUsername, setNewOperatorUsername] = useState("");
  const [resetPasswords, setResetPasswords] = useState<Record<string, string>>({});
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<InstitutionFormValues>({
    defaultValues: {
      adminPassword: "",
      adminUsername: "",
      code: "",
      name: ""
    },
    resolver: zodResolver(institutionFormSchema)
  });

  const loadInstitutions = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/admin/institutions");
      if (!response.ok) {
        setErrorMessage("Failed to load institutions");
        return;
      }
      const body = (await response.json()) as { data: InstitutionRecord[] };
      setInstitutions(body.data);
      setSelectedInstitutionId((currentValue) => currentValue ?? body.data[0]?.id ?? null);
    } catch {
      setErrorMessage("Institution service is unavailable");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadOperators = useCallback(async (institutionId: string) => {
    setIsLoadingOperators(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/admin/institutions/${encodeURIComponent(institutionId)}/operators`);
      if (!response.ok) {
        setErrorMessage("Failed to load institution operators");
        return;
      }
      const body = (await response.json()) as { data: InstitutionOperatorRecord[] };
      setOperators(body.data);
    } catch {
      setErrorMessage("Operator service is unavailable");
    } finally {
      setIsLoadingOperators(false);
    }
  }, []);

  useEffect(() => {
    void loadInstitutions();
  }, [loadInstitutions]);

  useEffect(() => {
    if (selectedInstitutionId) {
      void loadOperators(selectedInstitutionId);
    }
  }, [loadOperators, selectedInstitutionId]);

  async function onSubmit(formValues: InstitutionFormValues): Promise<void> {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/admin/institutions", {
        body: JSON.stringify(formValues),
        headers: withCsrfHeaders({
          "Content-Type": "application/json"
        }),
        method: "POST"
      });

      if (!response.ok) {
        const responseBody = (await response.json()) as { error?: { message?: string } };
        setErrorMessage(responseBody.error?.message ?? "Failed to create institution");
        return;
      }

      reset();
      await loadInstitutions();
    } catch {
      setErrorMessage("Institution service is unavailable");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function createOperator(): Promise<void> {
    if (!selectedInstitutionId || newOperatorUsername.trim().length < 3 || newOperatorPassword.length < 8) {
      setErrorMessage("Operator username and password are required");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/admin/institutions/${encodeURIComponent(selectedInstitutionId)}/operators`, {
        body: JSON.stringify({
          password: newOperatorPassword,
          username: newOperatorUsername
        }),
        headers: withCsrfHeaders({
          "Content-Type": "application/json"
        }),
        method: "POST"
      });

      if (!response.ok) {
        const responseBody = (await response.json()) as { error?: { message?: string } };
        setErrorMessage(responseBody.error?.message ?? "Failed to create operator");
        return;
      }

      setNewOperatorPassword("");
      setNewOperatorUsername("");
      await loadOperators(selectedInstitutionId);
    } catch {
      setErrorMessage("Operator service is unavailable");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resetOperatorPassword(operatorId: string): Promise<void> {
    if (!selectedInstitutionId || !resetPasswords[operatorId] || resetPasswords[operatorId].length < 8) {
      setErrorMessage("Reset password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/admin/institutions/${encodeURIComponent(selectedInstitutionId)}/operators/${encodeURIComponent(operatorId)}/password`,
        {
          body: JSON.stringify({
            password: resetPasswords[operatorId]
          }),
          headers: withCsrfHeaders({
            "Content-Type": "application/json"
          }),
          method: "PATCH"
        }
      );

      if (!response.ok) {
        const responseBody = (await response.json()) as { error?: { message?: string } };
        setErrorMessage(responseBody.error?.message ?? "Failed to reset operator password");
        return;
      }

      setResetPasswords((currentValue) => ({
        ...currentValue,
        [operatorId]: ""
      }));
      await loadOperators(selectedInstitutionId);
    } catch {
      setErrorMessage("Operator service is unavailable");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedInstitution = institutions.find((institution) => institution.id === selectedInstitutionId) ?? null;

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="section-stack">
          <span className="section-kicker">Platform scope</span>
          <h1 className="admin-page-title">Institutions</h1>
          <p className="body-copy">
            Manage issuing institutions and their internal operator accounts. Platform admins create workspaces;
            institution operators sign in with their own credentials and only see their institution data.
          </p>
        </div>
      </header>

      <form className="access-frame evidence-sheet reveal-surface" onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "620px", margin: "0 0 1.5rem" }}>
        <span className="sheet-clamp">New institution</span>
        <label className="field-block" htmlFor="code">
          <span className="field-label">Institution Code</span>
          <input {...register("code")} aria-invalid={errors.code ? "true" : "false"} className="field-input" id="code" placeholder="e.g. UNIV-DEMO" type="text" />
          {errors.code ? <span className="field-error">{errors.code.message}</span> : null}
        </label>
        <label className="field-block" htmlFor="name">
          <span className="field-label">Institution Name</span>
          <input {...register("name")} aria-invalid={errors.name ? "true" : "false"} className="field-input" id="name" placeholder="e.g. Demo University" type="text" />
          {errors.name ? <span className="field-error">{errors.name.message}</span> : null}
        </label>
        <label className="field-block" htmlFor="adminUsername">
          <span className="field-label">Initial Operator Username</span>
          <input
            {...register("adminUsername")}
            aria-invalid={errors.adminUsername ? "true" : "false"}
            autoCapitalize="none"
            className="field-input"
            id="adminUsername"
            placeholder="e.g. demo-operator"
            type="text"
          />
          {errors.adminUsername ? <span className="field-error">{errors.adminUsername.message}</span> : null}
        </label>
        <label className="field-block" htmlFor="adminPassword">
          <span className="field-label">Initial Operator Password</span>
          <input
            {...register("adminPassword")}
            aria-invalid={errors.adminPassword ? "true" : "false"}
            autoComplete="new-password"
            className="field-input"
            id="adminPassword"
            placeholder="At least 8 characters"
            type="password"
          />
          {errors.adminPassword ? <span className="field-error">{errors.adminPassword.message}</span> : null}
        </label>
        <button className="button button-primary button-block" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating..." : "Create institution"}
        </button>
      </form>

      {errorMessage ? (
        <div className="status-panel status-panel-danger">{errorMessage}</div>
      ) : isLoading ? (
        <div className="admin-page-loading">
          <div className="admin-loading-pulse" />
          <span>Loading institutions...</span>
        </div>
      ) : (
        <section className="admin-data-section evidence-sheet reveal-surface" aria-label="Institution records">
          <span className="sheet-clamp">Institution records</span>
          <div className="admin-evidence-table">
            <div className="admin-table-header-row admin-table-5col">
              <span>Name</span>
              <span>Code</span>
              <span>Identifier</span>
              <span>Created</span>
              <span>Action</span>
            </div>
            {institutions.map((institution) => (
              <div className="admin-table-row admin-table-5col" key={institution.id}>
                <strong>{institution.name}</strong>
                <code>{institution.code}</code>
                <code>{institution.id}</code>
                <span className="admin-timestamp">{new Date(institution.createdAt).toLocaleDateString("en-GB")}</span>
                <button
                  className="admin-inline-action"
                  onClick={() => setSelectedInstitutionId(institution.id)}
                  type="button"
                >
                  Operators
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedInstitution ? (
        <section className="admin-data-section evidence-sheet reveal-surface" aria-label="Institution operators" style={{ marginTop: "1.5rem" }}>
          <span className="sheet-clamp">Operator accounts</span>
          <div className="admin-recent-header">
            <h2 className="panel-title">{selectedInstitution.name}</h2>
            <code>{selectedInstitution.code}</code>
          </div>

          <div className="admin-operator-form-grid">
            <input
              className="field-input"
              onChange={(event) => setNewOperatorUsername(event.target.value)}
              placeholder="New operator username"
              type="text"
              value={newOperatorUsername}
            />
            <input
              className="field-input"
              onChange={(event) => setNewOperatorPassword(event.target.value)}
              placeholder="Temporary password"
              type="password"
              value={newOperatorPassword}
            />
            <button className="button button-secondary" disabled={isSubmitting} onClick={() => void createOperator()} type="button">
              Add operator
            </button>
          </div>

          {isLoadingOperators ? (
            <div className="admin-page-loading">
              <div className="admin-loading-pulse" />
              <span>Loading operators...</span>
            </div>
          ) : (
            <div className="admin-evidence-table" style={{ marginTop: "1rem" }}>
              <div className="admin-table-header-row admin-table-4col">
                <span>Username</span>
                <span>Role</span>
                <span>Created</span>
                <span>Reset password</span>
              </div>
              {operators.map((operator) => (
                <div className="admin-table-row admin-table-4col" key={operator.id}>
                  <strong>{operator.username}</strong>
                  <span className="admin-status-badge admin-status-issued">{operator.role}</span>
                  <span className="admin-timestamp">{new Date(operator.createdAt).toLocaleDateString("en-GB")}</span>
                  <div className="admin-inline-form">
                    <input
                      className="field-input"
                      onChange={(event) =>
                        setResetPasswords((currentValue) => ({
                          ...currentValue,
                          [operator.id]: event.target.value
                        }))
                      }
                      placeholder="New password"
                      type="password"
                      value={resetPasswords[operator.id] ?? ""}
                    />
                    <button
                      className="admin-inline-action"
                      disabled={isSubmitting}
                      onClick={() => void resetOperatorPassword(operator.id)}
                      type="button"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
