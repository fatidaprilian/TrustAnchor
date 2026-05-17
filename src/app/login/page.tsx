import { TrustAnchorWordmark } from "@/components/trustanchor-wordmark";
import { LoginForm } from "@/features/authentication/components/login-form";

export default function LoginPage(): JSX.Element {
  return (
    <main className="page-shell page-shell-login">
      <section className="login-grid">
        <div className="login-brief register-surface register-surface-dark reveal-surface">
          <span className="register-tab">Restricted register</span>
          <TrustAnchorWordmark detail="Controlled issuing register" tone="light" />

          <div className="section-stack">
            <span className="section-kicker section-kicker-light">Admin access</span>
            <h1 className="hero-title hero-title-login">Open the issuing register before sealing a record.</h1>
            <p className="lead-copy lead-copy-light">
              Sign in to manage templates, issue certificates, and keep every public verification report tied to a
              traceable operator action.
            </p>
          </div>

          <div className="access-plate" aria-hidden="true">
            <span />
            <strong>ACCESS</strong>
            <code>operator://bootstrap-admin</code>
          </div>

          <div className="login-ledger">
            <div className="dark-rail">
              <span className="ledger-label ledger-label-light">Current scope</span>
              <strong>Template creation, issuance, and verification readiness</strong>
            </div>
            <div className="dark-rail">
              <span className="ledger-label ledger-label-light">Security posture</span>
              <strong>Platform credentials and institution operator accounts</strong>
            </div>
          </div>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
