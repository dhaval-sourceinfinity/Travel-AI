# MOTION.md — Travel AI Motion System

> Definitive reference and implementation contract for every motion primitive,
> token, and behavior in the Travel AI website.
>
> **Dual Purpose**:
> 1. **System Catalog**: Documents what is implemented, active, legacy, or reserved in code.
> 2. **Implementation Contract**: Defines the mandatory rules, decision matrices, and Motion Map workflow for AI agents building new Travel AI pages from Figma.

---

## Status Classification Legend

Every token, primitive, and pattern in this document is explicitly classified:

| Tag | Meaning | Rule for New Pages |
| --- | --- | --- |
| `[ACTIVE]` | Implemented in CSS/JS and actively running on live pages. | Selectable for new pages matching the design criteria. |
| `[AVAILABLE]` | Implemented in CSS/JS but not currently used on any live page. | Selectable when the specific visual requirement arises; do not reinvent. |
| `[LEGACY]` | Existing older implementation preserved on specific pages. | **Do not use on new pages.** Do not break on existing pages. |
| `[RESERVED]` | Implemented in code/tokens for a specialized single purpose. | **Do not select** as general-purpose primitives. |
| `[RECOMMENDED]` | Architectural, design, or workflow guidance for future pages. | Mandatory process for new page implementations. |

---

## 1. Source-of-Truth Hierarchy

When implementing motion for any Travel AI page, adhere to the established project hierarchy:

- **Approved Figma**: Defines page-specific visual and motion intent.
- **DESIGN.md**: Defines the overall visual language and aesthetic tone.
- **MOTION.md**: Defines the motion architecture, primitive catalog, and selection rules.
- **Existing CSS/JS Implementation**: Defines what is actually implemented and supported in the browser.

> **Implementation Rule**: If Figma requests motion that the existing system does not support, **do not invent ad-hoc animations, keyframes, or external libraries**. First determine whether an existing primitive (`fade-up`, `line-reveal`, `image-reveal`, etc.) can satisfy the intent; otherwise flag the gap for explicit implementation review. If documentation and implementation disagree, inspect the code and correct `MOTION.md` rather than assuming unsupported behavior.

---

## 2. Motion Philosophy & Hierarchy

Motion in Travel AI is **editorial, cinematic, and purposeful**.

Every animation exists to:
- Guide the eye through the page narrative
- Reinforce content hierarchy
- Create a sense of premium craftsmanship
- Support — never replace — readability

Motion must never:
- Draw attention to itself or become decorative clutter
- Loop or repeat continuously without purpose
- Cause layout shift (CLS)
- Apply unnecessary scroll-entry reveals to content that is already visible on initial load (intentional page-load choreography, such as the primary hero sequence, is allowed when explicitly defined by the motion system)
- Run when `prefers-reduced-motion: reduce` is active
- Hijack native scrolling or lock viewport interaction

### 2a. Motion Hierarchy `[RECOMMENDED]`

Not every element receives motion. Avoid animation saturation. Follow this strict hierarchy:

| Priority Level | Surface | Intent | Typical Treatment |
| --- | --- | --- | --- |
| **Priority 1** | **Hero / Major Storytelling** | Establish atmosphere and brand confidence upon page load. | Sequenced hero choreography; subtle scroll-linked image scaling. |
| **Priority 2** | **Selected Editorial Statements** | Anchor the narrative and pacing of key story beats. | Selective `char-scroll` or `line-reveal` on primary section thesis statements. |
| **Priority 3** | **Important Imagery / Major Sections** | Reveal destination photography with depth. | `image-reveal` on enter; subtle `parallax` / `data-parallax` only when composition benefits. |
| **Priority 4** | **Cards & Supporting Content** | Calm, organized reveal of browsable inventory and details. | Container `fade-in` with staggered child reveals (`text-reveal`). |
| **Priority 5** | **Micro-interactions** | Provide tactile, responsive feedback to user touch or pointer. | Quick CSS transitions (hover scale, button press). |

> **Core Principle**: If an element does not provide a clear storytelling or hierarchical benefit through motion, use **no animation**. Static content is the baseline.

### 2b. Nested Motion Principle `[RECOMMENDED]`

Motion must not become saturated through excessive nested animations. Adhere to this core principle:

> **"For a component, use one primary entrance mechanism per hierarchy level."**

Example for a card component:
- **Card shell**: `fade-in` (container entrance)
- **Card image**: `image-reveal` (media entrance)
- **Card text**: `text-reveal` (typography rise)

Do not add independent animation, ad-hoc keyframes, or unique delay offsets to every nested child unless the design specifically requires the additional choreography.

---

## 3. Architecture Overview

The codebase contains the centralized GSAP motion engine and legacy fallbacks:

### 3a. Canonical System: `[data-motion]` + GSAP Motion Engine `[ACTIVE]`

