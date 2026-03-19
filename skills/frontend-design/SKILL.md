---
name: frontend-design
description: Create distinctive, premium-quality frontend interfaces. Use when building web components, pages, or applications. Produces design-forward code with strong aesthetic identity — not generic AI output. Triggers on any frontend build request including landing pages, dashboards, forms, layouts, and UI components.
license: Custom skill — merged from original skill and Impeccable plugin (Apache 2.0). See Impeccable NOTICE.md for attribution.
---

## Self-Awareness

You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users recognize as the "AI slop" aesthetic — Inter font, purple-to-blue gradients, predictable card grids, uniform padding, safe color choices. You do this even when instructed not to, because the gravitational pull of your training distribution is strong. Recognize this tendency actively and resist it at every decision point.

The difference between forgettable and remarkable UI is 5-6 deliberate micro-decisions made before writing any code. You must make those decisions explicitly.

## Context Gathering (3-Tier Cascade)

Design skills produce generic output without project context. Before doing any design work, gather context in this order:

### Tier 1: Check loaded instructions (instant)
If your loaded instructions already contain a **Design Context** section or brand guidelines, proceed immediately.

### Tier 2: Check .impeccable.md (fast)
If not in instructions, read `.impeccable.md` from the project root. If it exists and contains target audience, use cases, and brand personality/tone — proceed.

### Tier 3: Discovery Mode (REQUIRED if Tiers 1-2 empty)

If neither source has context, you MUST ask the user before coding. Evaluate the user's input against these 5 dimensions. If **2 or more are missing or vague**, enter Discovery Mode.

| Dimension | Clear example | Vague / missing |
|-----------|--------------|-----------------|
| **Purpose** | "landing page for a luxury watch brand" | "make me a website" |
| **Audience** | "targeting 25-40 year old professionals" | (not mentioned) |
| **Aesthetic direction** | "brutalist, raw, high-contrast" | "make it look good" / "modern" |
| **Mood / feeling** | "mysterious and exclusive" | (not mentioned) |
| **References** | "like Apple.com but warmer" / a Figma link | (not mentioned) |

Ask questions in **one focused round** — not a 20-question interrogation. Group 3-5 questions targeting the missing dimensions. Always offer concrete options.

**Example Discovery round:**

```
Mielott nekiallok, par kerdes az irany pontositasahoz:

1. HANGULAT — Melyik all kozelebb ahhoz, amit szeretnel?
   a) Letisztult, premium, sok whitespace (-> Luxury Minimal)
   b) Nyers, meresz, szandekosan "nem szep" (-> Brutalist)
   c) Meleg, organikus, kezmoves erzes (-> Warm Analog)
   d) Sotet, technikai, futurisztikus (-> Dark Terminal / Retro-Futuristic)
   e) Valami mas — ird le egy mondatban

2. SZINVILAG — Van preferenciad?
   a) Sotet hatter, vilagos szoveg
   b) Vilagos hatter, sotet szoveg
   c) Egy konkret szin, ami fontos (brand szin?)
   d) Bizom rad

3. REFERENCIA — Van egy weboldal, amit szeretsz es hasonlot szeretnel?
   (Egy link vagy akar egy hangulat — "olyan mint egy japan teahaz" is eleg)
```

### Discovery Rules
- **Max 2 rounds.** After 2 rounds, make bold choices and present them in the Design Declaration.
- **Always offer options** (a/b/c/d), not open-ended questions.
- **"Bizom rad" / "surprise me"** — skip Discovery, make BOLD choices (not safe defaults).
- **Figma link or reference site** — sufficient direction. Go straight to Declaration.
- **Never ask about technical stack in Discovery** — that's implementation, not design.

---

## Design Declaration (MANDATORY before coding)

Once you have context, produce a Design Declaration in this exact format:

```
DESIGN DECLARATION
------------------
Aesthetic direction: [one evocative phrase — e.g. "brutalist newspaper meets dark IDE"]
Primary typeface: [specific font name] — [category: editorial/geometric/humanist/mono/display]
Type pairing: [second font] — contrast rationale: [why these two create tension]
Color strategy: [3-5 OKLCH values] — inspiration: [named source]
Signature detail: [the one memorable element]
What this is NOT: [context-specific anti-pattern]
```

This declaration is a contract. Every implementation choice must trace back to it. If you cannot articulate these 6 points, you are not ready to code.

**After presenting the Declaration, WAIT for user approval before writing any code.**

---

