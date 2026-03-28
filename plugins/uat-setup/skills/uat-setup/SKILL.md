---
name: uat-setup
description: >
  PostHog analytics és/vagy feedback widget integrálása bármely projektbe. CSAK explicit meghívásra
  (/uat-setup) — soha ne triggerelj automatikusan. A skill felméri a projekt típusát (Next.js, React,
  Vue, Svelte, Angular, Nuxt), az ORM/DB réteget (Drizzle, Prisma, raw SQL + Postgres/SQLite/MySQL),
  majd interaktívan végigvezeti a setupot. Használd amikor a user PostHog-ot, analytics-et, feedback
  widget-et, visszajelzés funkciót, vagy UAT setup-ot kér egy projektben.
---

# UAT Setup — PostHog Analytics + Feedback Widget

Két modul integrálása bármely frontend projektbe:
- **PostHog Analytics** — SDK init, proxy config, type-safe event wrapper
- **Feedback Widget** — DB tábla, API endpoint, floating UI component

## 1. lépés — Modul választás

Kérdezd meg a user-t:

**"Mit állítsak be?"**
1. **Csak PostHog** — Analytics tracking setup
2. **Csak Feedback Widget** — Visszajelzés gyűjtő komponens + API + DB
3. **Mindkettő** — Teljes UAT csomag

## 2. lépés — Projekt felderítés

Automatikusan detektáld, ne kérdezz ha egyértelmű:

### Framework detekció

Olvasd be a `package.json`-t (vagy megfelelő config fájlt) és állapítsd meg:

| Jel | Framework |
|-----|-----------|
| `next` dependency | **Next.js** (ellenőrizd App Router vs Pages Router: van-e `app/` dir) |
| `react` + `vite` | **React SPA** (Vite) |
| `react` + `react-scripts` | **React SPA** (CRA) |
| `vue` dependency | **Vue.js** (ellenőrizd: Nuxt ha van `nuxt` dep) |
| `svelte` vagy `@sveltejs/kit` | **Svelte / SvelteKit** |
| `@angular/core` | **Angular** |

### DB/ORM detekció (csak Feedback Widget-hez kell)

| Jel | Stack |
|-----|-------|
| `drizzle-orm` dependency | **Drizzle** (ellenőrizd dialect: `pg`, `postgres`, `@neondatabase/serverless`, `@vercel/postgres` → PostgreSQL; `mysql2` → MySQL; `better-sqlite3`, `@libsql/client` → SQLite) |
| `@prisma/client` dependency | **Prisma** (olvasd be `prisma/schema.prisma` → `provider`) |
| Egyik sem | Kérdezd meg: milyen DB-t használ, vagy kell-e DB egyáltalán |

### Backend architektúra detekció (Feedback Widget-hez)

Ha a framework **nem** Next.js (nincs beépített API routes):
1. Ellenőrizd van-e `/server`, `/backend`, vagy `/api` könyvtár
2. Ellenőrizd van-e `express`, `hono`, `fastify`, `koa` a root vagy server `package.json`-ban
3. Ha van külön backend → a feedback API-t **oda** kell tenni, és a frontend-en proxy-t vagy env-based URL-t kell beállítani

### Color scheme detekció (Feedback Widget-hez)

Próbáld kiolvasni a projekt brand/accent color-ját:
1. Tailwind v4 `@theme inline {}` block → keresd a `--color-primary`, `--color-brand`, `--color-accent`, `--color-warm` változókat
2. Tailwind v3 config (`tailwind.config.*`) → `theme.colors.primary` vagy `theme.extend.colors`
3. CSS változók (`:root` block) → `--primary`, `--brand`, `--accent`, `--warm`
4. Ha több jelölt van → kérdezd meg a user-t: "A detektált színek: X, Y. Melyiket használjam a widget gombhoz?"
5. Ha nem találsz → kérdezd meg, vagy használj semleges kéket (`#3b82f6`)