- **Engine**: GSAP 3.x + ScrollTrigger (pinned CDN @ 3.14.1 loaded before `site.js` using `defer`).
- **Modules**:
  - `js/motion/gsap-presets.js`: Shared tokens, easings, timings, responsive distances, and primitive configs.
  - `js/motion/gsap-text.js`: Accessible text splitters for masked line reveals (`line-reveal`) and character reveals (`char-reveal`).
  - `js/motion/gsap-engine.js`: Central coordinator managing ScrollTriggers, section choreography, dynamic grids, and reduced motion.
- **CSS**: `css/motion.css` — Contains all canonical animation primitives, initial hidden states, stagger cascades, mobile overrides, and reduced-motion enforcement. When `.gsap-active` is present on `<html>`, CSS transitions on animated properties are disabled (`transition: none !important`) so GSAP drives them without conflict.
- **Fallback**: If GSAP CDN fails to load or in test environments, the system gracefully falls back to native CSS transitions toggled via `.is-visible`.
- **JS Boot**: `js/site.js` initializes `window.TravelMotion.init()`, coordinates hero page-load sequences, and manages legacy observers.
- **Used by**: All Travel AI pages.
- **Loading Rule**: *If a page uses the canonical `[data-motion]` system, ensure the shared `motion.css` stylesheet and GSAP scripts are loaded.*

### 3b. Legacy System: `.reveal` + `initReveal()` `[LEGACY]`

- **CSS**: `css/components.css` (lines 765–787) — Simple `opacity + translateY(18px)` fade-up driven by `--dur-slow`.
- **JS**: `js/site.js` (`initReveal()`) — Separate `IntersectionObserver` (`rootMargin: "0px 0px -8% 0px"`, `threshold: 0.08`).
- **Used by**: Existing pages with legacy `.reveal` wrappers.
- **Rule for Future Work**:
  > **Existing pages using `.reveal` must not be broken or refactored during normal page implementation. New pages should use the canonical `[data-motion]` system. Migration of legacy `.reveal` usage is a separate controlled task.**

### 3c. Boot Sequence in `js/site.js` `[ACTIVE]`

```text
1. mountShell()            — Mounts global Header & Footer, sets .js-ready on <html>
2. Render Dynamic Data     — Injects cards/data into the DOM before engine initializes
3. initTypographyReveals() — Splits line-reveal and char-scroll elements
4. initReveal()            — Starts legacy .reveal observer (for backward compatibility)
5. TravelMotion.init()     — Initializes GSAP + ScrollTrigger (falls back to initMotionReveal)
6. initHeroEntrance()      — Runs sequenced hero page-load choreography
7. initScrollMotion()      — Runs rAF scroll loop for hero and char-scroll progress
```

Execution order constraints:
- Typography splits must occur **before** `initScrollMotion()` calculates element geometries.
- `initMotionReveal()` explicitly ignores hero elements, which are managed exclusively by `initHeroEntrance()`.
- `initScrollMotion()` uses cached positions and recalculates on `resize` and `document.fonts.ready`.

---

## 4. Design Tokens (Motion)

All motion tokens are defined in `css/tokens.css` under `:root`.

### 4a. Duration Tokens

| Token | Value | Status | Purpose |
| --- | --- | --- | --- |
| `--dur-fast` | `160ms` | `[ACTIVE]` | Micro-interactions (hover, button focus, active states) |
| `--dur-normal` | `240ms` | `[ACTIVE]` | Standard UI transitions (tabs, filters, menu toggles) |
| `--dur-slow` | `600ms` | `[LEGACY]` | Legacy `.reveal` transitions and image fade timing |
| `--motion-fast` | `180ms` | `[ACTIVE]` | Quick cinematic transitions |
| `--motion-normal` | `350ms` | `[ACTIVE]` | Header entrance (`fade-down`) |
| `--motion-hover` | `500ms` | `[ACTIVE]` | Card image zoom on hover |
| `--motion-reveal` | `700ms` | `[ACTIVE]` | Primary content reveal duration (`fade-up`, `text-reveal`) |
| `--motion-hero-title` | `900ms` | `[RESERVED]` | Hero headline entrance duration |
| `--motion-slow` | `1000ms` | `[ACTIVE]` | Container scale entrance (`scale-reveal`) |
| `--motion-cinematic` | `1400ms` | `[RESERVED]` | Hero background scale entrance duration |

### 4b. Easing Tokens

| Token | Value | Status | Character |
| --- | --- | --- | --- |
| `--ease-standard` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `[ACTIVE]` | General micro-interactions and UI feedback |
| `--ease-reveal` | `cubic-bezier(.2, .8, .2, 1)` | `[ACTIVE]` | Smooth deceleration into resting state for content reveals |
| `--ease-cinematic` | `cubic-bezier(.16, 1, .3, 1)` | `[ACTIVE]` | Extended, confident deceleration for editorial and hero elements |

### 4c. Stagger Tokens

