# PostHog — React SPA Integration (Vite / CRA)

## Dependencies

```bash
npm install posthog-js
```

## 1. Env változók

**Vite projekt:**
```env
VITE_POSTHOG_KEY=phc_xxxxxxxxxxxxx
```

**CRA projekt:**
```env
REACT_APP_POSTHOG_KEY=phc_xxxxxxxxxxxxx
```

## 2. SDK inicializálás

React SPA-ban a `main.tsx` (vagy `index.tsx`) fájlban inicializálj, az app renderelése ELŐTT:

```typescript
// src/main.tsx (Vite)
import posthog from "posthog-js";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
if (posthogKey && import.meta.env.PROD) {
  posthog.init(posthogKey, {
    api_host: "https://us.i.posthog.com", // vagy proxy URL ha van
  });
}

// ... ReactDOM.createRoot(...)
```

```typescript
// src/index.tsx (CRA)
import posthog from "posthog-js";

const posthogKey = process.env.REACT_APP_POSTHOG_KEY;
if (posthogKey && process.env.NODE_ENV === "production") {
  posthog.init(posthogKey, {
    api_host: "https://us.i.posthog.com",
  });
}
```

## 3. Proxy config (opcionális, de ajánlott)

### Vite

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      "/ingest": {
        target: "https://us.i.posthog.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ingest/, ""),
      },
    },
  },
});
```

> Fontos: A Vite proxy csak dev módban működik. Prod-ban a hosting platform (Vercel, Netlify, Cloudflare) rewrite szabályokat kell beállítani, vagy használd a közvetlen PostHog URL-t.

### CRA

CRA-ban nincs beépített prod proxy. Használd a közvetlen PostHog URL-t, vagy Nginx/Cloudflare rewrite-ot.

## 4. SPA page view tracking

React SPA-ban a PostHog nem követi automatikusan a route változásokat. React Router v6+ esetén:

```typescript
// src/hooks/use-posthog-pageview.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import posthog from "posthog-js";

export function usePostHogPageview() {
  const location = useLocation();

  useEffect(() => {
    posthog.capture("$pageview");
  }, [location.pathname]);
}
```

Ezt a hook-ot az App komponensben hívd meg.

## 5. Type-safe event wrapper

Ugyanaz mint Next.js-nél:

```typescript
// src/lib/analytics.ts
import posthog from "posthog-js";

interface AnalyticsEvents {
  // Custom event-ek ide
}

export function trackEvent<T extends keyof AnalyticsEvents>(
  event: T,
  properties: AnalyticsEvents[T]
): void {
  if (typeof window === "undefined") return;
  posthog.capture(event, properties);
}
```
