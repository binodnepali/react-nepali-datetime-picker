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
```
