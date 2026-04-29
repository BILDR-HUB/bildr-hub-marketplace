---
name: bildr-contractpage
description: "BILDR Munkalap (Contract Page) generálása DOCX formátumban a meglévő keretszerződéshez kapcsolódóan. Egy Munkalap egy adott projektet/feladatcsomagot rögzít: feladatok lista, technológia, vállalkozói díj, fizetési ütemezés, teljesítési határidő, harmadik fél szolgáltatási költségek. A felhasználó megadja: hányadik munkalap (1, 2, ...), melyik céghez (a keretszerződésben szereplő Megrendelő), és a feladat-specifikus adatokat. Aláírható, a keretszerződésben rögzített Teljesítési Igazolás flow szerint elfogadható. Trigger: munkalap, BILDR munkalap, contract page, work order, megbízási lap, szerződés melléklet."
---

# bildr-contractpage

## Cél

Egy adott BILDR keretszerződéshez kapcsolódó **N. sz. Munkalap** generálása DOCX formátumban. A munkalap önállóan írja le egy adott projekt/feladatcsomag adatait, és a keretszerződés általános rendelkezéseire hivatkozik.

**Kapcsolódás:** A keretszerződés (`bildr-contract` skill) szabályozza az általános feltételeket; minden új projekt új munkalapként jelenik meg, számozott sorrendben (1, 2, 3...).

## Mikor használd

Trigger szavak:
- **HU:** munkalap, BILDR munkalap, megbízási lap, szerződés melléklet, kerétszerződés melléklet, N. sz. munkalap
- **EN:** work order, contract page, statement of work (SOW)

## Workflow

### 1. lépés — Adatok visszakérdezése

Ha bármi hiányzik a briefből, **AskUserQuestion-nel** kérdezz vissza.

| Adat | Kötelező | Megjegyzés |
|---|---|---|
| Munkalap sorszáma | igen | 1, 2, 3... — hányadik munkalap |
| Megrendelő cégnév | igen | a keretszerződésben szereplő |
| Megrendelő teljes cégnév | igen | hivatalos formula |
| Keretszerződés dátuma | igen | hivatkozási alap, pl. "2026. április 8." |
| Projekt címe | igen | pl. "Marketing weboldal fejlesztése" |
| Feladatok listája | igen | bullet pontos lista a Vállalkozó által végzendő feladatokról |
| Technológiai stack | nem | pl. "Next.js 16, React 19, Cloudflare Workers" |
| Harmadik fél költségek | nem | hosting, DB, AI API tájékoztató jelleggel |
| Vállalkozói díj nettó | igen | pl. "200 000 Ft" |
| Vállalkozói díj szöveges | nem | pl. "kettőszázezer" |
| Fizetési ütemezés | igen | pl. "50% szerződéskor, 50% átadáskor" |
| Teljesítési határidő | igen | pl. "2026. május 31." |
| Aláírás helye/dátuma | nem | default: Budapest, ha nincs megadva, üres dátummal |

### 2. lépés — Korábbi munkalapok ellenőrzése

A munkalap sorszámozása **a keretszerződéshez tartozó projekt teljes futása alatt folyamatos**. Mielőtt új munkalapot írsz, ellenőrizd a korábbiakat:

```bash
ls <bildr-website-repo>/contracts/{ÜGYFÉL_SLUG}-munkalap-*.docx 2>/dev/null
```

Ha a user "1. sz. munkalapot" kér, de már létezik az adott ügyfélhez, kérdezz vissza: új-e (felülírás), vagy 2. számú.

### 3. lépés — JSON config összerakása

```json
{
  "workpage_number": 2,
  "company_name": "Példa Ügyfél Kft.",
  "company_long_name": "Példa Ügyfél Korlátolt Felelősségű Társaság",
  "framework_contract_date": "2026. április 8.",
  "project_title": "AI Voice Agent integráció",
  "tasks": [
    "OpenAI Realtime API integráció",
    "Twilio telefonkapcsolat beállítása",
    "Konverzáció flow tervezés és implementáció",
    "Tesztelés és finomhangolás 50 hívással"
  ],
  "tech_stack": "Node.js, OpenAI Realtime API, Twilio, Cloudflare Workers",
  "third_party_costs": [
    {"item": "OpenAI API", "estimate": "~30 000 Ft/hó"},
    {"item": "Twilio", "estimate": "~5 000 Ft/hó alapdíj + percdíj"}
  ],
  "fee_net": "850 000 Ft",
  "fee_text": "nyolcszázötvenezer",
  "payment_schedule": "50% szerződéskor (425 000 Ft + ÁFA), 50% átadáskor (425 000 Ft + ÁFA)",
  "deadline": "2026. június 15.",
  "city": "Budapest",
  "year": "2026",
  "month": "május"
}
```

