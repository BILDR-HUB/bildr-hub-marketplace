# Token-Based Auth Flows — Reference

## url_token vs UUID PK

Use a short, user-friendly token in URLs instead of UUID primary keys:
- `url_token`: 16 char base64url (12 byte `crypto.getRandomValues` = 96 bit entropy)
- PK (`id`) remains UUID for internal FKs and admin APIs
- Unique index on `url_token` for fast lookup

```ts
function generateUrlToken(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
```

## Token Expiry

```ts
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function tokenExpiresAt(): string {
  return new Date(Date.now() + TOKEN_TTL_MS).toISOString();
}

function isTokenExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false; // backwards compat: NULL = never expires
  return new Date() > new Date(expiresAt);
}
```

Usage: INSERT with `expires_at: tokenExpiresAt()`, lookup with `if (isTokenExpired(row.expires_at)) return null`.

## KV-Backed Magic Link (One-Time, Opaque)

Problem: Login magic link with `?email=foo@bar.com&otp=123456` leaks PII + secret in URL (browser history, proxy logs, referer).

```ts
// Generate
const magicToken = crypto.randomUUID();
await env.KV.put(`magic-token:${magicToken}`, JSON.stringify({ email, otp }), { expirationTtl: 300 });
// Email link: /login?token=${magicToken}

// Resolve (one-time)
const raw = await kv.get(`magic-token:${token}`);
await kv.delete(`magic-token:${token}`);
return JSON.parse(raw); // { email, otp }
```

Properties: opaque (no PII), one-time (delete after read), short TTL (5 min), KV-backed (multi-instance safe).

## Cross-Domain Auth (OTP Redirect)

Problem: OTP verify on domain A sets session cookie there — unusable on domain B.

Solution: Don't verify on the wrong domain. Redirect to the target domain with OTP in URL params:
1. Send OTP + read dev endpoint on admin domain (no cookie set)
2. Redirect: `studentUrl/login?email=x&otp=y&redirect=/dashboard`
3. Target domain's login hook auto-detects `?email=&otp=` and verifies (cookie on correct domain)

**Rule:** Cross-domain auth — cookie must be created on the domain where it will be used.

## Idempotent Token Creation (3 States)

Token-creating functions must handle 3 states:

```ts
async function createToken(entityId: string) {
  const existing = await db.select()...where(eq(table.entity_id, entityId)).get();

  if (!existing) {
    // State 1: No record → INSERT
    const token = generateUrlToken();
    await db.insert(table).values({ token, expires_at: tokenExpiresAt(), ... });
    return { token, existing: false }; // triggers email
  }

  if (existing.status !== "approved" && isTokenExpired(existing.expires_at)) {
    // State 3: Expired + not approved → UPDATE token
    const newToken = generateUrlToken();
    await db.update(table).set({ token: newToken, expires_at: tokenExpiresAt() })
      .where(eq(table.id, existing.id));
    return { token: newToken, existing: false }; // triggers email resend
  }

  // State 2: Valid token → return as-is
  return { token: existing.token, existing: true }; // skip email
}
```

The `existing: false` flag tells the caller to send an email.
