# PostHog — Vue.js / Nuxt Integration

## Vue.js (standalone)

### Dependencies
```bash
npm install posthog-js
```

### Env változók
```env
VITE_POSTHOG_KEY=phc_xxxxxxxxxxxxx
```

### SDK inicializálás — Plugin pattern

```typescript
// src/plugins/posthog.ts
import posthog from "posthog-js";
import type { App } from "vue";

// TypeScript augmentation for Options API
declare module "vue" {
  interface ComponentCustomProperties {
    $posthog: typeof posthog;
  }
}

export const posthogPlugin = {
  install(app: App) {
    const key = import.meta.env.VITE_POSTHOG_KEY;
    if (key && import.meta.env.PROD) {
      posthog.init(key, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
      });
    }
    // Composition API: inject("posthog")
    app.provide("posthog", posthog);
    // Options API: this.$posthog
    app.config.globalProperties.$posthog = posthog;
  },
};
```

```typescript
// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { posthogPlugin } from "./plugins/posthog";

createApp(App).use(posthogPlugin).mount("#app");
```

### Composable (Composition API / `<script setup>`)

A legtöbb modern Vue 3 projekt Composition API-t és `<script setup>`-ot használ. Használd a `usePostHog()` composable-t:

```typescript
// src/composables/use-posthog.ts
import posthog from "posthog-js";

export function usePostHog() {
  return posthog;
}
```

Használat `<script setup>`-ban:
```vue
<script setup lang="ts">
import { usePostHog } from "@/composables/use-posthog";
const posthog = usePostHog();
posthog.capture("my_event");
</script>
```

### Route tracking (Vue Router)

A `router.afterEach` hook-ban hívd meg a page view tracking-et. Add hozzá a `createRouter()` hívás **után** a router fájlban:

```typescript
// src/router/index.ts — a createRouter() UTÁN add hozzá:
import { nextTick } from "vue";
import posthog from "posthog-js";

router.afterEach((to) => {
  nextTick(() => {
    posthog.capture("$pageview", { path: to.fullPath });
  });
});
```

> A `nextTick()` biztosítja, hogy a `document.title` már frissült, mielőtt a PostHog rögzíti a page view-t.

### Reverse Proxy (ad blocker bypass)

A Vite dev server proxy-ja megegyezik a React SPA-val:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
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

## Nuxt

### Dependencies
```bash
npm install @posthog/nuxt
```

### Config
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@posthog/nuxt"],
  posthog: {
    publicKey: "phc_xxxxxxxxxxxxx",
    host: "https://us.i.posthog.com",
  },
});
```

A `@posthog/nuxt` modul automatikusan kezeli az inicializálást és a route tracking-et.

## Type-safe event wrapper

Vue projekthez a `composables/` könyvtárba tedd:

```typescript
// src/composables/use-analytics.ts
import posthog from "posthog-js";

interface AnalyticsEvents {
  // A user által megadott custom event-ek ide kerülnek
  // Példa:
  // form_submitted: { form_name: string; field_count: number };
  // export_downloaded: { format: "csv" | "xlsx" };
}

export function trackEvent<T extends keyof AnalyticsEvents>(
  event: T,
  properties: AnalyticsEvents[T]
): void {
  posthog.capture(event, properties);
}

export function useAnalytics() {
  return { trackEvent };
}
```

> Megjegyzés: A `typeof window === "undefined"` guard csak SSR framework-ökhöz (Nuxt) kell. Plain Vue 3 + Vite SPA-ban nincs rá szükség.

Használat `<script setup>`-ban:
```vue
<script setup lang="ts">
import { useAnalytics } from "@/composables/use-analytics";
const { trackEvent } = useAnalytics();
trackEvent("form_submitted", { form_name: "contact", field_count: 5 });
</script>
```