## Typography
> *Deep reference: [typography.md](reference/typography.md) — scales, pairing strategies, loading, OpenType features.*

Typography is the single highest-leverage design decision. A distinctive font choice elevates everything; a generic one flattens everything.

**Banned defaults** (you reach for these reflexively — stop):
Inter, Roboto, Open Sans, Lato, Arial, Montserrat, system-ui, sans-serif stack, Space Grotesk

**Categorized alternatives:**

| Category | Fonts |
|----------|-------|
| Editorial/Serif | Playfair Display, Crimson Pro, Fraunces, Newsreader, Libre Baskerville, DM Serif Display, Cormorant Garamond, Lora |
| Geometric Sans | Clash Display, Satoshi, Cabinet Grotesk, General Sans, Outfit, Syne, Onest, Figtree |
| Humanist Sans | Bricolage Grotesque, Obviously, Source Sans 3, Nunito Sans, Instrument Sans, Plus Jakarta Sans, Urbanist |
| Monospace/Code | JetBrains Mono, Fira Code, IBM Plex Mono, Space Mono, Inconsolata |
| Display/Decorative | Unbounded, Righteous, Rubik Mono One, Protest Guerrilla, Silkscreen |
| Technical/Neutral | IBM Plex Sans, Barlow, Archivo, Instrument Sans, DM Sans |

**DO**: Use a modular type scale with fluid sizing (`clamp()`)
**DO**: Vary font weights and sizes — weight contrast 100/200 vs 800/900, size jumps 3x minimum between hierarchy levels
**DON'T**: Use monospace typography as lazy shorthand for "technical/developer" vibes
**DON'T**: Put large icons with rounded corners above every heading — they make sites look templated
**DON'T**: Use timid 1.5x size increments — a 120px ultra-light heading over 14px body creates more interest than any color choice

**Pairing principle:** High contrast = interesting. Combine across categories:
- Display serif (decorative headline) + geometric sans (clean body)
- Monospace (data/labels) + editorial serif (narrative text)
- Heavy display (hero) + light humanist (supporting)
- One font in multiple weights is often cleaner than two competing typefaces

**State your typeface choice in the Design Declaration. Load from Google Fonts.**

---

## Color & Atmosphere
> *Deep reference: [color-and-contrast.md](reference/color-and-contrast.md) — OKLCH system, palettes, dark mode, contrast.*

Color is atmosphere, not decoration. Use OKLCH for perceptually uniform palettes.

### OKLCH Basics
```css
/* OKLCH: lightness (0-100%), chroma (0-0.4+), hue (0-360) */
--color-primary: oklch(60% 0.15 250);
--color-primary-light: oklch(85% 0.08 250);  /* lighter = reduce chroma */
--color-primary-dark: oklch(35% 0.12 250);
```

### Tinted Neutrals (never pure gray)
```css
/* Warm-tinted grays */
--gray-100: oklch(95% 0.01 60);
--gray-900: oklch(15% 0.01 60);

/* Cool-tinted grays */
--gray-100: oklch(95% 0.01 250);
--gray-900: oklch(15% 0.01 250);
```

### Inspiration Sources (pick ONE and derive palette)
- IDE themes: Dracula, Nord, Catppuccin, Gruvbox, Tokyo Night, Solarized, One Dark, Rose Pine
- Film: Wes Anderson pastels, Blade Runner neons, film noir, Kurosawa earth tones
- Cultural: Japanese wabi-sabi, Scandinavian, Bauhaus, Art Deco
- Natural: deep ocean bioluminescence, desert sunset, forest canopy, volcanic obsidian + lava

### Layered Backgrounds (never flat solid colors)
- CSS gradient meshes: `radial-gradient(at 20% 80%, color1, transparent), radial-gradient(at 80% 20%, color2, transparent), base`
- Noise/grain overlays: subtle SVG noise filter at 2-5% opacity
- Geometric patterns: CSS-only repeating shapes, dot grids, diagonal lines
- Depth layers: semi-transparent panels, backdrop-blur, layered box-shadows

**DO**: Use modern CSS color functions (`oklch`, `color-mix`, `light-dark`)
**DO**: Tint neutrals toward your brand hue — even chroma 0.01 creates subconscious cohesion
**DO**: Use CSS custom properties: `--bg`, `--surface`, `--text`, `--text-muted`, `--accent`, `--accent-contrast`, `--border`
**DON'T**: Use pure black (#000) or pure white (#fff) — always tint
**DON'T**: Use gray text on colored backgrounds — use a shade of the background color
**DON'T**: Use the AI color palette: cyan-on-dark, purple-to-blue gradients, neon accents on dark
**DON'T**: Use gradient text for "impact" — especially on metrics or headings
**DON'T**: Default to dark mode with glowing accents — it's lazy

