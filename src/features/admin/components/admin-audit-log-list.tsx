"use client";

import { useEffect, useState, useCallback } from "react";

interface AuditLogRecord {
  action: string;
  actorId: string | null;
  createdAt: string;
  detail: Record<string, unknown>;
  id: string;
  resourceId: string;
  resourceType: string;
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

function formatActionLabel(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\./g, " : ");
}

const PAGE_SIZE = 30;

export function AdminAuditLogList(): JSX.Element {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ limit: PAGE_SIZE, offset: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadLogs = useCallback(async (offset: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/admin/audit-logs?limit=${PAGE_SIZE}&offset=${offset}`);
      if (!response.ok) {
        setErrorMessage("Failed to load audit logs");
        return;
      }
      const body = (await response.json()) as { data: AuditLogRecord[]; meta: PaginationMeta };
      setLogs(body.data);
      setMeta(body.meta);
    } catch {
      setErrorMessage("Audit trail service is unavailable");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLogs(0);
  }, [loadLogs]);

  const currentPage = Math.floor(meta.offset / meta.limit) + 1;
  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="section-stack">
          <span className="section-kicker">Register chain</span>
          <h1 className="admin-page-title">Audit Trail</h1>
          <p className="body-copy">
            Immutable record of every administrative action. Template creation, certificate issuance, and
            verification events are logged with actor identity, timestamps, and structured detail.
          </p>
        </div>
      </header>

      {errorMessage ? (
        <div className="status-panel status-panel-danger">{errorMessage}</div>
      ) : isLoading ? (
        <div className="admin-page-loading">
          <div className="admin-loading-pulse" />
          <span>Loading audit trail...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="admin-empty-state register-surface register-surface-strong">
          <span className="register-tab">No events</span>
          <p className="body-copy">No audit events have been recorded yet.</p>
        </div>
      ) : (
        <>
          <section className="admin-data-section register-surface reveal-surface" aria-label="Audit log entries">
            <span className="register-tab">Audit register</span>
            <div className="admin-audit-timeline">
              {logs.map((log) => (
                <div className="admin-audit-timeline-entry" key={log.id}>
                  <div className="admin-audit-timeline-marker" />
                  <div className="admin-audit-timeline-body">
                    <div className="admin-audit-timeline-head">
                      <strong>{formatActionLabel(log.action)}</strong>
                      <span className="admin-timestamp">{formatTimestamp(log.createdAt)}</span>
                    </div>
                    <div className="admin-audit-timeline-meta">
                      <span>Resource: <code>{log.resourceType}</code></span>
                      <span>ID: <code>{log.resourceId.slice(0, 12)}...</code></span>
                      <span>Actor: {log.actorId ?? "system"}</span>
                    </div>
                    <button
                      className="text-link admin-audit-expand"
                      onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                      type="button"
                    >
                      {expandedId === log.id ? "Hide detail" : "Show detail"}
                    </button>
                    {expandedId === log.id ? (
                      <pre className="admin-audit-detail-block">
                        <code>{JSON.stringify(log.detail, null, 2)}</code>
                      </pre>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="admin-pagination">
            <button
              className="button button-secondary"
              disabled={currentPage <= 1}
              onClick={() => void loadLogs(Math.max(0, meta.offset - meta.limit))}
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
              onClick={() => void loadLogs(meta.offset + meta.limit)}
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