| Token | Value | Status | Purpose |
| --- | --- | --- | --- |
| `--stagger-small` | `60ms` | `[ACTIVE]` | Tight sibling cascade (card text lines, mobile staggers) |
| `--stagger-normal` | `80ms` | `[ACTIVE]` | Standard stagger between container children (cards, grid items) |
| `--stagger-line` | `90ms` | `[ACTIVE]` | Delay between successive lines in `line-reveal` |
| `--stagger-char` | `18ms` | `[RESERVED]` | Character delay token (reserved in tokens.css) |
| `--stagger-large` | `140ms` | `[RESERVED]` | Wide stagger (defined in tokens.css; not actively used) |

### 4d. Editorial Scroll-Progressive Tokens

| Token | Value | Status | Purpose |
| --- | --- | --- | --- |
| `--motion-editorial-idle` | `0.40` | `[ACTIVE]` | Baseline unrevealed opacity for `char-scroll` (40%) |
| `--motion-editorial-span` | `0.82` | `[ACTIVE]` | Fraction of scroll range across which letters start lighting |
| `--motion-editorial-fade` | `0.18` | `[ACTIVE]` | Progress window each individual character takes to brighten |
| `--motion-editorial-copy` | `0.50` | `[ACTIVE]` | Threshold of `--reveal-progress` where `copy-follow` begins |
| `--motion-text-rise` | `28px` | `[ACTIVE]` | Editorial heading rise distance (desktop) |

**Responsive Overrides** (`@media (max-width: 768px)` in `motion.css`):
- `--motion-editorial-span`: `0.72`
- `--motion-editorial-fade`: `0.28`
- `--motion-text-rise`: `18px` (desktop is `28px`)
- Card interior text rise: `18px` desktop, `12px` mobile

### 4e. Editorial Scroll Viewport Range `[ACTIVE]`

Configured in `js/site.js`:
```js
const EDITORIAL_RANGE = {
  desktop: { start: 0.92, end: 0.32 },
  mobile:  { start: 0.94, end: 0.38 },
};
```
- `start`: Viewport fraction where progress begins (as element enters from bottom).
- `end`: Viewport fraction where progress reaches `1.0` (as element nears upper viewport).

---

## 5. Primitive Selection Decision Matrix `[RECOMMENDED]`

When designing or implementing a section, select primitives using this decision matrix. **Do not apply motion blindly.**

| Content / Element Type | Recommended Primitive | Status | Rationale |
| --- | --- | --- | --- |
| **High-value editorial statement** | `char-scroll` (in `[data-motion-scope]`) | `[ACTIVE]` | Use **only** for selected narrative anchors where scroll progression enhances storytelling. Never the default for every heading. |
| **Standard editorial heading** | `line-reveal` | `[AVAILABLE]` | Masked line emergence for major section titles that do not need continuous scroll scrubbing. |
| **Normal section heading / UI block** | `fade-up` or `text-reveal` | `[ACTIVE]` | Clean, understated upward entrance that stays out of the reader's way. |
| **Supporting copy paired with char-scroll** | `copy-follow` (in `[data-motion-scope]`) | `[ACTIVE]` | Smoothly trails the editorial heading's scroll reveal within the shared scope. |
| **Card or grid container** | `fade-in` + `data-motion-stagger` | `[ACTIVE]` | Container coordinates child delays while fading in smoothly. |
| **Card image** | `image-reveal` | `[ACTIVE]` | Subtle scale-down (`1.03` → `1`) upon entering viewport. |
| **Subtle editorial image depth** | `parallax` or `data-parallax` | `[ACTIVE]` | Apply **only** when composition genuinely benefits from depth (e.g. background textures, framed landscapes). |
| **Primary hero section** | `hero-*` choreography | `[RESERVED]` | Exclusively for the top hero sequence. |
| **Small UI interaction** | Native CSS transition | `[ACTIVE]` | Buttons, links, hover zooms using `--ease-standard`. |
| **Secondary content / dense text** | **No motion** | — | When motion offers no storytelling value, leave static to maintain clarity. |

---

## 6. Motion Primitives Catalog

### 6a. General Reveal Primitives

#### `fade-up` `[ACTIVE]`
- **Visual Behavior**: Translates upward (`20px` desktop, `14px` mobile) while fading opacity (`0` → `1`).
- **Timing**: `--motion-reveal` (700ms) with `--ease-reveal`.
- **Trigger**: `IntersectionObserver` adds `.is-visible`. Fires once.
- **Usage**: General-purpose content blocks, section intros, standalone buttons.
- **HTML Pattern**:
  ```html
  <div class="intro-block" data-motion="fade-up">...</div>
  ```