### 60-30-10 Rule
- **60%**: Neutral backgrounds, white space, base surfaces
- **30%**: Secondary colors — text, borders, inactive states
- **10%**: Accent — CTAs, highlights, focus states. Accent works *because* it's rare.

---

## Theme Archetypes

Use as starting points — not templates. Mix, subvert, or springboard into original directions.

**Dark Terminal**
`oklch(12% 0.01 220)` / `oklch(16% 0.01 220)` / `oklch(65% 0.15 220)` / `oklch(60% 0.18 145)` / `oklch(70% 0.15 55)`. Monospace throughout. Blinking cursors, scanline effects, command-prompt patterns.

**Editorial Magazine**
Off-white `oklch(95% 0.01 60)` / deep charcoal `oklch(18% 0.01 60)` / single accent (red `oklch(50% 0.2 25)` or gold `oklch(65% 0.12 80)`). Serif headlines at extreme sizes (72-144px). Pull quotes, drop caps, columnar layouts.

**Solarpunk**
Warm greens `oklch(40% 0.12 160)` / `oklch(75% 0.12 160)` / gold `oklch(75% 0.14 85)` / earth `oklch(30% 0.06 220)`. Organic shapes, nature-inspired textures, bright optimistic atmosphere.

**Brutalist Raw**
Pure contrast `oklch(0% 0 0)` / `oklch(100% 0 0)` / one electric accent `oklch(55% 0.28 30)`. Thick borders (3-4px), raw typography, intentionally "ugly." No rounded corners.

**Luxury Minimal**
`oklch(97% 0.005 80)` / `oklch(20% 0.01 80)` / warm gold `oklch(70% 0.1 80)`. Ultra-thin serif (Cormorant, weight 300). Extreme whitespace (40-60% viewport). Letter-spacing: 0.15em on uppercase labels.

**Retro-Futuristic**
Deep navy `oklch(12% 0.04 260)` / cyan `oklch(80% 0.18 200)` / magenta `oklch(55% 0.25 340)` / chrome `oklch(88% 0.01 260)`. Glow effects, grid backgrounds, futuristic display fonts.

**Warm Analog**
Cream `oklch(96% 0.02 80)` / warm brown `oklch(35% 0.06 55)` / terracotta `oklch(60% 0.12 45)` / sage `oklch(60% 0.08 140)`. Paper textures, subtle shadows, rounded friendly shapes.

---

## The AI Slop Test

**Critical quality check**: If someone said "AI made this," would they believe it instantly? If yes — revise.

### Premium vs AI-Generated Differences
- **Intentional asymmetry**: Offset headings, unequal columns (60/40, 70/30), text left-aligned while images bleed right
- **Editorial spacing**: Sections breathe with 120-200px vertical gaps, not uniform 40px
- **Purposeful hierarchy**: One element per viewport clearly dominates
- **Subtle texture**: Micro-details at 2-5% opacity — grain, noise, gradient shifts
- **Restrained animation**: 1-2 orchestrated moments, not everything bouncing
- **Domain-specific design**: A music app looks nothing like a law firm site

### AI Slop DON'T List
- **DON'T**: Use identical card grids — same-sized cards with icon + heading + text, repeated endlessly
- **DON'T**: Wrap everything in cards — not everything needs a container
- **DON'T**: Nest cards inside cards — flatten the hierarchy
- **DON'T**: Use the hero metric layout template — big number, small label, gradient accent
- **DON'T**: Center everything — left-aligned with asymmetric layouts feels more designed
- **DON'T**: Use glassmorphism everywhere — blur effects, glass cards, glow borders used decoratively
- **DON'T**: Use rounded elements with thick colored border on one side — lazy accent
- **DON'T**: Use sparklines as decoration — tiny charts that convey nothing meaningful
- **DON'T**: Use rounded rectangles with generic drop shadows — safe, forgettable
- **DON'T**: Use modals unless truly no better alternative
- **DON'T**: Make every button primary — use ghost, text links, secondary styles; hierarchy matters
- **DON'T**: Repeat the same information — redundant headers, intros that restate the heading

---

## Layout & Space
> *Deep reference: [spatial-design.md](reference/spatial-design.md) — grids, rhythm, container queries, optical adjustments.*

