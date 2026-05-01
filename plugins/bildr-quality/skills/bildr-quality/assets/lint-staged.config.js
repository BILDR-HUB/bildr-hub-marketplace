// lint-staged — runs ESLint + Prettier on staged files only (fast pre-commit).
// Auto-fixes what it can. Blocks the commit only on ESLint errors (warnings
// are allowed because legacy code carries baseline warnings — strict-zero
// would prevent any commit touching legacy files).
//
// To enforce zero-warning on a per-PR basis, run `npm run lint:strict`.

/** @type {import("lint-staged").Configuration} */
export default {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{js,jsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml,css}": ["prettier --write"],
};
