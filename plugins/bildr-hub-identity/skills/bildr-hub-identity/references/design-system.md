# bildr.hub Design System — Complete Reference

## Color Tokens

### Light Mode — "Earth" (Default for community pages)

| Token | oklch | Hex | Usage |
|-------|-------|-----|-------|
| `--color-bg` | `oklch(0.95 0.01 70)` | `#f5f0eb` | Page background (cream white) |
| `--color-card` | `oklch(0.99 0.005 70)` | `#fdfbf8` | Card/panel backgrounds |
| `--color-surface` | `oklch(0.92 0.012 70)` | `#ece5dc` | Alternate surface (slightly darker) |
| `--color-text` | `oklch(0.27 0.05 55)` | `#3d2814` | Primary text (deep dark brown) |
| `--color-text-2` | `oklch(0.45 0.05 55)` | `#6b4423` | Secondary text (dark brown) |
| `--color-text-3` | `oklch(0.55 0.05 55)` | `#8b6144` | Tertiary text (medium brown) |
| `--color-border` | `oklch(0.82 0.02 60)` | `#d4c5b5` | Borders, dividers (beige) |
| `--color-primary` | `oklch(0.45 0.09 55)` | `#6b4423` | Primary brand color (dark brown) |
| `--color-secondary` | `oklch(0.55 0.08 55)` | `#8b6144` | Secondary brand color (medium brown) |
| `--color-accent` | `oklch(0.60 0.12 65)` | `#a8763e` | Accent (golden brown) |
| `--color-accent-dark` | `oklch(0.50 0.10 55)` | `#7a5a2e` | Darker accent (hover states) |
| `--color-accent-light` | `oklch(0.88 0.04 65)` | `#e8d5b8` | Light accent tint (backgrounds) |

### Dark Mode — "Amber Dark" (`.dark` class on `<html>`, for client/corporate pages)

| Token | oklch | Hex | Usage |
|-------|-------|-----|-------|
| `--color-bg` | `oklch(0.18 0.01 50)` | `#1c1917` | Page background (warm near-black) |
| `--color-card` | `oklch(0.22 0.012 50)` | `#292524` | Card/panel backgrounds |
| `--color-surface` | `oklch(0.20 0.01 50)` | `#231f1c` | Alternate surface |
| `--color-text` | `oklch(0.95 0.03 85)` | `#fef3c7` | Primary text (pale cream) |
| `--color-text-2` | `oklch(0.78 0.04 80)` | `#d4b896` | Secondary text |
| `--color-text-3` | `oklch(0.58 0.03 60)` | `#8a7560` | Tertiary text (warm grey) |
| `--color-border` | `oklch(0.30 0.015 50)` | `#3d3530` | Borders, dividers |
| `--color-primary` | `oklch(0.68 0.16 70)` | `#d97706` | Primary brand color (amber) |
| `--color-secondary` | `oklch(0.76 0.15 80)` | `#f59e0b` | Secondary brand color (light orange) |
| `--color-accent` | `oklch(0.83 0.14 90)` | `#fbbf24` | Accent (gold/yellow) |
| `--color-accent-dark` | `oklch(0.62 0.15 65)` | `#b45309` | Darker accent (hover states) |
| `--color-accent-light` | `oklch(0.30 0.05 70)` | `#44340a` | Subtle accent tint (dark bg) |

### System Colors (Shared)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#16a34a` | Success states (green-600) |
| `--color-error` | `#dc2626` | Error states (red-600) |
| `--color-warning` | `#ca8a04` | Warning states (yellow-600) |
| `--color-info` | `#2563eb` | Info states (blue-600) |

### Career Path Colors

| Level | Hex | Name |
|-------|-----|------|
| Newcomer | `#f5f0eb` | Cream |
| Brick | `#d4c5b5` | Beige |
| Builder | `#a8763e` | Golden brown |
| Architect | `#8b6144` | Medium brown |
| Engineer | `#6b4423` | Dark brown |
| Mastermind | `#d97706` | Amber |
| Mentor | `#f59e0b` | Gold |
| Founder | `#d62828` | Red |

---

## Typography

### Font Families

| Role | Font | CSS Variable | Weights | Rule |
|------|------|-------------|---------|------|
| Display | Bungee | `--font-display` | 400 | Always **UPPERCASE** (`text-transform: uppercase`) |
| Body | Plus Jakarta Sans | `--font-body` | 200, 300, 400, 500, 600, 700, 800 | General text |
| Mono | JetBrains Mono | `--font-mono` | 400, 700 | Code, labels, badges |

### Google Fonts Loading