> **Fontos**: A `--primary` néha sötét háttérszín (nem brand accent). Ha a detektált primary szín nagyon sötét vagy nagyon világos, keresd az accent/warm/brand változót is. A widget gombnak kontrasztos, feltűnő színt kell használnia.

## 3. lépés — PostHog integráció

A framework alapján kövesd a megfelelő reference fájlt:

- **Next.js** → olvasd be `references/posthog-nextjs.md`
- **React SPA** → olvasd be `references/posthog-react.md`
- **Vue / Nuxt** → olvasd be `references/posthog-vue.md`
- **Svelte / SvelteKit** → olvasd be `references/posthog-svelte.md`
- **Angular** → olvasd be `references/posthog-angular.md`

### Minden framework-re közös lépések

1. **Dependency telepítés** — az adott SDK package
2. **Env változók** — `NEXT_PUBLIC_POSTHOG_KEY` (vagy framework-megfelelő prefix: `VITE_`, `PUBLIC_`, stb.)
3. **SDK init** — framework-specifikus inicializálás
4. **Proxy config** — ad blocker bypass (ha a framework támogatja)
5. **Type-safe event wrapper** — `analytics.ts` létrehozása

### Custom event tracking

Miután az alap setup kész, kérdezd meg:

**"Milyen user action-öket szeretnél track-elni?"**

Adj példákat a projekt kontextusából (pl. ha van form → `form_submitted`, ha van export → `export_downloaded`).
Minden megadott event-hez generáld az `AnalyticsEvents` interface bejegyzést a megfelelő property-kkel.

Ha a user nem tud dönteni, javasolj 3-5 alap event-et a detektált feature-ök alapján.

## 4. lépés — Feedback Widget integráció

### DB tábla létrehozása

Az ORM és DB alapján válaszd a megfelelő megközelítést:

