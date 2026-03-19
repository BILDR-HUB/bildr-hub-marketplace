---
name: backend-patterns
description: Backend best practices for Drizzle ORM, SQLite/D1, query optimization, tRPC, and Hono. Use when writing database queries, API endpoints, tRPC procedures, or any server-side TypeScript code.
---

## Purpose

Battle-tested backend patterns for TypeScript server-side code. Covers Drizzle ORM, SQLite/D1, query optimization, tRPC v11, Hono, and Cloudflare Workers specifics.

## When to Apply

- Writing Drizzle ORM queries (SELECT, INSERT, UPDATE)
- Creating tRPC procedures or Hono routes
- Optimizing database performance
- Working with Cloudflare D1 or SQLite
- Designing API response shapes

---

## 1 — N+1 Query Prevention

```ts
// ❌ BAD — N+1: one query per item in loop
for (const item of items) {
  const related = await db.select().from(table).where(eq(table.id, item.relatedId)).get();
}

// ✅ GOOD — batch with inArray + Map grouping
const ids = items.map(i => i.relatedId);
const rows = await db.select().from(table).where(inArray(table.id, ids)).all();
const map = new Map(rows.map(r => [r.id, r]));
const enriched = items.map(i => ({ ...i, related: map.get(i.relatedId) }));
```

---

## 2 — Bulk INSERT vs Per-Row INSERT

```ts
// ❌ BAD — 200 DB round-trips
for (const row of rows) { await db.insert(table).values(row); }

// ✅ GOOD — 1 DB round-trip
await db.insert(table).values(rows);
```

PostgreSQL limit: ~65K params per query. If 100+ columns × 1000+ rows, chunk: `values.slice(i, i + 500)`.

---

## 3 — D1: db.batch() Not db.transaction()

Cloudflare D1 does NOT support `BEGIN`/`COMMIT` transactions. `db.transaction()` throws `"Failed query: begin"`.

```ts
// ❌ BAD — fails on D1
await db.transaction(async (tx) => {
  await tx.insert(tableA).values({...});
  await tx.insert(tableB).values({...});
});

// ✅ GOOD — D1 batch = atomic transaction
await db.batch([
  db.insert(tableA).values({...}),
  db.insert(tableB).values({...}),
]);
```

For dynamic arrays, `as any` type cast needed (Drizzle batch expects tuple type).

---

## 4 — Conditional WHERE (Optional Filters)

```ts
// ❌ BAD — duplicated query for optional filter
if (kategoria) {
  rows = await db.select().from(t).where(eq(t.kategoria, kategoria)).all();
} else {
  rows = await db.select().from(t).all();
}

// ✅ GOOD — undefined = no filter
const rows = await db.select().from(t)
  .where(kategoria ? eq(t.kategoria, kategoria) : undefined)
  .all();

// Multiple optional filters:
.where(and(
  kategoria ? eq(t.kategoria, kategoria) : undefined,
  status ? eq(t.status, status) : undefined,
))
```

---

## 5 — $defaultFn Anti-Pattern

```ts
// ❌ BAD — need read-back SELECT just for the generated value
const id = crypto.randomUUID();
await db.insert(table).values({ id, type: "parent" });
const created = await db.select().from(table).where(eq(table.id, id)).get();
return created.url_token; // $defaultFn generated it, must read back

// ✅ GOOD — generate explicitly, no read-back needed
const id = crypto.randomUUID();
const url_token = generateUrlToken();
await db.insert(table).values({ id, url_token, type: "parent" });
return url_token; // directly available
```

`$defaultFn` is only for values you never need back (e.g., `created_at` timestamp).

---

## 6 — UPDATE Read-Back Elimination

```ts
// ❌ BAD — unnecessary SELECT after UPDATE (1 extra round-trip)
await db.update(table).set({ status: "approved", date: now }).where(eq(table.id, row.id));
const updated = await db.select().from(table).where(eq(table.id, row.id)).get();
return { data: updated };

// ✅ GOOD — spread known values, 0 extra round-trip
await db.update(table).set({ status: "approved", date: now }).where(eq(table.id, row.id));
return { data: { ...row, status: "approved", date: now } };
```

Only read-back when DB triggers or DEFAULT values modify other columns.

---

## 7 — Batch Existence Check

```ts
// ❌ BAD — 2 separate queries
const mentorExists = await db.select()...where(eq(type, "mentor")).get();
const parentExists = await db.select()...where(eq(type, "parent")).get();

// ✅ GOOD — 1 query + Set
const existing = await db.select()...where(inArray(type, ["mentor", "parent"])).all();
const existingTypes = new Set(existing.map(e => e.type));
if (!existingTypes.has("mentor")) { /* create */ }
```

---

## 8 — Batch ID→Name Resolution

