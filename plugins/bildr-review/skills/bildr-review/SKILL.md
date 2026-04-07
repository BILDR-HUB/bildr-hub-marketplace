---
name: bildr-review
description: BILDR security review — auth framework defaults, middleware auth enforcement, session management, IDOR, XSS, input validation, RLS, token flows. Use when writing or reviewing API endpoints, auth flows, middleware, or any code handling user input.
---

## Purpose

Security review checklist for web applications, hardened with real incident learnings from BILDR projects. Covers auth framework pitfalls, middleware enforcement, session lifecycle, IDOR, XSS, input validation bypass, broken access control, and token misuse.

Use this as a mental checklist when writing or reviewing API endpoints, middleware, auth flows, and frontend code that handles sensitive data.

## When to Apply

- Writing or reviewing any API endpoint that accepts user input
- Implementing auth flows (login, token, magic link, OTP)
- Adding or modifying middleware
- File upload endpoints
- Role-based access control (RLS/RBAC)
- Any mutation that changes ownership or state
- Code review / PR review
- Adding new user creation paths

---

## 1 — Auth Framework Default Endpoints (CRITICAL)

**Rule:** Auth frameworks (better-auth, NextAuth, Lucia, etc.) ship with default endpoints that may be enabled even when you think sign-up is disabled. ALWAYS audit the catch-all auth route.

**Real incident:** `disableSignUp: true` on better-auth's emailOTP plugin only disabled OTP-based sign-up. The core `POST /api/auth/sign-up/email` (email+password) remained open. An attacker created a `member` account via this endpoint using a disposable email.

```ts
// ❌ BAD — only disables OTP sign-up, core sign-up still open
plugins: [
  emailOTP({ disableSignUp: true })
]

// ✅ GOOD — explicitly disable core email+password sign-up
emailAndPassword: {
  enabled: false,
},
plugins: [
  emailOTP({ disableSignUp: true })
]
```

**Checklist:**
- [ ] Enumerate ALL endpoints the auth framework exposes (check docs for `/sign-up/*`, `/reset-password`, `/change-email`)
- [ ] Explicitly disable every sign-up path you don't need
- [ ] Check `defaultValue` on role fields — if sign-up is open, what role does the user get?
- [ ] Test: `curl -X POST /api/auth/sign-up/email -d '{"email":"test@test.com","password":"x"}'` — should return 403/404, not 200

---

## 2 — Middleware-Level Auth Enforcement

**Rule:** Auth checks MUST run in middleware (before rendering), not only in layouts or page components.

**Problem:** Layout-level `getSessionUser()` → `redirect("/login")` runs DURING rendering, not before. CDN caching, edge cases with parallel routes, or CF Workers caching can bypass it.

```ts
// ✅ Middleware: check cookie PRESENCE (fast, pre-render gate)
export function middleware(request: NextRequest) {
  if (isPublicPath(pathname)) return NextResponse.next();

  const hasSession = request.cookies.has("better-auth.session_token")
    || request.cookies.has("__Secure-better-auth.session_token");

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// Layout: validate session against DB (defense-in-depth, second layer)
// API route: requireAuth() per-endpoint (third layer)
```

**Defense-in-depth layers:**
1. **Middleware** — cookie presence check (fast, runs BEFORE any rendering)
2. **Layout** — DB session validation (catches fake/expired cookies)
3. **API route** — `requireAuth()` per-endpoint (protects data access)

**Checklist:**
- [ ] Middleware exists for EVERY app (not just API CORS)
- [ ] Middleware matcher covers all routes (not just `/api/*`)
- [ ] Public paths explicitly whitelisted (not implicitly allowed)
- [ ] Both dev and prod cookie names checked (`prefix.session_token` + `__Secure-prefix.session_token`)

---

## 3 — Session Invalidation on User Deletion

**Rule:** When deleting a user, ALL their sessions MUST be deleted in the same transaction. Use cleanup that fails LOUD, not silent.

```ts
// ❌ BAD — silent catch hides session deletion failures
const safe = (sql) => db.prepare(sql).bind(id).run().catch(console.warn);
await safe("DELETE FROM sessions WHERE user_id = ?");

// ✅ GOOD — explicit transaction, fail loud
await db.batch([
  db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id),
  db.prepare("DELETE FROM accounts WHERE user_id = ?").bind(id),
  db.prepare("DELETE FROM users WHERE id = ?").bind(id),
]);
```

