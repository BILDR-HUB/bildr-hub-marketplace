# bildr.hub — offer-worker

Cloudflare Worker az árajánlat-kezelő folyamathoz. Automatikusan futtat értesítéseket, CRM-frissítéseket és callback oldalakat amikor egy árajánlat kiküldésre kerül, elfogadásra, vagy elutasításra.

---

## Architektúra

```
Twenty CRM (crm.bildr.hu)
        |
        | webhook (opportunity.created / opportunity.updated)
        v
  offer-worker (bildr.hu/offer/*)          <-- Cloudflare Worker
        |
        |-- Resend API (email küldés)
        |-- Discord Webhook (értesítések)
        |-- OFFER_KV (Cloudflare KV – deal ID számláló + idempotency)
        |-- Twenty CRM GraphQL (olvasás + írás)
```

**Infrastruktúra:**
- Platform: Cloudflare Workers
- Domain: `bildr.hu/offer/*` (zone route)
- KV Namespace: `OFFER_KV`
- Deploy: `npm run deploy` (wrangler)

---

## Végpontok

| Metódus | Útvonal | Leírás |
|---------|---------|--------|
| `POST` | `/offer/webhook/offer-sent` | Twenty CRM webhook — `opportunity.updated` esemény, `offerUrl` megadásakor emailt küld |
| `POST` | `/offer/webhook/deal-id` | Twenty CRM webhook — `opportunity.created` esemény, automatikusan kioszt egy Deal ID-t (`BH-YYYY-NNN`) |
| `GET` | `/offer/callback/accept/:id` | Kliens elfogadja az árajánlatot — CRM frissítés + email + Discord |
| `GET` | `/offer/callback/reject/:id` | Kliens elutasítja az árajánlatot — CRM frissítés + Discord |
| `GET` | `/offer/health` | Health check |

---

## Folyamatok

### 1. Ajánlat kiküldése (`/offer/webhook/offer-sent`)

1. A CRM-ben az opportunity `offerUrl` mezőjét kitöltik
2. Twenty CRM tüzel egy `opportunity.updated` webhookot
3. A worker ellenőrzi: `offerStatus` nem `Sent` / `Accepted` / `Rejected` (duplikátum védelem)
4. Lekéri az opportunity teljes adatait a CRM-ből (GraphQL)
5. Elküldi a brandelt email-t a kliensnek (Resend) — BCC: `ai@bildr.hu`
6. Beállítja a CRM-ben: `offerStatus: Sent`
7. Discord értesítés (idempotent — KV kulcs: `discord:email:{opportunityId}`)

### 2. Elfogadás (`/offer/callback/accept/:id`)

1. Kliens rákattint az "Elfogadom az árajánlatot" gombra az emailben
2. Worker lekéri az opportunity-t a CRM-ből
3. Ha már `Accepted` → köszönő oldal (duplikátum, nincs további akció)
4. Ha már `Rejected` → hibaoldal
5. CRM frissítés: `offerStatus: Accepted`, `stage: WAITING_FOR_CONTRACT`
6. CRM task létrehozása: `v1 elkészítése — {cégnév}`
7. Discord értesítés (idempotent — KV kulcs: `discord:accept:{opportunityId}`)
8. Visszaigazoló email a kliensnek (Resend)
9. Értesítő email a csapatnak (Resend → `ai@bildr.hu`)
10. Konfetti köszönő oldal a kliensnek

### 3. Elutasítás (`/offer/callback/reject/:id`)

1. Kliens rákattint az "Elutasítom az árajánlatot" gombra az emailben
2. Worker lekéri az opportunity-t a CRM-ből
3. Ha már `Rejected` → elutasítás oldal (duplikátum, nincs további akció)
4. Ha már `Accepted` → hibaoldal
5. CRM frissítés: `offerStatus: Rejected`, `stage: OPPORTUNITY`
6. Discord értesítés (idempotent — KV kulcs: `discord:reject:{opportunityId}`)
7. Visszajelző oldal a kliensnek

### 4. Deal ID kiosztás (`/offer/webhook/deal-id`)

1. Új opportunity létrehozásakor Twenty CRM tüzel egy `opportunity.created` webhookot
2. Ha a `bhDealId` mező üres, a worker kioszt egy új ID-t
3. A számláló KV-ban tárolódik (`offer-counter:{év}`)
4. Formátum: `BH-2026-001`, `BH-2026-002`, stb.
5. Beírja a CRM-be: `bhDealId` mező

---

## Idempotency (spam védelem)

Minden Discord értesítés előtt a worker ellenőriz egy KV kulcsot:

| KV kulcs | Mikor íródik | TTL |
|----------|-------------|-----|
| `discord:email:{id}` | Ajánlat email küldésekor | 30 nap |
| `discord:accept:{id}` | Elfogadáskor | 30 nap |
| `discord:reject:{id}` | Elutasításkor | 30 nap |

Ha a kulcs már létezik → Discord üzenet nem megy ki. Ez megakadályozza hogy dupla kattintás vagy párhuzamos kérés esetén többszörös értesítés érkezzen.

---

## CRM mezők (Twenty — opportunity)

| Mező | Típus | Leírás |
|------|-------|--------|
| `offerUrl` | Text | Az ajánlat linkje — kitöltésekor indul a folyamat |
| `offerStatus` | Single Select | `Sent` / `Accepted` / `Rejected` |
| `stage` | Select | `OPPORTUNITY` / `WAITING_FOR_CONTRACT` / stb. |
| `bhDealId` | Text | Auto-generált deal azonosító (`BH-YYYY-NNN`) |

---

## Email értesítők

| Email | Küldő | Címzett | BCC | Esemény |
|-------|-------|---------|-----|---------|
| Árajánlat | `ajanlat@bildr.hu` | Kliens | `ai@bildr.hu` | Ajánlat kiküldésekor |
| Elfogadás visszaigazolás | `ajanlat@bildr.hu` | Kliens | — | Elfogadáskor |
| Csapatértesítő | `ajanlat@bildr.hu` | `ai@bildr.hu` | — | Elfogadáskor |

---

## Fájlstruktúra

```
workers/offer-worker/
├── src/
│   ├── index.js              # Router, belépési pont
│   ├── routes/
│   │   ├── webhook.js        # Ajánlat email küldés (opportunity.updated)
│   │   ├── accept.js         # Elfogadás callback
│   │   ├── reject.js         # Elutasítás callback
│   │   └── dealid.js         # Deal ID kiosztás (opportunity.created)
│   └── lib/
│       ├── resend.js         # Email sablonok + küldés (Resend API)
│       ├── twenty.js         # CRM GraphQL lekérdezések és mutációk
│       ├── discord.js        # Discord webhook értesítők
│       └── utils.js          # Segédfüggvények, Deal ID számláló
├── package.json
└── wrangler.toml             # Cloudflare Worker konfiguráció
```

---

## Környezeti változók (Cloudflare Secrets)

| Változó | Leírás |
|---------|--------|
| `TWENTY_API_KEY` | Twenty CRM API kulcs |
| `RESEND_API_KEY` | Resend email API kulcs |
| `DISCORD_WEBHOOK_URL` | Discord webhook URL |
| `WEBHOOK_SECRET` | Opcionális — Twenty webhook Authorization header |

---

## Proposal Page Integration

Proposals are static HTML files in the bildr-website repo at `public/client/{opportunityId}.html`. The opportunity ID in the filename matches the Twenty CRM UUID.

### Accept Button Flow (on proposal page)

```javascript
var OPPORTUNITY_ID = '{uuid}';

function signProposal() {
  // 1. Animate signature (Dancing Script handwriting, clip-path reveal)
  document.getElementById('client-signature-ink').classList.add('signed');

  // 2. Disable button
  btn.disabled = true;
  btn.textContent = 'ELFOGADVA...';

  // 3. Redirect to offer-worker after animation
  setTimeout(function() {
    window.location.href = 'https://bildr.hu/offer/callback/accept/' + OPPORTUNITY_ID;
  }, 1500);
}
```

### Reject Link (on proposal page)

Subtle link below accept button:
```html
<a href="https://bildr.hu/offer/callback/reject/{uuid}">Elutasítom az ajánlatot</a>
```

### Full Workflow

1. Create proposal HTML in bildr-website: `public/client/{uuid}.html`
2. Deploy bildr-website (Cloudflare Pages auto-deploy from GitHub)
3. In Twenty CRM, set opportunity `offerUrl` to `https://bildr.hu/client/{uuid}.html`
4. CRM webhook triggers → offer-worker sends branded email via Resend
5. Email contains: "Árajánlat megtekintése" (→ proposal page), "Elfogadom" (→ accept callback), "Elutasítom" (→ reject callback)
6. Client can accept from email OR from proposal page (both go to same callback)
7. Offer-worker handles CRM update, task creation, Discord, emails, shows confetti page

---

## Deploy

```bash
cd workers/offer-worker
npm run deploy
```

Wrangler-rel deployol a Cloudflare-re, automatikusan a `bildr.hu/offer/*` route-ra.

Repo: `BILDR-HUB/bildr.hub_offer` — GitHub push to main triggers Cloudflare auto-deploy.

