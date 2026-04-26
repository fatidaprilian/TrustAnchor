import Link from "next/link";

import { TrustAnchorWordmark } from "@/components/trustanchor-wordmark";
import { InternalAccessPanel } from "@/features/home/components/internal-access-panel";
import { InternalNavAction } from "@/features/home/components/internal-nav-action";
import { VerificationLookupForm } from "@/features/verification/components/verification-lookup-form";

const inspectionPasses = [
  {
    body: "Template ownership and schema version are captured before any public claim exists.",
    code: "01",
    label: "Template register",
    title: "Align source"
  },
  {
    body: "Recipient claims become a canonical payload so repeated checks read the same document truth.",
    code: "02",
    label: "Claim sheet",
    title: "Normalize content"
  },
  {
    body: "Hash, signature, and envelope encryption make later tampering visible to the verifier.",
    code: "03",
    label: "Proof layer",
    title: "Seal evidence"
  },
  {
    body: "A public code exposes only safe verification details while private proof material stays protected.",
    code: "04",
    label: "Public slip",
    title: "Release lookup"
  }
] as const;

const evidenceMarks = [
  "RSA-SHA256 proof signature",
  "AES-GCM encrypted payload",
  "Public verification code",
  "Append-heavy audit log"
] as const;

const audienceSurfaces = [
  {
    body: "Create certificate templates and issue records from a controlled bench where every public claim has proof behind it.",
    cta: null,
    eyebrow: "Institution desk",
    title: "Issue records with a visible chain of custody."
  },
  {
    body: "Check certificate numbers, recipients, and document hashes from a public-safe verification page.",
    cta: null,
    eyebrow: "Review counter",
    title: "Read authenticity without opening private internals."
  },
  {
    body: "Inspect the OpenAPI contract when integration teams need the exact request and response surface.",
    eyebrow: "Integration audit",
    title: "Keep the contract close to the evidence.",
    cta: "Open JSON contract"
  }
] as const;

export function HomeShowcase(): JSX.Element {
  return (
    <main className="page-shell page-shell-home">
      <section className="masthead">
        <TrustAnchorWordmark detail="Forensic certificate evidence bench" />

        <nav className="masthead-actions" aria-label="Primary navigation">
          <span className="status-pill status-pill-verified">Verification bench online</span>
          <Link className="text-link" href="/api/openapi.json">
            OpenAPI
          </Link>
          <InternalNavAction />
        </nav>
      </section>

      <section className="light-table" aria-labelledby="home-heading">
        <div className="verification-slip evidence-sheet evidence-sheet-strong reveal-surface">
          <span className="sheet-clamp">Public lookup</span>
          <div className="section-stack">
            <span className="section-kicker">Inspection light on</span>
            <h1 className="hero-title" id="home-heading">
              Put a certificate under proof.
            </h1>
            <p className="lead-copy">
              TrustAnchor helps institutions issue anti-counterfeit digital certificates with signatures, envelope
              encryption, audit logs, and public verification that can be checked in seconds.
            </p>
          </div>

          <VerificationLookupForm />

          <div className="slip-footer" aria-label="Public verification checks">
            <span>Checks hash</span>
            <span>Reads status</span>
            <span>Shows safe claims</span>
          </div>
        </div>

        <aside className="specimen-stage reveal-surface" aria-label="Certificate proof specimen">
          <div className="specimen-sheet specimen-sheet-back" aria-hidden="true" />
          <div className="specimen-sheet specimen-sheet-main">
            <div className="specimen-ruler" aria-hidden="true" />
            <div className="specimen-header">
              <span>TrustAnchor</span>
              <strong>Evidence Specimen</strong>
            </div>
            <div className="specimen-watermark" aria-hidden="true">
              TA
            </div>
            <div className="specimen-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="specimen-proof">
              <span>verification_code</span>
              <code>TA-0F5N9A7K2Q</code>
            </div>
          </div>
          <div className="uv-strip" aria-hidden="true">
            {evidenceMarks.map((mark) => (
              <span key={mark}>{mark}</span>
            ))}
          </div>
        </aside>

        <InternalAccessPanel />
      </section>

      <section className="inspection-band evidence-sheet reveal-surface">
        <div className="section-stack section-stack-inline">
          <span className="section-kicker">Inspection passes</span>
          <h2 className="section-title">A valid certificate moves through four evidence decisions.</h2>
        </div>

        <div className="inspection-grid">
          {inspectionPasses.map((step) => (
            <article className="inspection-pass" key={step.code}>
              <div className="pass-index">
                <code>{step.code}</code>
                <span>{step.label}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="audience-grid" aria-label="TrustAnchor audiences">
        {audienceSurfaces.map((surface) => (
          <article className="audience-panel evidence-sheet reveal-surface" key={surface.eyebrow}>
            <span className="sheet-clamp">{surface.eyebrow}</span>
            <h2 className="section-title section-title-small">{surface.title}</h2>
            <p className="body-copy">{surface.body}</p>
            {surface.cta ? (
              <a className="text-link" href="/api/openapi.json">
                {surface.cta}
              </a>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
