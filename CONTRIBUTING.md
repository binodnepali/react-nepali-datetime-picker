# Contributing

## Setup

```bash
pnpm install
pnpm registry:build
pnpm dev
```

## Calendar data

Hamro Patro is the source of truth for BS month lengths and BS↔AD mapping. Month day counts can change when Hamro Patro corrects a year — refresh data manually; do **not** scrape on every docs deploy.

### Local refresh

```bash
# Near-term years (recommended); fills .cache/hamropatro/ then merges
pnpm data:scrape -- --years 2080-2089
pnpm data:build
pnpm data:validate
pnpm test
pnpm registry:build
```

Full range (slow, ~1000 requests):

```bash
pnpm data:scrape -- --years 2000-2089
pnpm data:build
pnpm data:validate
```

### Data release (maintainers)

1. **Actions → Refresh calendar data → Run workflow**
   - Default years: `2080-2089` (adjust as needed)
   - Opens a PR with updated `bs-calendar.json` and rebuilt registry JSON
2. **Review the PR** — focus on `daysInMonth` and AD date shifts
3. **Merge to `main`** — docs deploy runs separately; registry JSON updates go out with the merge

Suggested schedule: before Baishakh 1 (Nepali New Year) or when Hamro Patro publishes corrections.

## Registry

After changing files under `registry/web/files` or `registry/native/files`:

```bash
pnpm registry:build
```

Commit updated JSON under `apps/docs/public/r/` and `r-native/`.

## Docs

Edit Markdown under `apps/docs/`. Playground lives in `apps/docs/components/Playground.vue`.

Docs deploy to GitHub Pages on push to `main` (`.github/workflows/docs.yml`). Enable **Settings → Pages → Source: GitHub Actions** once after merge.

## Tests

```bash
pnpm test
pnpm check-types
pnpm release:check
```

## Versioning and releases

See [VERSIONING.md](./VERSIONING.md).

### Conventional commits

Use [Conventional Commits](https://www.conventionalcommits.org/) on `main` so release-please can build the Release PR changelog:

- `feat:` — new registry items, props, tokens (minor)
- `fix:` — bug fixes (patch)
- `data:` — Hamro Patro calendar refresh (patch; changelog **Data** section)
- `feat!:` / `BREAKING CHANGE:` — major

**Squash merge:** GitHub uses the **PR title** as the commit message on `main`. Set the PR title to a conventional commit (e.g. `feat: improve BS wheel picker layout and haptics`), not a free-form sentence like `Enhance UI components…`. CI checks PR titles on pull requests.

Hidden types on `main` (`docs:`, `chore:`, `ci:`, …) do not trigger a Release PR bump by themselves.

### Maintainer release (release-please)

1. Merge feature PRs to `main` (with conventional commits).
2. Run `pnpm registry:build` if needed; commit `apps/docs/public/r/` and `r-native/` in the same PR.
3. **release-please** opens or updates a **Release PR** (e.g. `chore(main): release 2.1.0`).
4. Review the Release PR — CI runs `pnpm release:check`.
5. **Merge the Release PR** when ready → tag `vX.Y.Z` + GitHub Release.
6. **Deploy docs** publishes registry JSON to GitHub Pages on push to `main`.

See [VERSIONING.md](./VERSIONING.md) for bootstrap notes (`2.0.0` baseline, `bootstrap-sha`).
