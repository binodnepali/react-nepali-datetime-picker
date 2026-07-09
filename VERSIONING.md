# Versioning

This repo ships a **registry-first** library (shadcn copy-in). Versioning is **one semver line** on the root `package.json`, published as **git tags** and **GitHub Releases** — not npm.

## Tooling

- **[release-please](https://github.com/googleapis/release-please)** — on every push to `main`, opens or updates a **Release PR** with `CHANGELOG.md` + version bump. Merge that PR → tag `vX.Y.Z` + GitHub Release.
- Config: `release-please-config.json`, `.release-please-manifest.json`
- Pre-merge gate: `pnpm release:check` (test, types, `registry:build`, registry JSON must be committed) — runs in CI on every PR

## Semver

| Bump | Examples |
|------|----------|
| **Major** | Breaking `BsDate` / props / pattern tokens, registry path changes (`feat!:` or `BREAKING CHANGE:`) |
| **Minor** | New registry items, optional props, new format tokens (`feat:`) |
| **Patch** | Bug fixes, styling, Hamro Patro data corrections (`fix:`, `data:`) |

Use commit type `data:` for calendar-only changes (changelog **Data** section).

## Release flow

```text
feat/fix commits on main
        ↓
release-please opens/updates "Release PR"
        ↓
you review Release PR (CI runs release:check)
        ↓
merge Release PR
        ↓
release-please tags vX.Y.Z + creates GitHub Release
        ↓
Deploy docs publishes registry JSON to GitHub Pages
```

1. Merge features to `main` with [Conventional Commits](#commit-message-format).
2. Ensure registry JSON is current: `pnpm registry:build` and commit `apps/docs/public/r/` + `r-native/` in the feature PR.
3. **release-please** bot opens a PR titled like `chore(main): release 2.1.0` — review changelog and version.
4. **Merge the Release PR** when ready to ship.
5. On the next `main` push, release-please creates the git tag and [GitHub Release](https://github.com/binodnepali/react-nepali-datetime-picker/releases).

You control **when** to ship by choosing when to merge the Release PR. Commits keep accumulating on `main` until you do.

### Bootstrap (v2)

| Setting | Value | Purpose |
|---------|-------|---------|
| `.release-please-manifest.json` | `"2.0.0"` | Last shipped version (registry-first baseline) |
| `bootstrap-sha` in config | `41293c8…` | Only commits **after** v2.0.0 docs land count toward the next release |

Remove `bootstrap-sha` from `release-please-config.json` after the **first** Release PR merges.

### Branch protection

- Allow **release-please[bot]** (or `github-actions[bot]`) to open and update Release PRs.
- If workflows do not run on bot PRs, use a [PAT](https://github.com/googleapis/release-please-action#github-credentials) instead of `GITHUB_TOKEN` in `.github/workflows/release-please.yml`.

## Verify before merge

```bash
pnpm release:check
```

## Commit message format

```
<type>(<optional scope>): <description>

feat: add formatPattern to bs-datetime-picker
fix: android clock hand alignment
data: refresh Hamro Patro years 2080-2089
feat!: rename BsDate.day to BsDate.date
```

Hidden types (no changelog section): `docs`, `chore`, `ci`, `test`, `refactor`, `style`, `build`.

## Version history

| Tag | Meaning |
|-----|---------|
| `v1.x` | Legacy npm package |
| `v2.0.0` | Registry-first rewrite (changelog backfill; no git tag) |
| `v2.1.0+` | Pattern formatting, release-please, CI |

Last v1 tag: `v1.0.2`. First automated release tag: `react-nepali-datetime-picker-v2.1.0`.

### One-time 2.0.0 backfill

v2 landed on `main` before release-please. The **2.0.0** changelog section was written manually so the registry rewrite is not buried in a small 2.1.0 entry. Future releases stay release-please–generated; editing **past** sections is safe.
