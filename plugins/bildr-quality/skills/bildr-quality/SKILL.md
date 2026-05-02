---
name: bildr-quality
description: >
  Code quality bootstrap bármely TypeScript projektbe — ESLint 9 flat config + Prettier + husky +
  lint-staged + knip. CSAK explicit meghívásra (/bildr-quality) — soha ne triggerelj automatikusan.
  A skill detektálja a projekt típusát (Next.js, CF Workers, Vite, generic), package manager-t
  (npm, pnpm, yarn, bun), idempotens (nem írja felül a meglévő konfigot kérdés nélkül), baseline-t
  mér (lint warnings, knip dead code, madge circular deps), és felajánlja az opt-in
  strict-type-checked módot. Használd amikor a user lint setup-ot, code quality bootstrapet,
  ESLint+Prettier konfigurálást, vagy a Bildr quality template aktiválását kéri egy projektben.
---

# Bildr Quality — Code Quality Bootstrap

ESLint 9 flat config + Prettier + husky pre-commit + lint-staged + knip beállítása bármely TypeScript projektben. A bundled configok `assets/`-ben vannak.

## Mit állít be a skill

Egy `/bildr-quality` futás után a projektben:

| Eszköz | Funkció |
|---|---|
| **ESLint 9 flat config** | TS strict + React + max-lines 600 + max-lines-per-function 80 + complexity 15 |
| **Prettier** | Double quote, semis, trailing comma all, 80 char width |
| **husky** | Pre-commit hook telepítve |
| **lint-staged** | Staged TS/TSX → ESLint --fix + Prettier --write commit előtt |
| **knip** | Dead code detection (manuális futás) |

És az npm scripts:

```
npm run lint         # eslint . — 0 errors required, warnings ok
npm run lint:strict  # eslint . --max-warnings 0 — CI gate
npm run lint:fix     # eslint . --fix
npm run format       # prettier --write .
npm run format:check # prettier --check .
npm run knip         # dead code report
```

## 1. lépés — Pre-flight ellenőrzés

Mielőtt bármit csinálsz:

1. **`package.json` létezik a projekt rootban?** Ha nem → STOP, közöld a user-rel hogy ez nem TS projekt root.
2. **Git repo?** (`.git/` létezik) Ha nincs → figyelmeztesd a user-t hogy a husky pre-commit hook nem fog működni `git init` nélkül. Kérdezd meg: folytassa, vagy futtasson előbb `git init`-et.
3. **`tsconfig.json` létezik?** Ha nem → figyelmeztetés: a TS-specifikus rule-ok limitáltan működnek. Kérdezd meg: folytassa-e.

## 2. lépés — Projekt típus detekció

Olvasd be a `package.json`-t és a fájlrendszert. Detektáld automatikusan:

| Jel | Típus | Hatás a setupra |
|---|---|---|
| `next.config.{js,ts,mjs}` exists | **Next.js** | Default `.next/**` ignore már beállítva. Ellenőrizd App vs Pages routert (`app/` dir vs `pages/`). |
| `wrangler.{toml,jsonc,json}` exists | **CF Workers** (Hono valószínűsíthető) | A bundled eslint.config.js már a `globals.node`-ot használja — Workers-en `globals.serviceWorker` lehet jobb, de a node default elfogadható kompromisszum. |
| `vite.config.{js,ts}` exists | **Vite** (React/Vue/SPA) | Nincs külön módosítás. |
| `nuxt.config.{js,ts}` exists | **Nuxt** | Default jó. |
| Nincs framework config, csak `package.json` | **Generic Node/TS** | Default jó. |

Mondd meg a user-nek mit detektáltál, **ne kérdezz feleslegesen**.

## 3. lépés — Meglévő setup detekció (idempotency)

Ellenőrizd ezeket, és ha van bármi → **ne írd felül kérdés nélkül**:

| Fájl / mező | Mit tegyél ha már létezik |
|---|---|
| `eslint.config.{js,ts,mjs}` | Olvasd be, hasonlítsd össze az `assets/eslint.config.js`-szel. Ha egyezik → "már beállítva". Ha eltér → mutasd a diff-et és kérdezd: overwrite, merge manually, or skip. |
| `.eslintrc.{js,json,yml}` (legacy) | Figyelmeztesd a user-t: ez ESLint 8 legacy config. A flat config (eslint.config.js) felülírja. Kérdezd: legacy törölhető-e. |
| `prettier.config.{js,json}` vagy `.prettierrc*` | Diff + ask. |
| `lint-staged.config.{js,json}` vagy mező `package.json`-ban | Diff + ask. |
| `knip.{json,jsonc}` | Diff + ask. |
| `.husky/pre-commit` | Nézd meg a tartalmát. Ha már `lint-staged`-et hív → kész. Ha mást → kérdezd a user-t. |
| `package.json` scripts (lint, format, stb.) | Ha létezik és más a parancs → kérdezd: overwrite vagy keep. |

