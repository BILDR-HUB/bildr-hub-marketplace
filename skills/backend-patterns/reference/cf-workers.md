# Cloudflare Workers Patterns — Reference

## waitUntil() for Fire-and-Forget

```ts
// ❌ RISKY — runtime may stop before promise completes
sendEmail(env, to, props).catch(console.error);

// ✅ SAFE — runtime guaranteed to wait
c.executionCtx.waitUntil(
  sendEmail(env, to, props).catch(console.error)
);
```

Critical for batch email sends after response is returned.

## Module-Level State Doesn't Survive Isolates

```ts
// ❌ BAD — isolate-specific, other isolates can't see it
const devOtpStore = new Map<string, { otp: string; ts: number }>();

// ✅ GOOD — globally shared, automatic TTL
await env.KV.put(`dev-otp:${email}`, otp, { expirationTtl: 600 });
const otp = await env.KV.get(`dev-otp:${email}`);
```

**Rule:** In CF Workers, NEVER use module-level Map/Set/Array as "cache" or "store". Use KV (read-heavy), D1 (write-heavy), or Durable Objects (strong consistency).

## Filename Extensions + esbuild Code-Splitting

`*.sql.ts` schema files become `.sql` extension chunks after esbuild code-splitting. Workers runtime only gives ESModule treatment to `.js`, `.mjs`, `.cjs` files. Everything else (`.sql`, `.json`, `.txt`) → Text module (string import, no named exports).

**Symptom:** `does not provide an export named 'fooTable'` on deploy (works locally).

**Fix:** Rename `*.sql.ts` → `*.ts`. The terminal.shop pattern (`*.sql.ts`) works without code-splitting, but monorepo + multiple importers = guaranteed splitting.

**Diagnostic:** `npx wrangler deploy --outdir /tmp/wrangler-out --dry-run` → check chunk file extensions.

## Next.js: force-dynamic for DB-Reading Pages

```ts
// Every page.tsx that imports db or runs Drizzle queries needs:
export const dynamic = "force-dynamic";
```

Place AFTER all imports, BEFORE component definition. Without it, Next.js tries to statically prerender at build time → no DB connection → build fails.

## Vercel Env Vars: printf Not echo

```bash
# ❌ BAD — echo appends trailing \n
echo "fc-abc123" | vercel env add FIRECRAWL_API_KEY production --force

# ✅ GOOD — printf doesn't add newline
printf "fc-abc123" | vercel env add FIRECRAWL_API_KEY production --force
```

Affects every secret that goes into HTTP headers or comparisons. `timingSafeEqual("pass", "pass\n")` is always false.

## drizzle-kit push vs migrate

- `drizzle-kit migrate` → production with existing data and migration history
- `drizzle-kit push --force` → fresh DB where schema.ts is the source of truth

## Batch Email: Loop-Invariant Hoisting

```ts
// ❌ BAD — formatDate runs 3× per iteration, sequential sends
for (const user of users) {
  await sendEmail(env, user.email, {
    date1: formatDate(config.date1),  // loop-invariant!
    date2: formatDate(config.date2),
  });
}

// ✅ GOOD — hoist + parallel sends
const date1 = formatDate(config.date1);
const date2 = formatDate(config.date2);
await Promise.all(
  users.map(user =>
    sendEmail(env, user.email, { date1, date2 })
      .catch(err => console.error(`Failed: ${user.email}`, err))
  )
);
```

Workers has 30s CPU limit — parallelization is essential for batch operations.

## R2 Delete: r2_key vs drive_link Guard

```ts
const r2Key = result.r2_key ?? result.drive_link;
if (r2Key && !r2Key.startsWith("http")) {
  await c.env.R2.delete(r2Key);
}
```

R2 key never starts with `http`. If it does, it's an external URL — don't try to delete from R2.
