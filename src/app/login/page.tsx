import { TrustAnchorWordmark } from "@/components/trustanchor-wordmark";
import { LoginForm } from "@/features/authentication/components/login-form";

export default function LoginPage(): JSX.Element {
  return (
    <main className="page-shell page-shell-login">
      <section className="login-grid">
        <div className="login-brief instrument-panel instrument-panel-ink reveal-surface">
          <TrustAnchorWordmark detail="Controlled issuing desk" tone="light" />

          <div className="section-stack">
            <span className="section-kicker section-kicker-light">Admin access</span>
            <h1 className="hero-title hero-title-login">Authorize the console before a record becomes public.</h1>
            <p className="lead-copy lead-copy-light">
              Sign in to manage templates, issue certificates, and preserve the trust signal behind every public
              verification report.
            </p>
          </div>

          <div className="signal-visual signal-visual-compact" aria-hidden="true">
            <div className="signal-orbit signal-orbit-small">
              <span className="orbit-ring orbit-ring-outer" />
              <span className="orbit-ring orbit-ring-middle" />
              <span className="orbit-ring orbit-ring-inner" />
              <span className="orbit-core">ID</span>
            </div>
          </div>

          <div className="login-ledger evidence-lanes evidence-lanes-dark">
            <div className="evidence-lane evidence-lane-dark">
              <span className="ledger-label ledger-label-light">Current scope</span>
              <strong>Template creation, issuance, and verification readiness</strong>
            </div>
            <div className="evidence-lane evidence-lane-dark">
              <span className="ledger-label ledger-label-light">Security posture</span>
              <strong>Bootstrap credentials for controlled local development</strong>
            </div>
            <div className="evidence-lane evidence-lane-dark">
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