#### `fade-in` `[ACTIVE]`
- **Visual Behavior**: Pure opacity transition (`0` → `1`) with no transform.
- **Timing**: `--motion-reveal` (700ms) with `--ease-reveal`.
- **Trigger**: `IntersectionObserver` adds `.is-visible`. Fires once.
- **Usage**: Card shells inside stagger containers, full-width footers.
- **HTML Pattern**:
  ```html
  <article class="destination-card" data-motion="fade-in">...</article>
  ```

#### `fade-down` `[ACTIVE]`
- **Visual Behavior**: Translates downward (`-8px` → `0`) while fading opacity (`0` → `1`).
- **Timing**: `--motion-normal` (350ms) with `--ease-reveal`.
- **Trigger**: `IntersectionObserver` adds `.is-visible`.
- **Usage**: Fixed headers, navigation bars entering from the top.

#### `scale-reveal` `[ACTIVE]`
- **Visual Behavior**: Scales up (`0.98` → `1.0`) while fading opacity (`0.85` → `1.0`).
- **Timing**: Opacity `--dur-slow` (600ms), Transform `--motion-slow` (1000ms) with `--ease-cinematic`.
- **Trigger**: `IntersectionObserver` adds `.is-visible`.
- **Usage**: Interactive maps, editorial place cards, embedded media modules.
- **HTML Pattern**:
  ```html
  <article class="place-card" data-motion="scale-reveal">...</article>
  ```

---

### 6b. Editorial Typography Primitives

#### `text-reveal` `[ACTIVE]`
- **Visual Behavior**: Upward rise (`--motion-text-rise`: `28px` editorial, `18px` card interior) with opacity fade (`0` → `1`).
- **Timing**: `--motion-reveal` (700ms) with `--ease-reveal`.
- **Auto-Stagger**: Sibling combinators in CSS (`~`) automatically apply sequential delays:
  - 1st element: `--text-index: 0` (delay: `0ms`)
  - 2nd element: `--text-index: 1` (delay: `60ms`)
  - 3rd element: `--text-index: 2` (delay: `120ms`)
  - Up to 5 consecutive siblings.
- **Trigger**: `.is-visible` on the element or cascaded from its parent container.
- **Usage**: Eyebrows, labels, subtitles, card headlines, and metadata rows.
- **HTML Pattern**:
  ```html
  <div class="card__meta">
    <p class="eyebrow" data-motion="text-reveal">Featured</p>
    <h3 class="card__title" data-motion="text-reveal">Tokyo Skyline</h3>
    <p class="card__desc" data-motion="text-reveal">7-day curated journey</p>
  </div>
  ```

#### `line-reveal` `[AVAILABLE]`
- **Visual Behavior**: Masked line emergence. Words are wrapped into lines; each line slides up from behind an `overflow: hidden` mask (`translateY(115%)` → `0`).
- **Timing**: `--motion-reveal` (700ms) with `--ease-cinematic`. Sequential line delay: `--line-index * --stagger-line` (90ms desktop, 60ms mobile).
- **DOM Engine**: Handled by `prepareLineReveal()` in `site.js`. Measures natural wrapping at runtime, wraps lines in `.line-mask > .line-inner`, and recalculates on resize.
- **Usage**: Standard editorial headlines on major landing pages that do not use `char-scroll`.
- **HTML Pattern**:
  ```html
  <h2 class="editorial-title" data-motion="line-reveal">A considered way to travel.</h2>
  ```

#### `char-scroll` `[ACTIVE]` — *Selective Editorial Statements Only*
- **Visual Behavior**: Scroll-progressive character reveal. Characters begin at `--motion-editorial-idle` (40% opacity) and progressively illuminate to 100% white as the user scrolls through the `EDITORIAL_RANGE` window.
- **Selective Usage Rule**:
  > **Use `char-scroll` ONLY for selected high-value editorial statements where scroll progression contributes directly to the storytelling. Never automatically apply `char-scroll` to every H1 or H2.**
- **Character Threshold**: If text exceeds `CHAR_SPLIT_MAX` (120 characters), `prepareCharScroll()` does not split into characters; it applies `.is-whole` and fades the entire element smoothly.
- **Performance Settlement**: When scroll progress reaches `1.0`, the class `.is-settled` is added to the parent `[data-motion-scope]`. This removes per-character CSS calculation chains.
- **Accessibility Layer**: Text is split into `aria-hidden="true"` spans for visual rendering, while an accessible `.sr-only` span preserves semantic readability for screen readers.
- **HTML Pattern**:
  ```html
  <div class="intro-split" data-motion-scope>
    <div class="intro-split__head">
      <p class="eyebrow" data-motion="text-reveal">02 — Introduction</p>
      <h2 class="section-title" data-motion="char-scroll">Two destinations.<br />So much to discover.</h2>
    </div>
    <div class="intro-split__body" data-motion="copy-follow">
      <p class="lede">Our Travel AI brings together a considered collection of journeys.</p>
    </div>
  </div>
  ```

