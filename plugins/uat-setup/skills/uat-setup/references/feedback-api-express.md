# Feedback API — Express / Hono / Fastify Reference

Ez a referencia a feedback widget backend API-ját tartalmazza **nem-Next.js** projektek számára.

## Express implementáció

### Drizzle ORM

```typescript
// server/routes/feedback.ts
import { Router } from "express";
import { db } from "../db"; // a projekt Drizzle kliense
import { feedback } from "../db/schema"; // a feedback tábla
import { desc, eq } from "drizzle-orm";

const router = Router();
const VALID_TYPES = ["bug", "feature", "question"] as const;

router.post("/api/feedback", async (req, res) => {
  try {
    const { type, message, pageUrl, userAgent } = req.body;

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: "Invalid feedback type" });
    }
    const trimmed = (message ?? "").toString().trim();
    if (!trimmed || trimmed.length > 5000) {
      return res.status(400).json({ error: "Invalid message" });
    }

    const [inserted] = await db
      .insert(feedback)
      .values({ type, message: trimmed, pageUrl, userAgent })
      .returning({ id: feedback.id });

    res.status(201).json({ id: inserted.id });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/feedback", async (req, res) => {
  try {
    const { status } = req.query;
    const items = await db
      .select()
      .from(feedback)
      .where(status ? eq(feedback.status, String(status)) : undefined)
      .orderBy(desc(feedback.createdAt));

    // Drizzle timestamp → Date, serialize for JSON
    res.json(items.map((item) => ({
      ...item,
      createdAt: item.createdAt?.toISOString(),
    })));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
```

### Prisma ORM

```typescript
// server/routes/feedback.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();
const VALID_TYPES = ["bug", "feature", "question"] as const;

router.post("/api/feedback", async (req, res) => {
  try {
    const { type, message, pageUrl, userAgent } = req.body;

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: "Invalid feedback type" });
    }
    const trimmed = (message ?? "").toString().trim();
    if (!trimmed || trimmed.length > 5000) {
      return res.status(400).json({ error: "Invalid message" });
    }

    const created = await prisma.feedback.create({
      data: { type, message: trimmed, pageUrl, userAgent },
    });

    res.status(201).json({ id: created.id });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/feedback", async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status: String(status) } : {};
    const items = await prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
```

### Route regisztráció

```typescript
// server/index.ts (vagy app.ts)
import express from "express";
import feedbackRouter from "./routes/feedback";

const app = express();
app.use(express.json());
app.use(feedbackRouter);
// ... egyéb route-ok
```

## Hono implementáció

```typescript
// server/routes/feedback.ts
import { Hono } from "hono";
import { db } from "../db";
import { feedback } from "../db/schema";
import { desc, eq } from "drizzle-orm";

const app = new Hono();
const VALID_TYPES = ["bug", "feature", "question"] as const;

app.post("/api/feedback", async (c) => {
  const { type, message, pageUrl, userAgent } = await c.req.json();

  if (!VALID_TYPES.includes(type)) {
    return c.json({ error: "Invalid feedback type" }, 400);
  }
  const trimmed = (message ?? "").toString().trim();
  if (!trimmed || trimmed.length > 5000) {
    return c.json({ error: "Invalid message" }, 400);
  }

  const [inserted] = await db
    .insert(feedback)
    .values({ type, message: trimmed, pageUrl, userAgent })
    .returning({ id: feedback.id });

  return c.json({ id: inserted.id }, 201);
});

app.get("/api/feedback", async (c) => {
  const status = c.req.query("status");
  const items = await db
    .select()
    .from(feedback)
    .where(status ? eq(feedback.status, status) : undefined)
    .orderBy(desc(feedback.createdAt));

  return c.json(items.map((item) => ({
    ...item,
    createdAt: item.createdAt?.toISOString(),
  })));
});

export default app;
```

## SPA + külön backend: Proxy konfiguráció

Ha a frontend (Vite dev server) és a backend különböző porton fut, a widget `fetch("/api/feedback")` hívása nem fog működni proxy nélkül.

### Vite proxy (dev módhoz)

```typescript
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001", // a backend port
        changeOrigin: true,
      },
    },
  },
});
```

### Produkcióban

Produkciós környezetben a proxy-t a hosting platform kezeli:
- **Nginx**: `proxy_pass` a backend-re
- **Vercel**: `vercel.json` rewrites
- **Cloudflare**: Workers route vagy Page Rules

Alternatíva: env-based API URL a widget-ben:
```typescript
const API_BASE = import.meta.env.VITE_API_URL || "";
fetch(`${API_BASE}/api/feedback`, { ... });
```

## Auth integráció

Ha a projektben van auth middleware (JWT, session, stb.), a feedback endpoint-ot is védd meg:

```typescript
// Express middleware példa
import { authMiddleware } from "../middleware/auth";

router.post("/api/feedback", authMiddleware, async (req, res) => {
  // ... a handler
});
```

A widget kliens oldalon nem kell külön auth kezelés — a meglévő cookie/token automatikusan megy a fetch kéréssel (same-origin).
