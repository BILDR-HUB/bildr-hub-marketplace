# Feedback Widget — Komponens referencia

Ez a referencia tartalmazza a feedback widget teljes implementációját. Adaptáld a detektált framework-höz és color scheme-hez.

## Komponens struktúra

A widget 3 részből áll:
1. **Floating gomb** — fix pozíció, jobb alsó sarok
2. **Popover form** — típus választó + textarea + küldés gomb
3. **Success state** — pipa ikon + köszönő üzenet → auto-close

## React implementáció (shadcn/ui)

Ha a projekt shadcn/ui-t használ (ellenőrizd: van-e `components/ui/` mappa), használd a `Button` és `Popover` komponenseket:

```tsx
"use client"; // Next.js-hez kell, React SPA-ban nem

import { useState, useRef } from "react";
import {
  MessageSquarePlus,
  Bug,
  Lightbulb,
  HelpCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type FeedbackType = "bug" | "feature" | "question";

const TYPE_OPTIONS = [
  { value: "bug" as const, label: "Hiba", icon: Bug },
  { value: "feature" as const, label: "Ötlet", icon: Lightbulb },
  { value: "question" as const, label: "Kérdés", icon: HelpCircle },
];

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("bug");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleSubmit() {
    if (!message.trim()) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: message.trim(),
          pageUrl: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) throw new Error();
      setIsSuccess(true);
      timeoutRef.current = setTimeout(() => setOpen(false), 2000);
    } catch {
      setError("Hiba történt, próbáld újra.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTimeout(() => {
        setType("bug");
        setMessage("");
        setIsSuccess(false);
        setError("");
      }, 200);
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
          aria-label="Visszajelzés küldése"
        >
          <MessageSquarePlus className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" sideOffset={12} className="w-80">
        {isSuccess ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Check className="h-8 w-8 text-green-500" />
            <p className="text-sm font-medium">Köszönjük a visszajelzést!</p>
          </div>
        ) : (
          <div>
            <p className="mb-3 font-semibold text-base">Visszajelzés</p>
            <div className="flex gap-1.5 mb-3">
              {TYPE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant="outline"
                  size="sm"
                  className={`flex-1 gap-1.5 ${
                    type === opt.value
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => setType(opt.value)}
                >
                  <opt.icon className="h-3.5 w-3.5" />
                  {opt.label}
                </Button>
              ))}
            </div>
            <textarea
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              rows={4}
              maxLength={5000}
              placeholder="Írd le a problémát vagy ötleted..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
            <Button
              className="w-full mt-3"
              disabled={isSubmitting || !message.trim()}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Küldés..." : "Küldés"}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
```

## shadcn nélküli React (Tailwind-only)

Ha a projektben nincs shadcn/ui, használd az alábbi standalone komponenst. Csak `lucide-react` és Tailwind kell hozzá.

> Előfeltétel: `npm install lucide-react` ha még nincs telepítve.

```tsx
"use client"; // Next.js-hez kell, React SPA-ban nem

import { useState, useRef, useEffect } from "react";
import {
  MessageSquarePlus,
  Bug,
  Lightbulb,
  HelpCircle,
  Check,
  X,
} from "lucide-react";

type FeedbackType = "bug" | "feature" | "question";

