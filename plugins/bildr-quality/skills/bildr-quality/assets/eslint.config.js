// ESLint 9 flat config — Bildr stack default.
// Stack: TypeScript strict + React + Vite/Next/CF Workers.
// Copy into project root, then `npm i -D` the matching deps (see README at top of templates dir).
//
// Two modes:
//   npm run lint                    → baseline (recommended rules, fast)
//   BILDR_STRICT=1 npm run lint     → strict-type-checked (catches floating promises,
//                                     unsafe assignment, etc — needs tsconfig.json present)

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

const STRICT_TYPE_CHECK = process.env.BILDR_STRICT === "1";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "build/**",
      ".next/**",
      "coverage/**",
      "node_modules/**",
      "drizzle/**",
      "*.config.js",
      "*.config.ts",
    ],
  },
  js.configs.recommended,
  ...(STRICT_TYPE_CHECK
    ? tseslint.configs.strictTypeChecked
    : tseslint.configs.recommended),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
        // Only attach the TS project service when type-checked rules are active —
        // it's slow and unnecessary for the baseline tier.
        ...(STRICT_TYPE_CHECK && {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        }),
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // ── React core ───────────────────────────────────────────────
      "react/jsx-key": "error",
      "react/jsx-no-target-blank": "error",
      "react/no-array-index-key": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn", // warn — too many false positives for error

      // ── TypeScript ───────────────────────────────────────────────
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "off", // pragmatic — we use ! when DB invariants guarantee
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // ── Code quality ─────────────────────────────────────────────
      // max-lines is the soft fence; max-lines-per-function is the real signal.
      // A 400-line file with 30 small functions is fine; a 200-line file with
      // one 180-line function is not. Keep both.
      "max-lines": [
        "warn",
        { max: 600, skipBlankLines: true, skipComments: true },
      ],
      "max-lines-per-function": [
        "warn",
        { max: 80, skipBlankLines: true, skipComments: true },
      ],
      complexity: ["warn", 15],
      "max-depth": ["warn", 4],
      "max-params": ["warn", 4],

      // ── Correctness ──────────────────────────────────────────────
      eqeqeq: ["error", "always", { null: "ignore" }],
      "prefer-const": "error",
      "no-var": "error",
      "no-throw-literal": "error",
      "no-implicit-coercion": "warn",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],

      // Hungarian copy uses NBSP (U+00A0) intentionally in formatted strings
      // (e.g. `${current} db · ${reserved} foglalt`) and JSX text nodes.
      // Allow it everywhere except where it would clearly be a typo (variable
      // names, between identifiers, etc).
      "no-irregular-whitespace": [
        "error",
        {
          skipStrings: true,
          skipTemplates: true,
          skipComments: true,
          skipJSXText: true,
          skipRegExps: true,
        },
      ],
      // Production validation regex needs control chars to scrub MS Word /
      // PDF-pasted text. Use `// eslint-disable-next-line no-control-regex` at
      // the call site if you need it; default is permissive here.
      "no-control-regex": "warn",
      // Pragmatic — test utils sometimes use bare `Function` type. Warn only.
      "@typescript-eslint/no-unsafe-function-type": "warn",

      // ── Style nudges (low-noise) ─────────────────────────────────
      "object-shorthand": "warn",
      "prefer-template": "warn",
    },
  },
  // ── Test files: relax max-lines + allow console ─────────────────
  {
    files: [
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "**/test/**",
      "**/tests/**",
      "**/__tests__/**",
    ],
    rules: {
      "max-lines": "off",
      "max-lines-per-function": "off",
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      // Type-checked rules that are noisy in test setup / mocks.
      ...(STRICT_TYPE_CHECK && {
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
      }),
    },
  },
  // ── Schema / migration / generated files: relax everything ──────
  {
    files: ["**/schema.ts", "**/migrations/**", "**/generated/**"],
    rules: {
      "max-lines": "off",
      "max-lines-per-function": "off",
      complexity: "off",
    },
  },
);