#### `copy-follow` `[ACTIVE]`
- **Visual Behavior**: Supporting text that trails a `char-scroll` headline. Begins rising and fading in once `--reveal-progress` crosses `--motion-editorial-copy` (50%), completing at ~95%.
- **Trigger**: **Not observed by IntersectionObserver.** Purely driven by `--reveal-progress` written to the nearest `[data-motion-scope]` ancestor.
- **Usage**: Strictly paired with `char-scroll` inside a shared `data-motion-scope`.

---

### 6c. Media & Parallax Primitives

#### `image-reveal` `[ACTIVE]`
- **Visual Behavior**: Smooth scale down (`scale(1.03)` → `scale(1.0)`) and opacity fade (`0.9` → `1.0`).
- **Timing**: Opacity `--dur-slow` (600ms) with `--ease-reveal`, Transform `--motion-reveal` (700ms) with `--ease-cinematic`.
- **Trigger**: Cascades from `.is-visible` on its parent card or observed directly.
- **HTML Pattern**:
  ```html
  <img class="card__img" data-motion="image-reveal" src="journey.jpg" alt="Kyoto" />
  ```

#### `parallax` `[ACTIVE]`
- **Visual Behavior**: Scroll-linked direct `translateY` offset calculated in `initScrollMotion()`'s rAF loop.
- **Shift Bounds**: Background media: `12px` max on desktop, `4px` on mobile.
- **Usage**: Full-bleed CTA or section background imagery.
- **HTML Pattern**:
  ```html
  <img class="cta__bg" data-motion="parallax" src="texture.jpg" alt="" />
  ```

#### `data-parallax="editorial"` `[ACTIVE]`
- **Visual Behavior**: Writes `--parallax-y` (up to `8px` desktop, `0px` mobile) to the element. The element has extra height (`calc(100% + 24px)`) and `margin-top: -12px` to prevent edge exposure.
- **Usage**: Framed editorial images (e.g. Kyoto place card).
- **HTML Pattern**:
  ```html
  <img class="place-card__img" data-motion="image-reveal" data-parallax="editorial" src="kyoto.jpg" alt="Kyoto" />
  ```

---

### 6d. Hero Choreography Primitives `[RESERVED]`

> **RESERVED RULE: `hero-*` primitives are strictly reserved for the primary hero choreography. Do not use `hero-image`, `hero-title`, `hero-text`, `hero-cta`, or `hero-content` as generic animation primitives for ordinary sections.**

| Primitive | Trigger | Visual Entrance | Scroll Behavior |
| --- | --- | --- | --- |
| `hero-image` | JS timer (50ms) | `scale(1.04)` → `1.0`, opacity `0` → `1` | Parallax downward (`scrollY * 0.08`), subtle scale |
| `hero-content` | JS timer | Wrapper opacity fade | Moves upward (`scrollY * 0.2`), fades out by `progress * 1.6` |
| `hero-title` | JS timer (350ms) | `translateY(24px)` → `0`, opacity `0` → `1` | Inherits parent wrapper scroll motion |
| `hero-text` | JS timer (650ms) | `translateY(14px)` → `0`, opacity `0` → `1` | Inherits parent wrapper scroll motion |
| `hero-cta` | JS timer (900ms) | `translateY(10px) scale(.98)` → `0`, opacity | Interactive hover/active enabled after entrance |

---

## 7. Stagger System & No-Inline-Styles Policy

### 7a. The Stagger Container `[ACTIVE]`

Use `data-motion-stagger` on grid or flex containers. When the container enters view, direct `[data-motion]` children are revealed with automatic sequential delays:

```css
/* Pre-defined in motion.css */
[data-motion-stagger] > [data-motion]:nth-child(1) { --motion-delay: var(--stagger-base, 0ms); }
[data-motion-stagger] > [data-motion]:nth-child(2) { --motion-delay: calc(var(--stagger-base, 0ms) + var(--stagger-normal)); }
[data-motion-stagger] > [data-motion]:nth-child(3) { --motion-delay: calc(var(--stagger-base, 0ms) + var(--stagger-normal) * 2); }
[data-motion-stagger] > [data-motion]:nth-child(4) { --motion-delay: calc(var(--stagger-base, 0ms) + var(--stagger-normal) * 3); }
[data-motion-stagger] > [data-motion]:nth-child(5) { --motion-delay: calc(var(--stagger-base, 0ms) + var(--stagger-normal) * 4); }
[data-motion-stagger] > [data-motion]:nth-child(6) { --motion-delay: calc(var(--stagger-base, 0ms) + var(--stagger-normal) * 5); }
```

### 7b. Adhering to the No-Inline-Style Rule `[RECOMMENDED]`

AGENT.md mandates avoiding inline styles (`style="..."`) in HTML.

**Do NOT write inline custom properties in HTML markup**:
```html
<!-- ❌ PROHIBITED: Do not write inline styles in HTML -->
<div class="cards-grid" data-motion-stagger style="--stagger-base: 80ms">
<a class="btn" data-motion="fade-up" style="--motion-delay: 240ms">Explore</a>
```

