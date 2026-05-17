import Link from "next/link";

import { TrustAnchorWordmark } from "@/components/trustanchor-wordmark";
import { InternalAccessPanel } from "@/features/home/components/internal-access-panel";
import { InternalNavAction } from "@/features/home/components/internal-nav-action";
import { VerificationLookupForm } from "@/features/verification/components/verification-lookup-form";

const registerPasses = [
  {
    body: "Template ownership and schema version are entered before the serial proof is issued.",
    code: "01",
    label: "Origin line",
    title: "Register source"
  },
  {
    body: "Recipient claims become a canonical payload so every later compare reads the same truth.",
    code: "02",
    label: "Payload row",
    title: "Normalize claim"
  },
  {
    body: "Autokey Cipher, hash, signature, and envelope encryption make mismatched records visible.",
    code: "03",
    label: "Proof strike",
    title: "Seal serial"
  },
  {
    body: "A public code exposes safe fields while private proof material remains server-side.",
    code: "04",
    label: "Lookup rail",
    title: "Release compare"
  }
] as const;

const registerMarks = [
  "Autokey Cipher payload layer",
  "RSA-SHA256 proof signature",
  "AES-GCM encrypted payload",
  "Public serial compare"
] as const;

const audienceSurfaces = [
  {
    body: "Create certificate templates and issue records from a controlled register where every public claim has proof behind it.",
    cta: null,
    eyebrow: "Issuer register",
    title: "Issue records with serial proof."
  },
  {
    body: "Check certificate numbers, recipients, and document hashes from a public-safe verification page.",
    cta: null,
    eyebrow: "Verifier rail",
    title: "Compare authenticity without private internals."
  },
  {
    body: "Inspect the OpenAPI contract when integration teams need the exact request and response surface.",
    eyebrow: "Contract register",
    title: "Keep the contract close to the proof.",
    cta: "Open JSON contract"
  }
] as const;

export function HomeShowcase(): JSX.Element {
  return (
    <main className="page-shell page-shell-home">
      <section className="masthead">
        <TrustAnchorWordmark detail="Engraved proof register" />

        <nav className="masthead-actions" aria-label="Primary navigation">
          <span className="status-pill status-pill-verified">Serial register online</span>
          <Link className="text-link" href="/api/openapi.json">
            OpenAPI
          </Link>
          <InternalNavAction />
        </nav>
      </section>

      <section className="register-hero" aria-labelledby="home-heading">
        <div className="serial-lookup-panel register-surface register-surface-strong reveal-surface">
          <span className="register-tab">Public serial lookup</span>
          <div className="section-stack">
            <span className="section-kicker">Register compare ready</span>
            <h1 className="hero-title" id="home-heading">
              Match the certificate serial to the proof register.
            </h1>
            <p className="lead-copy">
              TrustAnchor helps institutions issue anti-counterfeit digital certificates with Autokey Cipher,
              signatures, envelope encryption, audit logs, and public verification that can be checked in seconds.
            </p>
          </div>

          <VerificationLookupForm />

          <div className="serial-footer" aria-label="Public verification checks">
            <span>Checks hash</span>
            <span>Reads status</span>
            <span>Shows safe claims</span>
          </div>
        </div>

        <aside className="plate-stage reveal-surface" aria-label="Serial proof register plate">
          <div className="plate-proof plate-proof-underlay" aria-hidden="true" />
          <div className="plate-proof plate-proof-main">
            <div className="plate-ruler" aria-hidden="true" />
            <div className="plate-header">
              <span>TrustAnchor</span>
              <strong>Serial Register</strong>
            </div>
            <div className="serial-compare-window" aria-hidden="true">
              <div>
                <span>Presented serial</span>
                <code>TA-0F5N9A7K2Q</code>
              </div>
              <div>
                <span>Registry serial</span>
                <code>TA-0F5N9A7K2Q</code>
              </div>
            </div>
            <div className="microprint-lines" aria-hidden="true">
              <span>SHA256 RSA-PSS AES256GCM AUTOKEY VERIFIED SHA256 RSA-PSS AES256GCM AUTOKEY VERIFIED</span>
              <span>ISSUER REGISTER SERIAL MATCH PROOF MATERIAL SEALED PUBLIC CLAIM SAFE</span>
            </div>
            <div className="serial-proof">
              <span>verification_code</span>
              <code>TA-0F5N9A7K2Q</code>
            </div>
          </div>
          <div className="micro-ledger-strip" aria-hidden="true">
            {registerMarks.map((mark) => (
              <span key={mark}>{mark}</span>
            ))}
          </div>
        </aside>

        <InternalAccessPanel />
      </section>

      <section className="register-band register-surface reveal-surface">
        <div className="section-stack section-stack-inline">
          <span className="section-kicker">Register passes</span>
          <h2 className="section-title">A valid certificate moves through four serial decisions.</h2>
        </div>

        <div className="register-grid">
          {registerPasses.map((step) => (
            <article className="register-pass" key={step.code}>
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
          <article className="audience-panel register-surface reveal-surface" key={surface.eyebrow}>
            <span className="register-tab">{surface.eyebrow}</span>
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