**Also check:**
- [ ] Cookie cache (`cookieCache: { maxAge: 300 }`) — deleted user may access for up to maxAge seconds via cached session in cookie
- [ ] If user can re-register via any open sign-up path after deletion

---

## 4 — Public Registration Endpoint Hardening

**Rule:** Self-registration endpoints (portal invite, client sign-up) must verify the email belongs to the target organization.

```ts
// ❌ BAD — anyone who knows the company slug can register
const company = await db.prepare("SELECT id FROM companies WHERE slug = ?")
  .bind(slug).first();
await db.prepare("INSERT INTO users ...").bind(email, company.id);

// ✅ GOOD — email must exist in people table for this company
const person = await db.prepare(
  "SELECT id FROM people WHERE email = ? AND company_id = ?"
).bind(email, company_id).first();
if (!person) return Response.json({ error: "Not authorized" }, { status: 403 });
```

---

## 5 — API Input Validation (Trust Boundary)

**Rule:** Every POST/PATCH handler where body comes from `request.json()` must validate types explicitly.

**Problem:** `body.isActive` may be `"false"` (truthy string), `body.aliases` may be a string instead of array.

```ts
// ✅ Type guards at the handler entry, 400 response
if (body.isActive !== undefined && typeof body.isActive !== "boolean")
  return c.json({ error: "isActive must be a boolean" }, { status: 400 });
if (body.aliases !== undefined && !Array.isArray(body.aliases))
  return c.json({ error: "aliases must be an array" }, { status: 400 });
```

**Rule:** Only validate at system boundaries (API route). Internal functions trust TypeScript types.

---

## 6 — IDOR Prevention (Nested Resource Ownership)

**Rule:** For nested routes `/api/parent/[id]/child/[childId]`, ALWAYS verify parent ownership in the WHERE clause.

```ts
// ❌ BAD — ignores parent ownership
db.update(child).set(updates).where(eq(child.id, childId));

// ✅ GOOD — verifies ownership
db.update(child).set(updates)
  .where(and(eq(child.id, childId), eq(child.parentId, parentId)));
```

**If no match:** Return 404 (not 403) — don't reveal whether the resource exists.

---

## 7 — Stored XSS Prevention (URL Scheme Validation)

**Rule:** User-controlled URLs in `<a href=...>` must be scheme-whitelisted before rendering.

```tsx
// ✅ Only allow http/https
{url && /^https?:\/\//i.test(url) && (
  <a href={url} target="_blank" rel="noopener noreferrer">...</a>
)}
```

`rel="noopener noreferrer"` does NOT protect against `javascript:` — it only isolates the target window.

---

## 8 — Search DoS Prevention

**Rule:** Free-text search that hits LIKE/ILIKE + subqueries needs input length cap.

```ts
const rawSearch = searchParams.get("search")?.toLowerCase().trim() || null;
const search = rawSearch && rawSearch.length <= 200 ? rawSearch : null;
```

---

## 9 — Server-Side File Validation (Magic Bytes)

**Rule:** `file.type` (multipart Content-Type) is client-controlled. Always verify magic bytes.

```ts
function detectMimeFromBytes(buffer: ArrayBuffer): string | null {
  const bytes = new Uint8Array(buffer).slice(0, 16);
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf";
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return "image/png";
  return null;
}
```

Also sanitize filenames: `file.name.replace(/[^a-zA-Z0-9._-]/g, "_")` — path traversal prevention.

---

## 10 — Client-Supplied Enum Cross-Check

**Rule:** If an endpoint uses a client-supplied value for business logic (validation limits, routing), ALWAYS cross-check against the DB record.

```ts
const p = await db.select().from(table).where(eq(table.id, input.id)).get();
if (input.kategoria !== p.kategoria)
  throw new TRPCError({ code: "BAD_REQUEST", message: "Category mismatch" });
```

Never use a client-supplied enum directly for limit/validation lookup.

---

## 11 — Role-Based SELECT (Column Filtering)

**Rule:** If a query result is for a non-admin role, ALWAYS use explicit column list.

```ts
// ❌ BAD — admin scoring + audit fields leak to non-admin
const p = await db.select().from(table).where(...).get();

// ✅ GOOD — only role-relevant fields
const p = await db.select({
  id: table.id,
  kategoria: table.kategoria,
  cim: table.cim,
  // NOT: admin_pont_1, admin_pontozo_id, created_by, updated_by
}).from(table).where(...).get();
```

