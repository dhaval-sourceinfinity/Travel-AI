# AGENT.md --- Travel AI

> Production implementation contract for the Travel AI website built
> with **HTML, CSS, and vanilla JavaScript**, using Figma MCP as the
> design-to-code reference.

## 1. Project Mission

Build Travel AI as a premium, editorial travel experience where AI helps
users discover and shape journeys.

The supplied reference screens establish the current visual direction
for:

-   Home
-   Journeys / package listing
-   Journey / package details
-   Contact
-   Travel AI chat and its conversation states

These screenshots are **visual references**, not a license to hard-code
their dimensions or copy placeholder content.

### Product principles

-   Premium, calm, editorial
-   Photography-led
-   Human and trustworthy
-   AI-assisted, not "generic chatbot"
-   Minimal and intentional
-   Fast
-   Accessible
-   Responsive at every viewport
-   Maintainable as the site grows

------------------------------------------------------------------------

# 2. Technology Constraints

## Required

-   Semantic HTML5
-   Modern CSS
-   Vanilla JavaScript / ES modules
-   CSS custom properties for design tokens
-   Native browser APIs where practical

## Avoid by default

-   React/Vue/Angular
-   Bootstrap/Tailwind unless explicitly approved
-   Large UI component libraries
-   jQuery
-   Inline event handlers
-   Inline styles
-   Unnecessary third-party dependencies

The goal is a lightweight production frontend, not a framework
migration.

------------------------------------------------------------------------

# 3. Source-of-Truth Hierarchy & Project Contracts

## Core Project Contracts

The project is governed by three primary contracts with distinct responsibilities:

-   **`AGENT.md`**: How the AI agent should work, engineer, and implement the product (workflow, architecture, code standards, and constraints).
-   **`DESIGN.md`**: What the product should look like (visual language, aesthetic direction, color, typography, layout rhythm, and component styling).
-   **`MOTION.md`**: How motion and animation should be selected, structured, implemented, and validated (the authoritative motion implementation contract).

For any motion-specific decisions, **`MOTION.md` is the authoritative source of truth**. Do not invent ad-hoc animations, keyframes, or external animation libraries outside its catalog.

## Source-of-Truth Priority

When implementing a screen, use this priority:

1.  Approved Figma design and Figma variables/components (defines page-specific visual and motion intent)
2.  `DESIGN.md` (defines visual language and design system)
3.  `MOTION.md` (defines motion architecture, selection rules, and primitive catalog when motion is involved)
4.  Existing implementation conventions (`css/`, `js/` — defines what is actually supported in the browser)
5.  Product requirements / functional requirements
6.  Supplied screenshots
7.  Developer judgement

If two sources conflict, preserve the **design intent and responsive behavior**, not a literal pixel measurement.

Never reproduce an accidental Figma overflow, clipped element, or desktop-only constraint.

## Document & Implementation Workflow

Adhere to this sequential workflow:

``` text
Figma MCP
→ AGENT.md (engineering rules & constraints)
→ DESIGN.md (visual system & styling)
→ MOTION.md (when motion/animation is involved)
→ Inspect existing implementation (tokens.css, motion.css, components.css, site.js)
→ Motion Map (mandatory before coding motion)
→ Implementation (semantic HTML, scoped CSS, modular JS)
→ Responsive / Accessibility / Performance QA
```

------------------------------------------------------------------------

# 4. Figma MCP Workflow

## Before implementation

Use Figma MCP to inspect the relevant frame and determine:

-   Page/frame dimensions
-   Desktop/tablet/mobile variants
-   Component structure
-   Auto-layout behavior
-   Grid/layout rules
-   Typography styles
-   Color variables
-   Spacing variables
-   Border/radius values
-   Image aspect ratios
-   Icons
-   Interactive states
-   Hover/focus/active/disabled states
-   Modal/chat states
-   Content hierarchy
-   Motion and interaction intent (transitions, reveals, scroll-linked behaviors)

## Implementation sequence

1.  Inspect Figma.
2.  Map repeated patterns into reusable components.
3.  Extract tokens.
4.  Build semantic page structure.
5.  Build desktop composition.
6.  Add responsive composition.
7.  Add interaction states.
8.  If the page involves motion or animation:
    -   Read `.ai/MOTION.md`.
    -   Inspect the existing motion implementation in `css/motion.css` and `js/site.js` before inventing anything new.
    -   Create a Motion Map following the mandatory schema defined in `MOTION.md`.
    -   Implement motion derived from approved Figma intent using the canonical `[data-motion]` system defined in `MOTION.md`.