#### Drizzle + PostgreSQL
```typescript
export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 20 }).notNull(),
  message: text("message").notNull(),
  pageUrl: text("page_url"),
  userAgent: text("user_agent"),
  status: varchar("status", { length: 20 }).default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### Drizzle + SQLite
```typescript
export const feedback = sqliteTable("feedback", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: text("type").notNull(),
  message: text("message").notNull(),
  pageUrl: text("page_url"),
  userAgent: text("user_agent"),
  status: text("status").default("new"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
```

#### Drizzle + MySQL
```typescript
export const feedback = mysqlTable("feedback", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: varchar("type", { length: 20 }).notNull(),
  message: text("message").notNull(),
  pageUrl: text("page_url"),
  userAgent: text("user_agent"),
  status: varchar("status", { length: 20 }).default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### Prisma + PostgreSQL / MySQL
```prisma
model Feedback {
  id        String   @id @default(uuid())
  type      String   @db.VarChar(20)
  message   String
  pageUrl   String?  @map("page_url")
  userAgent String?  @map("user_agent")
  status    String   @default("new") @db.VarChar(20)
  createdAt DateTime @default(now()) @map("created_at")

  @@map("feedback")
}
```

#### Prisma + SQLite
```prisma
model Feedback {
  id        String   @id @default(uuid())
  type      String
  message   String
  pageUrl   String?  @map("page_url")
  userAgent String?  @map("user_agent")
  status    String   @default("new")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("feedback")
}
```

> **Fontos**: SQLite-ban a `@db.VarChar()` direktíva nem érvényes — Prisma hibát dob migrációnál. SQLite-hoz használj sima `String` típust `@db` annotáció nélkül.

### API endpoint

Framework-függő:
- **Next.js App Router** → `app/api/feedback/route.ts` (GET + POST named exports)
- **Next.js Pages Router** → `pages/api/feedback.ts` (req.method switch)
- **Express / Hono / Fastify** → olvasd be `references/feedback-api-express.md` a konkrét implementációért
- **Más framework** → a projekt API rétegéhez illeszkedő endpoint, a fenti minták alapján

> **SPA + külön backend esetén**: A widget `fetch("/api/feedback")` hívása relatív URL-t használ. Ha a frontend (Vite dev server, port 5173) és a backend (Express, pl. port 3001) különböző porton fut, proxy kell. Lásd a reference fájlt a Vite proxy konfigurációhoz.

Az endpoint:
- **POST**: Validálja a `type` mezőt (`"bug" | "feature" | "question"`), a `message`-t (trim, max 5000 char), menti a DB-be
- **GET**: Listázza a feedback-eket, opcionális `?status=` filter, `createdAt DESC` rendezés
- Hibakezelés: generikus hibaüzenetek (ne szivárogjon stack trace)
- **Auth**: Ha a projektben van auth middleware vagy session ellenőrzés, a feedback endpoint-ot is védd meg a meglévő auth rendszerrel

> **Drizzle gotcha**: A `timestamp` mezők `Date` objektumot adnak vissza. JSON response-hoz használj `.toISOString()` szerializálást. Továbbá a `drizzle-kit` nem mindig olvassa a `.env.local`-t — ha a migráció nem talál DB connection-t, add meg explicit: `DATABASE_URL=... npx drizzle-kit generate`.

### Floating widget komponens

Olvasd be `references/feedback-widget.md` a teljes komponens kódért.

Kulcs pontok:
- Fixed position: jobb alsó sarok (bottom-6 right-6 z-40)
- Popover pattern: gomb kattintásra nyílik a form
- 3 feedback típus: Hiba (Bug icon), Otlet (Lightbulb), Kerdes (HelpCircle)
- Magyar UI szövegek alapértelmezés
- A projekt **primary color**-ját használd a gombhoz (a detektált szín alapján)
- Success state: pipa ikon + "Koszonjuk a visszajelzest!" → 2s auto-close
- Submit: fetch POST az API endpoint-ra, page URL + user agent automatikusan

### Layout integráció

Keresd meg a projekt fő layout wrapper-ét:
- Next.js: `layout.tsx` vagy shell/wrapper komponens
- React SPA: `App.tsx` vagy layout wrapper
- Vue: `App.vue` vagy layout komponens
- Svelte: `+layout.svelte`

A `<FeedbackWidget />` komponenst a layout-ba illeszd, a fő content UTÁN (nem bele).

## 5. lépés — Migráció futtatás

Emlékeztesd a user-t:
1. **Drizzle**: `npx drizzle-kit generate` → `npx drizzle-kit migrate` (vagy push)
2. **Prisma**: `npx prisma migrate dev --name add-feedback`
3. Ellenőrizd, hogy a tábla létrejött

## 6. lépés — Ellenőrzés

Végül futtasd le az ellenőrzéseket:
1. **Build check**: `npm run build` (vagy a projekt build parancsa) — nincs TypeScript hiba
2. **PostHog**: A PostHog SDK tipikusan **nem inicializálódik dev módban** (az init kód `NODE_ENV` / `PROD` guard-ot használ). Az ellenőrzéshez:
   - **Next.js**: Deploy-olj preview környezetbe (Vercel preview), vagy ideiglenesen vedd ki a `NODE_ENV` checket
   - **Vite**: Futtasd `npm run build && npx vite preview` — ez prod build-et szolgál ki lokálisan
   - Ellenőrizd a PostHog dashboardon, hogy érkeznek-e eventek
3. **Feedback Widget**: A dev szerveren kattints a feedback gombra, küldj egy teszt üzenetet, ellenőrizd a DB-ben
   - **Drizzle**: Kérdezd le közvetlenül a DB-t, vagy használj DB GUI-t
   - **Prisma**: `npx prisma studio` a legegyszerűbb mód a tábla megtekintéséhez

Ha bármi hiba van, javítsd és futtasd újra a build-et.