const TYPE_OPTIONS = [
  { value: "bug" as const, label: "Hiba", icon: Bug },
  { value: "feature" as const, label: "Ötlet", icon: Lightbulb },
  { value: "question" as const, label: "Kérdés", icon: HelpCircle },
];

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("bug");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleClose() {
    setOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTimeout(() => {
      setType("bug");
      setMessage("");
      setIsSuccess(false);
      setError("");
    }, 200);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: message.trim(),
          pageUrl: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) throw new Error();
      setIsSuccess(true);
      timeoutRef.current = setTimeout(() => handleClose(), 2000);
    } catch {
      setError("Hiba történt, próbáld újra.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40" ref={panelRef}>
      {open && (
        <div className="absolute bottom-14 right-0 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900">
          {isSuccess ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm font-medium">Köszönjük a visszajelzést!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold text-base">Visszajelzés</p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-1.5 mb-3">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                      type === opt.value
                        ? "border-primary bg-primary text-white hover:bg-primary/90"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                    onClick={() => setType(opt.value)}
                  >
                    <opt.icon className="h-3.5 w-3.5" />
                    {opt.label}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none dark:border-gray-700 dark:bg-gray-800"
                rows={4}
                maxLength={5000}
                placeholder="Írd le a problémát vagy ötleted..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              )}
              <button
                type="submit"
                className="w-full mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                disabled={isSubmitting || !message.trim()}
              >
                {isSubmitting ? "Küldés..." : "Küldés"}
              </button>
            </form>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Visszajelzés küldése"
      >
        <MessageSquarePlus className="h-5 w-5" />
      </button>
    </div>
  );
}
```

> **Megjegyzés**: A `bg-primary` és `focus:ring-primary` class-okat cseréld a projekt tényleges brand color utility-jére (pl. `bg-warm`, `bg-brand`). Ellenőrizd, hogy a szín definiálva van a Tailwind `@theme` blokkban vagy CSS változóként.

## Vue implementáció

```vue
<!-- FeedbackWidget.vue -->
<script setup lang="ts">
import { ref } from "vue";

type FeedbackType = "bug" | "feature" | "question";

const open = ref(false);
const type = ref<FeedbackType>("bug");
const message = ref("");
const isSubmitting = ref(false);
const isSuccess = ref(false);
const error = ref("");

async function handleSubmit() {
  if (!message.value.trim()) return;
  isSubmitting.value = true;
  error.value = "";
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: type.value,
        message: message.value.trim(),
        pageUrl: window.location.pathname,
        userAgent: navigator.userAgent,
      }),
    });
    if (!res.ok) throw new Error();
    isSuccess.value = true;
    setTimeout(() => { open.value = false; }, 2000);
  } catch {
    error.value = "Hiba történt, próbáld újra.";
  } finally {
    isSubmitting.value = false;
  }
}

function reset() {
  setTimeout(() => {
    type.value = "bug";
    message.value = "";
    isSuccess.value = false;
    error.value = "";
  }, 200);
}
</script>

<template>
  <!-- Floating button + popover form — adaptáld a Vue UI library-hez -->
</template>
```

## Svelte implementáció

```svelte
<!-- FeedbackWidget.svelte -->
<script lang="ts">
  let open = false;
  let type: "bug" | "feature" | "question" = "bug";
  let message = "";
  let isSubmitting = false;
  let isSuccess = false;
  let error = "";

  async function handleSubmit() {
    if (!message.trim()) return;
    isSubmitting = true;
    error = "";
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: message.trim(),
          pageUrl: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      });
      if (!res.ok) throw new Error();
      isSuccess = true;
      setTimeout(() => { open = false; }, 2000);
    } catch {
      error = "Hiba történt, próbáld újra.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<!-- Floating button + popover form — adaptáld a projekt stílusához -->
```

## Adaptációs checklist

Mielőtt beilleszted a komponenst, ellenőrizd:
- [ ] A `bg-primary` / `bg-warm` / `bg-brand` a projekt **brand accent** color-jára mutat? (Nem a sötét háttérszínre!)
- [ ] A `"use client"` direktíva kell? (csak Next.js App Router-nél)
- [ ] A `lucide-react` (vagy `lucide-vue-next` / `lucide-svelte`) **telepítve van**? Ha nem: `npm install lucide-react`
- [ ] A Popover/Button UI library elérhető (shadcn), **vagy** a Tailwind-only verziót használod?
- [ ] Az API endpoint URL helyes? (`/api/feedback` vagy egyedi route)
- [ ] SPA + külön backend esetén: van-e Vite proxy vagy env-based API URL?
- [ ] A form `<form onSubmit>` elemet használ? (jobb accessibility: Enter küld)
