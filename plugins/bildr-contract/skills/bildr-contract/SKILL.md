---
name: bildr-contract
description: "BILDR Vállalkozási Keretszerződés vagy vállalkozói szerződés generálása DOCX formátumban egy bázis-template alapján. A megrendelő alapadatait (cégnév, székhely, adószám, cégjegyzékszám, képviselő, kapcsolattartó) kérdezi vissza; ha valami hiányzik, az interneten WebSearch-csel kikeresi a céges nyilvános adatokat (e-cegjegyzek.hu, opten.hu) és visszaigazolásra felmutatja. Az output egy testreszabott .docx fájl. Munkalapokhoz kapcsolódik (lásd bildr-contractpage skill). Trigger: keretszerződés, vállalkozói szerződés, BILDR contract, BILDR keretszerződés, contract draft."
---

# bildr-contract

## Cél

BILDR HUB Kft. **Vállalkozási Keretszerződés** generálása DOCX formátumban egy adott megrendelőhöz. Egy korábbi keretszerződés DOCX-et használunk kiindulási mintaként — minden új szerződés ennek a struktúrának a Megrendelő-specifikus testreszabása.

A keretszerződéshez **munkalapok** tartoznak (lásd `bildr-contractpage` skill); a keretszerződés egységesen szabályozza a felhasználói jogokat, titoktartást, díjazás módját, megszűnés módját, és a Munkalapok rögzítik az egyedi feladatokat és díjakat.

## Mikor használd

Trigger szavak:
- **HU:** keretszerződés, vállalkozói szerződés, kerete szerződés, BILDR contract, BILDR keretszerződés
- **EN:** framework agreement, contractor agreement, BILDR contract draft

## Setup — DOCX template

A skill **nem tartalmaz** mellékelt keretszerződés DOCX template-et (üzleti ok: az eredeti template céges és ügyfél-specifikus adatokat tartalmaz). A használat előtt:

1. **Készíts saját bázis keretszerződés DOCX-et** egy korábbi szerződésből vagy nullról (Word/Pages).
2. Mentsd a saját rendszereden, pl. `~/.bildr/templates/keretszerzodes-template.docx`.
3. Add meg a `--template` argumentumon keresztül a `generate_contract.py`-nak.

A scriptnek tudnia kell, hogy a template-edben **milyen string-ek azonosítják** a Megrendelő placeholder-eit. Ezek a `BASE_REPLACEMENTS` dict-ben állíthatók be a script tetején. Cseréld ki őket a saját bázis DOCX-edben szereplő string-ekre, mielőtt először lefuttatod.

## Workflow

### 1. lépés — Megrendelő alapadatok visszakérdezése

A user megad egy briefet (pl. "csinálj keretszerződést az X Kft. számára"). Ellenőrizd, melyik mező hiányzik, és **AskUserQuestion-nel** kérdezz vissza.

**Kötelező mezők (Megrendelő):**

| Mező | Példa |
|---|---|
| Cégnév rövid | Példa Ügyfél Kft. |
| Cégnév teljes | Példa Ügyfél Korlátolt Felelősségű Társaság |
| Székhely | 1051 Budapest, Példa utca 1. |
| Adószám | 12345678-2-43 |
| Cégjegyzékszám | 01-09-123456 |
| Képviselő neve | Példa Béla |
| Képviselő szerepe | ügyvezető (default) |
| Kapcsolattartó név | nem kötelező — ha nincs, képviselőt használ |
| Kapcsolattartó email | nem kötelező |
| Kapcsolattartó telefon | nem kötelező |

**Vállalkozó adatok fixek (BILDR HUB Kft.):**

```
Cégnév: BILDR HUB Korlátolt Felelősségű Társaság
Székhely: 1052 Budapest, Károly körút 10. 2. em. 3B. ajtó
Adószám: 33011387-2-41
Cégjegyzékszám: 01-09-454292
Képviseli: Kovács Bence, ügyvezető
```

Ha a saját céges adataidat szeretnéd használni, írd át a script-ben a Vállalkozó blokk default-jait, vagy a saját bázis DOCX-edben.

### 2. lépés — Hiányzó adatok internetes keresése

Ha a user nem ismeri a cég pontos adatait, **WebSearch** használatával keresd meg:

```
"<Cégnév>" cégjegyzékszám adószám
site:e-cegjegyzek.hu "<Cégnév>"
"<Cégnév>" opten
```

Mutasd a találatokat a usernek, kérj **explicit megerősítést** mielőtt a szerződésbe írod. Soha ne találj ki céges adatot.

### 3. lépés — JSON config összerakása

Hozz létre egy `/tmp/bildr-contract-{slug}.json` fájlt a következő szerkezetben:

```json
{
  "company_name": "Példa Ügyfél Kft.",
  "company_long_name": "Példa Ügyfél Korlátolt Felelősségű Társaság",
  "address": "1051 Budapest, Példa utca 1.",
  "tax_id": "12345678-2-43",
  "company_reg": "01-09-123456",
  "representative_name": "Példa Béla",
  "representative_role": "ügyvezető",
  "contact_name": "Példa Anna",
  "contact_phone": "+36 1 234 5678",
  "contact_email": "kapcsolat@peldaugyfel.hu",
  "project_title": "Marketing weboldal fejlesztése",
  "client_domain": "peldaugyfel.hu",
  "city": "Budapest",
  "year": "2026",
  "month": "május"
}
```

### 4. lépés — DOCX generálás

A skill scriptje a saját bázis DOCX-edet (a `--template` argumentumon át megadva) másolja és a placeholder string-eket cseréli:

```bash
# Egyszer telepítés (ha még nincs):
pip3 install python-docx

# Generálás:
python3 ${CLAUDE_PLUGIN_ROOT}/skills/bildr-contract/scripts/generate_contract.py \
  --template ~/.bildr/templates/keretszerzodes-template.docx \
  --config /tmp/bildr-contract-{slug}.json \
  --output <bildr-website-repo>/contracts/{slug}-keretszerzodes-{YYYY-MM-DD}.docx
```

A script run-szinten cserél, így a formázás (bold, számozás, listák) megmarad.

### 5. lépés — Munkalap kapcsolat

A keretszerződés önmagában **csak az általános rendelkezéseket** tartalmazza (titoktartás, felhasználói jog, díjazás módja, megszűnés). A konkrét feladatokat és díjakat a **Munkalapok** rögzítik — ezeket a `bildr-contractpage` skill-lel készítjük.

A keretszerződés szokásosan tartalmaz egy "1. számú melléklet — 1. sz. MUNKALAP" mintát. A bildr-contract skill **megtartja ezt a mellékletet** mintaként, de a tényleges projekt-specifikus munkalapokat **külön DOCX-ként** generálja a `bildr-contractpage` skill (lásd ott: chained workflow).

### 6. lépés — Ellenőrzés

```bash
open <bildr-website-repo>/contracts/{slug}-keretszerzodes-{YYYY-MM-DD}.docx
```

Nyisd meg Wordben/Pages-ben, ellenőrizd:
- Megrendelő adatok mindenhol cserélődtek
- BILDR HUB Kft. adatok érintetlenek
- Számozás és formázás megőrződött
- Aláírás blokk: Megrendelő / Vállalkozó

## Kapcsolódó skill-ek

- `bildr-contractpage` — **erősen kapcsolódik!** Munkalap készítés a keretszerződéshez. Általában együtt fut: először keretszerződés, aztán az 1. sz. munkalap.
- `bildr-tig` — teljesítési igazolás, a keretszerződés 4. pontja szerinti dokumentum
- `bildr-offer` — árajánlat, ami a keretszerződés alapdokumentuma

## Bundled erőforrások

| Fájl | Szerep |
|---|---|
| `scripts/generate_contract.py` | Python script, ami a placeholder-eket cseréli |
| `references/contract-structure.md` | A keretszerződés szekciói áttekintés |
| `assets/README.md` | Setup instrukció a saját DOCX template-hez |

## Tippek

- **Ne módosítsd a bázis DOCX-et közvetlenül.** Ha új szekció kell, adj hozzá a generált DOCX-hez Wordben.
- **Az "1. sz. Munkalap" melléklet** csak példa — éles munkalapot mindig a `bildr-contractpage` skill-lel készíts.
- **WebSearch a céges adatokra** — soha ne találj ki cégjegyzékszámot vagy adószámot.
- **Évszámok és hónapok** — a "Budapest, 2026. április" sor automatikusan cserélődik a `city`/`year`/`month` config szerint.
