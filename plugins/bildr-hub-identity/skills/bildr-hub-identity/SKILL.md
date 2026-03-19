---
name: bildr-hub-identity
description: "Apply the bildr.hub brand identity to web projects, business documents (quotes, PDFs), emails, and Discord. Provides the complete design system: dual-mode colors (Earth light + Amber Dark), Bungee/Plus Jakarta Sans/JetBrains Mono typography, component patterns, animations for web apps, A4 quote templates with branded headers/footers and print-ready CSS, email template guidelines, Discord embed/role color specs, career path color scale, and a bilingual communication tone guide (HU tegezos + EN). Use when building any bildr.hub-branded application, UI, generating business documents, or writing brand-aligned copy."
---

# bildr.hub Brand Identity Skill

## Purpose

Apply the bildr.hub visual identity consistently to any web project, business document, email, or Discord communication. The brand uses a warm earth-tone palette with two distinct modes: **Earth (light)** for community pages and **Amber Dark (dark)** for client/corporate pages. Typography is built on Bungee (display, always UPPERCASE), Plus Jakarta Sans (body), and JetBrains Mono (code/labels).

## When to Use

- Building a new app, tool, or landing page for bildr.hub
- Creating a UI prototype or demo that should carry the bildr.hub brand
- Setting up the design system / theme in a new project
- Generating business documents: quotes, proposals, invoices
- Creating any PDF from HTML that should carry the bildr.hub brand
- Writing marketing copy, emails, or client-facing text for bildr.hub
- Updating Discord embeds, bot messages, role colors, or welcome content
- The user mentions "bildr brand", "bildr style", "bildr.hub", "brand it" (in bildr.hub context)

## Brand Essence (Quick Reference)

| Attribute | Value |
|-----------|-------|
| Name | **bildr.hub** (always lowercase, with dot) |
| Legal entity | BILDR HUB Korlátolt Felelősségű Társaság (BILDR HUB Kft.) |
| Domain | bildr.hu |
| Email | ai@bildr.hu |
| Tagline | "Build. Learn. Grow." |
| Client headline | "Amit ma kézzel csinálsz, holnap magától megy." |
| Client headline (EN) | "What you do by hand today, runs itself tomorrow." |
| Light mode | **Earth** - warm creams and browns (community pages) |
| Dark mode | **Amber Dark** - warm black with amber/gold (client/corporate pages) |
| Display font | **Bungee** (400) - always UPPERCASE |
| Body font | **Plus Jakarta Sans** (200-800) |
| Mono font | **JetBrains Mono** (400, 700) |
| Border radius | 12-16px (rounded, friendly) |
| Max content | 1280px centered |
| Tone | Motivating, honest, growth-oriented, informal ("te") |
| Languages | Hungarian (primary, tegezos) + English |
| Logo | **Under design** - temporary: 'bildr.hub' text in Bungee |

### Legal / Company Data

| Adat / Field | Érték / Value |
|-------|-------|
| Cégnév / Company name | BILDR HUB Korlátolt Felelősségű Társaság |
| Rövid név / Short name | BILDR HUB Kft. |
| Cégjegyzékszám / Company registry no. | 01-09-454292 |
| Székhely / Registered seat | 1052 Budapest, Károly körút 10. 2. em. 3B. ajtó |
| Statisztikai számjel / Statistical code | 33011387-7020-113-01 |
| Adószám / Tax number | 33011387-2-41 |
| Közösségi adószám / EU VAT number | HU33011387 |

Jogi dokumentumokban (szerződések, árajánlatok, számlák) ezeket az adatokat **pontosan, betűhíven** kell idézni - különösen a cégnevet, cégjegyzékszámot, adószámot és székhelyet.

### What bildr.hub IS

- Hybrid: academy + community + delivery
- Real projects, real pay, revenue share
- Performance-based career progression
- Open events, curated membership
- AI, automation, and cloud first

### What bildr.hub is NOT

- Not free labor ("tapasztalatert dolgozol")
- Not an exclusive club (open events, curated deeper levels)
- Not a school/bootcamp (no tuition, no diploma, not an online course)

### Core Values

1. **Csinalas > Beszeles** - real projects, real outputs
2. **Kozosseg > Maganyos farkas** - stronger together, teamwork
3. **Novekedes > Tokeletesseg** - always a next level, learn from mistakes
4. **Oszinteseg > Politika** - no corporate BS, transparent decisions
5. **AI, automatizacio es Cloud first** - process optimization, modern approach
6. **Win-win szituaciok** - individual and team level

