# TrustAnchor Design Contract

## 1. Design Intent and Product Personality
TrustAnchor should feel like a banknote intaglio plate proof and serial-number register. The product work is to seal a credential, preserve its proof trail, and let a verifier compare the presented code against a trusted register.

This is a zero-based redesign. Existing UI code remains useful for behavior, routes, content, accessibility, and data contracts only. The prior sunlit forensic registry light table and older civic signal observatory direction are blocked as visual continuity.

Product personality:
- Engraved
- Exact
- Institutional
- Tamper-evident
- Quietly authoritative

## 2. Audience and Use-Context Signals
Primary audiences:
- Institution administrators who issue certificate records and manage templates.
- Authorized officers who check documents during review or service delivery.
- Public recipients who need to prove that a certificate is genuine.

Use-context signals:
- The first public action is verifying a code or QR-linked record.
- Admin users need compact ledgers for templates, issuances, revocation, and audit events.
- Proof values must read like serial numbers and register entries, not marketing copy.
- Invalid, revoked, and tampered states must be visible without relying on color alone.

Confirmed inputs:
- The app uses Next.js App Router with TypeScript.
- `/` is the public verification entry and product overview.
- `/login` is the controlled admin entry.
- `/verify/[verificationCode]` presents the public verification result.
- `/verify/[verificationCode]/print` presents the print-ready certificate artifact.
- TrustAnchor centers on digital signatures, Autokey Cipher payload transformation, double encryption, audit logging, QR lookup, and instant verification.

## 3. Visual Direction and Distinctive Moves
### Chosen Conceptual Anchor
Banknote intaglio plate proof and serial-number register.

Source domain:
- Security printing.
- Intaglio plate proofs.
- Banknote serial registers.
- Microprint and anti-counterfeit proof review.

Specific reference point:
- A banknote plate proof sheet paired with a serial-number register, where engraved line weight, paper tone, overprint marks, serial rows, and proof comparison make authenticity legible.

Rationale:
TrustAnchor verifies whether a certificate record is authentic and unchanged. A banknote proof register gives the UI a stronger anti-counterfeit grammar than generic credential dashboards: serial comparison, register rows, engraved role contrast, and controlled exception states.

Distinctive moves:
- Public verification uses a serial register compare surface instead of a card grid.
- Verification state changes use serial-compare flip motion.
- Proof values use OCR-style monospace with tabular numbers and slashed zero.
- Display headings use a heavy condensed engraved voice with sharp role contrast.
- Admin surfaces use compact micro-ledger rails instead of sidebar-first admin chrome.
- Revoked or invalid proof states behave like mismatched overprint or struck register entries.

Asset roles:
- Hero composition is locked as a serial register plate: a public lookup panel paired with an abstract plate-proof register showing presented serial, registry serial, microprint lines, and a compact proof rail.
- Primary visual asset is code-native and functional: it explains serial comparison, proof registration, and anti-counterfeit linework without depicting a real banknote or currency.
- Secondary asset roles are QR proof, serial values, micro-ledger rails, and struck-register state marks.
- Assets must not become wallpaper, generic trust badges, decorative certificate mockups, or literal money imagery.

## 4. Color, Typography, Spacing, and Density Decisions
Color behavior:
- Use engraved monochrome as the base: graphite ink over neutral low-chroma ivory paper.
- Keep paper tokens below visible cream dominance; page background must read as precision security paper, not sepia archive.
- Use one warm spot color derived from intaglio reference material for serial alerts or seal emphasis, balanced by neutral shadows and non-brown focus treatment.
- Do not keep the previous porcelain, sky, mint, marigold, coral, ultraviolet palette.
- Do not introduce purple startup gradients, dark slate command shells, or aurora Web3 colors.

Typography:
- Typography classification is `newly-introduced`.
- Display roles use a heavy condensed engraved voice.
- Body copy stays readable and institutional.
- Proof values use OCR-style monospace with `tabular-nums` and slashed-zero behavior where available.
- The old `Bahnschrift`/`DIN Condensed` display, `Aptos`/`Segoe UI` body, and `IBM Plex Mono` proof trio is blocked as historical direction.
- Implementation fallback chains must not include `Arial Narrow`, `Bahnschrift`, `DIN Condensed`, `Segoe UI`, `Noto Sans`, `SFMono-Regular`, or `Consolas`.

Spacing and density:
- Spacing derives from compact micro-ledger rhythm.
- Dense metadata is allowed when serial comparison remains clear.
- Desktop may expose parallel register columns and proof rails.
- Mobile must collapse to a single verification register with the decisive action first.

## 5. Token Architecture and Alias Strategy
Token layers:
- Primitive tokens hold raw color, type scale, radius, border, shadow, spacing, and motion values.
- Semantic tokens express paper, ink, register, serial, accent, proof, verified, revoked, invalid, focus, and audit roles.
- Component tokens consume semantic roles for register rails, serial fields, proof rows, forms, buttons, tables, and status marks.

Rules:
- Components consume semantic tokens instead of raw primitives.
- Exact primitive values remain flexible until implementation and accessibility checks lock them.
- WCAG 2.2 AA contrast is mandatory.
- Motion tokens must include reduced-motion fallbacks.

## 6. Responsive Recomposition Plan
Mobile:
- Promote the verification input and result summary first.
- Collapse micro-ledger rails into a single serial stack.
- Hide secondary proof explanation behind progressive disclosure when needed.

