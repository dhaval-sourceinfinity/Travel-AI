# DESIGN.md --- Travel AI Design System

> Visual and interaction specification for the Travel AI HTML/CSS/JS
> implementation.

# 1. Design Intent

Travel AI is a **premium digital travel studio with an AI travel
advisor**.

The supplied reference screens show five important product surfaces:

-   Home / editorial landing page
-   Journeys listing
-   Journey details
-   Contact
-   Travel AI conversational UI

The visual language is:

-   Near-black editorial background
-   Off-white typography
-   Violet/purple AI accent
-   High-quality destination photography
-   Large, confident headlines
-   Thin borders
-   Restrained cards
-   Rounded imagery
-   Minimal navigation
-   Generous but controlled whitespace
-   Quiet, purposeful motion

The product should feel **personal, premium, intelligent, and
trustworthy**.

Do not make it look like:

-   a generic SaaS dashboard
-   a generic AI chatbot
-   a travel booking marketplace crowded with filters
-   a neon/futuristic AI product

------------------------------------------------------------------------

# 2. Design Tokens

Create one token layer and make components consume it.

``` css
:root {
  --color-bg: #07090a;
  --color-surface: #0d1012;
  --color-surface-elevated: #121519;
  --color-border: rgba(255,255,255,.09);

  --color-text: #f5f5f5;
  --color-text-secondary: #a7a9ad;
  --color-text-muted: #6f7379;

  --color-primary: #8b5cf6;
  --color-primary-hover: #9d72f8;
  --color-primary-soft: rgba(139,92,246,.14);

  --color-white: #fff;

  --chat-bg: #fff;
  --chat-surface: #f8f9fb;
  --chat-text: #1d2430;
  --chat-muted: #8d96a3;
  --chat-user: #7c3aed;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 14px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;

  --container-max: 1440px;

  --duration-fast: 160ms;
  --duration-normal: 240ms;
  --ease-standard: cubic-bezier(.2,.8,.2,1);
}
```

Final values must be taken from approved Figma variables where
available.

Do not create random per-component colors or spacing values.

------------------------------------------------------------------------

# 3. Typography

Use one primary modern sans-serif family unless Figma specifies
otherwise.

### Hierarchy

``` text
Display
H1
H2
H3
Body
Small
Caption
```

Use fluid typography where appropriate:

``` css
font-size: clamp(2.5rem, 6vw, 6.5rem);
```

Starting range:

  Role        Mobile     Desktop
  ------- ---------- -----------
  Hero      44--56px   72--104px
  H1        36--44px    56--72px
  H2        30--36px    44--56px
  H3        22--28px    28--36px
  Body      14--16px    15--18px
  Small     12--14px    12--14px

These are design ranges, not fixed requirements.

### Typography rules

-   Headlines use tighter line-height.
-   Body text uses comfortable line-height.
-   Keep reading widths controlled.
-   Avoid huge paragraphs spanning the viewport.
-   Use weight and spacing to establish hierarchy.
-   Do not shrink body text excessively to fit desktop layouts on
    mobile.

------------------------------------------------------------------------

# 4. Grid, Container & Spacing

Primary container:

``` css
.container {
  width: min(100% - 32px, var(--container-max));
  margin-inline: auto;
}
```

Large sections can use:

``` css
padding-block: clamp(64px, 9vw, 144px);
```

Reading content should generally remain around 680--780px.

Wide editorial layouts may use 1200--1440px.

At 1600px+ screens, do not simply stretch every element.

------------------------------------------------------------------------

# 5. Header

Reference:

``` text
[Travel AI logo]                  About Us | How it Works | For Advisors | Blog
```

Characteristics:

-   Dark background
-   Compact
-   Thin bottom border
-   Logo left
-   Navigation right
-   Minimal visual noise

## Desktop

Show the full navigation when it fits.

## Mobile

Use:

``` text
[Logo]                              [Menu]
```

Do not compress four desktop navigation items into an unreadable mobile
row.

Menu requirements:

