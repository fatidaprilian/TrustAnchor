"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SessionUser {
  institutionName: string;
  role: string;
  username: string;
}

type InternalRoute = "/admin/institutions" | "/admin";

function getRoleHomePath(role: string): InternalRoute {
  return role === "platform_admin" ? "/admin/institutions" : "/admin";
}

function getRoleLabel(role: string): string {
  return role === "platform_admin" ? "Platform admin" : "Institution admin";
}

export function InternalAccessPanel(): JSX.Element {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession(): Promise<void> {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const body = (await response.json()) as { data: SessionUser };
          setSessionUser(body.data);
        }
      } catch {
        /* unauthenticated homepage is expected */
      } finally {
        setIsLoading(false);
      }
    }

    void loadSession();
  }, []);

  if (isLoading) {
    return (
      <div className="bench-copy evidence-sheet reveal-surface">
        <span className="sheet-clamp">Internal access</span>
        <div className="section-stack">
          <span className="section-kicker">Operator check</span>
          <h2 className="section-title">Reading current session.</h2>
          <p className="body-copy">The public verification bench stays available while the issuing desk checks access.</p>
        </div>
      </div>
    );
  }

  if (sessionUser) {
    const roleHomePath = getRoleHomePath(sessionUser.role);

    return (
      <div className="bench-copy evidence-sheet reveal-surface">
        <span className="sheet-clamp">Signed-in desk</span>
        <div className="section-stack">
          <span className="section-kicker">{getRoleLabel(sessionUser.role)}</span>
          <h2 className="section-title">Continue your internal workspace.</h2>
          <p className="body-copy">
            {sessionUser.username} is signed in for {sessionUser.institutionName}. Public verification remains open on
            this page, while certificate operations stay inside the dashboard.
          </p>
        </div>

        <div className="role-duty-grid" aria-label="Current role duties">
          {sessionUser.role === "platform_admin" ? (
            <>
              <span>Manage institutions</span>
              <span>Create and reset operators</span>
              <span>Prepare issuing workspaces</span>
            </>
          ) : (
            <>
              <span>Create academic templates</span>
              <span>Issue and revoke certificates</span>
              <span>Review scoped audit logs</span>
            </>
          )}
        </div>

        <div className="hero-actions" aria-label="Internal session actions">
          <Link className="button button-primary" href={roleHomePath}>
            Open dashboard
          </Link>
          <a className="button button-tertiary" href="/api/openapi.json">
            Inspect API contract
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bench-copy evidence-sheet reveal-surface">
      <span className="sheet-clamp">Internal access</span>
      <div className="section-stack">
        <span className="section-kicker">One login, two internal roles</span>
        <h2 className="section-title">Use the issuing desk only if you manage certificate records.</h2>
        <p className="body-copy">
          Platform admins manage institutions and operators. Institution admins create templates, issue certificates,
          revoke records, and inspect audit logs for their own institution.
        </p>
      </div>

      <div className="role-duty-grid" aria-label="Internal roles">
        <span>Platform admin: institutions and operators</span>
        <span>Institution admin: templates and issuance</span>
        <span>Public users: verify by code or QR without login</span>
      </div>

      <div className="hero-actions" aria-label="Secondary actions">
        <Link className="button button-primary" href="/login">
          Internal login
        </Link>
        <a className="button button-tertiary" href="/api/openapi.json">
          Inspect API contract
        </a>
      </div>
    </div>
  );
}
