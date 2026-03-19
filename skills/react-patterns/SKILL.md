---
name: react-patterns
description: React frontend best practices — hooks ordering, state sync, optimistic UI, performance, and common pitfalls. Use when writing React components, hooks, forms, or any client-side UI code.
---

## Purpose

Practical React patterns that prevent crashes, race conditions, and performance issues. Every pattern here comes from a real production bug.

## When to Apply

- Writing React components with hooks
- Form components that receive data from queries
- Optimistic UI (drag & drop, toggles)
- Search/filter inputs with API calls
- Components with conditional rendering (loading states)
- Performance-sensitive lists or dashboards

---

## 1 — Hooks: NEVER After Early Return

React counts hooks per render. If a hook appears after an early return, the first render sees N hooks, the next sees N+1 → crash + white screen.

```tsx
// ❌ CRASH — hook after early return
function Page() {
  const { data, isLoading } = trpc.foo.useQuery();
  if (isLoading) return <Loading />;
  const goTo = useCallback(() => {}, []); // 💥 "Rendered more hooks than during the previous render"
}

// ✅ GOOD — all hooks before any early return
function Page() {
  const { data, isLoading } = trpc.foo.useQuery();
  const goTo = useCallback(() => {}, []);
  if (isLoading) return <Loading />;
  // use goTo here
}

// ✅ BEST — if you don't need a hook, use a plain closure
function Page() {
  const { data, isLoading } = trpc.foo.useQuery();
  if (isLoading) return <Loading />;
  const goTo = (n: number) => setState(n); // plain closure, not a hook
}
```

---

## 2 — AbortController: Fetch Race Condition Prevention

When filter/search input triggers debounced fetches, older responses can overwrite newer results.

```tsx
// ❌ BAD — stale response overwrites fresh data
const fetchData = async () => {
  const res = await fetch(url);
  setData(await res.json());
};

// ✅ GOOD — abort previous request before starting new one
const abortRef = useRef<AbortController | null>(null);
const fetchData = useCallback(async () => {
  abortRef.current?.abort();
  abortRef.current = new AbortController();
  try {
    const res = await fetch(url, { signal: abortRef.current.signal });
    if (res.ok) setData(await res.json());
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return; // expected
    throw e;
  }
}, [deps]);
```

---

## 3 — useState Prop Sync After Mutation Invalidation

`useState(prop.value)` only initializes on mount. After tRPC mutation + cache invalidation, the parent re-renders with fresh data but the input still shows the stale value.

```tsx
// ❌ BAD — state never updates after invalidation
const [value, setValue] = useState(p.field ?? "");

// ✅ GOOD — useEffect reset when not editing
const [value, setValue] = useState(p.field ?? "");
useEffect(() => {
  if (!editing) setValue(p.field ?? "");
}, [p.field, editing]);

// ✅ ALSO GOOD — derive from props in read mode
const displayValue = editing ? localValue : (p.field ?? "");
```

---

## 4 — React Form: key Prop for Entity Switching

When the same form/modal opens for different entities, `useState` keeps the previous entity's data.

```tsx
// ❌ BAD — form shows entity A's data when opened for entity B
<TaskForm task={editTask} />

// ✅ GOOD — React unmounts/remounts, clean state
<TaskForm key={editTask?.id ?? "new"} task={editTask} />
```

Simpler and more reliable than useEffect sync.

---

## 5 — Optimistic UI: Don't Refetch on Success

```ts
// ❌ BAD — optimistic update applied, then refetch causes flicker
setTasks(optimisticallyUpdated);
try {
  await fetch(`/api/tasks/${id}`, { method: "PATCH", ... });
  await fetchTasks(); // unnecessary + causes flash
} catch (e) {
  await fetchTasks(); // revert on error
}

// ✅ GOOD — refetch only on error (revert)
setTasks(optimisticallyUpdated);
try {
  await fetch(`/api/tasks/${id}`, { method: "PATCH", ... });
  // optimistic update is already correct — no refetch needed
} catch (e) {
  await fetchTasks(); // revert to server state
}
```

---

## 6 — useMemo for Derived/Computed Data