**CDN (vanilla HTML):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bungee&family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
```

**Next.js:**
```typescript
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
// Bungee must be loaded via CDN or @font-face as next/font doesn't always support it
// Or use: import localFont from "next/font/local"

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// In layout.tsx:
// <body className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
```

### Typography Scale

| Element | Size | Font | Weight | Tracking | Line Height |
|---------|------|------|--------|----------|-------------|
| Hero h1 | `clamp(44px, 5.5vw, 72px)` | Bungee | 400 | -1px | 1.1 |
| Section h2 | `clamp(28px, 4vw, 44px)` | Bungee | 400 | -0.5px | 1.15 |
| Section h3 | `clamp(20px, 2.5vw, 28px)` | Plus Jakarta Sans | 600 | -0.3px | 1.3 |
| Body | 16-17px | Plus Jakarta Sans | 400 | normal | 1.6-1.75 |
| Body small | 14px | Plus Jakarta Sans | 400 | normal | 1.5 |
| Section label | 11px | JetBrains Mono | 700 | 0.1em | normal |
| Nav links | 12px | JetBrains Mono | 400 | 0.04em | normal |
| Button primary | 14px | Bungee | 400 | 0.05em | normal |
| Button secondary | 13px | JetBrains Mono | 400 | normal | normal |
| Badge/tag | 11px | JetBrains Mono | 700 | 0.05em | normal |

### Text Emphasis Pattern

```html
<!-- Community: Bungee accent in headings -->
<h2>BUILD. LEARN. <em>GROW.</em></h2>
<!-- CSS: -->
h2 { font-family: var(--font-display); text-transform: uppercase; }
h2 em { font-style: normal; color: var(--color-accent); }
```

### Corporate Heading Pattern

Corporate headings use Plus Jakarta Sans 700 for the main text, with **Bungee only for the accent phrase**. This keeps the professional tone with a touch of brand personality.

```html
<h1 class="corporate-hero">
  <span class="corporate-hero-main">Amit ma kézzel csinálsz,</span>
  <span class="corporate-hero-accent">HOLNAP MAGÁTÓL MEGY.</span>