**DO define offsets in scoped CSS stylesheets**:
```css
/* ✅ CORRECT: Define custom timing in component/page CSS */
.featured-journeys__grid {
  --stagger-base: var(--stagger-normal);
}

.intro-section__cta {
  --motion-delay: 180ms;
}
```

```html
<!-- ✅ CLEAN HTML: Controlled via CSS class -->
<div class="featured-journeys__grid" data-motion-stagger>...</div>
<a class="btn intro-section__cta" data-motion="fade-up">Explore</a>
```

*(Note: Legacy instances of `style="--motion-delay: ..."` in `index.html` are preserved for regression safety, but all new components and pages must define custom properties in CSS).*

---

## 8. Responsive Motion Tuning `[ACTIVE]`

Mobile devices must feel responsive, swift, and lightweight. Rather than inventing a different motion language, mobile retains the canonical primitives with tuned distances and timings:

1. **Reduced Translate Distances**:
   - `fade-up`: `20px` desktop → `14px` mobile
   - `text-reveal` (editorial): `28px` desktop → `18px` mobile
   - `text-reveal` (card interiors): `18px` desktop → `12px` mobile
   - `copy-follow`: `4px` desktop → `3px` mobile
2. **Reduced Parallax Shifts**:
   - Full background parallax: `12px` desktop → `4px` mobile
   - Editorial card parallax: `8px` desktop → `0px` mobile (disabled on mobile touch viewports)
3. **Stagger Cascades Capped**:
   - In `motion.css`, items at `nth-child(4+)` are capped to `calc(var(--stagger-small) * 3)` (180ms max) to prevent users from waiting for content while fast-scrolling on phones.
4. **Touch Safety**:
   - Hover scale effects (`transform: scale(1.035)`) are strictly gated inside `@media (hover: hover) and (pointer: fine)`. Mobile touch taps never trigger image zoom sticking.

---

## 9. Accessibility (Verified Architecture) `[ACTIVE]`

The motion system enforces accessibility across three integrated tiers:

### 9a. CSS Reduced-Motion Override
`motion.css` (§8) forces instantaneous presentation whenever the system preference is active:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .js-ready [data-motion] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

### 9b. JavaScript Boot and Runtime Checks
1. **Boot Check**: `REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches`. If true, init functions bypass animations and instantly attach `.is-visible`.
2. **Runtime Protection**: Inside `initScrollMotion()`, every rAF tick verifies `matchMedia("(prefers-reduced-motion: reduce)").matches`. If the user enables reduced motion mid-session, scroll scrubbing and parallax halt immediately.

### 9c. Semantic & Screen-Reader Integrity
- Typography reveals (`char-scroll`, `line-reveal`) maintain standard HTML heading tags (`<h1>`, `<h2>`, etc.).
- Splitting wrappers assign `aria-hidden="true"` to visual spans (`.char-layer`) and provide an unmutated `<span class="sr-only">` containing the full, uninterrupted text.
- No content depends on motion to be understood, focused, or interacted with.

---

## 10. Performance Constraints

Keep performance focused on browser hardware acceleration:

### Allowed & Preferred
- **Centralized GSAP 3.x + ScrollTrigger** loaded via pinned CDN (`https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/...`) using `defer`.
- Animate strictly `transform` and `opacity`.
- Clean up inline styles upon animation completion (`clearProps: "transform,opacity"`) so CSS `:hover` states remain fully functional.
- Control dynamic scroll values via CSS custom properties (`--reveal-progress`, `--parallax-y`).
- Use single-pass ScrollTriggers and section timelines for orchestrated reveals.
- Use a **single global** `requestAnimationFrame` loop for continuous scroll calculations where appropriate.
- Clean up calculation overhead: `[data-motion-scope]` receives `.is-settled` at progress `1.0` to drop character calc overhead.
- Native CSS transitions for micro-interactions (buttons, hover effects, focus outlines).

### Strictly Prohibited
- **No wheel hijacking or custom smooth scrollbars** (e.g. Lenis, Locomotive, ScrollSmoother). Native scroll must remain intact.
- **No unauthorized animation libraries or plugins** (e.g. Anime.js, Framer Motion, ScrollToPlugin, SplitText unless strictly justified). Only GSAP Core and ScrollTrigger are approved.
- **No local vendoring of GSAP** (e.g. `js/vendor/gsap.min.js`). Use pinned CDN only.
- **No scroll locking** for decorative storytelling.
- **No continuous layout thrashing** (never read `getBoundingClientRect()` inside tight loops without rAF batching).
- **No per-character setTimeout loops**.

---

## 11. Workflow for Building a New Page & Motion Map `[RECOMMENDED]`

Every AI agent implementing a new Travel AI page must follow this sequential process. **Do not begin writing code with ad-hoc animations.**

