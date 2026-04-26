# TrustAnchor Design Contract

## 1. Design Intent and Product Personality
TrustAnchor should now feel like a forensic document light table: precise, physical, and evidence-led. The interface should make users feel they are placing a certificate under controlled light, checking layers, and reading only the public proof needed to trust the record.

This is a zero-based redesign. Existing UI code is used for route behavior, copy needs, form contracts, and accessibility evidence only. The old observatory metaphor, orbit graphics, signal rings, balanced grid rhythm, and prior palette are discarded.

Product personality:
- Forensic
- Institutional
- Tactile
- Exacting
- Quietly high-tech

## 2. Audience and Use-Context Signals
Primary audiences:
- Institution administrators issuing certificate records
- Authorized officers checking records during service or review
- Public recipients proving that a certificate is genuine

Use-context signals:
- Verification remains the first decisive action on mobile
- Proof strings, hashes, and verification codes must read like evidence labels
- Admin login should feel like controlled access to an evidence bench
- Public result pages should feel like a document inspection sheet, not a dashboard

Confirmed inputs:
- The app is a Next.js App Router application
- `/` is the public verification entry and product overview
- `/login` is the controlled admin entry
- `/verify/[verificationCode]` presents the public verification result
- `/verify/[verificationCode]/print` presents the print-ready certificate artifact
- TrustAnchor centers on digital signatures, double encryption, audit logging, and instant verification

## 3. Visual Direction and Distinctive Moves
### Chosen Conceptual Anchor
Forensic Light Table

Source domain:
- Forensic document examination benches
- Oblique light inspection
- UV security ink review
- Microprint and registration mark systems

Specific reference point:
- A document examiner's illuminated light table with translucent vellum overlays, registration rulers, edge clamps, and UV-reactive security fibers.

Rationale:
TrustAnchor is about proving that a document has not been counterfeited. A forensic light table fits that work better than generic security dashboards because it gives the UI a physical inspection language: layered sheets, alignment marks, public-safe redaction, and proof bands.

Distinctive moves:
- Landing page starts as an angled inspection bench with a verification slip in the strongest light
- Certificate proof is shown as layered paper, not equal cards
- Microprint rails and registration ticks frame important values
- Login becomes an operator access drawer beside the inspection surface
- Verification results read like a stamped public evidence sheet
- Print-ready certificate artifacts read like formal evidence sheets placed on the same light table

### Visual Reset Strategy
Old visual DNA being discarded:
- Civic signal observatory metaphor
- Orbit rings and scanner circles
- Porcelain and midnight observatory palette
- Equal-height instrument panels
- Telemetry lane language

New direction:
- Warm lab paper, graphite ink, cyan inspection light, ultraviolet violet, ember seal, and verified green
- Layered evidence sheets with slight rotation and clipped corners
- Fine registration grids, ruler marks, microprint rails, and clamp-like headers
- CSS-only light sweep and paper lift motion with reduced-motion fallback

## 4. Color, Typography, Spacing, and Density Decisions
Color behavior:
- Lab paper and graphite create a document-first reading surface
- Cyan blue represents inspection light and primary action
- Ultraviolet violet highlights encrypted or hidden proof layers
- Ember marks audit and seal moments
- Green marks verified public status

Typography:
- Display text uses a condensed technical voice for inspection headings
- Body text uses a readable civic sans stack
- Metadata labels stay compact and uppercase
- Proof values use monospaced type and microprint containment

Spacing and density:
- Use a 10px inspection rhythm rather than the previous 8px observatory rhythm
- Desktop compositions should overlap and layer surfaces like papers on a bench
- Mobile collapses into one clean inspection stack with verification first
- Dense proof metadata is acceptable only when hierarchy and wrapping stay clear

## 5. Token Architecture and Alias Strategy
Token layers:
- Primitive tokens hold raw colors, radius, shadows, spacing, and motion durations
- Semantic tokens express bench, sheet, ink, grid, action, verified, audit, danger, and ultraviolet roles
- Component tokens consume semantic roles for evidence sheets, clamps, proof rails, forms, and buttons

Rules:
- Components consume semantic tokens instead of raw values
- Focus, hover, loading, error, and success states must work across public and admin surfaces
- Motion values must include reduced-motion fallbacks

## 6. Responsive Recomposition Plan
Mobile:
- Verification form appears first as a focused evidence slip
- Layered document visual becomes a compact stacked sheet below the form
- Trust steps collapse into a numbered inspection sequence

Tablet:
- Verification and document preview form two stacked bands
- Audience sections become two-column only when content stays readable

Desktop:
- Use a wide inspection bench: verification slip, document specimen, and proof rail visible together
- Allow controlled overlap and rotation to create a physical surface
- Keep the primary verification action visually dominant

Forbidden:
- Scale-only shrink
- Preserving desktop overlap on narrow screens
- Reusing the observatory orbit or signal-ring visual system
- Generic dashboard sidebars or card grids

## 7. Motion, Interaction, and Feedback Rules
Motion is inspection behavior:
- Evidence sheets lift a few pixels on hover
- Light bands sweep slowly across specimen surfaces
- Buttons compress like physical controls
- Inputs brighten as if moved under stronger light
- Result status stamps settle into place
- All non-essential motion stops under `prefers-reduced-motion`

No new animation dependency is required for this slice. CSS transforms, opacity, and pseudo-elements are enough for the current interaction depth.

## 8. Component Language, States, and Morphology
Core morphology:
- Low-radius evidence sheets
- Clamped headers and ruler rails
- Layered paper overlaps
- Monospaced proof labels
- Strong focus outlines that read like inspection marks

State behavior:
- Hover increases light and lift
- Focus uses a cyan outline with offset
- Active states compress slightly
- Disabled states stay legible
- Errors use message text and color together

## 9. Source Boundaries and Context Hygiene
Used sources:
- Current repository routes and UI behavior
- Project brief, architecture decision record, API contract, database schema, and flow overview
- Existing UI as behavior evidence only

QR rendering uses the project dependency `qrcode-generator`; no new animation, icon, canvas, or UI primitive library is added.

## 10. Accessibility Non-Negotiables
- WCAG 2.2 AA is the floor
- Focus must be visible on links, buttons, and inputs
- Interactive targets must be at least 44px high
- Status must include readable text, not color alone
- Form errors must be local and visible
- Public verification and login must remain keyboard usable
- Reduced motion must stop non-essential animation

## 11. Anti-Patterns to Avoid
- Observatory signal rings from the previous concept
- Generic SaaS dashboard chrome
- Purple-only gradient shells
- Equal-weight card grids
- Decorative motion that hides form work
- Proof strings styled like marketing copy

## 12. Implementation Notes for Future UI Tasks
- Preserve route behavior and API contracts while changing composition freely
- Add future admin and certificate artifact pages as evidence workflows, not generic dashboards
- Keep proof metadata readable before adding more ornament
- Introduce a UI or motion dependency only after live official docs are checked and a clear interaction need exists

## Assumptions To Validate
- The forensic inspection metaphor feels credible for education and public-sector users
- Public verification may safely show recipient name, certificate number, institution, template, and hash
- Bootstrap admin login remains enough for the current local development slice

## Next Validation Action
Begin Phase 8 by validating security-hardening UI states for rate limiting, CSRF failures, type safety, lint, responsive behavior, reduced motion, and the project PR checklist.
