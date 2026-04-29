# Munkalap konfiguráció — példák

Néhány gyakori projekttípus szerinti JSON config minta, hogy gyors a sablont másolni.

## 1. Marketing weboldal fejlesztés

```json
{
  "workpage_number": 1,
  "company_name": "Példa Ügyfél Kft.",
  "company_long_name": "Példa Ügyfél Korlátolt Felelősségű Társaság",
  "framework_contract_date": "2026. március 1.",
  "project_title": "Marketing weboldal fejlesztése",
  "tasks": [
    "Design rendszer és layout terv elkészítése",
    "Marketing landing page fejlesztése (Hero, Services, Cases, Contact)",
    "Mobil reszponzivitás és cross-browser tesztelés",
    "SEO alapok (meta, OpenGraph, sitemap, robots.txt)",
    "Cloudflare Workers deploy + custom domain"
  ],
  "tech_stack": "Next.js 16, React 19, Tailwind CSS v4, Cloudflare Workers (OpenNext)",
  "third_party_costs": [
    {"item": "Cloudflare Workers hosting", "estimate": "~0 Ft/hó (free tier)"},
    {"item": "Domain regisztráció", "estimate": "Megrendelő saját költsége"}
  ],
  "fee_net": "1 200 000 Ft",
  "fee_text": "egymillió-kettőszázezer",
  "payment_schedule": "50% szerződéskor (600 000 Ft + ÁFA), 50% átadáskor (600 000 Ft + ÁFA)",
  "deadline": "2026. április 15.",
  "city": "Budapest",
  "year": "2026",
  "month": "március"
}
```

## 2. AI Voice Agent fejlesztés

```json
{
  "workpage_number": 2,
  "company_name": "Példa Ügyfél Kft.",
  "company_long_name": "Példa Ügyfél Korlátolt Felelősségű Társaság",
  "framework_contract_date": "2026. március 1.",
  "project_title": "AI Voice Agent telefonos ügyfélszolgálatra",
  "tasks": [
    "Konverzáció flow tervezés és prompt engineering",
    "OpenAI Realtime API integráció",
    "Twilio telefon integráció",
    "CRM integráció",
    "Tesztelés 100+ szimulált hívással",
    "Production deploy és monitoring beállítás"
  ],
  "tech_stack": "Node.js, OpenAI Realtime API, Twilio, Cloudflare Workers, Twenty CRM",
  "third_party_costs": [
    {"item": "OpenAI API", "estimate": "~80 000 Ft/hó (becsült forgalom alapján)"},
    {"item": "Twilio", "estimate": "~10 000 Ft/hó alapdíj + percdíj"},
    {"item": "Cloudflare Workers", "estimate": "~5 000 Ft/hó (paid tier ha szükséges)"}
  ],
  "fee_net": "2 800 000 Ft",
  "fee_text": "kettőmillió-nyolcszázezer",
  "payment_schedule": "30% szerződéskor (840 000 Ft + ÁFA), 40% MVP demo után (1 120 000 Ft + ÁFA), 30% production átadáskor (840 000 Ft + ÁFA)",
  "deadline": "2026. június 30.",
  "city": "Budapest",
  "year": "2026",
  "month": "március"
}
```

## 3. Egyszeri konzultáció / audit

```json
{
  "workpage_number": 3,
  "company_name": "Példa Ügyfél Kft.",
  "company_long_name": "Példa Ügyfél Korlátolt Felelősségű Társaság",
  "framework_contract_date": "2026. március 1.",
  "project_title": "Tech audit és architektúra konzultáció",
  "tasks": [
    "Meglévő rendszer review (kódbázis, infrastruktúra, security)",
    "Audit jelentés írása (max 20 oldal)",
    "Prezentáció és Q&A a vezetésnek",
    "Roadmap javaslat priorizált issue listával"
  ],
  "tech_stack": "",
  "third_party_costs": [],
  "fee_net": "350 000 Ft",
  "fee_text": "háromszázötvenezer",
  "payment_schedule": "Egy összegben az audit jelentés átadásakor",
  "deadline": "2026. március 28.",
  "city": "Budapest",
  "year": "2026",
  "month": "március"
}
```

## 4. Folyamatos havidíjas üzemeltetés

```json
{
  "workpage_number": 4,
  "company_name": "Példa Ügyfél Kft.",
  "company_long_name": "Példa Ügyfél Korlátolt Felelősségű Társaság",
  "framework_contract_date": "2026. március 1.",
  "project_title": "Havi üzemeltetés és support — weboldal",
  "tasks": [
    "Hibajavítás bejelentés alapján (max 8 munkaóra/hó)",
    "Biztonsági frissítések alkalmazása",
    "Tartalom-frissítések (max 4 kérés/hó)",
    "Performance monitoring és optimalizálás",
    "Havi státusz jelentés"
  ],
  "tech_stack": "Next.js, Cloudflare Workers, Payload CMS",
  "third_party_costs": [
    {"item": "Hosting", "estimate": "~0 Ft/hó (free tier)"}
  ],
  "fee_net": "120 000 Ft / hó",
  "fee_text": "havi egyszázhúszezer",
  "payment_schedule": "Havi számlázás minden hónap 5-én esedékes, számla kibocsátás a TIG aláírása után",
  "deadline": "Folyamatos, határozatlan időre. Bármelyik fél 30 napos felmondási idővel megszüntetheti.",
  "city": "Budapest",
  "year": "2026",
  "month": "március"
}
```

## Tippek

- **Sorszám következetesség** — minden új munkalap a következő számot kapja (1, 2, 3...)
- **`framework_contract_date`** — pontosan az, amit a keretszerződésben aláírtatok (utóbbi aláíró napja)
- **`tasks` lista** — 3-12 tétel ideális; 12+ esetén csoportosítsd alpontokra
- **`third_party_costs`** — csak ha van; tájékoztató jelleggel, hivatkozz arra hogy a Megrendelőt terheli
- **`fee_text`** — a Polgári Törvénykönyv értelmében nagy összegeknél hasznos a betűs forma is
