# TrustAnchor Design Contract

## 1. Design Intent and Product Personality
TrustAnchor should feel like a public trust instrument, not a startup dashboard. The interface must communicate institutional authority, verification clarity, and proof-chain discipline for education bodies and government agencies.

This redesign resets the UI from zero. Existing frontend code remains useful only as route, behavior, and content evidence. It is not a visual reference.

The product personality is:
- Civic
- Forensic
- Deliberate
- Assuring
- Structured under pressure

## 2. Audience and Use-Context Signals
The main audiences are:
- Institution administrators issuing certificates in a controlled workspace
- Authorized officers verifying authenticity during a review or service flow
- Public recipients proving that a document is genuine

Use-context signals:
- Users need confidence fast, not decorative storytelling first
- Verification is often performed under time pressure and partial trust
- Public verification must feel official without feeling bureaucratically dense
- Admin access should feel controlled and high-accountability

Confirmed inputs:
- The app is a Next.js web application
- `/` is the public-facing landing and verification entry
- `/login` is the controlled admin entry
- `/verify/[verificationCode]` presents the public verification result
- The product promise centers on digital signatures, double encryption, audit logging, and instant verification

## 3. Visual Direction and Distinctive Moves
### Chosen conceptual anchor
Forensic light table

Source domain:
- Scientific instrumentation
- Archival examination

Rationale:
TrustAnchor exists to inspect authenticity, surface proof, and make trust legible. A forensic light table gives us a strong mental model: layered records, illuminated evidence, ruled surfaces, and precise reading zones. That fits better than a generic dashboard shell because the product is about examination and proof, not general administration.

Distinctive moves:
- Large editorial headline zones paired with instrument-style data strips
- Surfaces that look layered and indexed instead of card-based
- Verification as the visual center of gravity on small screens
- Thin ruled borders, evidence labels, and coded metadata for official tone
- A report-like verification result page instead of a success card grid

### Visual reset strategy
Old visual DNA being discarded:
- Frosted SaaS-style panels
- Teal-and-brass continuity
- Three-column balanced stage composition
- Generic rounded cards as the primary surface language

New direction being selected:
- Bone, ink, cobalt, and signal-lime palette
- Layered dossier surfaces with ruled separators
- Editorial asymmetry and vertical rhythm over symmetric card grids
- Evidence-led hierarchy where verification and proof states dominate composition

## 4. Color, Typography, Spacing, and Density Decisions
### Color behavior
The palette must feel official and technical, not luxurious or playful.

Primary roles:
- Bone paper backgrounds for calm, document-like reading
- Deep ink for authority and contrast
- Cobalt as the main institutional action color
- Signal-lime for live verification and success states
- Amber for audit and caution emphasis
- Coral-red for destructive or invalid states

### Typography
Typography is split by purpose:
- Display: strong, modern, slightly compressed for decisive headlines
- Body: civic and readable for dense operational copy
- Code and proof strings: monospaced and visibly separate from narrative text

Role rules:
- Headline typography carries product confidence
- Body typography supports dense operational reading
- Metadata and labels use uppercase tracking sparingly to create registry cues
- Proof data must never share the same treatment as marketing copy

### Spacing and density
The system uses tighter density than a marketing site, but avoids cramped admin chrome.

Density rules:
- Mobile prioritizes a single decisive action at a time
- Tablet groups related proof surfaces into stacked bands
- Desktop uses width for reading lanes, not for extra filler modules

## 5. Token Architecture and Alias Strategy
Token layers:
- Primitive tokens store raw OKLCH colors, type sizes, spacing, radius, and shadow values
- Semantic tokens express intent such as page background, panel border, verification accent, or muted body copy
- Component tokens consume semantic aliases for surfaces such as lookup panel, report frame, signal chip, and action button

Rules:
- Components must not reference raw primitive values directly
- All new surfaces should inherit from the semantic layer first
- State styling must stay coherent across home, login, verification, and not-found screens

## 6. Responsive Recomposition Plan
Responsive behavior must change information order, not only width.

Mobile:
- Verification panel becomes the first primary task on the landing page
- Secondary narrative collapses into supporting sections below the form
- Trust-chain and audience surfaces become vertical stacks

Tablet:
- Home page keeps a two-band rhythm with verification still promoted
- Detail surfaces compress into paired columns instead of miniature desktop replicas

Desktop:
- Narrative and verification can sit in tension, but the proof-action surface must remain visually dominant
- Auxiliary information belongs in side rails and sectional bands, not equal-weight card grids

Explicitly forbidden:
- Preserving desktop order on mobile without reason
- Centered generic hero with identical supporting cards
- Turning verification result into a simple green success card

## 7. Motion, Interaction, and Feedback Rules
Motion should reinforce trust, not decorate it.

Rules:
- Use soft vertical reveal and panel drift for page-load hierarchy
- Use restrained hover elevation and border-intensity shifts for interactive surfaces
- Keep motion transform-and-opacity based
- Respect reduced motion preferences and remove non-essential choreography

Feedback:
- Primary buttons should feel immediate and clear
- Form errors must be visible, local, and text-based
- Status chips should carry both color and text meaning

## 8. Component Language, States, and Morphology
Core morphology:
- Framed panels with layered inner borders
- Section rails and report dividers instead of repeated rounded cards
- Code fields and proof blocks with monospaced alignment and strong containment

Required state behavior:
- Default: structured and calm
- Hover: stronger border or surface lift, never dramatic glow
- Focus: high-contrast visible outline with enough offset
- Active: slightly compressed or darkened feedback
- Disabled: muted contrast without losing legibility
- Loading: status copy changes first, visual motion second
- Error: red and text treatment together, never color alone

## 9. Source Boundaries and Context Hygiene
Valid sources for this redesign:
- Current repo routes and frontend behavior
- The project brief, ADR, API contract, database schema, and flow overview
- The user’s request for a full redesign from zero
- Official documentation only when framework or dependency choices matter

Invalid sources:
- Old visual continuity from the existing frontend
- Generic dashboard habits
- Unrelated product screenshots or remembered layouts

## 10. Accessibility Non-Negotiables
- WCAG 2.2 AA is the hard floor
- Focus indicators must be visible on all interactive controls
- Minimum target size is 44px
- Contrast must remain strong on all proof, metadata, and body text
- Status must never rely on color alone
- Public verification and admin login must remain keyboard-usable
- Reduced motion must be respected

## 11. Anti-Patterns to Avoid
- Frosted glass startup UI
- Purple gradients or dark-mode-by-default bias
- Symmetric card grids standing in for information architecture
- Oversized rounded controls with weak institutional tone
- Decorative security metaphors that do not support task clarity
- “Everything is a panel” morphology that hides hierarchy

## 12. Implementation Notes for Future UI Tasks
- Keep the landing page centered on verification confidence, not generic product marketing
- Preserve route behavior while allowing visual and structural rewrites
- Prefer CSS variables and semantic tokens over route-local hardcoded values
- Add UI surfaces in feature-oriented modules, not a giant shared catch-all
- If a new animation or UI library is ever considered, verify current official docs first and document the reason before adoption

## Assumptions To Validate
- Public verification may safely display recipient name, certificate number, institution, and template name
- The first admin surface can remain a controlled login gateway without a full internal dashboard
- The “forensic light table” anchor reads as trust-building rather than intimidating for target institutions

## Next Validation Action
Implement the zero-based frontend reset across the public landing page, admin login page, verification result page, and not-found state, then validate accessibility, hierarchy, and responsive recomposition against this contract.