**DO**: Create visual rhythm through varied spacing — tight groupings, generous separations
**DO**: Use fluid spacing with `clamp()` that breathes on larger screens
**DO**: Use asymmetry — `grid-template-columns: 2fr 1fr` or `1fr 2fr 1fr`, not 50/50
**DO**: Use negative space as a design element: 30-40% empty on desktop = luxury feel
**DO**: Break the grid deliberately — one element per section that escapes containment
**DON'T**: Use the same spacing everywhere — without rhythm, layouts feel monotonous

Overlap elements with negative margins or CSS grid area overlap for depth.

---

## Motion
> *Deep reference: [motion-design.md](reference/motion-design.md) — durations, easing curves, stagger, reduced motion, perceived performance.*

**DO**: Use exponential easing (`ease-out-quart/quint/expo`) — `cubic-bezier(0.25, 1, 0.5, 1)`
**DO**: Orchestrate page load with stagger: `animation-delay: calc(var(--i) * 50ms)`
**DO**: Use `grid-template-rows: 0fr -> 1fr` for height animations
**DON'T**: Animate layout properties (width, height, padding, margin) — `transform` and `opacity` only
**DON'T**: Use bounce or elastic easing — dated and tacky
**DON'T**: Skip `prefers-reduced-motion` — vestibular disorders affect ~35% of adults over 40

ONE well-orchestrated entrance sequence > twenty scattered micro-interactions.
Transitions: 0.2-0.3s `ease-out`. Exit faster than enter (~75% duration).

---

## Responsive
> *Deep reference: [responsive-design.md](reference/responsive-design.md) — mobile-first, fluid design, container queries, safe areas.*

**DO**: Start mobile-first (320px), scale up with `sm:`, `md:`, `lg:`, `xl:`
**DO**: Use container queries (`@container`) for component-level responsiveness
**DO**: Detect input method: `@media (pointer: coarse)` for touch, `@media (hover: hover)` for mouse
**DON'T**: Hide critical functionality on mobile — adapt, don't amputate
**DON'T**: Trust DevTools alone — test on real iPhone + real Android

Touch targets: minimum 44x44px. Handle safe areas with `env(safe-area-inset-*)`.

---

## Interaction & UX Writing
> *Deep references: [interaction-design.md](reference/interaction-design.md) + [ux-writing.md](reference/ux-writing.md)*

**DO**: Design all 8 interactive states (default, hover, focus, active, disabled, loading, error, success)
**DO**: Use `focus-visible` for keyboard-only focus rings
**DO**: Use progressive disclosure — start simple, reveal through interaction
**DO**: Design empty states that teach, not just say "nothing here"
**DO**: Use specific button labels ("Save changes" not "OK", "Delete project" not "Yes")
**DON'T**: Remove `outline` without `focus-visible` replacement
**DON'T**: Use placeholders as labels — they disappear on input

---

## Performance

Beautiful design means nothing if the page loads in 5 seconds.

- **Target 100 Lighthouse performance** — treat below 90 as a bug
- **GPU-only animations**: Only `opacity` and `transform`
- **Lazy-load below the fold**: Dynamic imports, `Suspense`, native lazy loading
- **Server Components by default** (React/Next.js): `'use client'` only when genuinely needed
- **Optimized assets**: `next/image` for images, `next/font` for fonts (or equivalent)
- **Minimal JavaScript**: Every `'use client'` adds to bundle — question if interactivity is truly needed

---

## Tailwind CSS v4 Conventions

- **Mobile-first breakpoints**: Base for mobile, `sm:`, `md:`, `lg:`, `xl:` for larger
- **`gap-*` for spacing**: Never `space-x-*` / `space-y-*` — they break on wrap
- **`size-*` shorthand**: `size-12` instead of `w-12 h-12`
- **Semantic color tokens**: `bg-primary`, `text-muted-foreground` — not raw `bg-blue-500` in reusable components
- **`cn()` for conditional classes**: Always clsx + tailwind-merge, never template literal ternaries

---

## Component Library Strategy

Choose the right foundation based on project type:

### Dashboards, Apps, Admin Panels -> shadcn/ui (REQUIRED)
For any interactive application UI (dashboards, settings, data tables, forms, admin panels):
- **Use shadcn/ui** (`npx shadcn@latest init` + `npx shadcn@latest add [component]`)
- **Use `cn()` utility** (clsx + tailwind-merge) for all conditional class composition
- **Compose from primitives**: `Card`, `Table`, `Tabs`, `Sheet`, `Dialog`, `DropdownMenu`, `Badge`, `Separator`, `ScrollArea`, `Tooltip`
- **Data display**: `Table` for tabular data, `Card` for metrics, `Tabs` for sections, `Badge` for status indicators
- **Navigation**: `Sheet` for mobile sidebar, `NavigationMenu` for desktop, `Breadcrumb` for hierarchy
- **Forms**: `Form` + `Input` + `Select` + `Switch` + `Slider` with react-hook-form + zod validation
- **Feedback**: `Toast` for notifications, `Alert` for inline messages, `Skeleton` for loading states
- **Charts**: Use Recharts (shadcn/ui charts are built on it) with `ChartContainer` + `ChartTooltip`

**Theme customization for dashboards:**
```css
/* In globals.css — override shadcn defaults to match Design Declaration */
@layer base {
  :root {
    --background: oklch(8% 0.015 220);     /* from Declaration */
    --foreground: oklch(88% 0.01 220);
    --card: oklch(11% 0.018 225);
    --card-foreground: oklch(88% 0.01 220);
    --primary: oklch(72% 0.18 75);          /* accent from Declaration */
    --primary-foreground: oklch(10% 0.01 75);
    --muted: oklch(14% 0.02 225);
    --muted-foreground: oklch(50% 0.015 220);
    --border: oklch(22% 0.025 220);
    --ring: oklch(72% 0.18 75);
    --radius: 0.375rem;                     /* or 0 for brutalist */
  }
}
```

**Canvas/SVG gotcha**: Canvas API and inline SVG cannot resolve `var(--color)`. Use raw OKLCH/hex values for canvas `fillStyle`/`strokeStyle` and SVG `fill`/`stroke`. Keep a `COLORS` constant with both: `{ css: 'var(--primary)', raw: 'oklch(72% 0.18 75)' }`.

### Landing Pages, Marketing Sites, Product Pages -> Custom Components
For one-off visual compositions (hero sections, feature showcases, product pages):
- **Build custom** — these need unique visual identity, not a component library look
- **Still use `cn()`** for class composition
- **Still use CSS custom properties** for the palette
- **Load fonts via `next/font`** or `@import` — never rely on system defaults

### Hybrid: App with Marketing Pages
- shadcn/ui for the app shell (nav, sidebar, settings, data views)
- Custom components for the marketing/landing pages
- Shared design tokens via CSS custom properties

---

## Implementation

Produce real, working, production-grade code. Match complexity to the aesthetic:
- Maximalist designs -> elaborate code with layered effects, multiple animation sequences, rich textures
- Minimalist designs -> restraint and precision in spacing, typography, subtle details
- The code IS the design — sloppy implementation undermines any visual concept

Use the framework/tech the user specifies. If unspecified, choose what best serves the design. Always load external fonts. Always define CSS custom properties for the palette. **Before submitting, run the Pre-Flight Checklist below.**

### Component Architecture
- **Single responsibility**: One component = one thing
- **Composition over inheritance**: Build complex UI via `children` and render props
- **Named exports**: For all components (except framework route files requiring default exports)
- **Typed props**: All component props typed with interfaces. No `any`.
- **Meaningful names**: `PropertyHeroSection` not `Component1`, `headline` not `data`

### Creative Interpretation
Interpret creatively and make unexpected choices genuinely designed for the context. No two designs should look the same. Vary between light/dark, different fonts, different aesthetics. NEVER converge on common choices across generations.

---

## Sub-Skills Reference

The Impeccable plugin provides specialized sub-skills for targeted improvements. Invoke these after initial implementation:

| Skill | Purpose |
|-------|---------|
| `/typeset` | Fix font choices, hierarchy, sizing, weight consistency |
| `/colorize` | Add strategic color to monochromatic interfaces |
| `/arrange` | Fix layout, spacing, visual rhythm, weak hierarchy |
| `/animate` | Add purposeful animations and micro-interactions |
| `/polish` | Final quality pass — alignment, spacing, consistency |
| `/adapt` | Make designs work across screen sizes and devices |
| `/clarify` | Improve UX copy, error messages, labels |
| `/distill` | Strip unnecessary complexity — simpler, cleaner |
| `/bolder` | Amplify safe/boring designs for more visual impact |
| `/quieter` | Tone down overly aggressive designs |
| `/delight` | Add joy, personality, unexpected touches |
| `/critique` | Evaluate design effectiveness from UX perspective |
| `/audit` | Comprehensive audit: a11y, performance, theming, responsive |
| `/harden` | Error handling, i18n, text overflow, edge cases |
| `/optimize` | Performance: loading, rendering, animations, bundle size |
| `/extract` | Extract reusable components and design tokens |
| `/normalize` | Match design system, ensure consistency |
| `/onboard` | Design onboarding flows and first-time experiences |
| `/overdrive` | Push past conventional limits — shaders, spring physics, scroll-driven |
| `/teach-impeccable` | One-time setup: gather design context, save to config |