Mentsd: `/tmp/bildr-workpage-{slug}-{N}.json`

### 4. lépés — DOCX generálás

```bash
# Ha még nincs telepítve:
pip3 install python-docx

# Generálás:
python3 ${CLAUDE_PLUGIN_ROOT}/skills/bildr-contractpage/scripts/generate_workpage.py \
  --config /tmp/bildr-workpage-{slug}-{N}.json \
  --output <bildr-website-repo>/contracts/{slug}-munkalap-{N}.docx
```

A script egy szabványos DOCX-et hoz létre Calibri fonttal, számozott listákkal, bullet pontokkal.

### 5. lépés — Ellenőrzés

```bash
open <bildr-website-repo>/contracts/{slug}-munkalap-{N}.docx
```

Ellenőrzés:
- Hivatkozás a keretszerződésre (dátummal)
- Megrendelő cégnév helyes
- BILDR HUB Kft. mint Vállalkozó
- Feladatok számozva
- Vállalkozói díj kiemelt (bold)
- Aláírás blokk: Megrendelő (cégnév) + Vállalkozó (BILDR HUB Kft., képv.: Kovács Bence)

### 6. lépés — Workflow integráció

A munkalap aláírásával kezdődik a projekt:
1. **Most:** munkalap aláírás → munka megkezdése
2. **Projekt végén:** `bildr-tig` skill-lel **Teljesítési Igazolás** generálása → számla kibocsátás

## Munkalap struktúra

```
{N}. számú melléklet — {N}. sz. MUNKALAP
─────────────────────────────────────────
[Hivatkozás a keretszerződésre]

Felek
  Megrendelő: {company_long_name}
  Vállalkozó: BILDR HUB Korlátolt Felelősségű Társaság

A megvalósítandó feladat
  {project_title}

  A Vállalkozó az alábbi feladatokat valósítja meg:
  1. ...
  2. ...
  3. ...

Technológia: {tech_stack}

Üzemeltetési költségek (harmadik fél)
  • {item}: {estimate}
  ...
  [Boilerplate: a Megrendelőt terhelik, ...]

Vállalkozói Díj
  {fee_net} + ÁFA (azaz {fee_text} forint + ÁFA)

Fizetési ütemezés
  {payment_schedule}

Teljesítési határidő
  {deadline}

Egyéb rendelkezések
  [Boilerplate: a Keretszerződés irányadó, TIG → számla, ...]

Aláírás:
  {city}, {year}. {month} ...

  Megrendelő                    Vállalkozó
  ___________________           ___________________
  {company_name}                BILDR HUB Kft.
                                képv.: Kovács Bence, ügyvezető
```

## Tippek

- **Sorszámozás folyamatos** — új projekt ugyanahhoz az ügyfélhez = új munkalap a következő sorszámmal
- **A keretszerződés rendelkezései irányadóak** — ne ismételd meg a titoktartást, felhasználói jogokat stb.
- **Tasks lista** — bullet pont vagy számozás, max 10-12 tétel; ha több, csoportosítsd
- **3rd party költség** — mindig tájékoztató jellegű, hivatkozz arra, hogy a Megrendelőt terheli
- **Aláírás blokk** — egyezzen a keretszerződésével; ha más kapcsolattartó van, jelezd

## Kapcsolódó skill-ek

- `bildr-contract` — keretszerződés, **kötelező előfeltétel** — egy munkalap mindig egy keretszerződéshez tartozik
- `bildr-tig` — teljesítési igazolás, ami a munkalapon szereplő feladatok teljesítését igazolja
- `bildr-offer` — árajánlat, amiből a munkalap díjazása és feladatlistája származik

## Bundled erőforrások

| Fájl | Szerep |
|---|---|
| `scripts/generate_workpage.py` | Python script ami a JSON config-ból DOCX-et generál (python-docx) |
| `references/workpage-examples.md` | Példa munkalap konfigurációk különböző projekttípusokra |