---

## Visual System Summary

### Color Modes

**Light mode ("Earth")** - for community pages:

| Token | Hex | Role |
|-------|-----|------|
| Background | `#f5f0eb` | Cream white |
| Primary | `#6b4423` | Dark brown |
| Secondary | `#8b6144` | Medium brown |
| Accent | `#a8763e` | Golden brown |
| Text | `#3d2814` | Deep dark brown |

**Dark mode ("Amber Dark")** - for client/corporate pages:

| Token | Hex | Role |
|-------|-----|------|
| Background | `#1c1917` | Warm near-black |
| Primary | `#d97706` | Orange/amber |
| Secondary | `#f59e0b` | Light orange |
| Accent | `#fbbf24` | Gold/yellow |
| Text | `#fef3c7` | Pale cream |

**Full token reference** (with derived tokens, oklch values, component patterns, Tailwind v4 block): see `references/design-system.md`

### Typography Rules

| Role | Font | Rule |
|------|------|------|
| Display | **Bungee** | Always **UPPERCASE**. Community titles, CTA buttons, accent words in corporate headings. |
| Body | **Plus Jakarta Sans** | Body text, subtitles, descriptions. **Corporate headings: weight 700**, accent word in Bungee. |
| Mono | **JetBrains Mono** | Code, labels, badges, technical elements. |

**Corporate heading pattern:** Plus Jakarta Sans 700 for the main sentence + Bungee UPPERCASE only for the key accent phrase. This keeps corporate pages professional with a touch of personality.

```html
<!-- Corporate hero example -->
<h1>
  <span style="font-family: 'Plus Jakarta Sans'; font-weight: 700;">Amit ma kézzel csinálsz,</span><br>
  <span style="font-family: 'Bungee'; text-transform: uppercase; color: var(--color-accent);">holnap magától megy.</span>
</h1>
```

### Key Design Decisions