Tablet:
- Pair verification input with the most important proof register.
- Move admin ledger filters above rows instead of compressing a desktop table.

Desktop:
- Use compact register columns and serial rails to show context without becoming a generic dashboard.
- Keep public verification visibly different from internal issuance and audit surfaces.

Forbidden:
- Scale-only shrink.
- Card-grid feature walls.
- Sidebar-first admin chrome as the primary identity.
- Desktop overlaps or dense rails that make proof values unreadable.

## 7. Motion, Interaction, and Feedback Rules
Motion is proof comparison behavior:
- Use serial-compare flip motion for verification state changes.
- Use manifest handoff motion when proof details move from lookup to result.
- Use register-row strike or overprint behavior for revoked, invalid, or tampered states.
- Keep high-frequency motion on transform and opacity.
- Stop non-essential motion under `prefers-reduced-motion`.

Interaction rules:
- Focus states must be visible and read like a register selection mark.
- Loading states must reserve the same shape as final register rows.
- Error states must include text and not rely on warm accent color alone.
- Public verification must remain keyboard usable.

## 8. Component Language, States, and Morphology
Core morphology:
- Tight register rails.
- Engraved linework and fine borders used as functional separators.
- Serial-number fields with strong alignment.
- Low-radius forms and proof blocks.
- Compact status marks that include readable text.

State behavior:
- Default: quiet graphite and ivory register surface.
- Hover: controlled ink-weight or row-emphasis change.
- Focus-visible: strong outline plus offset.
- Active: slight press or flip commitment.
- Loading: skeleton serial rows matching real content.
- Success: verified serial match with warm accent used sparingly.
- Error: mismatch or tamper language with explicit message text.
- Revoked: struck register entry with readable revoked copy.

## 9. Source Boundaries and Context Hygiene
Used sources:
- Current repository routes, components, and API behavior.
- `docs/project-brief.md`, `docs/flow-overview.md`, and `docs/api-contract.md`.
- Existing UI only as behavior evidence.
- External references as mechanics and quality bars only: OpenCerts, Rootproof, TrueCerta, IBM Digital Credentials, W3C Verifiable Credentials Data Model 2.0, and 1EdTech Open Badges 3.0.

Boundaries:
- Do not copy external layout rhythm, palette, component skin, visual metaphor, or brand posture.
- Do not revive the sunlit forensic registry light table unless the user explicitly approves continuity later.
- Do not revive the civic signal observatory direction.

## 10. Accessibility Non-Negotiables
- WCAG 2.2 AA is the floor.
- Interactive targets must be at least 44px high when touch is expected.
- Focus must be visible on links, buttons, inputs, and disclosure controls.
- Status must include readable text beyond color.
- Form errors must be local and visible.
- Reduced motion must stop non-essential animation.
- Proof strings must wrap, scroll, or truncate only with clear access to the full value.

## 11. Anti-Patterns to Avoid
- Generic SaaS admin chrome.
- Equal-weight card grids.
- Purple startup gradients.
- Dark slate command shells.
- Aurora or Web3 proof atmospheres.
- Shield/check/badge icon wallpaper.
- Decorative certificate mockups.
- Daylight sweeps, paper lifts, color-tab feedback, or stamp-settle motion from the blocked light-table direction.
- The old condensed/sans/mono font trio.

## 12. Implementation Notes for Future UI Tasks
- Start future UI work from `docs/design-intent.json`.
- Treat the selected anchor as a behavior source, not a literal banknote skin.
- Keep the serial register plate functional; future assets must explain proof comparison, QR lookup, or register state.
- Add a new UI, motion, icon, or primitive dependency only after official documentation is checked and the design role is recorded.
- Validate with `npm run validate`, responsive inspection, keyboard flow, reduced-motion behavior, and contrast checks before claiming a UI implementation is complete.

## Research Dossier Summary
Approved Section 5 anchor:
- Primary anchor: Banknote intaglio plate proof and serial-number register.
- Palette direction: engraved monochrome plus one warm security accent.
- Signature moves: serial-compare flip motion, engraved type contrast, and compact micro-ledger rail composition.

Token continuity classification:
- Typography: `newly-introduced`.
- Palette: `anchor-derived`.
- Motion: `anchor-derived`.
- Spacing: `anchor-derived`.

Anti-repeat blocklist:
- Previous anchors: Sunlit Forensic Registry Light Table; Civic Signal Observatory.
- Previous palette: porcelain paper, graphite ink, sky inspection light, mint verification, marigold audit tabs, coral caution, ultraviolet hidden layers; midnight observatory palette.
- Previous motion: daylight sweep, paper lift, color-tab feedback, status stamp settlement, orbit rings, scanner circles, telemetry lane motion.
- Previous typography: condensed inspection headings, civic sans body copy, compact uppercase labels, monospaced microprint proof values.

Category-code rejection:
- Credential SaaS typography and gradient hero patterns are rejected.
- Public-sector verifier navy/orange portal patterns are rejected.
- Security proof console condensed-plus-mono defaults are rejected unless explicitly classified as continuity, which this redesign does not do.
- Admin KPI-card and table-first chrome is rejected as the product identity.

Next validation action:
- Validate the implemented serial register plate across desktop and mobile, then run `npm run validate`.
