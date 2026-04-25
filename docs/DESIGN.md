# TrustAnchor Design Contract

## 1. Design Intent and Product Personality
TrustAnchor should feel like a civic signal instrument for certificate authenticity. The interface must make proof feel observable, locked, and readable within one scan for institutions, public officers, and recipients.

This redesign is a new concept pass. Existing frontend code is used only for route behavior, copy requirements, form contracts, and accessibility evidence. It is not a visual continuity source.

Product personality:
- Civic
- Signal-led
- Precise
- Calm under scrutiny
- Operationally assured

## 2. Audience and Use-Context Signals
Primary audiences:
- Institution administrators issuing certificates from a controlled workspace
- Authorized officers validating records during service or review
- Public recipients proving that a certificate is genuine

Use-context signals:
- Verification must be the first decisive action on small screens
- Public users need status language that is readable under pressure
- Admin access must feel controlled without becoming a generic dashboard
- Proof strings, hashes, and verification codes must look materially different from narrative copy

Confirmed inputs:
- The app is a Next.js App Router application
- `/` is the public verification entry and product overview
- `/login` is the controlled admin entry
- `/verify/[verificationCode]` presents the public verification result
- TrustAnchor centers on digital signatures, double encryption, audit logging, and instant verification

## 3. Visual Direction and Distinctive Moves
### Chosen Conceptual Anchor
Civic Signal Observatory

Source domain:
- Scientific observatories
- Public infrastructure control rooms
- Telemetry monitoring

Rationale:
TrustAnchor turns document authenticity into a verifiable public signal. A civic signal observatory gives the interface a strong non-dashboard metaphor: signal rings, proof lanes, live telemetry, and controlled reading surfaces. It fits the product better than decorative security metaphors because verification is an act of observing evidence, not just storing data.

Distinctive moves:
- A live signal field on the landing page that frames verification as the primary operation
- Concentric scanner rings and proof ticks built in CSS, with reduced-motion fallbacks
- Asymmetric lanes instead of equal-weight card grids
- Report pages that read like signal confirmation sheets, not simple success cards
- Admin login as an access console attached to the same proof network

### Visual Reset Strategy
Old visual DNA being discarded:
- Frosted SaaS panels
- Teal/brass continuity
- Generic rounded card repetition
- Balanced hero/card grid composition
- Static proof presentation

New direction:
- Porcelain, midnight ink, civic blue, oxide, and signal green palette
- Ruled observatory surfaces with low-radius frames
- Signal rings, scan sweeps, lane dividers, and registry ticks
- Rich but purposeful CSS motion using transforms and opacity

## 4. Color, Typography, Spacing, and Density Decisions
Color behavior:
- Porcelain and paper tones carry public readability
- Midnight ink establishes authority
- Civic blue is the main action and navigation color
- Signal green marks valid/live states
- Oxide and amber distinguish caution, audit, and invalid states

Typography:
- Display text is assertive but not theatrical
- Body text stays civic and readable
- Metadata labels remain compact and explicit
- Proof strings use monospaced treatment with strong containment

Spacing and density:
- Use an 8px base rhythm
- Prefer long proof lanes and section bands over card piles
- Keep mobile verification-first and single-task focused
- Desktop may expose more telemetry, but must not equalize every surface

## 5. Token Architecture and Alias Strategy
Token layers:
- Primitive tokens hold raw colors, radius, shadow, spacing, and motion durations
- Semantic tokens express page, surface, text, border, action, valid, warning, and danger roles
- Component tokens consume semantic roles for signal panels, proof lanes, report frames, and buttons

Rules:
- Components should consume semantic tokens instead of raw color values
- Interactive states must be shared across landing, login, verification, and not-found screens
- Motion values must have reduced-motion alternatives

## 6. Responsive Recomposition Plan
Mobile:
- Verification console appears before product narrative
- Signal visualization becomes compact and secondary
- Trust chain surfaces become a vertical proof sequence

Tablet:
- Verification and signal summary form a two-band composition
- Supporting proof lanes are paired, not miniaturized desktop

Desktop:
- Use asymmetric observatory lanes: narrative, verification console, and signal telemetry
- Keep verification visually dominant through placement and contrast
- Avoid centered hero symmetry

Forbidden:
- Scale-only shrink
- Preserving desktop order on mobile without product reason
- Equal-weight card rows as default layout

## 7. Motion, Interaction, and Feedback Rules
Motion is functional signal behavior:
- Page sections reveal with short opacity and vertical movement
- Scanner rings rotate slowly on desktop
- Scan lines and signal bars pulse to imply live verification readiness
- Form and button states use immediate transform and border feedback
- All non-essential motion stops under `prefers-reduced-motion`

No new animation dependency is required for this slice. The current surface can meet the motion goal with CSS transforms, opacity, and pseudo-elements, keeping runtime cost low.

## 8. Component Language, States, and Morphology
Core morphology:
- Low-radius framed instruments
- Ruled lanes and dividers
- Monospaced proof blocks
- Signal chips with text plus color, never color alone
- Buttons with clear solid primary treatment and visible focus

State behavior:
- Hover increases border strength or controlled lift
- Focus uses high-contrast outline with offset
- Active compresses slightly
- Disabled remains legible
- Errors use text and color together

## 9. Source Boundaries and Context Hygiene
Used sources:
- Current repository routes and UI behavior
- Project brief, ADR, API contract, database schema, and flow overview
- User-provided frontend library research file
- Existing design docs as content to refine, not visual continuity to preserve

Research used from the user file:
- Prefer controlled transform/opacity motion before adding heavy animation stacks
- Preserve accessibility and native browser behavior
- Favor code ownership and small composable UI surfaces
- Treat motion as interaction feedback, not decoration

Research deliberately not adopted:
- No Lenis, GSAP, Rive, Lottie, WebGL, or page-transition library is added because this app has a small public/auth surface and does not yet need dependency-level orchestration.

## 10. Accessibility Non-Negotiables
- WCAG 2.2 AA is the floor
- Focus must be visible on links, buttons, and inputs
- Interactive targets must be at least 44px high
- Status must include readable text
- Form errors must be local and visible
- Public verification and login must remain keyboard usable
- Reduced motion must stop non-essential animation

## 11. Anti-Patterns to Avoid
- Generic SaaS dashboards
- Frosted glass as the primary style
- Purple gradient startup shells
- Decorative security padlock metaphors as the main visual idea
- Equal-weight card grids
- Motion that hides the verification action

## 12. Implementation Notes for Future UI Tasks
- Preserve route behavior and API contracts while allowing visual recomposition
- Keep public verification dominant across viewports
- Add future admin surfaces as controlled proof workflows, not generic dashboard pages
- Introduce a motion/UI dependency only after live official documentation is checked and a real interaction need exists

## Assumptions To Validate
- Public verification may safely show recipient name, certificate number, institution, template, and hash
- A login gateway is enough for the current admin-facing UI slice
- The civic signal observatory anchor reads as official and reassuring for education and public-sector users

## Next Validation Action
Implement the new observatory-style frontend across landing, login, verification result, and not-found states, then validate type safety, build output, responsiveness, reduced motion, and accessibility-relevant UI states.