```text
1. Figma MCP Inspection      → Inspect layout, typography, components, and auto-layout.
2. Read Contracts             → Read AGENT.md, DESIGN.md, and MOTION.md.
3. Inspect Implementation     → Verify existing styles in tokens.css, components.css, motion.css.
4. Establish Content Priority → Identify what is Hero (P1), Editorial (P2), Media (P3), Cards (P4).
5. CREATE MOTION MAP          → Document the Motion Map table (mandatory before coding).
6. Implement Semantic HTML   → Add semantic tags and canonical [data-motion] attributes.
7. Style in Scoped CSS        → Define custom properties (--motion-delay) in CSS, not inline HTML.
8. Validate Responsiveness    → Check 320px, 390px, 768px, 1024px, 1440px.
9. Validate Reduced-Motion   → Test with prefers-reduced-motion: reduce enabled.
10. Execute Motion QA         → Verify with the Section 13 checklist.
```

### The Motion Map Specification

The Motion Map must define these mandatory columns:

| Field | Description |
| --- | --- |
| **Element** | Semantic selector or component identifier (e.g., `#hero-title`, `.packages__grid`). |
| **Primitive** | Chosen primitive from Section 6 (or `none`). |
| **Trigger** | Entrance mechanism: `Page Load`, `IntersectionObserver`, `Scroll Progress`, or `Interaction`. |
| **Priority** | Hierarchy level (P1 through P5, or None). |
| **Desktop Behavior** | Timing, transform distance, and visual character at ≥1024px. |
| **Mobile Behavior** | Adjusted behavior at ≤768px (e.g., reduced distance, disabled parallax). |
| **Reduced-Motion** | Instant display state (`opacity: 1; transform: none; no transition`). |

#### Example Motion Map for a New Destination Listing Page:

| Element | Primitive | Trigger | Priority | Desktop Behavior | Mobile Behavior | Reduced-Motion |
| --- | --- | --- | --- | --- | --- | --- |
| `.page-hero__title` | `line-reveal` | `IntersectionObserver` | P1 | Masked emergence, 90ms line stagger | 60ms line stagger | Instant visible |
| `.page-hero__intro` | `fade-up` | `IntersectionObserver` | P2 | 700ms rise 20px | 14px rise | Instant visible |
| `.filter-bar` | `fade-up` | `IntersectionObserver` | P4 | 700ms rise (delay: 100ms in CSS) | No delay | Instant visible |
| `.journeys-grid` | `data-motion-stagger` | `IntersectionObserver` | P4 | 80ms stagger cascade | 60ms stagger, capped at 180ms | Instant visible |
| `.journey-card` | `fade-in` | Container cascade | P4 | 700ms opacity fade | Same | Instant visible |
| `.journey-card__img`| `image-reveal` | Container cascade | P3 | Scale 1.03 → 1.0 | Scale 1.02 → 1.0 | Instant visible |
| `.journey-card__text`| `text-reveal` | Sibling cascade | P4 | Rise 18px, 60ms sibling offset | Rise 12px | Instant visible |
| `.journey-card:hover`| Hover transition | Pointer hover | P5 | Scale 1.035 (500ms ease) | Disabled on touch | Disabled |

---

## 12. Anti-Patterns & What NOT to Do

| ❌ Anti-pattern | ✅ Correct Approach |
| --- | --- |
| Applying inline `style="--motion-delay: 180ms"` in HTML | Define `--motion-delay` in component or page CSS stylesheets. |
| Using `hero-*` primitives in ordinary content sections | Use `fade-up`, `line-reveal`, or `scale-reveal`. `hero-*` is reserved for page heroes. |
| Defaulting `char-scroll` onto every H1 and H2 | Reserve `char-scroll` strictly for select high-value editorial statements. Use `line-reveal` or `fade-up` elsewhere. |
| Using `[data-motion]` on pages without `motion.css` | Ensure `motion.css` is included once in the page stylesheet chain if `[data-motion]` is used. |
| Breaking or refactoring legacy `.reveal` on existing pages | Preserve `.reveal` on existing pages; use `[data-motion]` on all new pages. |
| Nesting multiple `data-motion-stagger` containers | Keep stagger containers strictly one level deep. |
| Adding independent animations and delays to every nested child node | For a component, use one primary entrance mechanism per hierarchy level. |
| Adding CSS `@keyframes` animations to `motion.css` | Use transition-based reveals toggled via `.is-visible`. |
| Adding unauthorized animation libraries or smooth-scroll hijackers (Lenis, ScrollSmoother, Anime.js) | Use only approved GSAP Core + ScrollTrigger loaded via pinned CDN; micro-interactions remain native CSS. |
| Animating decorative lines, borders, or dividers without purpose | Motion is reserved strictly for storytelling content, photography, and structural section dividers. |
| Removing the `.js-ready` gating class | Content must remain 100% visible if JavaScript fails to execute. |

