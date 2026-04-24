import { TrustAnchorWordmark } from "@/components/trustanchor-wordmark";
import { LoginForm } from "@/features/authentication/components/login-form";

export default function LoginPage(): JSX.Element {
  return (
    <main className="page-shell page-shell-login">
      <section className="login-grid">
        <div className="login-brief frame-panel frame-panel-ink">
          <TrustAnchorWordmark detail="Controlled issuing desk" tone="light" />

          <div className="section-stack">
            <span className="section-kicker section-kicker-light">Admin access</span>
            <h1 className="hero-title hero-title-login">Authorize the desk that issues the record, not the rumor.</h1>
            <p className="lead-copy lead-copy-light">
              Sign in to manage templates, issue certificates, and preserve the proof chain behind every public
              verification result.
            </p>
          </div>

          <div className="login-ledger">
            <div className="ledger-row ledger-row-dark">
              <span className="ledger-label ledger-label-light">Current scope</span>
              <strong>Template creation, issuance, and verification readiness</strong>
            </div>
            <div className="ledger-row ledger-row-dark">
              <span className="ledger-label ledger-label-light">Security posture</span>
              <strong>Bootstrap credentials for controlled local development</strong>
            </div>
            <div className="ledger-row ledger-row-dark">
              <span className="ledger-label ledger-label-light">Trust chain</span>
              <strong>Template discipline, signed payloads, encrypted proof, public lookup</strong>
            </div>
          </div>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