Az **idempotency cél**: ha a user másodszor futtatja a skillt egy már beállított projektben, csak az eltéréseket lássa, ne fusson le minden install újra.

## 4. lépés — Package manager detekció

| Lockfile | Package manager | Install parancs |
|---|---|---|
| `pnpm-lock.yaml` | **pnpm** | `pnpm add -D <pkgs>` |
| `yarn.lock` | **yarn** | `yarn add -D <pkgs>` |
| `bun.lockb` vagy `bun.lock` | **bun** | `bun add -d <pkgs>` |
| `package-lock.json` vagy semmi | **npm** | `npm install --save-dev <pkgs>` |

A `npx` parancsok minden pm-mel működnek (kivéve bun-t — ott `bunx`). A `npm pkg set` szintén minden projektben működik (csak a `package.json`-t szerkeszti).

## 5. lépés — Plan + user confirmation

Mielőtt bármit telepítesz, foglald össze a tervet és kérj engedélyt:

```
Setup terv:
- Projekt típus: Next.js (App Router)
- Package manager: pnpm
- Telepítendő devDependencies: eslint@^9, @eslint/js, typescript-eslint,
  eslint-plugin-react, eslint-plugin-react-hooks, globals, prettier, husky,
  lint-staged, knip
- Másolandó config fájlok: eslint.config.js, prettier.config.js,
  lint-staged.config.js, knip.json
- Husky init + pre-commit hook
- npm scripts hozzáadás (lint, lint:strict, lint:fix, format, format:check, knip)
- Baseline mérés a setup után (lint, knip, madge --circular)

Folytassam?
```

Csak ha "igen" → tovább.

## 6. lépés — Dev dependencies telepítés

A detektált pm-mel:

```bash
# npm
npm install --save-dev eslint@^9 @eslint/js typescript-eslint \
  eslint-plugin-react eslint-plugin-react-hooks globals \
  prettier husky lint-staged knip

# pnpm
pnpm add -D eslint@^9 @eslint/js typescript-eslint \
  eslint-plugin-react eslint-plugin-react-hooks globals \
  prettier husky lint-staged knip

# yarn
yarn add -D eslint@^9 @eslint/js typescript-eslint \
  eslint-plugin-react eslint-plugin-react-hooks globals \
  prettier husky lint-staged knip

# bun
bun add -d eslint@^9 @eslint/js typescript-eslint \
  eslint-plugin-react eslint-plugin-react-hooks globals \
  prettier husky lint-staged knip
```

> **Megjegyzés**: `eslint@^9` pin szükséges, mert az `eslint-plugin-react@7.x` peer-supports csak ESLint 9-ig (2026-04 állapot). Ha az ecosystem-ben az ESLint 10 elterjed, a skillt frissíteni kell.

## 7. lépés — Config fájlok másolása

A bundled configok ennek a SKILL.md fájlnak az `assets/` mappájában vannak. Másold át őket a projekt rootba (a 3. lépésnél tisztáztuk hogy felül lehet írni):

### 7a. Általános configok (mindig)

- `assets/eslint.config.js` → `./eslint.config.js`
- `assets/prettier.config.js` → `./prettier.config.js`
- `assets/lint-staged.config.js` → `./lint-staged.config.js`

> **Megjegyzés**: a bundled `eslint.config.js` `import.meta.dirname`-et használ amikor a `BILDR_STRICT=1` mód aktív. Ez Node 20.11+ kell. Ha a projekt régebbi Node-ot használ (`engines.node` mezőt nézd meg), figyelmeztesd a user-t.

### 7b. Framework-specifikus knip config

A `knip.json` (dead code detection) projekt-layout-függő. **Ne** másold a generikus `knip.json`-t Next.js App Router projektbe — a `app/` mappát nem látja, és hamis "0 unused" baseline-t fog mutatni.

A 2. lépésben detektált projekt típus alapján válaszd a megfelelő bundled configot:

| Projekt típus | Másolandó fájl |
|---|---|
| Next.js App Router (`app/` dir van) | `assets/knip-nextjs-app.json` → `./knip.json` |
| Next.js Pages Router (`pages/` dir van) | `assets/knip-nextjs-pages.json` → `./knip.json` |
| Vite (React/Vue, `vite.config.*`) | `assets/knip-vite.json` → `./knip.json` |
| CF Workers (`wrangler.*`) | `assets/knip-workers.json` → `./knip.json` |
| Generic / nem detektált | `assets/knip.json` → `./knip.json` + figyelmeztesd a user-t hogy customize-olnia kell az `entry` és `project` mezőket |

> **Fontos**: a knip alapból nem hibázik amikor az `entry` glob 0 fájlt match-el — csak hamis "all clean" eredményt ad. A baseline lépésben (10. lépés) jelentsd a user-nek hány fájlt látott a knip ténylegesen, így észrevehető a misconfig.

### 7c. CF Workers ESLint globals override

A bundled `eslint.config.js` `globals.node`-ot használ default-ként. Workers projektben ez **nem ideális** — Workers V8 isolate-on fut, nem Node-on, és a `setImmediate`/`__dirname`/stb. globalokat nem szabadna szabadon megengedni.

Ha **Workers** projekt detektálva (`wrangler.*` exists):

1. Olvasd be a most átmásolt `eslint.config.js`-t
2. A `globals.node` sort cseréld le `globals.serviceWorker`-re a `languageOptions.globals` blokkban:
   ```diff
   globals: {
     ...globals.browser,
   - ...globals.node,
   + ...globals.serviceWorker,
   },
   ```
3. Kérdezd meg a user-t: **"Használsz `nodejs_compat` flag-et a `wrangler.toml`-ban (azaz `process.env`, `Buffer`, stb. Node API-kat hívsz a kódban)? Ha igen, hagyjam meg a `globals.node`-ot is."**
   - Ha igen → mindkettőt rakd be (`...globals.serviceWorker, ...globals.node`)
   - Ha nem → csak `serviceWorker` marad

> **Miért**: A `globals.browser` lefedi a fetch/Response/Request/URL/crypto.subtle Web Standard API-kat (Workers-en is futnak). A `globals.serviceWorker` extra Worker-specifikus globals-okat ad (pl. `addEventListener`, `caches`). A `globals.node` viszont (`process`, `Buffer`, `__dirname`, `setImmediate`) Workers-en csak `nodejs_compat` flag-gel működik — alapból tiltani kell hogy a lint elkapjon hibás használatot.

## 8. lépés — Husky pre-commit hook

```bash
npx husky init   # vagy `pnpm exec husky init`, `bunx husky init`
```

Ez létrehozza a `.husky/` mappát és bejegyzi a prepare script-et a `package.json`-ba.

Aztán írd felül a `.husky/pre-commit`-et:

```bash
npx lint-staged
```

(vagy `pnpm exec lint-staged` / `bunx lint-staged` a pm szerint).

Tedd executable-é: `chmod +x .husky/pre-commit`.

## 9. lépés — npm scripts hozzáadás

A `npm pkg set` parancs **minden pm-mel** működik (csak a `package.json`-t szerkeszti):

```bash
npm pkg set scripts.lint="eslint ."
npm pkg set scripts.lint:strict="eslint . --max-warnings 0"
npm pkg set "scripts.lint:fix"="eslint . --fix"
npm pkg set scripts.format="prettier --write ."
npm pkg set "scripts.format:check"="prettier --check ."
npm pkg set scripts.knip="knip --reporter compact"
```

> **Filozófia**: `lint` warnings-ot enged át (legacy kód baseline-ra van warning), `lint:strict` a CI gate (zero-warning).

## 10. lépés — Baseline mérés

Most futtasd ezeket sorban és gyűjtsd össze a számokat:

1. **Lint baseline**: a detektált pm-mel `<pm> run lint` (ne `lint:strict`! — az exitelne)
   - Számold meg: hány error, hány warning
   - Ha **error > 0**: ne lépj tovább, jelentsd a user-nek hogy a baseline-t fix-elni kell előbb
2. **Knip baseline**: `npx knip --reporter compact` (vagy `bunx`/`pnpm exec`)
   - Számold meg: hány unused export, hány unused file
3. **Madge circular deps**: `npx madge --circular --extensions ts,tsx src/`
   - Hány circular dep
4. **Tests** (ha van test script): `<pm> test` röviden — pass / fail count
   - Ha nincs test script: skip ezt

## 11. lépés — Project CLAUDE.md update

Keresd meg a projekt rootjában a `CLAUDE.md`-t (ha nincs → kérdezd: létrehozzam-e).