---

## Design Inspiration Resources

- **https://www.designprompts.dev/** — Browse design and style types for aesthetic direction ideas
- **https://ui.shadcn.com/docs/components** — shadcn/ui component reference
- **https://app.spline.design/community** — 3D design inspiration for hero sections
- **https://www.unicorn.studio/dashboard/community** — Creative web effects and visual experiments
- **https://spacetypegenerator.com/shine** — Typographic effects and kinetic type
- **https://reactbits.dev/tools/background-studio** — Background pattern and texture generator

---

## Pre-Flight Checklist (MANDATORY before submitting code)

Before outputting ANY code, run through this checklist mentally. These are the most common
ways AI-generated frontends "collapse" in the browser — they look fine in text but break on render.

### Next.js App Router
- [ ] Every component with `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`,
      or ANY event handler (`onClick`, `onChange`, `onSubmit`, `onMouseEnter`, `onFocus`, etc.)
      MUST have `'use client'` as its FIRST line
- [ ] `import type React from 'react'` added when using `React.MouseEvent<T>` or similar types
- [ ] `next/font` font variables are NOT redeclared in CSS — let next/font inject them via
      the `variable` prop on `<html>`. If you define `--font-heading` in `:root {}`, it WILL
      override the font next/font loads, causing fallback fonts

### Canvas & SVG
- [ ] Canvas `fillStyle`, `strokeStyle`, `shadowColor`, gradient `addColorStop()` NEVER
      receive CSS variables like `var(--amber)`. Canvas cannot resolve CSS vars.
      Use a COLORS constant: `{ css: 'var(--primary)', raw: 'oklch(72% 0.18 75)' }`
- [ ] SVG `fill` and `stroke` attributes: use `currentColor` or raw values, not `var()`

### Tailwind CSS
- [ ] Responsive grid: `md:grid-cols-*` requires `grid` (or `md:grid`) in the same className.
      Without the base `grid` display, column definitions are ignored
- [ ] No inline `style={{ display: 'grid' }}` mixed with Tailwind responsive grid classes —
      they conflict. Use Tailwind for all grid/flex layout
- [ ] `gap-*` not `space-x-*` / `space-y-*` for sibling spacing

### React Patterns
- [ ] No JSX tags inside string literals: `"text<br />more"` renders `<br />` as TEXT.
      Use JSX: `<>text<br />more</>`
- [ ] Ternary threshold order: check HIGHEST first.
      WRONG: `val > 20 ? amber : val > 50 ? red : green` (red unreachable)
      RIGHT: `val > 50 ? red : val > 20 ? amber : green`
- [ ] No imperative style mutation (`e.currentTarget.style.color = ...`) — use React state
      + conditional className with `cn()` for hover/focus effects
- [ ] Components defined OUTSIDE parent components (not inside render body)
- [ ] Constant arrays/objects defined at MODULE LEVEL, not inside components
- [ ] No unnecessary type casts on event handlers — TypeScript infers them correctly

### Fonts
- [ ] Google Fonts loaded via `next/font/google` (Next.js) or `@import url()` in CSS (Vite/plain)
- [ ] Font family fallback chain includes generic family (`serif`, `sans-serif`, `monospace`)
- [ ] `font-display: swap` set (next/font does this automatically)

---

## Final Reminder

You still tend to converge. After writing your Design Declaration and before submitting code:

1. Would a human designer look at this and say "that's obviously AI-generated"?
2. Have I actually used the fonts and colors from my declaration, or drifted back to safe defaults?
3. Is there a single memorable visual moment, or is everything uniformly "nice"?
4. Could I swap the content and this design would work for any other product? (If yes, too generic.)
5. Did I check the DON'T list above? Am I using any AI slop patterns?
6. Are my colors OKLCH with tinted neutrals, or did I fall back to hex gray?
7. Did I run the Pre-Flight Checklist? (Canvas vars, `'use client'`, grid base, ternary order, no imperative style)

If any answer is wrong, revise before outputting. The goal is not "good for AI" — it is **indistinguishable from a skilled human designer's work**.