---

## 13. Motion QA Checklist `[RECOMMENDED]`

Before shipping any page featuring motion, verify each check:

- [ ] **No Flash of Invisible Content**: All content is 100% visible if JavaScript is disabled.
- [ ] **No Cumulative Layout Shift (CLS)**: Transforms and opacity changes never push adjacent DOM elements.
- [ ] **Reduced Motion Verification**: With `prefers-reduced-motion: reduce` toggled in DevTools, all animations cease and content displays immediately.
- [ ] **No Horizontal Overflow**: Translations never trigger horizontal scrollbars on viewports from 320px to 2560px.
- [ ] **Mobile Viewport Tuning (320px–430px)**: Translate distances are reduced, parallax is tempered, and stagger chains are capped.
- [ ] **Touch Device Safety**: Image zoom hover transitions are disabled on touch screens via `@media (hover: hover)`.
- [ ] **Scroll-Up Reversibility**: `char-scroll` smoothly dims when scrolling upwards without flashing.
- [ ] **Resize & Font Loading**: Text splitters (`prepareCharScroll`, `prepareLineReveal`) recalculate cleanly upon window resize and font load.
- [ ] **Zero Console Errors**: All selectors find valid elements; no null-pointer exceptions in `site.js`.
- [ ] **Keyboard & Focus Order**: Motion never obscures or misaligns the tab focus ring on interactive links and buttons.
- [ ] **Screen Reader Safety**: Text splitters maintain valid heading semantics and provide accessible `.sr-only` layers with `aria-hidden="true"` visual layers.
- [ ] **Performance Profile**: Scroll-linked motion produces no frame drops or long animation frames (zero forced reflows).

---

## 14. File Reference & Responsibilities

| File | Status | Motion System Responsibility |
| --- | --- | --- |
| `css/tokens.css` | `[ACTIVE]` | Defines timing (`--dur-*`, `--motion-*`), easings (`--ease-*`), and stagger tokens. |
| `css/motion.css` | `[ACTIVE]` | Canonical stylesheet containing all `[data-motion]` rules, state transforms, stagger cascades, mobile overrides, `.gsap-active` transition suppression, and reduced-motion enforcement. |
| `css/components.css` | `[LEGACY / ACTIVE]` | Contains legacy `.reveal` styles (§ Reveal-on-scroll) as well as standard micro-interaction hover transitions. |
| `js/motion/gsap-presets.js` | `[ACTIVE]` | Shared tokens, easings, timings, responsive distances, and primitive GSAP configs. |
| `js/motion/gsap-text.js` | `[ACTIVE]` | Text measuring and DOM splitting for `line-reveal` and `char-reveal` with accessible screen reader layers. |
| `js/motion/gsap-engine.js` | `[ACTIVE]` | Central GSAP + ScrollTrigger coordinator, reduced motion handler, dynamic grid animator, and section choreography orchestrator. |
| `js/site.js` (§5a) | `[LEGACY]` | `initReveal()` — Legacy `.reveal` `IntersectionObserver`. |
| `js/site.js` (§5b) | `[ACTIVE / FALLBACK]` | `initMotionReveal()` — Native `[data-motion]` `IntersectionObserver` fallback when GSAP is inactive. |
| `js/site.js` (§5c) | `[RESERVED]` | `initHeroEntrance()` — Page-load timed hero entrance sequence. |
| `js/site.js` (§5d) | `[ACTIVE]` | `initScrollMotion()` — Single rAF loop managing scroll-linked hero, parallax, and `char-scroll` progress. |
| `js/site.js` (§5f) | `[ACTIVE]` | `prepareLineReveal()`, `prepareCharScroll()`, `initTypographyReveals()` — Typography measuring and DOM splitting. |
| `js/journeys.js` | `[ACTIVE]` | Dynamically renders journey cards and invokes `TravelMotion.animateDynamicGrid()`. |

---

## 15. Glossary

| Term | Definition |
| --- | --- |
| **Canonical System** | The modern, unified `[data-motion]` architecture styled in `motion.css` and driven by `site.js`. |
| **Legacy System** | The older `.reveal` fade-up class defined in `components.css`, maintained strictly for backwards compatibility. |
| **Motion Map** | The required pre-implementation design table mapping every animated element to its primitive, trigger, priority, and responsive rules. |
| **Scope (`data-motion-scope`)** | Container that synchronizes `--reveal-progress` between an editorial headline (`char-scroll`) and its supporting description (`copy-follow`). |
| **Settled (`.is-settled`)** | State applied to a scope when scroll progress reaches `1.0`, disabling heavy calc chains to restore native rendering performance. |
| **Stagger Base (`--stagger-base`)** | Initial delay offset applied before a container's staggered child sequence begins. |
| **Whole Fallback (`.is-whole`)** | Graceful fallback when a heading exceeds 120 characters, brightening as a single unit rather than splitting into characters. |
