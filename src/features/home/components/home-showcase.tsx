import Link from "next/link";

import { TrustAnchorWordmark } from "@/components/trustanchor-wordmark";
import { VerificationLookupForm } from "@/features/verification/components/verification-lookup-form";

const trustChainSteps = [
  {
    body: "Template ownership and schema intent are locked before issuance begins.",
    code: "01",
    metric: "Template",
    title: "Source registered"
  },
  {
    body: "Recipient claims become a canonical payload before proof material is created.",
    code: "02",
    metric: "Payload",
    title: "Claims normalized"
  },
  {
    body: "Hash, signature, and envelope encryption make tampering visible.",
    code: "03",
    metric: "Proof",
    title: "Evidence sealed"
  },
  {
    body: "A public code exposes safe verification without revealing encrypted internals.",
    code: "04",
    metric: "Lookup",
    title: "Signal readable"
  }
] as const;

const telemetrySignals = [
  {
    label: "Verification endpoint",
    value: "Online"
  },
  {
    label: "Primary users",
    value: "Institutions, officers, recipients"
  },
  {
    label: "Proof posture",
    value: "Signed, encrypted, audit aware"
  }
] as const;

const audienceSurfaces = [
  {
    body: "Issue certificate records from a controlled workspace where templates, ownership, and proof material stay traceable.",
    eyebrow: "Issuing institutions",
    title: "Controlled records before public claims."
  },
  {
    body: "Validate a certificate in service queues, admissions review, or field operations with a public-safe status report.",
    eyebrow: "Review officers",
    title: "One scan to separate evidence from rumor."
  },
  {
    body: "Inspect the OpenAPI contract when integration, audit, or technical review needs the public surface in exact terms.",
    eyebrow: "Technical auditors",
    title: "Contracts stay close to the interface."
  }
] as const;

export function HomeShowcase(): JSX.Element {
  return (
    <main className="page-shell page-shell-home">
      <section className="masthead">
        <TrustAnchorWordmark detail="Civic certificate signal registry" />

        <div className="masthead-actions" aria-label="Primary navigation">
          <span className="signal-chip signal-chip-valid">Verification live</span>
          <Link className="text-link" href="/api/openapi.json">
            OpenAPI contract
          </Link>
          <Link className="button button-ghost" href="/login">
            Admin access
          </Link>
        </div>
      </section>

      <section className="observatory-grid" aria-labelledby="home-heading">
        <div className="observatory-copy instrument-panel reveal-surface">
          <span className="section-kicker">Civic signal observatory</span>
          <h1 className="hero-title" id="home-heading">
            Verify the signal behind every certificate.
          </h1>
          <p className="lead-copy">
            TrustAnchor helps institutions issue anti-counterfeit digital certificates with signatures, double
            encryption, audit logging, and instant public verification.
          </p>

          <div className="hero-actions" aria-label="Primary actions">
            <Link className="button button-primary" href="/login">
              Enter issuing desk
            </Link>
            <a className="button button-secondary" href="/api/openapi.json">
              Inspect API contract
            </a>
          </div>

          <div className="evidence-lanes" aria-label="TrustAnchor proof capabilities">
            <div className="evidence-lane">
              <span className="ledger-label">Protected evidence</span>
              <strong>Hash, signature, encrypted payload, and wrapped key material</strong>
            </div>
            <div className="evidence-lane">
              <span className="ledger-label">Operational fit</span>
              <strong>Admissions, civil services, academic records, and audit review</strong>
            </div>
          </div>
        </div>

        <aside className="signal-visual instrument-panel reveal-surface" aria-label="Live verification signal model">
          <div className="signal-orbit" aria-hidden="true">
            <span className="orbit-ring orbit-ring-outer" />
            <span className="orbit-ring orbit-ring-middle" />
            <span className="orbit-ring orbit-ring-inner" />
            <span className="orbit-core">TA</span>
          </div>
          <div className="telemetry-stack">
            {telemetrySignals.map((signal) => (
              <div className="telemetry-row" key={signal.label}>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
              </div>
            ))}
          </div>
        </aside>

        <div className="lookup-panel signal-console reveal-surface">
          <div className="section-stack section-stack-compact">
            <span className="section-kicker section-kicker-light">Public verification console</span>
            <h2 className="panel-title">Enter a code and read the trust state.</h2>
            <p className="panel-copy">
              The public flow confirms the stored proof chain without exposing encrypted payload internals.
            </p>
          </div>

          <VerificationLookupForm />

          <div className="console-footer">
            <div>
              <span className="ledger-label ledger-label-light">Checks performed</span>
              <strong>Document hash, signature, record status</strong>
            </div>
            <div>
              <span className="ledger-label ledger-label-light">Best used by</span>
              <strong>Recipients, officers, institutional reviewers</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-band instrument-panel reveal-surface">
        <div className="section-stack section-stack-inline">
          <span className="section-kicker">Proof telemetry</span>
          <h2 className="section-title">Every valid record moves through four observable trust decisions.</h2>
        </div>

        <div className="trust-band-grid">
          {trustChainSteps.map((step) => (
            <article className="trust-step" key={step.code}>
              <div className="trust-step-head">
                <span className="trust-step-code">{step.code}</span>
                <span>{step.metric}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="audience-grid" aria-label="TrustAnchor audiences">
        {audienceSurfaces.map((surface, index) => (
          <article
            className={`instrument-panel audience-panel reveal-surface${index === 2 ? " audience-panel-accent" : ""}`}
            key={surface.eyebrow}
          >
            <span className="section-kicker">{surface.eyebrow}</span>
            <h2 className="section-title section-title-small">{surface.title}</h2>
            <p className="body-copy">{surface.body}</p>
            {index === 2 ? (
              <a className="text-link" href="/api/openapi.json">
                Open the JSON contract
              </a>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