9.  Validate against Figma.
10. Test real viewport sizes.
11. Fix visual differences without introducing fragile CSS.

## Motion in the Figma Workflow

When a page or component contains meaningful motion:

-   **Read `.ai/MOTION.md`**: Consult `MOTION.md` as the authoritative contract before choosing any animation.
-   **Inspect Code First**: Verify existing primitives and tokens in `css/motion.css`, `css/tokens.css`, and `js/site.js` to reuse supported behaviors.
-   **Draft a Motion Map**: Before writing animation markup or CSS, create a Motion Map adhering to the mandatory structure specified in `MOTION.md` (Element, Primitive, Trigger, Priority, Desktop/Mobile/Reduced-motion behavior).
-   **Canonical Implementation**: Apply approved Figma motion intent exclusively via the canonical `[data-motion]` primitives defined in `MOTION.md`.

## Important

Do not turn every Figma layer into an HTML element.

Translate Figma's visual composition into:

-   Grid
-   Flexbox
-   intrinsic sizing
-   `minmax()`
-   `clamp()`
-   `min()`
-   `max()`
-   container queries where useful

------------------------------------------------------------------------

# 5. Required Project Structure

Use a structure similar to:

``` text
travel-ai/
├── index.html
├── pages/
│   ├── journeys.html
│   ├── journey-details.html
│   └── contact.html
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── videos/
│
├── css/
│   ├── tokens.css
│   ├── reset.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── pages.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── components/
│   │   ├── header.js
│   │   ├── footer.js
│   │   ├── journey-card.js
│   │   ├── chat.js
│   │   └── modal.js
│   ├── pages/
│   │   ├── home.js
│   │   ├── journeys.js
│   │   ├── journey-details.js
│   │   └── contact.js
│   └── utils/
│       ├── dom.js
│       ├── validation.js
│       └── storage.js
│
├── data/
│   └── journeys.js
│
├── AGENT.md
├── DESIGN.md
└── MOTION.md
```

The exact file count may change as the project evolves, but
responsibilities should remain separated.

------------------------------------------------------------------------

# 6. Architecture Rules

## HTML

-   Use semantic landmarks.
-   One clear primary `<main>` per page.
-   Maintain logical heading order.
-   Use `<button>` for actions.
-   Use `<a>` for navigation.
-   Use `<form>` for forms.
-   Never make a plain `<div>` behave like a button.

## CSS

Organize CSS in this order:

``` text
tokens → reset/base → layout → components → pages → responsive
```

Prefer shallow selectors.

Good:

``` css
.journey-card {}
.journey-card__media {}
.journey-card__content {}
.journey-card__title {}
```

Avoid deeply nested selectors tied to page structure.

## JavaScript

-   Use ES modules.
-   Keep modules small and single-purpose.
-   Avoid global mutable state.
-   Use event delegation for repeated/dynamic controls.
-   Avoid inline `onclick`.
-   Prefer `textContent` for untrusted strings.
-   Do not inject unsanitized API/AI HTML.
-   Handle loading, success, empty, and error states.
-   Do not expose API keys/secrets in frontend code.

## Motion & Animation

All animation and motion implementation is governed strictly by `.ai/MOTION.md`:

-   **Canonical System**: New pages and components must use the canonical `[data-motion]` system defined in `MOTION.md`. If a page uses `[data-motion]`, ensure the shared `css/motion.css` stylesheet is loaded once in the page's stylesheet chain.
-   **Legacy Preservation**: Existing legacy `.reveal` implementations (e.g. on `journeys.html`) must not be broken or refactored during unrelated page work. Migration of legacy `.reveal` usage is a separate controlled task.
-   **Reuse Over Invention**: Reuse existing motion primitives catalogued in `MOTION.md` before creating anything new. Do not create ad-hoc animation systems, arbitrary `@keyframes`, or introduce external animation libraries (such as GSAP or Lenis) when an existing primitive satisfies the approved design intent.
-   **Uncovered Requirements**: If Figma requires motion that the existing system cannot support, flag the gap for explicit implementation review instead of inventing an unsupported solution.
-   **No Inline Timing Styles**: Define timing offsets and stagger variables (`--motion-delay`, `--stagger-base`) in component or page CSS stylesheets, never via inline `style="..."` attributes in HTML.