Ha **van** `## Code Quality` szekció → skip.

Ha **nincs**: append-eld ezt a szekciót:

```markdown
## Code Quality

ESLint + Prettier + husky setup aktív (`/bildr-quality` skillel beállítva).

Konvenciók (lint enforce-olja):
- max-lines 600/file, max-lines-per-function 80, complexity 15, max-depth 4, max-params 4
- Magyar copy: NBSP (U+00A0) megengedett string template-ben és JSX text-ben
- `console.log` tilos — `console.warn`, `console.error`, `console.info` használható
- `import type { ... }` ahol type-only érték (consistent-type-imports rule)
- `===` mindig (kivéve `== null` ami null+undefined-ot is fog — engedélyezett)

Ha a kód átlépi a fenti limiteket: split / extract function. **Ne** `eslint-disable`-ezz — alakítsd át a kódot.

Quality gate parancsok:
- `<pm> run lint` — fejlesztés közbeni gyors ellenőrzés (warnings OK)
- `<pm> run lint:strict` — CI gate (0 warning kötelező)
- `<pm> run knip` — dead code report (manuális, ad-hoc)
```

A `<pm>`-et cseréld le a detektált package manager-re (npm / pnpm / yarn / bun).

## 12. lépés — Opt-in: strict-type-checked mód

Kérdezd meg a user-t:

**"Akarod a strict-type-checked módot is bekapcsolni? Ez a typescript-eslint legszigorúbb tier-je — floating promises, unsafe assignment, és más type-checked rule-okat aktivál. Lassabb (a TS type info-t használja lint közben), és sok új warning lesz az első futáson. CI-be érdemes (külön script-ként), nem default-nak."**

Ha **igen**:

1. Ellenőrizd hogy a `tsconfig.json` `strict: true`-val rendelkezik-e
2. Adj hozzá egy `lint:typed` script-et:
   ```bash
   npm pkg set "scripts.lint:typed"="BILDR_STRICT=1 eslint ."
   npm pkg set "scripts.lint:typed:strict"="BILDR_STRICT=1 eslint . --max-warnings 0"
   ```
3. Futtasd a baseline-t újra: `BILDR_STRICT=1 <pm> run lint`
4. Jelentsd: hány új warning a strict módban

Ha **nem**: skip, csak említsd hogy a `BILDR_STRICT=1 <pm> run lint` később elérhető.

## 13. lépés — Végső jelentés

Foglald össze a user-nek így (vagy hasonló formában):

```
/bildr-quality setup complete

Projekt típus: Next.js (App Router)
Package manager: pnpm

Telepítve:
✓ ESLint 9 + typescript-eslint + react plugins
✓ Prettier
✓ husky + lint-staged (pre-commit hook aktív)
✓ knip

Baseline:
- Lint: 0 errors, 47 warnings (legacy kód, OK)
- Knip: 8 unused exports, 1 unused file
- Madge: 0 circular deps
- Tests: 423/423 green

CLAUDE.md: ## Code Quality szekció hozzáadva

Strict-type-checked mód: opt-in, BILDR_STRICT=1 npm run lint paranccsal aktiválható

Következő lépések (manuális):
1. Futtasd egyszer: pnpm run format — ezzel az egész codebase-t Prettier-formázza
2. Commitold ezt egy "style: format codebase" commit-tal
3. Az új devDependencies + a 4 config fájl + .husky/ + package.json scripts változás commitold
```

## Edge cases

- **Monorepo (workspace)**: ha `pnpm-workspace.yaml` vagy `workspaces` mező a `package.json`-ban → kérdezd: root-ra installáld a quality eszközöket, vagy egy konkrét workspace-re? Default: root + a workspace-eket lefedi a glob.
- **Bun runtime**: a bundled configok `import.meta.dirname`-et használnak amikor STRICT mód aktív — Bun ezt 1.1+ támogatja. Default módban nincs probléma.
- **Sem `src/` mappa**: a `knip.json` `entry`-ben felsorolt fájlok mind src-en belül vannak. Ha a projekt másképp strukturált (`app/`, `pages/`, `lib/`), a knip warnolni fog "no entry files matched". Ilyenkor a setup után kérdezd a user-t hogy testre szabja-e a `knip.json` `entry` és `project` mezőit.
- **Cloudflare Workers globals**: a `globals.node` (default) helyett a `globals.serviceWorker` lehetne pontosabb — ha a user ezt fontosnak tartja, projekt-szinten override-olható az `eslint.config.js` aljához egy plusz blokkal. Default elfogadható kompromisszum.
