import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "@/features/admin/components/admin-shell";

export const metadata: Metadata = {
  description: "Manage certificate templates, issue records, and review audit trails from the TrustAnchor issuer register.",
  title: "Admin Dashboard | TrustAnchor"
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
  return <AdminShell>{children}</AdminShell>;
}
