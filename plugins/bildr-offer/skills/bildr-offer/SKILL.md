---
name: bildr-offer
description: "BILDR.HUB HTML árajánlat (proposal) generálása. Multi-page A4 layout, warm brown palette, Bungee + Plus Jakarta Sans tipográfia, PDF export window.print()-tel, accept/reject callback flow. Visszakérdez minden hiányzó adatra (ügyfél név, logó, szolgáltatás, csomagok, árak, érvényesség, opportunity UUID). Trigger: árajánlat, ajánlat készítés, bildr offer, bildr ajánlat, bildr proposal, quote BILDR-nek."
---

# bildr-offer

## Cél

BILDR.HUB brandelt HTML árajánlat generálása ügyfeleknek. Az output egy önálló HTML fájl, amely:
- Multi-page A4 layout (scroll-based, nem slide deck)
- Böngészőben megnyitható, A4-re nyomtatható (Cmd+P → PDF)
- Inline CSS, csak a Google Fonts külső
- Accept/reject callback flow (`signProposal()`)

## Mikor használd

Trigger szavak:
- **HU:** árajánlat, ajánlat, ajánlat készítés, bildr ajánlat, bildr offer, proposal
- **EN:** offer, quote, proposal, pricing presentation

## Workflow

### 1. lépés — Brief beolvasása + visszakérdezés

A user megad egy briefet. Ellenőrizd, melyik mező hiányzik, és **AskUserQuestion-nel egyszerre** kérdezz rá a hiányzó adatokra.

| Adat | Kötelező | Megjegyzés |
|---|---|---|
| Ügyfél cégnév | igen | pl. "Példa Ügyfél Kft." |
| Ügyfél kapcsolattartó (név + szerep) | nem | aláírás blokkhoz |
| Ügyfél logó | nem | base64 PNG/SVG; ha nincs, text fallback |
| Ügyfél domain / weboldal | nem | parties box-hoz |
| Projekt / szolgáltatás cím | igen | pl. "AI Voice Agent fejlesztés" |
| Rövid projekt leírás (1-2 mondat) | igen | cover subtitle |
| Csomagok és tartalmuk | igen | csomagonként min. 8-16 feature |
| Csomagonkénti ár (Ft / EUR) | igen | nettó, áthúzott + akciós ha van |
| Tech stack | nem | tech-badge-ek |
| Fizetési ütemezés | igen | pl. 50% szerződéskötéskor, 50% átadáskor |
| Havi üzemeltetési költség | nem | hosting, DB, AI API |
| Érvényesség | nem | default: 30 nap |
| Opportunity UUID | igen | fájlnévhez + callback URL-ekhez |
| Nyelv | nem | default: magyar |

**Ne találj ki adatokat.** Ha valami hiányzik, kérdezz vissza. Ha az user "nem tudom"-mal válaszol, használj sensible default-ot és jelezd.

### 2. lépés — UUID + fájlnév

```
TARGET = <bildr-website-repo>/public/client/{OPPORTUNITY_UUID}.html
```

Ha nincs UUID, generálj egyet: `uuidgen | tr '[:upper:]' '[:lower:]'`

### 3. lépés — HTML összeállítás

A struktúra fix — 5 oldal A4:

```
PAGE 1: COVER         — cover-logos, cover-title, cover-subtitle, cover-meta
PAGE 2: ÖSSZEFOGLALÓ  — doc-parties, 01 Vezetői összefoglaló, 02 Megértettük az igényt
PAGE 3: FUNKCIÓK      — 03 A megoldás (feature-grid 16 item), 04 Tech stack
PAGE 4: ÁRAZÁS        — 05 Fejlesztési díj (doc-table), 06 Havi üzemeltetés
PAGE 5: LÉPÉSEK       — 07 Következő lépések, doc-signatures, doc-accept, doc-footer
```

**CSS változók (fix BILDR.HUB warm brown palette):**