-   keyboard accessible
-   clear focus state
-   `aria-expanded`
-   `aria-controls`
-   closes appropriately
-   no page overflow

------------------------------------------------------------------------

# 6. Home Page Composition

The supplied home reference follows an editorial story.

Recommended sequence:

1.  Header
2.  Full-bleed hero
3.  Destination introduction
4.  Destination cards
5.  Technology + human travel section
6.  Feature/value propositions
7.  Journey showcase
8.  Destination discovery
9.  How Travel AI works
10. Testimonials
11. Large visual CTA
12. Footer

## Hero

Characteristics:

-   Large destination photography
-   Dark image treatment/overlay
-   Very large centered headline
-   Short supporting text
-   Primary CTA

Example hierarchy:

``` text
Travel, made
personal.
```

The exact copy comes from product content/Figma, not from this document.

### Responsive hero

Mobile must:

-   keep important image subjects visible
-   reduce headline fluidly
-   preserve CTA visibility
-   avoid fixed-height clipping
-   maintain sufficient contrast

------------------------------------------------------------------------

# 7. Destination Cards

Destination cards are editorial rather than dashboard-like.

Use:

-   large photography
-   short label
-   strong title
-   concise description
-   subtle CTA

On desktop, cards can sit side-by-side.

On mobile, stack them.

Do not allow text to overlap important image subjects unless the
composition intentionally requires it.

Use gradients/overlays only when needed for readability.

------------------------------------------------------------------------

# 8. Journey Listing

Reference pattern:

``` text
┌────────────────────────┐  ┌────────────────────────┐
│         IMAGE          │  │         IMAGE          │
├────────────────────────┤  ├────────────────────────┤
│ 7 Days · 6 Nights      │  │ 10 Days · 9 Nights     │
│ Journey title          │  │ Journey title           │
│ Description             │  │ Description             │
│ ────────────────────── │  │ ────────────────────── │
│ From price       CTA   │  │ From price       CTA    │
└────────────────────────┘  └────────────────────────┘
```

Desktop:

``` css
grid-template-columns: repeat(2, minmax(0, 1fr));
```

Mobile:

``` text
1 column
```

Card requirements:

-   stable image aspect ratio
-   consistent internal padding
-   readable metadata
-   clear title
-   limited description length
-   price and CTA remain aligned
-   no content clipping

------------------------------------------------------------------------

# 9. Journey Detail

Reference hierarchy:

``` text
Breadcrumb
↓
Large title
↓
Editorial gallery
↓
Overview + contextual price/details
↓
Included features
↓
What makes this journey special
↓
Full program
↓
Sample daily schedule
↓
Food
↓
Image gallery
↓
Footer
```

## Gallery

Desktop can use an editorial mosaic:

``` text
┌─────────────────────┬───────────────┐
│                     │               │
│     Main image      │    Image 2    │
│                     ├───────┬───────┤
│                     │ Img 3 │ Img 4 │
└─────────────────────┴───────┴───────┘
```

Mobile:

-   stacked gallery, or
-   horizontal swipe carousel

Every image must reserve its layout space.

## Sidebar

Desktop can use:

``` text
Main content | package details
```

At tablet widths, move the contextual panel below the primary content
when two columns become cramped.

------------------------------------------------------------------------

# 10. Package Detail Data Integrity

The supplied screenshots contain placeholder/example content.

Do not treat visual placeholder data such as location, pricing, guest
count, dates, or food descriptions as authoritative product data.

Production data should come from the approved content/data source.

Visual implementation must remain independent from the specific example
values.

------------------------------------------------------------------------

# 11. Contact Page

Reference composition:

``` text
┌──────────────────────┬────────────────────────┐
│                      │ Contacts               │
│       IMAGE          │ Get in touch           │
│                      │ supporting text        │
│                      │                        │
│                      │ Name       Email       │
│                      │ Message                │
│                      │                        │
│                      │ Submit                 │
└──────────────────────┴────────────────────────┘
```

Desktop:

-   image and form side-by-side
-   thin vertical divider
-   large form heading

Mobile:

``` text
IMAGE
↓
CONTACT LABEL
↓
HEADING
↓
FORM
```

Form fields must have visible labels.

------------------------------------------------------------------------

# 12. Buttons

## Primary

-   Strong contrast
-   Compact
-   Rounded
-   Clear text
-   Optional arrow

## Secondary

-   Dark/transparent surface
-   Thin border
-   Lower visual emphasis

## AI

-   Violet accent
-   Reserved for AI-related actions

All buttons need:

-   default
-   hover
-   active
-   focus
-   disabled
-   loading where applicable

Touch target should generally be at least 44×44px.

------------------------------------------------------------------------

# 13. Cards

Use subtle elevation rather than heavy shadows.

``` css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: var(--radius-md);
```

Cards should feel integrated with the editorial page, not like floating
SaaS widgets.

------------------------------------------------------------------------

# 14. Chat Visual System

The supplied chat screenshots intentionally use a **light conversational
panel against the dark website**.

This contrast should remain.

## Chat shell

Desktop:

-   floating/centered panel
-   light surface
-   rounded top corners
-   compact header
-   conversation body
-   bottom composer

Recommended starting constraint:

``` css
width: min(480px, calc(100vw - 32px));
max-height: min(720px, calc(100dvh - 32px));
```

## Header

``` text
[AI icon] Travel AI
          Your AI Travel Advisor        [−] [×]
```

Controls are icon buttons with accessible names.

## AI message

-   left aligned
-   light gray bubble
-   AI avatar
-   readable line length

## User message

-   right aligned
-   violet/purple bubble
-   white text

## Quick replies

Pill-like controls that naturally wrap.

Never force:

``` text
white-space: nowrap
```

when it causes mobile overflow.

------------------------------------------------------------------------

# 15. Chat States

Design and implement all:

### Initial

AI greeting:

``` text
Tell me about the trip you're thinking about...
```

plus suggested prompts.

### Preference collection

AI question + chips:

``` text
Relaxing / Leisure
Adventure
Luxury
Culture & Sightseeing
Something Special
```

### User response

Right-aligned user bubble.

### Confirmation

Structured trip summary:

``` text
Destination
Travellers
Adults
Duration
Departure
Budget
Travel style
Travel month
```

### Recommendation

Destination image +:

-   title
-   estimated budget
-   travel style
-   highlights
-   action buttons

### Custom itinerary

Day-by-day structured content.

### Loading

Subtle typing/progress indicator.

### Error

Clear explanation + retry.

### Empty/offline

Keep existing conversation when possible and provide a recovery action.

------------------------------------------------------------------------

# 16. Chat Responsive Behavior

## Desktop ≥ 1024px

Floating panel.

## Tablet

Use a wider sheet/panel if needed.

## Mobile

Use near-full-screen or bottom-sheet behavior.

Recommended:

``` css
height: 100dvh;
max-height: 100dvh;
padding-bottom: env(safe-area-inset-bottom);
```

Structure:

``` text
┌──────────────────────┐
│ Fixed header         │
├──────────────────────┤
│                      │
│ Scrollable messages  │
│                      │
├──────────────────────┤
│ Fixed composer       │
└──────────────────────┘
```

Only the message area should scroll.

This is especially important on iOS Safari where the browser chrome and
keyboard change the visual viewport.

------------------------------------------------------------------------

# 17. Responsive Matrix

  Area                Small mobile   Tablet         Laptop         Desktop     Large desktop
  ------------------- -------------- -------------- -------------- ----------- ----------------
  Header              Menu           Compact/menu   Full if fits   Full        Full
  Hero                1 column       1 column       Editorial      Editorial   Wide editorial
  Destination cards   Stack          Stack/2        2              2           2
  Journey grid        1              1--2           2              2           2
  Journey detail      1              1--2           2              2           2
  Gallery             Stack/swipe    Simplified     Mosaic         Mosaic      Mosaic
  Contact             Stack          Stack/2        2              2           2
  Footer              Stack          Rows           Columns        Columns     Columns
  Chat                Full/sheet     Sheet          Floating       Floating    Floating