------------------------------------------------------------------------

# 7. Reusable Component Inventory

Build shared patterns before duplicating them.

### Global

-   Header
-   Mobile navigation
-   Footer
-   Container
-   Section heading
-   Button
-   Icon button
-   Badge/tag
-   Divider

### Travel

-   Journey card
-   Journey metadata
-   Price block
-   Image gallery
-   Feature list
-   Daily schedule
-   Food/diet list
-   Destination card

### Forms

-   Text field
-   Email field
-   Textarea
-   Validation message
-   Submit/loading state
-   Success/error state

### AI

-   Chat shell
-   Chat header
-   AI message
-   User message
-   Quick-reply chip
-   Typing indicator
-   Recommendation card
-   Trip summary
-   Itinerary message
-   Chat empty/error state

A component should be shared when the interaction and visual behavior
are materially the same.

------------------------------------------------------------------------

# 8. Responsive Strategy

Do **not** design desktop first and simply shrink it.

Every major component needs an explicit behavior for:

-   Small mobile
-   Large mobile
-   Tablet
-   Laptop
-   Desktop
-   Large desktop

## Baseline breakpoints

Use these as starting points only:

``` css
--bp-sm: 480px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1536px;
```

Prefer content-driven media/container queries when they produce a better
result.

## Required test widths

``` text
320
360
375
390
414
430
480
768
834
1024
1280
1440
1600
1920
```

Also test short heights:

``` text
320 × 568
390 × 844
768 × 600
1024 × 600
1280 × 720
1440 × 900
```

------------------------------------------------------------------------

# 9. Responsive Rules

## Small mobile

-   One-column content.
-   No horizontal page scrolling.
-   Navigation becomes a menu.
-   Cards stack.
-   Forms become one column.
-   Gallery becomes stacked or swipeable.
-   Long buttons/chips wrap.
-   Chat becomes a viewport-safe sheet/full-screen experience.
-   Footer columns stack.
-   Preserve readable typography; do not solve width by making text
    tiny.

## Tablet

-   Use 1--2 columns based on actual available width.
-   Preserve editorial whitespace.
-   Avoid squeezing two complex desktop columns into insufficient space.

## Laptop

Treat laptop as a first-class target.

A 1024px-wide laptop may have only 600--768px of vertical space.

Therefore:

-   No fixed page-height assumptions.
-   No clipped tabs.
-   No overflowing action rows.
-   Chat body scrolls independently.
-   Forms can reflow.
-   Sidebar can move below content.
-   Navigation must collapse if it no longer fits.

## Large desktop

-   Center content within a max-width.
-   Do not stretch reading text across the entire viewport.
-   Allow imagery to become larger without making the UI feel sparse.
-   Preserve the visual rhythm of the reference.

------------------------------------------------------------------------

# 10. Layout Rules

Prefer:

``` css
.container {
  width: min(100% - 32px, var(--container-max));
  margin-inline: auto;
}
```

and:

``` css
grid-template-columns: repeat(2, minmax(0, 1fr));
```

Avoid:

-   fixed page widths
-   fixed content heights
-   absolute positioning for normal document flow
-   negative-margin hacks
-   viewport-specific pixel nudges
-   `overflow: hidden` used to hide broken layouts

If content grows, the layout must grow.

------------------------------------------------------------------------

# 11. Page Requirements

## Home

Reference flow:

1.  Header
2.  Hero
3.  Destination introduction
4.  Destination cards
5.  Technology + human travel message
6.  Value propositions
7.  Journey showcase
8.  Destination discovery
9.  How Travel AI works
10. Testimonials
11. Large CTA
12. Footer

## Journeys

-   Editorial page heading
-   Intro copy
-   Responsive two-column journey grid on sufficiently wide screens
-   One-column cards on narrow screens
-   Stable image ratios
-   Metadata, title, description, price, CTA
-   Consistent card heights only where content permits; never clip
    content

## Journey details

-   Breadcrumb
-   Title
-   Editorial image gallery
-   Package overview
-   Price/location/details
-   Included features
-   Special highlights
-   Full program
-   Sample schedule
-   Food/diet information
-   Gallery
-   Footer

Desktop may use a main content column + contextual sidebar.

Tablet/mobile must be allowed to collapse into one column.

## Contact

Desktop reference:

``` text
image | form
```