| Element | Decision |
|---------|----------|
| Cards | **Bordered** - 1px solid, clean, organized |
| Background texture | **Dotted** - subtle, barely visible, adds warmth |
| Gradients | **Yes, warm** - brown-to-gold in hero sections and CTAs |
| Animation | **Smooth, restrained** - ease-out, 0.5s, subtle hover lift |
| Icons | **Community:** filled / **Client-facing:** outline |
| Links | **Color + underline on hover** (accent color, no underline by default) |
| Section separation | **Spacing only** (no lines, optional bg color change) |
| Code blocks | **Themed** - dark brown bg (#3d2814), cream text (#fef3c7) |
| Tables | **Striped rows + strong header** - dark brown header, alternating cream/white |
| Nav height | 64px, fixed top, backdrop-filter: blur(20px) |

### Two Sub-page Concept

| Aspect | Community page | Client/corporate page |
|--------|---------------|----------------------|
| Visual mode | **Light (Earth)** | **Dark (Amber Dark)** |
| Tone | Energetic, motivating | Clean, professional, premium |
| Icons | Filled | Outline |
| CTA text | **CSATLAKOZZ** / JOIN THE CREW | **OLDJUK MEG** / LET'S SOLVE IT |
| CTA target | Discord invite link | Consultation/quote request |
| Content | Values + builder project showcase | Problem-solution focused |
| Discord focus | Yes - drive everyone here | No - drive toward consultation |

### Hero and Navigation

- **Hero**: Big Bungee title + warm gradient background. Landing page is a "gateway": left -> community, right -> corporate. Only the HERO is visible, then navigate onward.
- **Mobile**: Phone-optimized - the two directions stack vertically.
- **Navbar**: Fixed top, blur background, backdrop-filter: blur(20px). Logo left, links + CTA right.

---

## Workflow

### 1. Determine the Stack

Check what technology the project uses:

- **Next.js + Tailwind v4**: Use the `@theme` block from `references/design-system.md`. Load fonts via `next/font/google`.
- **Vanilla HTML/CSS**: Copy `assets/bildr-tokens.css` into the project. Load fonts from Google Fonts CDN.
- **React (Vite) + Tailwind**: Same `@theme` block approach. Load fonts in `index.html` from Google Fonts CDN.
- **Other stacks**: Use `assets/bildr-tokens.css` as CSS custom properties. Adapt as needed.

### 2. Apply Design Tokens

Read `references/design-system.md` for the complete token reference. At minimum, set up:

1. **Colors** - Import all color tokens (bg, card, text, text-2, text-3, border, accent, accent-dark, accent-light, surface, primary, secondary)
2. **Typography** - Bungee as display (UPPERCASE), Plus Jakarta Sans as body, JetBrains Mono for labels/badges/code
3. **Shadows** - Use the shadow system (sm/md/lg + accent variants) - warm brown/amber-based
4. **Border radius** - 12px for standard elements, 16px for large cards/sections
5. **Dark/Light mode** - Light (Earth) is default (community). Dark (Amber Dark) via `.dark` class on `<html>` (corporate)

### 3. Apply Component Patterns

The design system includes these reusable patterns (see `references/design-system.md` for full CSS):

- **`.btn-primary`** - Solid button (Bungee UPPERCASE, accent bg, rounded)
- **`.btn-secondary`** - Bordered button (mono font, accent on hover)
- **`.section-mono`** - Section label (mono, uppercase, accent, 11px)
- **`.section-header h2`** - Section heading (Bungee UPPERCASE, clamp)
- **`.wrap`** - Content container (max 1280px, responsive padding)
- **Cards** - bg: `--color-card`, border: `--color-border`, 12px radius, hover shadow
- **Code blocks** - dark brown bg, cream text
- **Tables** - striped rows, dark brown header with cream text
- **Dotted background** - radial-gradient pattern on sections

### 4. Apply Animations

For interactive projects:

- **Scroll reveal**: `opacity: 0 -> 1, y: 30 -> 0` triggered at 80% viewport
- **Hover states**: `transition-all 0.5s ease-out`, subtle `translateY(-3px)` on cards
- **CSS easing**: `--ease-smooth` (ease-out family)

### 5. Logo

**Currently under design.** Use text logotype as temporary:

```html
<span class="logo" style="font-family: 'Bungee', sans-serif; text-transform: uppercase;">BILDR<span style="color: var(--color-accent)">.HUB</span></span>
```

Logo files will be added later: `assets/logo.svg`, `assets/logo-icon.svg`

---

## Communication Tone Guide

### Magyar (tegezos, elsodleges nyelv)

**Stilus:** Motivalo, oszinte, fejlodes-orientalt. Tegezunk mindenhol, de igenyesen.

**Kontextusfuggo regiszter:**
- **Discord** = lazabb, de igényes
- **Weboldal** = motiváló, letisztult
- **Árajánlat / email** = igényes, professzionális, de továbbra is tegezős

**Do's:**
- Tegezz mindenhol, konzekvensen
- Aktív igék ("Megoldjuk" nem "Megoldásra kerül")
- Konkrétumok ("2 hét" nem "rövidesen")
- A probléma után mindig jöjjön a megoldás
- Rövid mondatok és bekezdések
- Mondandód lényege az első mondatban

**Don'ts:**
- Soha ne magázz
- Nincs corporate buzzword ("szinergia", "innovatív megoldás")
- Nincs túlzott ígéret ("forradalmasítjuk")
- Nincs passzív szerkezet
- Nincs `&` jel - mindig "és"
- Nincs `–` (en-dash) - sima `-` kötőjel

**CTA szövegek:**
- Community: "Csatlakozz" / "Join the crew"
- Céges: "Oldjuk meg" / "Let's solve it"
- Másodlagos: "Nézd meg mit építünk" / "See what we build"

**Példa szövegek:**

**Web hero (community):**
> Építs. Tanulj. Növekedj.

**Web hero (céges):**
> Amit ma kézzel csinálsz, **HOLNAP MAGÁTÓL MEGY.**

**Web sub-hero (community):**
> Valódi projektek, valódi fizetés, valódi fejlődés - egy közösségben, ahol a teljesítmény számít.

**Web sub-hero (céges):**
> Automatizáljuk a folyamataidat, hogy a csapatod arra fókuszáljon, ami valóban számít.

**Árajánlat bevezető:**
> Összeszedtem, hogyan tudjuk a leghatékonyabban megoldani amit beszéltünk. A következő oldalon leírom a részleteket és az árajavaslatot.

**Email opening (ismeretlennek):**
> Szia [Név]! A bildr.hub csapatából írok. Láttam, hogy [kontextus] - összeszedtem pár gondolatot, hátha hasznos.

**Email opening (meglévő ügyfél):**
> Szia [Név]! Hogy halad a [projekt név]? Van pár ötletem, amit megbeszélhetnénk.

### English

**Style:** Same builder mentality, direct, motivational. First-name basis.

**Key principles:**
- Warm, direct, conversational
- Problem -> solution structure in client communication
- Value-driven, no fluff
- Competent but never condescending

**Example texts:**

**Web hero (community):**
> Build. Learn. Grow.

**Web hero (client):**
> What you do by hand today, **RUNS ITSELF TOMORROW.**

**Web sub-hero (client):**
> We automate your processes so your team can focus on what truly matters.

**Email opening:**
> Hey [Name]! Writing from the bildr.hub team. I noticed [context] - put together a few thoughts that might help.

**CTA buttons:**
- "Join the crew" (not "Register")
- "Let's solve it" (not "Contact us")
- "See what we build" (not "Learn more")

### Discord (internal)

**Register:** Lazább, de igényes. Emoji rendszer a career path-ból.

**Patterns:**
- Level-up gratulációk: "GG [név]! 🏗️ Builder lettél - megérdemelted!"
- Kihívások: "Heti challenge: építs egy REST API-t 48 óra alatt. Ki vállalja? 🧱"
- Showcase ösztönzés: "Mutasd meg min dolgozol! Drop a screenshot a #showcase-be 📸"
- Feedback: "Jó munka volt a [projekt]! Amit még lehetne: [konkrétum]"

**Career path emojik:**
🌱 Newcomer | 🧱 Brick | 🏗️ Builder | 🏛️ Architect | ⚙️ Engineer | 🧠 Mastermind | 🌟 Mentor | 🌿 Founder

---

## Career Path Color Scale

Used in Discord roles, web badges, and the career progression UI:

| Level | Emoji | Hex | Description |
|-------|-------|-----|-------------|
| Newcomer | 🌱 | `#f5f0eb` | Cream |
| Brick | 🧱 | `#d4c5b5` | Beige |
| Builder | 🏗️ | `#a8763e` | Golden brown |
| Architect | 🏛️ | `#8b6144` | Medium brown |
| Engineer | ⚙️ | `#6b4423` | Dark brown |
| Mastermind | 🧠 | `#d97706` | Amber |
| Mentor | 🌟 | `#f59e0b` | Gold |
| **Founder** | 🌿 | `#d62828` | **Red (stays!)** |

These colors should be applied as:
- Discord role colors (exact hex)
- Web badge backgrounds (with appropriate text color)
- Career path visualization gradients

---

## Document Generation (Quotes, PDFs)

For business documents (quotes, contracts), the brand uses the **Earth palette** (light background) for print readability. The template supports two PDF generation methods: client-side `window.print()` and server-side Playwright.

### When to Generate Documents

- Quotes / proposals (árajánlatok)
- Contracts (szerződések)
- Invoices or summaries
- Any professional A4 PDF

### Document Workflow

1. **Start from the template**: Read `assets/quote-template.html` as the base. It contains a complete, self-contained A4 HTML document with embedded CSS, print styles, header, footer, and page break handling.

2. **Fill in the content**: Replace the placeholder sections with actual document content. The template includes:
   - bildr.hub header (logotype + contact)
   - Document title and type
   - Date and document number
   - Client information
   - Project description
   - Line items table (feature grid with numbered icons)
   - Terms / deadlines / phased timeline
   - Pricing table (bundled pricing with strikethrough original)
   - Payment schedule (milestone-based installments)
   - Monthly running costs breakdown (vendor costs vs bildr.hub maintenance)
   - **Two signature blocks** (bildr.hub + client, with handwriting signature animation)
   - **Accept section** (ELFOGADOM button → offer-worker callback + signature animation)
   - **Reject link** (subtle, below accept button)
   - Footer (bildr.hu + ai@bildr.hu)

3. **Key document rules**:
   - **NEVER use `&` or `–` (en-dash) characters in HTML content.** Use "és" instead of `&`, and `-` instead of `–`.
   - **ALWAYS use proper Hungarian accented characters (ékezetek)** in all document text.
   - Documents always use **Earth palette** (light background) for print readability.
   - The template is print-friendly with warm brown tones.
   - Use `page-break-before: always` on elements that should start a new page.
   - Use `page-break-inside: avoid` on tables and signature blocks.
   - All links must be clickable `<a href="...">` tags.

4. **Clickable links in footer** (always present):
   - Website: `https://bildr.hu`
   - Email: `mailto:ai@bildr.hu`

5. **Generate PDF** — two methods available (see below).

### Proposal File Naming and Offer Integration

Proposals live at `public/client/{opportunityId}.html` in the bildr-website repo, where the ID matches the Twenty CRM opportunity UUID.

**Offer-worker integration flow:**
1. Create proposal HTML → `public/client/{uuid}.html`
2. Set `offerUrl` in CRM → `https://bildr.hu/client/{uuid}.html`
3. CRM webhook triggers → offer-worker sends branded email to client
4. Client opens proposal → reads, clicks ELFOGADOM
5. Signature animation plays (Dancing Script handwriting, left-to-right reveal)
6. After 1.5s → redirect to `bildr.hu/offer/callback/accept/{uuid}`
7. Offer-worker: CRM update, task creation, Discord notification, confirmation emails
8. Client sees confetti thank-you page

**Reject flow:** Subtle link under accept button → `bildr.hu/offer/callback/reject/{uuid}`

See `references/offer-worker.md` for full offer-worker documentation.

### Signature Animation

The client signature block uses **Dancing Script** (Google Font, weight 700) for a handwriting effect:

```html
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&..." rel="stylesheet">

<div class="doc-signature-line">
  <span class="doc-signature-ink" id="client-signature-ink">Client Name</span>
</div>
```

CSS animation reveals text left-to-right using `clip-path`:

```css
.doc-signature-ink {
  font-family: 'Dancing Script', cursive;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-accent-dark);
  position: absolute;
  bottom: 10px;
  left: 0;
  white-space: nowrap;
  clip-path: inset(0 100% 0 0);
}

.doc-signature-ink.signed {
  animation: handwrite 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@keyframes handwrite {
  0%   { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0% 0 0); }
}
```

### Multi-Component Proposal Patterns

For proposals with multiple deliverables (e.g. app + website):

**Phased timeline:**
```
I. fázis: [Component A]  → X hét fejlesztés + 2 hét finomhangolás
II. fázis: [Component B] → Y hét fejlesztés + 2 hét finomhangolás
Teljes projekt            → ~Z hét (N hónap)
```

**Bundled pricing:** Show individual component prices, strikethrough total, then discounted bundle price with savings amount highlighted.

**Milestone-based payments:** Equal installments tied to project milestones (project start, app test delivery, website test delivery, final delivery).

**Monthly running costs:** Split clearly into:
- Vendor costs (paid directly to providers: Cloudflare, Shopify, AI, etc.)
- bildr.hub maintenance (monthly availability hours)

**Feature grid:** Numbered items with colored icon badges. Use different badge colors for different components (default for app, accent-light background for website).

### PDF Generation

Two methods, both produce identical output:

#### Method 1: Client-side `window.print()` (recommended for web-hosted quotes)

The template includes a "PDF LETÖLTÉS" button that calls `window.print()`. The browser opens the print dialog where the user selects "Save as PDF" (Chrome) / "Mentés PDF-ként".

The `@media print` CSS handles everything automatically:
- `@page { margin: 24mm 22mm 28mm 22mm }` — per-page margins
- `.page` layout reset (no padding/margin/shadow)
- `.doc-accept` section hidden
- `page-break-inside: avoid` on tables, signatures, parties

**Advantages**: Vector text (selectable, searchable), perfect page breaks, tiny file size (~180KB), no dependencies, works in any browser.

**IMPORTANT**: Do NOT use html2pdf.js or similar canvas-based libraries. They produce rasterized text, inconsistent page breaks, and browser-dependent rendering artifacts.

#### Method 2: Playwright `page.pdf()` (for server-side/automated generation)

**Step 1 - Serve the HTML locally:**
```bash
python3 -m http.server 8788
```

**Step 2 - Navigate to the page:**
```
URL: http://localhost:8788/quote.html
```

**Step 3 - Wait for fonts, then generate PDF:**
```js
async (page) => {
  await page.waitForTimeout(2000);
  await page.pdf({
    path: '/absolute/path/to/output.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '24mm',
      right: '22mm',
      bottom: '28mm',
      left: '22mm'
    }
  });
  return 'PDF saved';
}
```

**Step 4 - Kill the HTTP server** after PDF is generated.

**Playwright rules:**
- Margins in `page.pdf()` override `@page` CSS margins
- Always `printBackground: true`
- Always wait 2 seconds for fonts
- Use `format: 'A4'`
- Let content flow in a single `.page` wrapper

---

## Contract Generation (Szerződések)

For legal documents (contracts, amendments, completion certificates), the brand uses the **Earth palette** with the same warm brown document styling as quotes. Contract templates are self-contained A4 HTML files with embedded CSS, identical print/PDF support.

### When to Generate Contracts

- Vállalkozási szerződés (project-based contract for custom development)
- Keretszerződés (framework agreement for ongoing work)
- Teljesítési igazolás (completion certificate for milestones/final delivery)

### Contract Templates

| Template | Path | Purpose |
|----------|------|---------|
| Vállalkozási szerződés | `assets/vallalkozasi-szerzodes-template.html` | One-off project contracts with milestones, IP, warranty |
| Keretszerződés | `assets/keretszerzodes-template.html` | Ongoing/retainer framework agreements |
| Teljesítési igazolás | `assets/teljesitesi-igazolas-template.html` | Milestone or final delivery sign-off |

### Contract Workflow

1. **Start from the template**: Read the appropriate template from `assets/`. Templates contain all CSS, print styles, header/footer, and section structure.

2. **Fill in client and project data**: Replace all `[...]` placeholders with actual values. Key fields:
   - Client name, address, company registry, tax number, representative
   - Project name, description, tech stack
   - Pricing, payment schedule, milestones
   - Dates, contract ID

3. **Contract ID format**: `BH-{TYPE}-{YEAR}-{SEQ}`
   - `BH-VSZ-2026-001` = Vállalkozási szerződés
   - `BH-KSZ-2026-001` = Keretszerződés
   - `BH-TIG-2026-001` = Teljesítési igazolás

4. **Szolgáltató (Provider) data**: Always use the exact legal data from the "Legal / Company Data" table above. Representative: use actual ügyvezető name.

5. **Verify**: No `[...]` placeholders remain. Search with regex `\[.*?\]` — only CSS selectors like `a[href^="http"]` should match.

6. **Deploy**: Upload to Cloudflare KV via the BILDR-CONTRACTS repo (GitHub Actions auto-deploys). Contracts are accessible at `contracts.bildr.hu/{hash}`.

### Vállalkozási Szerződés Structure (18 sections)

The template has 18 numbered sections. When adding project-specific sections (e.g., maintenance), insert at the appropriate position and renumber all subsequent sections. **Update all cross-references** (e.g., "a 10. pontban meghatározott óradíj" must reflect new numbering).

| # | Section | Notes |
|---|---------|-------|
| 01 | A szerződés tárgya | Project description, spec reference (1. sz. Melléklet) |
| 02 | Teljesítési határidők | Milestones table, delay penalties (0.5%/day, max 10%) |
| 03 | Vállalkozói díj | Pricing table, payment schedule, 8 day payment term |
| 04 | Teljesítés és átadás-átvétel | Deliverables, 5 workday acceptance window |
| 05 | Üzembe helyezés | Server setup, EU data center, backups, security |
| 06 | Szellemi tulajdon | IP transfer on full payment, provider retains tools/know-how |
| 07 | Szavatosság | 90 days warranty, bug severity tiers (24h/48h/5d) |
| 08 | Referencia jog | Portfolio usage rights |
| 09 | Titoktartás | Mutual NDA, unlimited duration |
| 10 | Fejlesztési változtatások | Change requests, hourly rate |
| 11 | Adatvédelem | GDPR, DPA reference |
| 12 | Felelősség korlátozása | Liability cap = contract value |
| 13 | Vis maior | 60 day threshold for termination |
| 14 | Felmondás | Withdrawal (15d), no ordinary termination, extraordinary grounds |
| 15 | Kapcsolattartás | Contact persons, written-only legal notices |
| 16 | Alkalmazandó jog | Hungarian law, Budapest courts |
| 17 | ÁSZF | bildr.hu/aszf reference |
| 18 | Záró rendelkezések | Amendments in writing, severability, annexes |

### Adding Maintenance/Retainer Section

When a contract includes ongoing maintenance (üzemeltetés és karbantartás), insert as a new section after Szavatosság (07) and renumber everything after. Key elements:

- Duration: határozatlan (indefinite) or fix term
- Monthly fee + included hours
- Unused hours don't roll over
- Overage billed at development hourly rate (cross-reference the Fejlesztési változtatások section)
- Either party can terminate with 30 calendar days written notice
- Excludes: major version upgrades, platform migration, new features
- Activate after warranty period expires

Update the Felmondás section to reference maintenance termination rules separately from the project contract.

### Contract Document Rules

All rules from the quote/PDF generation section apply, plus:

- **ALWAYS use proper Hungarian legal terminology** (Szolgáltató, Megrendelő, Felek, Ptk., etc.)
- **Contract sections use `doc-section` with `doc-section-num`** for numbered headings (01, 02, ... 18/19)
- **Clauses use `clause` + `clause-num`** for sub-numbering (1.1., 1.2., etc.)
- **Cross-references**: When renumbering sections, update ALL internal references (e.g., "a 10. pontban", "a 9. pont szerinti titoktartás")
- **Signatures**: Two blocks — Szolgáltató (left) + Megrendelő (right), with name and role
- **Footer**: bildr.hu + ai@bildr.hu + document identifier

### Contracts Hosting (contracts.bildr.hu)

Signed/final contracts are hosted via Cloudflare Worker at `contracts.bildr.hu/{hash}`:

- **Repo**: `BILDR-HUB/BILDR-CONTRACTS` on GitHub
- **Worker**: Serves HTML from KV by hash lookup
- **Registry**: `contracts.json` maps hash → file + metadata
- **CI/CD**: GitHub Actions auto-deploys Worker + syncs all contracts to KV on push to main
- **404**: Branded error page ("Ez a dokumentum nem található")
- **Headers**: `X-Robots-Tag: noindex, nofollow` (contracts are private)

To upload a new contract:
1. Place HTML in `documents/`
2. Add entry to `contracts.json` with a random 8-char hex hash
3. Push to main → GitHub Actions handles the rest

---

## Email Template Guidelines

For email communications, follow these brand rules:

| Element | Specification |
|---------|--------------|
| Header | bildr.hub logotype (text-based, Bungee uppercase) |
| Body font | Plus Jakarta Sans, Earth palette colors |
| CTA button | Golden brown (#a8763e) background, UPPERCASE Bungee text, white text, 12px radius |
| Footer | bildr.hu + ai@bildr.hu |
| Links | Accent color (#a8763e), underline on hover |
| Tone | Tegezős, motiváló, igényes (see tone guide above) |

Email should be consistent with the web brand - warm, professional, never corporate.

---

## Discord Update Guidelines

When updating Discord bot embeds, role colors, or channel content:

### Embed Colors
- **Community/general context**: Amber `#d97706`
- **Official/announcement**: Dark brown `#6b4423`
- **Success/celebration**: Green `#16a34a`
- **Error/warning**: Red `#dc2626`

### Role Colors
Apply the career path hex values as Discord role colors (see Career Path Color Scale above).

### Content Updates
- Welcome message, rules, and learning-path content should follow the tone guide
- Use career path emojis consistently
- Bot avatar: bildr.hub text in Bungee font

---

## Bundled Resources

| Path | Description |
|------|-------------|
| `references/design-system.md` | Complete design token reference with Earth + Amber Dark modes, component CSS, typography scale, Tailwind v4 @theme block |
| `references/offer-worker.md` | Offer-worker documentation: CRM webhooks, email flow, accept/reject callbacks, proposal page integration |
| `assets/bildr-tokens.css` | Standalone CSS custom properties file - drop into any project |
| `assets/quote-template.html` | Self-contained A4 HTML quote template for web view + PDF (via `window.print()` or Playwright) |
| `assets/vallalkozasi-szerzodes-template.html` | Vállalkozási szerződés sablon - egyedi projekt fejlesztéshez |
| `assets/keretszerzodes-template.html` | Keretszerződés sablon - folyamatos együttműködéshez |
| `assets/teljesitesi-igazolas-template.html` | Teljesítési igazolás sablon - mérföldkő/végátadás aláíráshoz |

