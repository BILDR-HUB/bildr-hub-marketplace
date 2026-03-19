# tRPC v11 + Hono Patterns — Reference

## Integration Setup

tRPC mounted on `/api/trpc/*` in Hono via `fetchRequestHandler`. Hono handles: auth routes (`/api/auth/*`), health check, webhooks, static assets.

## 3 Procedure Levels

```ts
const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(authMiddleware);      // any authenticated user
const adminProcedure = t.procedure.use(authMiddleware).use(adminMiddleware); // admin role only
```

## End-to-End Type Safety (Monorepo)

```
Backend:  tRPC router → Zod input schemas
Shared:   Zod schemas in packages/shared → frontend form validation too
Frontend: import type { AppRouter } → createTRPCClient<AppRouter> → full autocomplete
```

No codegen needed — TypeScript compiler handles it. Requires monorepo where types are importable.

## Zod: Empty String ≠ undefined

HTML form fields send empty strings (`""`), but `z.string().email().optional()` treats `""` as a valid string (not `undefined`) → Zod email validation fails on empty fields.

```ts
// ✅ cleanForm helper — replace empty strings with undefined
function cleanForm(form: Record<string, string>) {
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(form)) {
    result[key] = value.trim() || undefined;
  }
  return result;
}

// Usage before mutation:
updateMutation.mutate(cleanForm(form));
```

## tRPC Input: z.record → z.object().partial()

```ts
// ❌ BAD — accepts anything, no frontend autocomplete
data: z.record(z.string(), z.unknown())

// ✅ GOOD — mirrors the core allowlist
data: z.object({
  title: z.string(),
  category: z.string(),
  // ... same fields as the allowlist
}).partial(),
```

## tRPC .output(): Ordering Matters

```ts
// ✅ CORRECT — .passthrough() then .nullable()
.output(z.object({ id: z.string(), status: z.string().nullable() }).passthrough().nullable())

// ❌ WRONG — reversed: passthrough is a ZodObject method, nullable is a wrapper
.output(z.object({...}).nullable().passthrough()) // TypeError
```

## Frontend Error Field Mismatch

```ts
// Backend returns:
c.json({ success: false, error: "Invalid token" }, 400)

// Frontend MUST read:
(errorData as { error?: string })?.error  // ✅
// NOT:
(errorData as { message?: string })?.message  // ❌ — always undefined
```

Better: shared response type in `@project/shared` used by both sides.

## Hono Route Zod Validation (non-tRPC)

```ts
const parseResult = z.object({
  category: z.enum(CATEGORIES).optional(),
}).safeParse({ category: c.req.query("category") || undefined });
if (!parseResult.success) return c.json({ error: "Invalid parameters" }, 400);
```
