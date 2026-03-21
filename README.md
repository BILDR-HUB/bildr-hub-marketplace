# bildr.hub Marketplace

Curated Claude Code plugins by [bildr.hub](https://bildr.hu).

## Plugins

| Plugin | Category | Description |
|--------|----------|-------------|
| `frontend-design` | Design | Premium frontend interfaces with OKLCH colors, typography, theme archetypes, AI slop detection |
| `bildr-hub-identity` | Design | bildr.hub brand identity — design system, document templates, tone guide |
| `bildr-learn` | Productivity | bildr.hub public knowledge base management |
| `security-review` | Security | API security checklist — IDOR, XSS, input validation, RLS, token flows |
| `backend-patterns` | Backend | Drizzle ORM, SQLite/D1, query optimization, tRPC, Hono, CF Workers |
| `react-patterns` | Frontend | Hooks ordering, state sync, optimistic UI, performance pitfalls |
| `ui-ux-pro-max` | Design | **Manual only** — industry-specific design system generator (161 palettes, 57 fonts, 99 UX rules). Based on [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) |

## Installation

```bash
# Add the marketplace
/plugin marketplace add BILDR-HUB/bildr-hub-marketplace

# Install individual plugins
/plugin install security-review@bildr-hub-marketplace
/plugin install backend-patterns@bildr-hub-marketplace
/plugin install react-patterns@bildr-hub-marketplace
```

## Versioning

> **Important:** When updating a skill's content, you MUST bump the version in `plugin.json` — otherwise users won't receive the update due to caching.

```
1.0.0 → 1.0.1  (minor fix, typo, new example)
1.0.0 → 1.1.0  (new section added)
1.0.0 → 2.0.0  (restructure, breaking changes)
```

Version is declared in `.claude-plugin/marketplace.json` under each plugin's `version` field.

## Auto-Update

Third-party marketplaces have auto-update **disabled by default**. Users can enable it:

```bash
/plugin
# → Marketplaces tab → Enable auto-update for bildr-hub-marketplace
```

Manual update:
```bash
claude plugin update security-review@bildr-hub-marketplace
```

## Contributing

Each plugin lives in `skills/<plugin-name>/`:
- `SKILL.md` — main skill instructions (loaded when triggered)
- `reference/` — detailed reference docs (loaded on demand)

When adding or updating a plugin:
1. Edit the skill content in `skills/<name>/`
2. Bump the version in `.claude-plugin/marketplace.json`
3. Commit and push