------------------------------------------------------------------------

# 18. Short-Viewport Design

Do not equate screen width with vertical space.

Important cases:

-   1024 × 600
-   1280 × 720
-   mobile browser with keyboard open

Rules:

-   no fixed page-height content
-   no clipped chat
-   no hidden composer
-   no inaccessible bottom actions
-   tabs/actions may wrap
-   content should scroll naturally
-   avoid excessive header height

------------------------------------------------------------------------

# 19. Image Direction

Photography is one of the main brand assets.

Use:

-   destination-led compositions
-   natural-looking crops
-   consistent aspect ratios
-   high-quality but optimized imagery

### Image behavior

``` css
img {
  display: block;
  max-width: 100%;
}
```

For editorial cards:

``` css
object-fit: cover;
```

Use `aspect-ratio` or explicit intrinsic dimensions.

### Loading

-   Hero/LCP image: eager/priority as appropriate
-   Below-fold images: lazy
-   Use `srcset`/`sizes`
-   AVIF/WebP where supported

------------------------------------------------------------------------

# 20. Motion

Motion should support storytelling.

Use:

-   fade
-   subtle translate
-   image reveal
-   small hover scale
-   menu transition
-   chat open/close

Keep motion around 160--300ms for normal micro-interactions.

Avoid:

-   constant animation
-   heavy parallax
-   long transitions
-   layout-shifting animation

Respect:

``` css
@media (prefers-reduced-motion: reduce) {
  /* reduce non-essential motion */
}
```

------------------------------------------------------------------------

# 21. Footer

Reference footer:

-   Travel AI identity
-   short brand statement
-   Explore
-   Journeys
-   Travel AI
-   Help
-   advisor CTA
-   legal links

Desktop:

``` text
Brand | Explore | Journeys | Travel AI | Help
```

Mobile:

Stack naturally.

Advisor CTA remains visually distinct but not oversized.

------------------------------------------------------------------------

# 22. Accessibility States

Every interactive component must define:

``` text
Default
Hover
Focus-visible
Active
Disabled
Loading
Error
```

Focus must remain visible on the dark theme.

Do not use only color to communicate:

-   selected
-   error
-   disabled
-   success

------------------------------------------------------------------------

# 23. Performance-Aware Design

Visual design decisions must respect performance.

### Avoid

-   giant uncompressed hero images
-   unnecessary background videos
-   too many font weights
-   multiple icon libraries
-   large JS UI libraries
-   heavy animation libraries
-   unnecessary third-party embeds

### Targets

-   Lighthouse Performance 90+
-   Accessibility 95+
-   Best Practices 95+
-   SEO 95+
-   Green Core Web Vitals under realistic conditions

Performance should be validated with throttled CPU/network conditions,
not only a fast development machine.

------------------------------------------------------------------------

# 24. Design QA Matrix

Every approved screen should be reviewed at:

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

And:

``` text
100% zoom
125% zoom
150% zoom
200% zoom
```

Also test:

-   keyboard navigation
-   iOS Safari
-   Android Chrome
-   reduced motion
-   short laptop viewport
-   mobile keyboard open
-   slow network
-   slow CPU

------------------------------------------------------------------------

# 25. Figma-to-Production Rule

Figma defines the intended visual system.

CSS defines how that system survives different screens.

If a 1440px design is perfect but the 1024px version clips:

**Do not preserve the clipping. Recompose the layout.**

Use:

-   Grid
-   Flexbox
-   `minmax()`
-   `clamp()`
-   intrinsic sizing
-   container queries where appropriate

Do not use arbitrary viewport-specific offsets.

------------------------------------------------------------------------

# 26. Final Design Standard

The finished product should feel like one coherent Travel AI system:

``` text
Premium photography
        +
Editorial typography
        +
Calm dark UI
        +
Violet AI identity
        +
Simple interactions
        +
Responsive composition
        +
Fast performance
```

The highest-priority rule is:

> **Never solve a visual problem with a fixed dimension when responsive
> layout can preserve the same design intent without making the
> interface fragile.**
