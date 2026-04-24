import Link from "next/link";

import { TrustAnchorWordmark } from "@/components/trustanchor-wordmark";
import { VerificationLookupForm } from "@/features/verification/components/verification-lookup-form";

const trustChainSteps = [
  {
    body: "Schema version, institution ownership, and layout intent stay traceable from the moment a template is created.",
    code: "01",
    title: "Template discipline"
  },
  {
    body: "Recipient data is turned into a canonical payload before any proof material is produced.",
    code: "02",
    title: "Canonical issuance payload"
  },
  {
    body: "Digital signatures and envelope-style double encryption make tampering visible and storage safer.",
    code: "03",
    title: "Protected proof chain"
  },
  {
    body: "A public verification code gives officers and recipients a fast way to validate authenticity.",
    code: "04",
    title: "Instant public lookup"
  }
] as const;

const registrySignals = [
  {
    label: "Readiness",
    value: "Verification endpoint online"
  },
  {
    label: "Audience",
    value: "Education and public-sector issuers"
  },
  {
    label: "Assurance",
    value: "Audit trail attached to sensitive actions"
  }
] as const;

const audienceSurfaces = [
  {
    body: "Issue trusted certificates from a controlled workspace with traceable templates and explicit ownership.",
    eyebrow: "For institution administrators",
    title: "Keep issuance disciplined, not improvised."
  },
  {
    body: "Validate a record in service queues, admissions reviews, or field operations without exposing encrypted internals.",
    eyebrow: "For officers and reviewers",
    title: "Read the trust status in one scan."
  },
  {
    body: "Expose the current public contract used for verification and issuance flows when integration or review needs it.",
    eyebrow: "For technical and audit review",
    title: "Contracts stay visible alongside the experience."
  }
] as const;

export function HomeShowcase(): JSX.Element {
  return (
    <main className="page-shell page-shell-home">
      <section className="masthead">
        <TrustAnchorWordmark detail="Anti-counterfeit document verification" />

        <div className="masthead-actions">
          <span className="signal-chip signal-chip-valid">Verification live</span>
          <Link className="text-link" href="/api/openapi.json">
            OpenAPI contract
          </Link>
          <Link className="button button-ghost" href="/login">
            Admin access
          </Link>
        </div>
      </section>

      <section className="hero-grid">
        <div className="hero-copy frame-panel">
          <div className="section-stack">
            <span className="section-kicker">Public trust registry</span>
            <h1 className="hero-title">Make document trust readable before doubt has time to spread.</h1>
            <p className="lead-copy">
              TrustAnchor helps education institutions and government agencies issue anti-counterfeit certificates with
              digital signatures, double encryption, audit logging, and instant verification.
            </p>
          </div>

          <div className="hero-actions">
            <Link className="button button-primary" href="/login">
              Enter issuing desk
            </Link>
            <a className="button button-secondary" href="/api/openapi.json">
              Inspect API contract
            </a>
          </div>

          <div className="hero-ledger">
            <div className="ledger-row">
              <span className="ledger-label">Primary public action</span>
              <strong>Verify a certificate by code</strong>
            </div>
            <div className="ledger-row">
              <span className="ledger-label">Protected evidence</span>
              <strong>Hash, signature, and wrapped payload proof</strong>
            </div>
            <div className="ledger-row">
              <span className="ledger-label">Operational fit</span>
              <strong>Admissions, civil services, academic records, and audit review</strong>
            </div>
          </div>
        </div>

        <div className="lookup-panel frame-panel frame-panel-dark">
          <div className="section-stack section-stack-compact">
            <span className="section-kicker section-kicker-light">Verification chamber</span>
            <h2 className="panel-title">Enter a code. Read the trust state immediately.</h2>
            <p className="panel-copy">
              The public flow confirms the stored proof chain without exposing encrypted payload internals.
            </p>
          </div>

          <VerificationLookupForm />

          <div className="lookup-footnote-grid">
            <div className="mini-panel mini-panel-dark">
              <span className="ledger-label ledger-label-light">Checks performed</span>
              <strong>Document hash, signature, record status</strong>
            </div>
            <div className="mini-panel mini-panel-dark">
              <span className="ledger-label ledger-label-light">Best used by</span>
              <strong>Recipients, officers, and institutional reviewers</strong>
            </div>
          </div>
        </div>

        <aside className="registry-rail frame-panel">
          <div className="section-stack section-stack-compact">
            <span className="section-kicker">Registry stance</span>
            <h2 className="rail-title">Proof is treated as a readable record, not a hidden implementation detail.</h2>
          </div>

          <div className="signal-list">
            {registrySignals.map((signal) => (
              <div className="signal-row" key={signal.label}>
                <span className="ledger-label">{signal.label}</span>
                <strong>{signal.value}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="trust-band frame-panel">
        <div className="section-stack section-stack-inline">
          <span className="section-kicker">Trust chain</span>
          <h2 className="section-title">The interface follows the four proof decisions behind every valid record.</h2>
        </div>

        <div className="trust-band-grid">
          {trustChainSteps.map((step) => (
            <article className="trust-step" key={step.code}>
              <span className="trust-step-code">{step.code}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="audience-grid">
        {audienceSurfaces.map((surface, index) => (
          <article
            className={`frame-panel audience-panel${index === 2 ? " audience-panel-accent" : ""}`}
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