Mobile:

``` text
image
form
```

Form must remain accessible and comfortable for touch.

------------------------------------------------------------------------

# 12. Travel AI Chat

The chat is a core product experience.

Reference states include:

1.  Initial greeting + suggested prompts
2.  User preference selection
3.  AI follow-up question + chips
4.  Trip-detail confirmation
5.  Recommendation with destination image
6.  Custom itinerary
7.  Actions such as Build My Trip / Change Preferences
8.  Loading/typing
9.  Error/retry

## Desktop

Use a floating panel.

Recommended constraints:

``` css
width: min(480px, calc(100vw - 32px));
max-height: min(720px, calc(100dvh - 32px));
```

## Mobile

Do not use the desktop centered panel unchanged.

Use a bottom sheet or near-full-screen layout.

Use viewport-aware sizing:

``` css
height: 100dvh;
max-height: 100dvh;
padding-bottom: env(safe-area-inset-bottom);
```

Use `svh`/`dvh` as appropriate for mobile browser chrome.

## Chat anatomy

``` text
Header
↓
Scrollable conversation
↓
Composer
```

Header and composer must remain usable while only the conversation area
scrolls.

## Chat rules

-   AI messages left aligned.
-   User messages right aligned.
-   Images never overflow.
-   Long text wraps.
-   Chips wrap.
-   Composer remains visible.
-   Keyboard must not hide the composer.
-   Focus management must be deliberate.
-   Escape should close the chat/dialog where appropriate.
-   Do not lock the entire page's scroll unless the interaction requires
    it.

------------------------------------------------------------------------

# 13. Image Rules

Travel imagery is a major performance and visual-quality factor.

For every meaningful image:

-   Use the correct aspect ratio.
-   Reserve layout space with `width`/`height` or `aspect-ratio`.
-   Use `object-fit: cover` where editorial cropping is intended.
-   Use AVIF/WebP when supported.
-   Use `srcset` and `sizes` for responsive images.
-   Lazy-load below-the-fold images.
-   Do not lazy-load the primary LCP image.
-   Add useful `alt` text.
-   Decorative imagery gets `alt=""`.
-   Do not ship huge source files when a smaller derivative is
    sufficient.

Never use a giant image as a CSS background when an optimized `<img>` is
more appropriate for content/LCP.

------------------------------------------------------------------------

# 14. Performance Budget

Target:

-   Lighthouse Performance: 90+
-   Accessibility: 95+
-   Best Practices: 95+
-   SEO: 95+
-   Core Web Vitals: green in realistic conditions

Prioritize:

1.  LCP
2.  CLS
3.  INP
4.  Image weight
5.  Font loading
6.  JavaScript execution
7.  Third-party scripts

### Practical rules

-   Keep initial JS small.
-   Defer non-critical scripts.
-   Load page-specific modules only where needed.
-   Minimize font families and weights.
-   Use WOFF2.
-   Use `font-display: swap`.
-   Avoid render-blocking third-party scripts.
-   Avoid unnecessary animation work on the main thread.
-   Do not load an entire icon library for a few icons.

Suggested budgets should be measured rather than guessed, but as a
starting target:

-   Critical initial JS: ≤ 100 KB compressed
-   Critical CSS: ≤ 50 KB compressed
-   Avoid loading more than one large hero image at initial render
-   Keep non-critical images lazy

------------------------------------------------------------------------

# 15. Accessibility

Target WCAG 2.2 AA.

Required:

-   Keyboard navigation
-   Visible focus
-   Correct labels
-   Logical heading hierarchy
-   Sufficient contrast
-   44×44px minimum practical touch targets
-   Accessible icon buttons
-   Dialog semantics
-   Focus management
-   Error messaging
-   Reduced-motion support

For menus:

``` html
<button aria-expanded="false" aria-controls="mobile-menu">
```

For dialogs:

-   `role="dialog"` where appropriate
-   `aria-modal="true"`
-   accessible name
-   focus moved into the dialog
-   focus returned after close

Respect:

``` css
@media (prefers-reduced-motion: reduce) {
  /* Disable/reduce non-essential motion */
}
```

Never communicate state through color alone.

------------------------------------------------------------------------

# 16. Forms

