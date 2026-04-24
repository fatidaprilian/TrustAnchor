import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

export const metadata: Metadata = {
  description: "Issue and verify anti-counterfeit digital certificates with signatures, audit logs, and instant lookup.",
  title: "TrustAnchor"
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body className="app-body">{children}</body>
    </html>
  );
}
