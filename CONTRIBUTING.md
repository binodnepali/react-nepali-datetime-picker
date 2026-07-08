# Contributing

## Setup

```bash
pnpm install
pnpm registry:build
pnpm dev
```

## Calendar data

Hamro Patro scrape (optional, needs network):

```bash
pnpm scrape:hamropatro
pnpm test
```

## Registry

After changing files under `registry/web/files` or `registry/native/files`:

```bash
pnpm registry:build
```

Commit updated JSON under `apps/docs/public/r/` and `r-native/`.

## Docs

Edit Markdown under `apps/docs/`. Playground lives in `apps/docs/components/Playground.vue`.

## Tests

```bash
pnpm test
pnpm check-types
```