```ts
// ✅ Collect IDs → single inArray query → Map → O(1) lookup
const ids = new Set(rows.map(r => r.user_id));
const people = await db.select({ id, name })
  .from(usersTable)
  .where(inArray(usersTable.id, [...ids])).all();

const nameMap = new Map(people.map(p => [p.id, p.name]));
const enriched = rows.map(r => ({ ...r, userName: nameMap.get(r.user_id) ?? r.user_id }));
```

If IDs are known upfront, prefer LEFT JOIN in the main query (0 extra round-trips).

---

## 9 — Lightweight Validation Query

```ts
// ❌ BAD — 6 queries just to get 1 field for validation
const detail = await getFullDetail(id); // 6 JOINs, heavy
const config = CONFIG[detail.category];

// ✅ GOOD — 1 targeted query
const category = await getCategoryById(id); // 1 JOIN, also serves as RLS check
const config = CONFIG[category];
```

For mutation validation, don't call "get detail" when you only need 1-2 fields.

---

## 10 — D1 Race Condition: UNIQUE Constraint

D1 doesn't support `db.transaction()`, so SELECT-count + INSERT is not atomic.

```sql
-- ✅ DB-level hard guard
CREATE UNIQUE INDEX idx_entries_unique ON entries(parent_id, sequence_num);
```

Application-level count check remains as soft guard (nice error message). UNIQUE index is the real guarantee.

---

## 11 — Partial Indexes

```ts
// ✅ Only index non-NULL rows (80%+ are NULL)
index("idx_listings_lat").on(table.latitude).where(sql`latitude IS NOT NULL`),

// ✅ Composite partial index for filtered queries
index("idx_dedup").on(table.district, table.source, table.area)
  .where(sql`duplicate_of_id IS NULL AND status = 'active'`),
```

---

## 12 — Redundant COUNT Elimination

```ts
// ❌ BAD — 3 queries: data + count + stats
const [data, totalResult, statsResult] = await Promise.all([...]);

// ✅ GOOD — 2 queries: data + stats (stats includes total)
const [data, statsResult] = await Promise.all([...]);
const total = stats.total; // COUNT(*) already in stats query
```

-33% DB round-trips on list pages.

---

## 13 — SSR Waterfall: Parallelize ID-Only Queries

```ts
// ❌ BAD — sequential: wait for project, then fetch related
const project = await getProject(id);
const [company, docs] = await Promise.all([
  getCompany(project.company_id), listDocs(id),
]);

// ✅ GOOD — id-only queries run parallel with main entity
const [project, docs, notes, devs] = await Promise.all([
  getProject(id),
  listDocs(id),        // only needs id, not project entity
  listNotes("project", id),
  listDevs(id),
]);
if (!project) notFound();
// Only company_id-dependent queries wait
const company = await getCompany(project.company_id);
```

---

## 14 — Parallel I/O Concurrency Limiter

```ts
// ❌ BAD — sequential: N × latency
for (const item of items) { await processItem(item); }

// ❌ BAD — all at once: rate limit / connection limit
await Promise.all(items.map(item => processItem(item)));

// ✅ GOOD — chunked concurrency
const CONCURRENCY = 5;
for (let i = 0; i < items.length; i += CONCURRENCY) {
  const chunk = items.slice(i, i + CONCURRENCY);
  await Promise.all(chunk.map(item => processItem(item)));
}
```

---

## 15 — Export/Bulk Query: LIMIT Required

Every potentially unbounded query needs `.limit(EXPORT_ROW_LIMIT)`. Workers has 128MB memory limit.

---

## 16 — Don't Accept What You Don't INSERT

```ts
// ❌ BAD — created_by accepted but never inserted → silent data loss
async function create({ title, created_by }) {
  await db.insert(table).values({ id: newId(), title }); // created_by dropped!
}

// ✅ GOOD — signature matches INSERT
async function create({ title }) {
  await db.insert(table).values({ id: newId(), title });
}
```

---

## tRPC + Hono Patterns

See `reference/trpc-hono.md` for:
- tRPC v11 + Hono integration setup
- 3 procedure levels (public/protected/admin)
- End-to-end type safety (monorepo)
- Zod empty string handling (`cleanForm`)
- `z.record` → `z.object().partial()` input typing
- `.output()` with `.passthrough().nullable()` ordering
- Hono route Zod `safeParse` for non-tRPC routes

## Cloudflare Workers Specifics

See `reference/cf-workers.md` for:
- `waitUntil()` for fire-and-forget (emails, background tasks)
- Module-level state doesn't survive across isolates → use KV
- `*.sql.ts` filename + esbuild code-splitting → Workers ESModule bug
- `nodejs_compat` flag for React Email rendering
- `force-dynamic` for every DB-reading Next.js page
- `printf` not `echo` for Vercel env vars (trailing newline)
- `drizzle-kit push` vs `migrate` for fresh DBs