```css
:root {
  --color-text: #3d2814;
  --color-text-2: #6b4423;
  --color-text-3: #8b6144;
  --color-accent: #a8763e;
  --color-accent-dark: #7a5a2e;
  --color-accent-light: #e8d5b8;
  --color-border: #d4c5b5;
  --color-border-light: #ece5dc;
  --color-stripe: #fdfbf8;
  --color-bg: #f5f0eb;
  --font-display: "Bungee", sans-serif;
  --font-body: "Plus Jakarta Sans", -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "SF Mono", monospace;
}
```

**Google Fonts import:**

```html
<link href="https://fonts.googleapis.com/css2?family=Bungee&family=Dancing+Script:wght@700&family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### 4. lépés — Accept/reject callback

```html
<button class="doc-accept-btn" id="accept-btn" onclick="signProposal()">ELFOGADOM</button>
<button class="doc-accept-btn secondary" onclick="window.print()">PDF LETÖLTÉS</button>
<a href="https://bildr.hu/offer/callback/reject/{UUID}">Elutasítom</a>
```

```javascript
var OPPORTUNITY_ID = '{UUID}';
function signProposal() {
  var btn = document.getElementById('accept-btn');
  if (btn.disabled) return;
  document.getElementById('client-signature-ink').classList.add('signed');
  btn.disabled = true;
  btn.textContent = 'ELFOGADVA...';
  setTimeout(function() {
    window.location.href = 'https://bildr.hu/offer/callback/accept/' + OPPORTUNITY_ID;
  }, 1500);
}
```

A callback endpoint URL-eket cseréld a saját környezetedre, ha nem a `bildr.hu` domain alatt futsz.

### 5. lépés — Ellenőrzés

```bash
open <bildr-website-repo>/public/client/{UUID}.html
```

Print preview (Cmd+P) — ellenőrizd:
- A4 oldaltördelés (5 oldal)
- Logók megjelennek
- Árak helyesek
- Nincsenek elcsúszott szekciók

### 6. lépés — Deploy

```bash
cd <bildr-website-repo>
git add public/client/{UUID}.html
git commit -m "Add proposal: {ügyfél neve} — {projekt cím}"
git push
```

Cloudflare Pages auto-deploy → URL: `https://<your-domain>/client/{UUID}.html`

A CRM-ben az opportunity `offerUrl` mezőjébe kell beírni.

## PDF export

A user a böngészőben megnyitja a HTML-t, Cmd+P → "Mentés PDF-ként". A `@media print` szabályok automatikusan:
- elrejtik a `.doc-accept` szekciót (ami nem nyomtatandó)
- minden `.page` külön A4 oldalként rendereződik
- eltávolítják a margókat és a háttér színt

```css
@media print {
  html { font-size: 11.5px; }
  body { background: #fff; margin: 0; padding: 0; }
  .page { width: auto; min-height: auto; margin: 0; padding: 0; box-shadow: none; }
  @page { size: A4; margin: 24mm 22mm 28mm 22mm; }
  .doc-parties, .doc-signatures, .doc-highlight, .doc-table thead { page-break-inside: avoid; }
  .doc-accept { display: none; }
}
```

## Tippek

- **Fix BILDR.HUB brand** — a CSS változók nem ügyfélspecifikusak
- **Ügyfél logó** — base64-be konvertálva inline (`data:image/png;base64,...`); ha nincs, használj text fallback-et
- **Csomagok** — ha több csomag van, vagy külön page-eket használj, vagy egy comparison table-t
- **Self-contained** — a SKILL.md elég a HTML összeállításhoz; nincs külső reference fájl

## Kapcsolódó skill-ek

- `bildr-tig` — teljesítési igazolás ehhez az árajánlathoz tartozó projekt teljesítésekor
- `bildr-contract` — keretszerződés, ami az árajánlat elfogadása után készül
- `bildr-hub-identity` — teljes BILDR.HUB design system (ha mélyebb branding kell)