-   Every field has a visible label.
-   Use correct `type` and `autocomplete`.
-   Placeholder is not the label.
-   Validate on the client for immediate feedback.
-   Preserve values after recoverable errors.
-   Prevent duplicate submissions.
-   Show loading state.
-   Show success/failure state.
-   Use `aria-describedby` for relevant errors/help text.
-   Do not disable submit merely because a field is incomplete unless
    there is a clear UX reason.

------------------------------------------------------------------------

# 17. Security

Frontend code must:

-   Never contain secrets/API keys.
-   Treat AI/API responses as untrusted.
-   Avoid unsanitized `innerHTML`.
-   Validate external URLs before rendering them.
-   Avoid putting sensitive information in localStorage.
-   Use HTTPS in production.
-   Use appropriate security headers at deployment level.

------------------------------------------------------------------------

# 18. SEO

Every public page should have:

-   Unique title
-   Meta description
-   Canonical URL where applicable
-   Semantic headings
-   Descriptive links
-   Open Graph metadata
-   Crawlable primary content

Journey pages should expose meaningful content in HTML rather than
relying entirely on client-side rendering.

------------------------------------------------------------------------

# 19. Browser/Platform QA

Test current supported versions of:

-   Chrome
-   Edge
-   Safari
-   Firefox

Special attention:

-   iOS Safari
-   Android Chrome
-   Mobile browser address-bar changes
-   Safe-area insets
-   Keyboard opening
-   Reduced-motion
-   Zoom at 100/125/150/200%

------------------------------------------------------------------------

# 20. Debugging Rules

When a responsive issue appears:

1.  Reproduce at the exact viewport.
2.  Inspect the containing block.
3.  Identify whether the issue is width, height, overflow, typography,
    or positioning.
4.  Fix the layout rule causing the issue.
5.  Re-test adjacent breakpoints.
6.  Re-test desktop after mobile changes.
7.  Do not add a one-off pixel hack unless the underlying reason is
    understood.

Never fix:

``` css
left: 7px;
top: -13px;
```

just to make one screenshot match.

------------------------------------------------------------------------

# 21. Definition of Done

A page is not complete until:

### Design

-   [ ] Matches approved Figma intent
-   [ ] Matches typography hierarchy
-   [ ] Matches spacing rhythm
-   [ ] Matches image treatment
-   [ ] Matches interaction states

### Responsive

-   [ ] 320--430px tested
-   [ ] 768px tested
-   [ ] 1024px tested
-   [ ] 1280--1440px tested
-   [ ] 1600--1920px tested
-   [ ] Short-height laptop tested
-   [ ] No horizontal overflow

### Functional

-   [ ] Navigation
-   [ ] Links
-   [ ] Buttons
-   [ ] Forms
-   [ ] Chat
-   [ ] Modal/sheet
-   [ ] Loading
-   [ ] Empty
-   [ ] Error

### Accessibility

-   [ ] Keyboard
-   [ ] Focus
-   [ ] Labels
-   [ ] Contrast
-   [ ] Dialog behavior
-   [ ] Reduced motion

### Performance

-   [ ] Images optimized
-   [ ] Fonts optimized
-   [ ] No unexpected CLS
-   [ ] JS deferred/code-split where useful
-   [ ] Lighthouse checked
-   [ ] No console errors

### Motion (for pages using motion)

Follow the motion QA requirements in `.ai/MOTION.md` (see Section 13 checklist):

-   [ ] Reduced-motion behavior verified (`prefers-reduced-motion: reduce` stops animation and displays content immediately)
-   [ ] Responsive motion tuning verified (reduced translate distances and capped staggers on mobile)
-   [ ] No layout shift (CLS) caused by transforms or opacity reveals
-   [ ] No horizontal overflow introduced by motion translations across all viewports (320px–2560px)
-   [ ] Touch safety (hover zooms disabled on touch devices via `@media (hover: hover)`)
-   [ ] Accessibility and semantic integrity (screen-reader safe typography splitting, normal heading tags)
-   [ ] Performance verified (GPU-accelerated transforms/opacity, zero forced reflows, single rAF loop)
-   [ ] Zero console errors from motion observers or element queries

------------------------------------------------------------------------

# 22. Non-Negotiable Decision Rule

When pixel similarity conflicts with production quality:

**Preserve the design intent, not the broken implementation.**

Priority:

``` text
Responsive behavior
→ Accessibility
→ Performance
→ Maintainability
→ Visual fidelity
```

A Travel AI page should look like the same premium product on every
device, not like a desktop screenshot squeezed into a phone.
