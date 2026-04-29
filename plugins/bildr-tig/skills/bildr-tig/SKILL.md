---
name: bildr-tig
description: "BILDR Teljesítési Igazolás (TIG) generálása egy oldalas A4 HTML-ben. Mikor teljesítettük a feladatot + két fél által aláírandó blokk (Megrendelő + Vállalkozó). BILDR.HUB warm brown branding, PDF export window.print()-tel. Visszakérdez a hiányzó adatokra (munkalap szám, projekt, teljesítés dátuma, feladatok listája, díj, megrendelő adatai). Trigger: teljesítési igazolás, TIG, performance certificate, BILDR teljesítés."
---

# bildr-tig

## Cél

BILDR Teljesítési Igazolás (TIG) generálása **egyetlen A4 oldal** HTML formátumban. Két fél (Megrendelő + Vállalkozó) általi aláírásra alkalmas. A keretszerződés 4. pontja szerint a Vállalkozó által kiállított számla alapja a TIG.

## Mikor használd

Trigger szavak:
- **HU:** teljesítési igazolás, TIG, teljesítés igazolás, igazoljuk a teljesítést
- **EN:** performance certificate, completion certificate, acceptance certificate

## Workflow

### 1. lépés — Adatok visszakérdezése

Ha bármi hiányzik a briefből, **AskUserQuestion-nel** kérdezz vissza egy körben:

| Adat | Kötelező | Megjegyzés |
|---|---|---|
| Megrendelő cégnév | igen | pl. "Példa Ügyfél Kft." |
| Megrendelő székhely | igen | |
| Megrendelő adószám | igen | |
| Megrendelő képviselő | igen | név + szerep (pl. ügyvezető) |
| Vállalkozó | nem | default: BILDR HUB Kft. (lásd lentebb) |
| Keretszerződés dátuma | igen | pl. 2026. április 8. |
| Munkalap száma | igen | pl. "1. sz. Munkalap" |
| Munkalap címe / projekt | igen | pl. "Marketing weboldal fejlesztése" |
| Teljesítés időszaka | igen | pl. "2026. április 8 — 2026. április 28." |
| Teljesítés dátuma | igen | pl. 2026. április 28. |
| Elvégzett feladatok | igen | bullet pontos lista |
| Vállalkozói díj | igen | nettó Ft + ÁFA |
| Számlázási megjegyzés | nem | pl. előleg-végszámla hivatkozás |
| Aláírás helye | nem | default: Budapest |

### 2. lépés — Vállalkozó default adatok

```
BILDR HUB Korlátolt Felelősségű Társaság
Székhely: 1052 Budapest, Károly körút 10. 2. em. 3B. ajtó
Adószám: 33011387-2-41
Cégjegyzékszám: 01-09-454292
Képviseli: Kovács Bence, ügyvezető
```

Ha a saját céged adatait szeretnéd használni a Vállalkozó blokkban, írd át a `assets/tig-template.html`-t a saját adataidra.

### 3. lépés — HTML generálás

Használd az `assets/tig-template.html`-t. Egyetlen `.page` (210mm × 297mm), nincs page-break.

A struktúra:
```
┌─────────────────────────────────────────────┐
│  doc-header (BILDR.HUB | TIG — Munkalap #N)│
│                                             │
│  Cím:    TELJESÍTÉSI IGAZOLÁS               │
│                                             │
│  Hivatkozás blokk:                          │
│   - Keretszerződés                          │
│   - Munkalap                                │
│   - Teljesítés időszaka                     │
│                                             │
│  Felek box (Megrendelő ↔ Vállalkozó)       │
│                                             │
│  Igazolt teljesítés:                        │
│   - Feladat lista (bullet)                  │
│   - Teljesítés dátuma                       │
│   - Vállalkozói díj (nettó + ÁFA + bruttó) │
│                                             │
│  Záradék (a megrendelő igazolja, hogy...)   │
│                                             │
│  Aláírások (két oszlop: Megrendelő ↔ Váll.)│
│                                             │
│  Footer (helyszín, dátum)                  │
└─────────────────────────────────────────────┘
```

A template `{{PLACEHOLDER}}` szintaxist használ — futtatáskor cseréld ki a tényleges értékekre Edit/Write tool-okkal vagy egy egyszerű find-and-replace-szel.

### 4. lépés — Mentés

Default mentési hely:
```
<bildr-website-repo>/public/tig/{ÜGYFÉL_SLUG}-{MUNKALAP_SZAM}-{YYYY-MM-DD}.html
```

Például: `peldaugyfel-1-2026-04-28.html`

Ha a `tig/` mappa nem létezik, hozd létre.

### 5. lépés — PDF export

A HTML-t a user böngészőben megnyitja → Cmd+P → "Mentés PDF-ként". A `@media print` szabályok az aláírás-vonalakat és a layout-ot megőrzik.

```bash
open {fájlnév}.html
```

## Záradék minta szöveg (másolható)

```
A Megrendelő a fent felsorolt feladatokat mennyiségi és minőségi szempontból
átvizsgálta, és azokat a Vállalkozási Keretszerződés és a {N}. sz. Munkalap
rendelkezéseinek megfelelően teljesítettnek minősíti. A jelen Teljesítési
Igazolás aláírásával a Megrendelő hozzájárul a feladatra vonatkozó számla
kiállításához. Fizetési határidő: a számla kézhezvételétől számított 8 munkanap.
```

## Bundled erőforrások

| Fájl | Szerep |
|---|---|
| `assets/tig-template.html` | Egyetlen-oldalas A4 HTML template `{{PLACEHOLDER}}`-ekkel |

## Kapcsolódó skill-ek

- `bildr-contract` — keretszerződés, ami a TIG hivatkozási alapja
- `bildr-contractpage` — munkalap, ami a TIG-ben hivatkozott feladatokat tartalmazza
- `bildr-offer` — árajánlat, ami a teljesített projekt eredeti dokumentuma
