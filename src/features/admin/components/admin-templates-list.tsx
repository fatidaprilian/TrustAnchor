"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface TemplateRecord {
  certificateType: string;
  createdAt: string;
  id: string;
  isActive: boolean;
  schemaVersion: string;
  templateName: string;
}

interface PaginationMeta {
  limit: number;
  offset: number;
  total: number;
}

function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return isoString;
  }
}

const PAGE_SIZE = 20;

export function AdminTemplatesList(): JSX.Element {
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ limit: PAGE_SIZE, offset: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadTemplates = useCallback(async (offset: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/admin/templates?limit=${PAGE_SIZE}&offset=${offset}`);
      if (!response.ok) {
        setErrorMessage("Failed to load templates");
        return;
      }
      const body = (await response.json()) as { data: TemplateRecord[]; meta: PaginationMeta };
      setTemplates(body.data);
      setMeta(body.meta);
    } catch {
      setErrorMessage("Template service is unavailable");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTemplates(0);
  }, [loadTemplates]);

  const currentPage = Math.floor(meta.offset / meta.limit) + 1;
  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="section-stack" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span className="section-kicker">Template register</span>
            <h1 className="admin-page-title">Certificate Templates</h1>
            <p className="body-copy">
              View and manage certificate templates available for issuance. Each template defines a schema version,
              certificate type, and layout definition.
            </p>
          </div>
          <Link className="button button-primary" href="/admin/templates/create">
            Create template
          </Link>
        </div>
      </header>

      {errorMessage ? (
        <div className="status-panel status-panel-danger">{errorMessage}</div>
      ) : isLoading ? (
        <div className="admin-page-loading">
          <div className="admin-loading-pulse" />
          <span>Loading template register...</span>
        </div>
      ) : templates.length === 0 ? (
        <div className="admin-empty-state register-surface register-surface-strong">
          <span className="register-tab">No templates</span>
          <p className="body-copy">No certificate templates have been registered yet. Use the API to create your first template.</p>
        </div>
      ) : (
        <>
          <section className="admin-data-section register-surface reveal-surface" aria-label="Template records">
            <span className="register-tab">Template records</span>
            <div className="admin-evidence-table">
              <div className="admin-table-header-row admin-table-5col">
                <span>Template name</span>
                <span>Type</span>
                <span>Schema</span>
                <span>Status</span>
                <span>Created</span>
              </div>
              {templates.map((template) => (
                <div className="admin-table-row admin-table-5col" key={template.id}>
                  <strong>{template.templateName}</strong>
                  <span>{template.certificateType}</span>
                  <code>{template.schemaVersion}</code>
                  <span className={`admin-status-badge ${template.isActive ? "admin-status-issued" : "admin-status-revoked"}`}>
                    {template.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="admin-timestamp">{formatTimestamp(template.createdAt)}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="admin-pagination">
            <button
              className="button button-secondary"
              disabled={currentPage <= 1}
              onClick={() => void loadTemplates(Math.max(0, meta.offset - meta.limit))}
              type="button"
            >
              Previous
            </button>
            <span className="admin-page-indicator">
              Page {currentPage} of {totalPages} &middot; {meta.total} total
            </span>
            <button
              className="button button-secondary"
              disabled={currentPage >= totalPages}
              onClick={() => void loadTemplates(meta.offset + meta.limit)}
              type="button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
