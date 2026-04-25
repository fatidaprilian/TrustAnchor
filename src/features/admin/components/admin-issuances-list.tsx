"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface IssuanceRecord {
  certificateNumber: string;
  createdAt: string;
  id: string;
  recipientName: string;
  status: string;
  verificationCode: string;
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

export function AdminIssuancesList(): JSX.Element {
  const [issuances, setIssuances] = useState<IssuanceRecord[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ limit: PAGE_SIZE, offset: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadIssuances = useCallback(async (offset: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/admin/issuances?limit=${PAGE_SIZE}&offset=${offset}`);
      if (!response.ok) {
        setErrorMessage("Failed to load issuances");
        return;
      }
      const body = (await response.json()) as { data: IssuanceRecord[]; meta: PaginationMeta };
      setIssuances(body.data);
      setMeta(body.meta);
    } catch {
      setErrorMessage("Issuance service is unavailable");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadIssuances(0);
  }, [loadIssuances]);

  const currentPage = Math.floor(meta.offset / meta.limit) + 1;
  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="section-stack" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span className="section-kicker">Issuance ledger</span>
            <h1 className="admin-page-title">Certificate Issuances</h1>
            <p className="body-copy">
              All issued certificates with recipient details, verification codes, and current status. Each record
              carries cryptographic proof material sealed at issuance time.
            </p>
          </div>
          <Link className="button button-primary" href="/admin/issuances/create">
            Issue certificate
          </Link>
        </div>
      </header>

      {errorMessage ? (
        <div className="status-panel status-panel-danger">{errorMessage}</div>
      ) : isLoading ? (
        <div className="admin-page-loading">
          <div className="admin-loading-pulse" />
          <span>Loading issuance ledger...</span>
        </div>
      ) : issuances.length === 0 ? (
        <div className="admin-empty-state evidence-sheet evidence-sheet-strong">
          <span className="sheet-clamp">No issuances</span>
          <p className="body-copy">No certificates have been issued yet. Create a template first, then issue certificates through the API.</p>
        </div>
      ) : (
        <>
          <section className="admin-data-section evidence-sheet reveal-surface" aria-label="Issuance records">
            <span className="sheet-clamp">Issuance records</span>
            <div className="admin-evidence-table">
              <div className="admin-table-header-row admin-table-5col">
                <span>Recipient</span>
                <span>Certificate number</span>
                <span>Verification code</span>
                <span>Status</span>
                <span>Issued</span>
              </div>
              {issuances.map((issuance) => (
                <div className="admin-table-row admin-table-5col" key={issuance.id}>
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
          </section>

          <div className="admin-pagination">
            <button
              className="button button-secondary"
              disabled={currentPage <= 1}
              onClick={() => void loadIssuances(Math.max(0, meta.offset - meta.limit))}
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
              onClick={() => void loadIssuances(meta.offset + meta.limit)}
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
