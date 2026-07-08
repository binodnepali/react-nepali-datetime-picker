# react-nepali-datetime-picker

Registry-first **Bikram Sambat (BS)** date pickers for React (web) and React Native (Expo). Copy components into your app with the shadcn CLI — no npm runtime dependency.

The headless calendar engine lives in **`lib/bs-day-picker/`** (`BsDayPicker`, `useBsCalendar`). Registry items are **`bs-calendar`** and **`bs-date-picker`**.

## Quick start

```bash
git clone https://github.com/binodnepali/react-nepali-datetime-picker.git
cd react-nepali-datetime-picker
pnpm install
pnpm registry:build
pnpm dev
```

Docs: [Getting started](./apps/docs/getting-started.md)

## Install in your app

After hosting `apps/docs/public/r/` (web) or `r-native/` (Expo):

```json
{
  "registries": {
    "@react-nepali-datetime-picker": "https://your-docs-host/r/{name}.json"
  }
}
```

```bash
pnpm dlx shadcn@latest add @react-nepali-datetime-picker/bs-calendar
pnpm dlx shadcn@latest add @react-nepali-datetime-picker/bs-date-picker
```

Expo / React Native: use `@react-nepali-datetime-picker-native` → `r-native/{name}.json`. See [React Native guide](./apps/docs/react-native.md).

## Monorepo

| Path | Purpose |
|------|---------|
| `packages/core` | `@react-nepali-datetime-picker/core` — BS calendar data + headless hook |
| `registry/web`, `registry/native` | shadcn registry sources |
| `apps/docs` | VitePress site + hosted registry JSON |
| `scripts/scrape-hamropatro.mjs` | Regenerate `bs-calendar.json` from Hamro Patro |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Docs dev server |
| `pnpm registry:build` | Build web + native registry JSON |
| `pnpm scrape:hamropatro` | Refresh calendar data (2000–2089 BS) |
| `pnpm test` | Vitest (`packages/core`) |

## License

MIT