```tsx
// ❌ BAD — O(n log n) sort runs on every keystroke in a form input
const events = buildTimelineEvents(notes, documents, activityLog);
const grouped = groupByDate(events);

// ✅ GOOD — only recomputes when inputs actually change
const events = useMemo(
  () => buildTimelineEvents(notes, documents, activityLog),
  [notes, documents, activityLog]
);
const filtered = useMemo(
  () => filter === "all" ? events : events.filter(e => e.type === filter),
  [events, filter]
);
const grouped = useMemo(() => groupByDate(filtered), [filtered]);
```

Rule: If computed value is O(n)+ and input changes rarely but component renders often (form input, hover) → useMemo.

---

## 7 — Callback Semantics: onClose ≠ onComplete

```ts
// ❌ BAD — onComplete fires even on cancel → unnecessary refetch
function handleClose() {
  resetState();
  onClose();
  onComplete?.(); // fires even if user cancelled!
}

// ✅ GOOD — onComplete only on actual success
function handleClose() {
  const didComplete = step === "success";
  resetState();
  onClose();                          // always: UI cleanup
  if (didComplete) onComplete?.();    // only on success: trigger refetch
}
```

---

## 8 — Badge Variant Helper: Don't Repeat Ternary Chains

```tsx
// ❌ BAD — same ternary chain copy-pasted 4 times
variant={x.status === "approved" ? "success" : x.status === "rejected" ? "destructive" : "secondary"}

// ✅ GOOD — single helper function, imported everywhere
import { statusVariant } from "@/lib/badge-variants";
variant={statusVariant(x.status ?? "")}
```

If 3+ different variant mappings exist, collect helpers in a single `badge-variants.ts`.

---

## 9 — Sidebar Badge Polling: Interval Not Navigation

```tsx
// ❌ BAD — API call on every page navigation
useEffect(() => {
  fetch("/api/unread-count").then(r => r.json()).then(d => setCount(d.count));
}, [pathname]); // fires on every route change

// ✅ GOOD — mount once + fixed interval matching data change frequency
useEffect(() => {
  const fetchCount = () =>
    fetch("/api/unread-count").then(r => r.json()).then(d => setCount(d.count)).catch(() => {});
  fetchCount();
  const interval = setInterval(fetchCount, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, []); // empty deps = mount only
```

If data changes rarely (cron, admin action), don't tie fetching to navigation events.

---

## 10 — IIFE Anti-Pattern in JSX: Extract Component

```tsx
// ❌ BAD — IIFE in JSX with local variables, reduce, type casts
{condition ? (
  <p>No data</p>
) : (() => {
  const config = CONFIG[data.category as keyof typeof CONFIG];
  const total = config.reduce((sum, f) => sum + (values[f.key] ?? 0), 0);
  return <table>...</table>;
})()}

// ✅ GOOD — dedicated component with explicit props
function ScoreDisplay({ category, scores }: Props) {
  const config = CONFIG[category];
  if (!config) return null;
  const total = config.reduce((sum, f) => sum + (scores[f.key] ?? 0), 0);
  return <table>...</table>;
}
```

IIFE acceptable for ≤2 lines. 10+ lines → always extract to component.

---

## 11 — maxWidth Container: Always Add width: 100%

```tsx
// ❌ BAD — container width depends on content (jumps on tab switch)
<div style={{ maxWidth: 700, margin: "0 auto" }}>

// ✅ GOOD — container always fills available space (max 700px)
<div style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
```

Without `width: 100%`, the div takes the content's intrinsic width — inconsistent when content changes dynamically.

---

## 12 — scroll-margin-top: CSS-Only Sticky Header Offset

```css
/* ❌ BAD — manual JS offset calculation */
/* element.getBoundingClientRect() + window.scrollTo(...) */

/* ✅ GOOD — CSS only, scrollIntoView respects it automatically */
.target-element {
  scroll-margin-top: 100px; /* sticky header height + padding */
}
```

`scrollIntoView({ behavior: "smooth", block: "start" })` automatically accounts for `scroll-margin-top`. Zero JS needed.