`select()` (all columns) is only acceptable for admin-level endpoints.

---

## 12 — Backend RLS Enforcement (Coordinator/Scoped Roles)

**Rule:** If a role has restricted view (e.g., coordinator → own school only), the backend MUST enforce the filter. Frontend filtering is UX, not security.

```ts
async function enforceScope(user, inputScope?) {
  if (user.role !== "coordinator") return inputScope;
  const entity = await getEntity(user.id);
  if (!entity?.scope_id) throw new TRPCError({ code: "FORBIDDEN" });
  return entity.scope_id; // ALWAYS override with their own scope
}
```

**Fail closed:** If scope is NULL (not configured), FORBIDDEN — not "access everything".

**Checklist for every admin endpoint:** "If a scoped role calls this, what should they see?" If not everything → enforce.

---

## 13 — Backend Boolean Enforcement

**Rule:** If a boolean field must be `true` (consent, ToS acceptance), the backend MUST verify. A disabled frontend button is UX, not security.

```ts
if (!data.consent_accepted)
  return { error: "Consent is required" };
```

---

## 14 — Atomic Conditional UPDATE (TOCTOU Prevention)

**Rule:** Don't SELECT→check→UPDATE. Put ownership + state conditions in the WHERE clause.

```ts
// ❌ BAD — 2 queries + TOCTOU race
const p = await db.select()...get();
if (p.owner_id !== userId) return { error: "Forbidden" };
await db.update(table).set({ status: "deleted" }).where(eq(table.id, id));

// ✅ GOOD — 1 query, atomic, no race
const result = await db.update(table)
  .set({ status: "deleted", updated_by: userId })
  .where(and(
    eq(table.id, id),
    eq(table.owner_id, userId),
    inArray(table.status, ["draft", "ready"]),
  ));
if (!result.meta.changes) return { error: "Not found or not deletable" };
```

Generic error message prevents IDOR information disclosure.

---

## 15 — Server-Side Soft-Delete Filtering

**Rule:** Soft-deleted records must be filtered in the DB query, never on the client.

```ts
.where(and(
  eq(table.owner_id, userId),
  sql`${table.status} != 'deleted'`,
))
```

Why: prevents bandwidth waste, stops other frontend logic from seeing deleted data, prevents sensitive deleted data from leaking in API responses.

---

## 16 — Token-Based Public Flows

See `reference/token-flows.md` for detailed patterns on:
- `url_token` vs UUID PK (user-friendly URLs)
- Token expiry with `expires_at` + `isTokenExpired()` helper
- KV-backed magic links (opaque, one-time, short TTL)
- Cross-domain auth (OTP redirect pattern)
- Idempotent token creation (3 states: new / valid / expired→refresh)

---

## Quick Checklist

When reviewing an endpoint or auth flow, ask:

**Auth framework:**
- [ ] All default sign-up endpoints explicitly disabled?
- [ ] Role `defaultValue` safe if sign-up is somehow open?
- [ ] Auth catch-all route (`[...all]`) audited for exposed endpoints?

**Middleware:**
- [ ] Auth middleware exists for every app?
- [ ] Middleware covers all routes, not just `/api/*`?
- [ ] Public paths explicitly whitelisted?

**Session lifecycle:**
- [ ] User deletion also deletes all sessions (same transaction)?
- [ ] Session cookie cache TTL is reasonable?
- [ ] No open re-registration path after deletion?

**API endpoints:**
- [ ] Input types validated at boundary? (string, boolean, array)
- [ ] Nested resource ownership checked in WHERE? (IDOR)
- [ ] User-supplied URLs scheme-whitelisted? (XSS)
- [ ] Search input length-capped? (DoS)
- [ ] File upload validates magic bytes? (not just MIME)
- [ ] Client enum values cross-checked against DB? (tampering)
- [ ] SELECT uses explicit columns for non-admin roles? (data leak)
- [ ] Scoped roles enforced server-side? (RLS)
- [ ] Required booleans verified server-side? (consent bypass)
- [ ] Mutations use atomic conditional UPDATE? (TOCTOU)
- [ ] Soft-deleted records filtered in query? (not client-side)
- [ ] Tokens have expiry + one-time use where applicable?

**Public registration:**
- [ ] Self-registration requires email in org's people/contacts table?
- [ ] Created users always get lowest-privilege role?
- [ ] Email format validated server-side?
