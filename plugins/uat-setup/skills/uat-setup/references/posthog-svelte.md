# PostHog — Svelte / SvelteKit Integration

## Dependencies
```bash
npm install posthog-js
```

## Svelte (standalone, Vite)

### Env változók
```env
VITE_POSTHOG_KEY=phc_xxxxxxxxxxxxx
```

### SDK inicializálás

```typescript
// src/lib/posthog.ts
import posthog from "posthog-js";

export function initPostHog() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (key && import.meta.env.PROD && typeof window !== "undefined") {
    posthog.init(key, {
      api_host: "https://us.i.posthog.com",
    });
  }
}
```

```svelte
<!-- src/App.svelte -->
<script>
  import { onMount } from "svelte";
  import { initPostHog } from "./lib/posthog";

  onMount(() => initPostHog());
</script>
```

## SvelteKit

### Env változók
```env
PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
```

### SDK inicializálás — Layout-ban

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import posthog from "posthog-js";

  onMount(() => {
    const key = import.meta.env.PUBLIC_POSTHOG_KEY;
    if (key && browser) {
      posthog.init(key, {
        api_host: "https://us.i.posthog.com",
      });
    }
  });

  // Route tracking
  $: if (browser && $page.url) {
    posthog.capture("$pageview");
  }
</script>

<slot />
```

### SvelteKit proxy (hooks.server.ts)

```typescript
// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith("/ingest")) {
    const target = event.url.pathname.replace("/ingest", "");
    const response = await fetch(`https://us.i.posthog.com${target}`, {
      method: event.request.method,
      headers: event.request.headers,
      body: event.request.body,
    });
    return response;
  }
  return resolve(event);
};
```

## Type-safe event wrapper

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