</h1>
```

```css
.corporate-hero-main {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: clamp(32px, 4.5vw, 56px);
  letter-spacing: -0.5px;
  line-height: 1.2;
  display: block;
  color: var(--color-text);
}
.corporate-hero-accent {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 48px);
  text-transform: uppercase;
  display: block;
  color: var(--color-accent);
  margin-top: 4px;
}
```

---

## Shadows

### Light Mode (Earth)

| Token | Value |
|-------|-------|
| `--shadow-sm` | `0 1px 3px rgba(61, 40, 20, 0.08)` |
| `--shadow-md` | `0 4px 12px rgba(61, 40, 20, 0.1)` |
| `--shadow-lg` | `0 8px 24px rgba(61, 40, 20, 0.14)` |
| `--shadow-accent-sm` | `0 1px 2px rgba(168, 118, 62, 0.15)` |
| `--shadow-accent-md` | `0 4px 12px rgba(168, 118, 62, 0.2)` |
| `--shadow-accent-lg` | `0 8px 24px rgba(168, 118, 62, 0.3)` |

### Dark Mode (Amber Dark)

| Token | Value |
|-------|-------|
| `--shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.3)` |
| `--shadow-md` | `0 4px 12px rgba(0, 0, 0, 0.4)` |
| `--shadow-lg` | `0 8px 24px rgba(0, 0, 0, 0.5)` |
| `--shadow-accent-sm` | `0 1px 2px rgba(217, 119, 6, 0.2)` |
| `--shadow-accent-md` | `0 4px 12px rgba(217, 119, 6, 0.3)` |
| `--shadow-accent-lg` | `0 8px 24px rgba(217, 119, 6, 0.4)` |

---

## Spacing & Layout

| Token / Pattern | Value | Usage |
|-----------------|-------|-------|
| `.wrap` | max-width: 1280px | Content container |
| Wrap padding | 32px / 20px / 16px | Desktop / tablet / phone |
| Section padding | 100px 0 | Standard section |
| Card padding | 24-32px | Internal card spacing |
| Gap (grid) | 16-64px | Between grid items |
| Nav height | 64px | Fixed navigation bar |

### Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Standard | 12px | Buttons, cards, inputs |
| Large | 16px | Hero cards, feature sections |
| Small | 8px | Tags, badges, small elements |
| Round | 9999px | Pills, avatar placeholders |

---

## Background Texture — Dotted Pattern

A subtle dotted pattern adds warmth. Apply to sections or the main background:

```css
.dotted-bg {
  background-image: radial-gradient(
    circle,
    var(--color-border) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
}

/* Even subtler variant with lower opacity */
.dotted-bg-subtle {
  background-image: radial-gradient(
    circle,
    color-mix(in oklch, var(--color-border) 40%, transparent) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
}
```

---

## Gradient Definitions

### Hero Gradient (Light / Earth)

```css
.hero-gradient {
  background: linear-gradient(
    135deg,
    #f5f0eb 0%,
    #e8d5b8 40%,
    #d4c5b5 70%,
    #f5f0eb 100%
  );
}
```

### Hero Gradient (Dark / Amber Dark)

```css
.dark .hero-gradient {
  background: linear-gradient(
    135deg,
    #1c1917 0%,
    #44340a 40%,
    #3d3530 70%,
    #1c1917 100%
  );
}
```

### CTA Gradient

```css
.cta-gradient {
  background: linear-gradient(135deg, #a8763e, #d97706);
}

.dark .cta-gradient {
  background: linear-gradient(135deg, #d97706, #fbbf24);
}
```

### Accent Text Gradient

```css
.text-gradient {
  background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Component Patterns (CSS)

### Primary Button

```css
.btn-primary {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--color-accent);
  color: #fff;
  padding: 14px 32px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.5s ease-out;
  border: none;
  cursor: pointer;
  min-height: 44px;
}
.btn-primary:hover {
  background: var(--color-accent-dark);
  box-shadow: var(--shadow-accent-md);
  transform: translateY(-2px);
}
```

### Secondary Button

```css
.btn-secondary {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-2);
  padding: 14px 28px;
  border-radius: 12px;
  text-decoration: none;
  border: 1px solid var(--color-border);
  transition: all 0.5s ease-out;
  min-height: 44px;
  background: transparent;
}
.btn-secondary:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  box-shadow: var(--shadow-accent-sm);
}
```

### Section Label

```css
.section-mono {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 16px;
}
```

### Section Header

```css
.section-header {
  text-align: center;
  margin-bottom: 48px;
}
.section-header h2 {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  line-height: 1.15;
  color: var(--color-text);
}
.section-header h2 em {
  font-style: normal;
  color: var(--color-accent);
}
```

### Card Pattern

```css
.card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.5s ease-out;
}
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}
```

### Input / Form Field

```css
.input {
  font-family: var(--font-body);
  font-size: 15px;
  background: var(--color-card);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 12px 16px;
  min-height: 44px;
  transition: border-color 0.3s;
  width: 100%;
}
.input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: var(--shadow-accent-sm);
}
.input::placeholder {
  color: var(--color-text-3);
}
```

### Navigation Bar

```css
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  height: 64px;
  display: flex;
  align-items: center;
  background: color-mix(in oklch, var(--color-bg) 92%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s, box-shadow 0.3s;
}
nav.scrolled {
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}
```

### Code Block

```css
.code-block {
  background: #3d2814;
  color: #fef3c7;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.6;
  padding: 20px 24px;
  border-radius: 12px;
  overflow-x: auto;
}
.code-block .keyword { color: #fbbf24; }
.code-block .string { color: #f59e0b; }
.code-block .comment { color: #8b6144; font-style: italic; }
```

### Table

```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.table thead th {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: left;
  padding: 12px 16px;
  background: var(--color-text);
  color: var(--color-bg);
}
.table thead th:first-child { border-radius: 8px 0 0 0; }
.table thead th:last-child { border-radius: 0 8px 0 0; }
.table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
}
.table tbody tr:nth-child(even) {
  background: var(--color-surface);
}
```

### Section (Standard)

```css
.section-std {
  padding: 100px 0;
}
```

---

## Animation Tokens

| Token | Value |
|-------|-------|
| `--ease-smooth` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--duration-base` | `0.5s` |

### Scroll Reveal Pattern

```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s var(--ease-smooth), transform 0.6s var(--ease-smooth);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Hover Transitions

```css
.hover-lift {
  transition: all 0.5s ease-out;
}
.hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
```

---

## Tailwind v4 @theme Block

For Tailwind CSS v4 projects, use this in `globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Light mode (Earth) — default, community pages */
  --color-bg: oklch(0.95 0.01 70);
  --color-card: oklch(0.99 0.005 70);
  --color-surface: oklch(0.92 0.012 70);
  --color-text: oklch(0.27 0.05 55);
  --color-text-2: oklch(0.45 0.05 55);
  --color-text-3: oklch(0.55 0.05 55);
  --color-border: oklch(0.82 0.02 60);
  --color-primary: oklch(0.45 0.09 55);
  --color-secondary: oklch(0.55 0.08 55);
  --color-accent: oklch(0.60 0.12 65);
  --color-accent-dark: oklch(0.50 0.10 55);
  --color-accent-light: oklch(0.88 0.04 65);

  --color-success: #16a34a;
  --color-error: #dc2626;
  --color-warning: #ca8a04;
  --color-info: #2563eb;

  --font-display: "Bungee", sans-serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);

  --shadow-sm: 0 1px 3px rgba(61, 40, 20, 0.08);
  --shadow-md: 0 4px 12px rgba(61, 40, 20, 0.1);
  --shadow-lg: 0 8px 24px rgba(61, 40, 20, 0.14);
  --shadow-accent-sm: 0 1px 2px rgba(168, 118, 62, 0.15);
  --shadow-accent-md: 0 4px 12px rgba(168, 118, 62, 0.2);
  --shadow-accent-lg: 0 8px 24px rgba(168, 118, 62, 0.3);

  --radius: 0.75rem;
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.25rem;
}

/* Dark mode (Amber Dark) — corporate/client pages */
.dark {
  --color-bg: oklch(0.18 0.01 50);
  --color-card: oklch(0.22 0.012 50);
  --color-surface: oklch(0.20 0.01 50);
  --color-text: oklch(0.95 0.03 85);
  --color-text-2: oklch(0.78 0.04 80);
  --color-text-3: oklch(0.58 0.03 60);
  --color-border: oklch(0.30 0.015 50);
  --color-primary: oklch(0.68 0.16 70);
  --color-secondary: oklch(0.76 0.15 80);
  --color-accent: oklch(0.83 0.14 90);
  --color-accent-dark: oklch(0.62 0.15 65);
  --color-accent-light: oklch(0.30 0.05 70);

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-accent-sm: 0 1px 2px rgba(217, 119, 6, 0.2);
  --shadow-accent-md: 0 4px 12px rgba(217, 119, 6, 0.3);
  --shadow-accent-lg: 0 8px 24px rgba(217, 119, 6, 0.4);
}
```

### Tailwind Usage Examples

```html
<!-- Colors -->
<div class="bg-bg text-text border border-border">
<span class="text-accent">highlighted</span>
<div class="bg-card rounded-lg shadow-md">

<!-- Typography — Bungee UPPERCASE titles -->
<h1 class="font-display text-[clamp(44px,5.5vw,72px)] uppercase tracking-tight leading-[1.1]">
  BILDR<span class="text-accent">.HUB</span>
</h1>

<!-- Body text -->
<p class="font-body text-base text-text-2 leading-relaxed">

<!-- Mono labels -->
<span class="font-mono text-xs text-accent uppercase tracking-[0.1em]">

<!-- Primary button (Bungee) -->
<button class="bg-accent text-white font-display text-sm uppercase tracking-wide px-8 py-3.5 rounded-xl hover:bg-accent-dark hover:shadow-accent-md transition-all duration-500">
  CSATLAKOZZ
</button>

<!-- Secondary button (Mono) -->
<a class="font-mono text-[13px] text-text-2 px-7 py-3.5 rounded-xl border border-border hover:border-accent hover:text-accent transition-all duration-500">
  Nézd meg mit építünk
</a>

<!-- Card with hover lift -->
<div class="bg-card border border-border rounded-xl p-6 transition-all duration-500 ease-out hover:shadow-md hover:-translate-y-[3px]">

<!-- Code block -->
<pre class="bg-[#3d2814] text-[#fef3c7] font-mono text-sm p-5 rounded-xl">

<!-- Dotted background -->
<section class="bg-bg" style="background-image: radial-gradient(circle, var(--color-border) 1px, transparent 1px); background-size: 24px 24px;">
```

---

## Responsive Breakpoints

| Breakpoint | Width | Approach |
|------------|-------|----------|
| Base | 0+ | Mobile-first (default) |
| `md:` | 768px+ | Tablet and up |
| `lg:` | 1024px+ | Desktop |
| `xl:` | 1280px+ | Wide desktop |

### Pattern: Desktop grid, Mobile stack
```html
<div class="grid lg:grid-cols-2 gap-12">
```

### Pattern: Hero split (community vs corporate)
```html
<!-- Desktop: side by side. Mobile: stacked -->
<div class="grid md:grid-cols-2 gap-0">
  <div class="bg-[#f5f0eb] text-[#3d2814] p-12"><!-- Community side (light) --></div>
  <div class="bg-[#1c1917] text-[#fef3c7] p-12"><!-- Corporate side (dark) --></div>
</div>
```

---

## Logo (Temporary Text Logotype)

Until the final logo is designed, use this text-based logotype:

```html
<span class="logo">BILDR<span class="logo-accent">.HUB</span></span>
```

```css
.logo {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text);
}
.logo-accent {
  color: var(--color-accent);
}
```

For dark mode, the text color automatically adapts via `--color-text`.

