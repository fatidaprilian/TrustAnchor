"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { TrustAnchorWordmark } from "@/components/trustanchor-wordmark";
import { withCsrfHeaders } from "@/features/admin/lib/csrf";

interface SessionUser {
  institutionId: string;
  institutionName: string;
  role: string;
  username: string;
}

const navigationItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/institutions", label: "Institutions", platformOnly: true },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/issuances", label: "Issuances" },
  { href: "/admin/audit-log", label: "Audit trail" }
] as const;

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function loadSession(): Promise<void> {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const body = (await response.json()) as { data: SessionUser };
          setSessionUser(body.data);
        }
      } catch {
        /* session unavailable */
      }
    }
    void loadSession();
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { headers: withCsrfHeaders(), method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  }, [router]);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar register-surface register-surface-dark" aria-label="Admin navigation">
        <div className="admin-sidebar-header">
          <TrustAnchorWordmark detail="Issuer register" tone="light" />
        </div>

        <nav className="admin-nav" aria-label="Dashboard navigation">
          {navigationItems.filter((item) => !("platformOnly" in item) || sessionUser?.role === "platform_admin").map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

            return (
              <Link
                className={`admin-nav-item ${isActive ? "admin-nav-item-active" : ""}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          {sessionUser ? (
            <div className="admin-operator-badge">
              <span className="admin-operator-label">Operator</span>
              <strong className="admin-operator-name">{sessionUser.username}</strong>
              <span className="admin-operator-role">{sessionUser.role}</span>
              <span className="admin-operator-role">{sessionUser.institutionName}</span>
            </div>
          ) : null}
          <button
            className="button button-tertiary admin-logout-button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
          >
            {isLoggingOut ? "Ending session..." : "End session"}
          </button>
          <Link className="admin-nav-home-link" href="/">
            Public serial lookup
          </Link>
        </div>
      </aside>

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
