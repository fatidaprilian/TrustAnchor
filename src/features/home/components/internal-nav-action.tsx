"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SessionUser {
  role: string;
}

type InternalRoute = "/admin/institutions" | "/admin";

function getRoleHomePath(role: string): InternalRoute {
  return role === "platform_admin" ? "/admin/institutions" : "/admin";
}

export function InternalNavAction(): JSX.Element {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    async function loadSession(): Promise<void> {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const body = (await response.json()) as { data: SessionUser };
          setSessionUser(body.data);
        }
      } catch {
        /* public visitor */
      }
    }

    void loadSession();
  }, []);

  return (
    <Link className="button button-secondary" href={sessionUser ? getRoleHomePath(sessionUser.role) : "/login"}>
      {sessionUser ? "Dashboard" : "Internal login"}
    </Link>
  );
}
