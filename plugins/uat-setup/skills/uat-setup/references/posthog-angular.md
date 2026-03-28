# PostHog — Angular Integration

## Dependencies
```bash
npm install posthog-js
```

## Env változók

Angular-ban az `environment.ts` fájlokat használd:

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  posthogKey: "phc_xxxxxxxxxxxxx",
  posthogHost: "https://us.i.posthog.com",
};
```

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  posthogKey: "",
  posthogHost: "",
};
```

## SDK inicializálás — APP_INITIALIZER

```typescript
// src/app/posthog.initializer.ts
import posthog from "posthog-js";
import { environment } from "../environments/environment";

export function initPostHog(): () => void {
  return () => {
    if (environment.production && environment.posthogKey) {
      posthog.init(environment.posthogKey, {
        api_host: environment.posthogHost,
      });
    }
  };
}
```

```typescript
// src/app/app.config.ts (standalone API)
import { ApplicationConfig, APP_INITIALIZER } from "@angular/core";
import { initPostHog } from "./posthog.initializer";

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initPostHog,
      multi: true,
    },
  ],
};
```

## Route tracking

```typescript
// src/app/app.component.ts
import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import posthog from "posthog-js";

@Component({ selector: "app-root", template: "<router-outlet />" })
export class AppComponent {
  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => posthog.capture("$pageview"));
  }
}
```

## Type-safe event wrapper

```typescript
// src/app/lib/analytics.ts
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
