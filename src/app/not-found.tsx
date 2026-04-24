import Link from "next/link";

import { TrustAnchorWordmark } from "@/components/trustanchor-wordmark";

export default function NotFoundPage(): JSX.Element {
  return (
    <main className="page-shell page-shell-not-found">
      <section className="masthead masthead-compact">
        <TrustAnchorWordmark detail="Public verification lookup" />
        <Link className="text-link" href="/">
          Back to verification
        </Link>
      </section>

      <section className="not-found-frame frame-panel">
        <span className="section-kicker">Record not found</span>
        <h1 className="hero-title hero-title-compact">The verification code does not match an issued record.</h1>
        <p className="lead-copy">
          Check the code, confirm the issuing institution, or return to the public verification screen to try again.
        </p>

        <div className="not-found-actions">
          <Link className="button button-primary" href="/">
            Try another code
          </Link>
          <Link className="button button-secondary" href="/login">
            Go to admin access
          </Link>
        </div>
      </section>
    </main>
  );
}
