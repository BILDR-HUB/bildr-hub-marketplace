# PostHog — Next.js Integration

## Dependencies

```bash
npm install posthog-js
```

> Note: A `@posthog/next` csomag is létezik, de a `posthog-js` közvetlenül + `instrumentation-client.ts` egyszerűbb és kevesebb boilerplate.

## 1. Env változók

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
```

A `NEXT_PUBLIC_` prefix szükséges, hogy a client-side kód is elérje.

## 2. SDK inicializálás — instrumentation-client.ts

**App Router (Next.js 15.3+)**: Használd az `instrumentation-client.ts` hook-ot a projekt gyökerében.

```typescript
// instrumentation-client.ts
import posthog from "posthog-js";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY &&
  process.env.NODE_ENV !== "development"
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
  });
}
```

**Pages Router vagy régebbi Next.js**: Használj `PostHogProvider`-t az `_app.tsx`-ben:

```typescript
// pages/_app.tsx
import posthog from "posthog-js";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
      });
    }
  }, []);

  return <Component {...pageProps} />;
}
```

## 3. Reverse Proxy (ad blocker bypass)

A `next.config.ts`-be (vagy `.mjs`/`.js`) add hozzá a rewrites-ot:

```typescript
// next.config.ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // ... többi config
};
```

> EU cloud esetén cseréld `us`-t `eu`-ra.

## 4. Middleware bypass

Ha a projekt használ `middleware.ts`-t (pl. auth), add hozzá az `/ingest` prefix-et az ignorált útvonalakhoz:

```typescript
// middleware.ts — a matcher-ből vagy a logikából hagyd ki:
if (pathname.startsWith("/ingest")) {
  return NextResponse.next();
}
```

## 5. Type-safe event wrapper

```typescript
// src/lib/analytics.ts
import posthog from "posthog-js";

// A user által megadott custom event-ek ide kerülnek
interface AnalyticsEvents {
  // Példa:
  // form_submitted: { form_name: string; field_count: number };
  // export_downloaded: { format: "csv" | "xlsx" };
}

export function trackEvent<T extends keyof AnalyticsEvents>(
  event: T,
  properties: AnalyticsEvents[T]
): void {
  if (typeof window === "undefined") return;
  posthog.capture(event, properties);
}
```

A `trackEvent` hívás fire-and-forget: nem blokkol, nem dob hibát, server-side no-op.
