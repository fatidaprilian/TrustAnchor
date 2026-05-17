"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardSummaryData {
  auditLogCount: number;
  institutionName: string;
  issuanceCount: number;
  recentAuditLogs: Array<{
    action: string;
    actorId: string | null;
    createdAt: string;
    id: string;
    resourceType: string;
  }>;
  recentIssuances: Array<{
    certificateNumber: string;
    createdAt: string;
    id: string;
    recipientName: string;
    status: string;
    verificationCode: string;
  }>;
  templateCount: number;
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

export function AdminDashboard(): JSX.Element {
  const [summary, setSummary] = useState<DashboardSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary(): Promise<void> {
      try {
        const response = await fetch("/api/admin/summary");
        if (!response.ok) {
          setErrorMessage("Failed to load dashboard data");
          return;
        }
        const body = (await response.json()) as { data: DashboardSummaryData };
        setSummary(body.data);
      } catch {
        setErrorMessage("Dashboard service is unavailable");
      } finally {
        setIsLoading(false);
      }
    }
    void loadSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="admin-page-loading">
        <div className="admin-loading-pulse" />
        <span>Loading issuer register...</span>
      </div>
    );
  }

  if (errorMessage || !summary) {
    return (
      <div className="admin-page-error">
        <div className="status-panel status-panel-danger">
          {errorMessage ?? "Unable to load dashboard"}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="section-stack" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span className="section-kicker">Issuer register overview</span>
            <h1 className="admin-page-title">Dashboard</h1>
            <p className="body-copy">
              {summary.institutionName} workspace. Manage templates, review issuance records, and trace
              every action through the audit trail.
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link className="button button-secondary" href="/admin/templates/create">
              Create template
            </Link>
            <Link className="button button-primary" href="/admin/issuances/create">
              Issue certificate
            </Link>
          </div>
        </div>
      </header>

      <section className="admin-stat-grid" aria-label="Key metrics">
        <article className="admin-stat-card register-surface register-surface-strong reveal-surface">
          <span className="register-tab">Templates</span>
          <div className="admin-stat-value">{summary.templateCount}</div>
          <span className="admin-stat-label">Certificate templates registered</span>
          <Link className="text-link admin-stat-action" href="/admin/templates">
            View all templates
          </Link>
        </article>

        <article className="admin-stat-card register-surface register-surface-strong reveal-surface">
          <span className="register-tab">Issuances</span>
          <div className="admin-stat-value">{summary.issuanceCount}</div>
          <span className="admin-stat-label">Certificates issued</span>
          <Link className="text-link admin-stat-action" href="/admin/issuances">
            View all issuances
          </Link>
        </article>

        <article className="admin-stat-card register-surface register-surface-strong reveal-surface">
          <span className="register-tab">Audit trail</span>
          <div className="admin-stat-value">{summary.auditLogCount}</div>
          <span className="admin-stat-label">Recorded register actions</span>
          <Link className="text-link admin-stat-action" href="/admin/audit-log">
            View full audit trail
          </Link>
        </article>
      </section>

      <div className="admin-recent-grid">
        <section className="admin-recent-panel register-surface reveal-surface" aria-label="Recent issuances">
          <span className="register-tab">Recent issuances</span>
          <div className="admin-recent-header">
            <h2 className="panel-title">Latest certificates</h2>
            <Link className="text-link" href="/admin/issuances">View all</Link>
          </div>

          {summary.recentIssuances.length === 0 ? (
            <p className="body-copy admin-empty-message">No certificates have been issued yet.</p>
          ) : (
            <div className="admin-evidence-table">
              <div className="admin-table-header-row">
                <span>Recipient</span>
                <span>Certificate</span>
                <span>Verification</span>
                <span>Status</span>
                <span>Issued</span>
              </div>
              {summary.recentIssuances.map((issuance) => (
                <div className="admin-table-row" key={issuance.id}>
                  <strong>{issuance.recipientName}</strong>
                  <code>{issuance.certificateNumber}</code>
                  <code>{issuance.verificationCode}</code>
                  <span className={`admin-status-badge admin-status-${issuance.status}`}>
                    {issuance.status}
                  </span>
                  <span className="admin-timestamp">{formatTimestamp(issuance.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-recent-panel register-surface reveal-surface" aria-label="Recent audit events">
          <span className="register-tab">Audit events</span>
          <div className="admin-recent-header">
            <h2 className="panel-title">Latest actions</h2>
            <Link className="text-link" href="/admin/audit-log">View all</Link>
          </div>

          {summary.recentAuditLogs.length === 0 ? (
            <p className="body-copy admin-empty-message">No audit events recorded yet.</p>
          ) : (
            <div className="admin-audit-feed">
              {summary.recentAuditLogs.map((log) => (
                <div className="admin-audit-entry" key={log.id}>
                  <div className="admin-audit-dot" />
                  <div className="admin-audit-content">
                    <strong className="admin-audit-action">{formatActionLabel(log.action)}</strong>
                    <span className="admin-audit-meta">
                      {log.resourceType} &middot; {log.actorId ?? "system"} &middot; {formatTimestamp(log.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
