---
name: security-review
description: Security review checklist for web APIs — IDOR, XSS, input validation, RLS, token flows, auth enforcement. Use when writing or reviewing API endpoints, auth flows, file uploads, or any code handling user input.
---

## Purpose

This skill provides a security review checklist for web applications. It covers the most common vulnerabilities found in real production codebases: IDOR, XSS, input validation bypass, broken access control, token misuse, and more.

Use this as a mental checklist when writing or reviewing API endpoints, middleware, auth flows, and frontend code that handles sensitive data.

## When to Apply

- Writing or reviewing any API endpoint that accepts user input
- Implementing auth flows (login, token, magic link, OTP)
- File upload endpoints
- Role-based access control (RLS/RBAC)
- Any mutation that changes ownership or state
- Code review / PR review

---

## 1 — API Input Validation (Trust Boundary)

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

## 2 — IDOR Prevention (Nested Resource Ownership)

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

## 3 — Stored XSS Prevention (URL Scheme Validation)

**Rule:** User-controlled URLs in `<a href=...>` must be scheme-whitelisted before rendering.

```tsx
// ✅ Only allow http/https
{url && /^https?:\/\//i.test(url) && (
  <a href={url} target="_blank" rel="noopener noreferrer">...</a>
)}
```

`rel="noopener noreferrer"` does NOT protect against `javascript:` — it only isolates the target window.

---

## 4 — Search DoS Prevention

**Rule:** Free-text search that hits LIKE/ILIKE + subqueries needs input length cap.

```ts
const rawSearch = searchParams.get("search")?.toLowerCase().trim() || null;
const search = rawSearch && rawSearch.length <= 200 ? rawSearch : null;
```

---

## 5 — Server-Side File Validation (Magic Bytes)

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

## 6 — Client-Supplied Enum Cross-Check

**Rule:** If an endpoint uses a client-supplied value for business logic (validation limits, routing), ALWAYS cross-check against the DB record.

```ts
const p = await db.select().from(table).where(eq(table.id, input.id)).get();
if (input.kategoria !== p.kategoria)
  throw new TRPCError({ code: "BAD_REQUEST", message: "Category mismatch" });
```

Never use a client-supplied enum directly for limit/validation lookup.

---

## 7 — Role-Based SELECT (Column Filtering)

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

## 8 — Backend RLS Enforcement (Coordinator/Scoped Roles)

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

## 9 — Backend Boolean Enforcement

**Rule:** If a boolean field must be `true` (consent, ToS acceptance), the backend MUST verify. A disabled frontend button is UX, not security.

```ts
if (!data.consent_accepted)
  return { error: "Consent is required" };
```

---

## 10 — Atomic Conditional UPDATE (TOCTOU Prevention)

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

## 11 — Server-Side Soft-Delete Filtering

**Rule:** Soft-deleted records must be filtered in the DB query, never on the client.

```ts
.where(and(
  eq(table.owner_id, userId),
  sql`${table.status} != 'deleted'`,
))
```

Why: prevents bandwidth waste, stops other frontend logic from seeing deleted data, prevents sensitive deleted data from leaking in API responses.

---

## 12 — Token-Based Public Flows

See `reference/token-flows.md` for detailed patterns on:
- `url_token` vs UUID PK (user-friendly URLs)
- Token expiry with `expires_at` + `isTokenExpired()` helper
- KV-backed magic links (opaque, one-time, short TTL)
- Cross-domain auth (OTP redirect pattern)
- Idempotent token creation (3 states: new / valid / expired→refresh)

---

## Quick Checklist

When reviewing an endpoint, ask:

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
