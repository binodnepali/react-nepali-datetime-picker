# react-nepali-datetime-picker — agent guide

**Product docs:** hosted at [binodnepali.github.io/react-nepali-datetime-picker](https://binodnepali.github.io/react-nepali-datetime-picker/) — install guides, API, styling. This file is **how to work in the repo**.

**Workspace:** `react-nepali-datetime-picker` · **Node:** >=22 · **pnpm:** 10.28.0 ·
**Version:** 2.2.0 (release-please on root `package.json`, not npm publish)

**Model:** Registry-first Bikram Sambat pickers — consumers copy components via **shadcn CLI**; there is no runtime npm package.

**Last reviewed**: July 12, 2026

## What this repo ships

| Surface | Registry path | Install namespace |
|---------|---------------|-------------------|
| **Web** (React + Tailwind + shadcn) | `apps/docs/public/r/` | `@react-nepali-datetime-picker` |
| **Native** (Expo + NativeWind + RNR) | `apps/docs/public/r-native/` | `@react-nepali-datetime-picker-native` |

**Registry items (install order):** `bs-calendar` → `bs-date-picker` → `bs-time-picker` → `bs-datetime-picker`. Web also has **`popover`** (picker shell; pulled as `registryDependency`).

## Layout

```
react-nepali-datetime-picker/
├── packages/core/              # Headless BS engine (private; copied into registry)
├── registry/web/files/         # Web shadcn UI sources (edit + registry:build)
├── registry/native/files/      # Native platform sources (.ios.tsx / .android.tsx)
├── apps/docs/                  # VitePress site + public/r + public/r-native
├── scripts/build-registry.mjs  # Core sync + manifest + shadcn build
└── package.json
```

## Workspace packages

| Package | Path | Role |
|---------|------|------|
| `@react-nepali-datetime-picker/core` | `packages/core` | `BsDayPicker`, `useBsCalendar`, BS↔AD data, time helpers — **source of truth** |
| `@react-nepali-datetime-picker/docs` | `apps/docs` | VitePress documentation |

## Commands

```bash
pnpm install
pnpm registry:build          # Required after core/registry source changes
pnpm dev                     # VitePress docs (local)
pnpm registry:serve          # Static host apps/docs/public on :4310 (local registry JSON)
pnpm test                    # Vitest (packages/core)
pnpm check-types             # tsc in packages/core
pnpm lint                    # ESLint on packages/core/src only
pnpm release:check           # test + types + registry:build + verify committed public/r*
```

**Calendar data** (maintainers): `pnpm data:scrape` → `pnpm data:build` → `pnpm data:validate` → `pnpm registry:build`. See `CONTRIBUTING.md`, `apps/docs/data.md`.

## Registry pipeline (`pnpm registry:build`)

1. **Copy core** — `packages/core/src` → `registry/{web,native}/files/lib/bs-day-picker/` (+ `time/*` with import rewrites). Native **excludes** web-only `bs-day-picker.tsx` (native has its own under `registry/native/files/lib/bs-day-picker/`).
2. **Write manifests** — `registry/{web,native}/registry.json` + per-item `*.json`.
3. **Embed files** — `shadcn build` → `apps/docs/public/r/` and `r-native/`.

**Always commit** rebuilt JSON under `apps/docs/public/r*` when registry sources change. CI `release:check` fails if they are stale.

**Install from built output only** — use `apps/docs/public/r/*.json`, not raw `registry/web/*.json` (no embedded file content).

### Hosted registry URLs

```
https://binodnepali.github.io/react-nepali-datetime-picker/r/{name}.json
https://binodnepali.github.io/react-nepali-datetime-picker/r-native/{name}.json
```

Local dev: `pnpm registry:serve` then point consumer `components.json` at `http://localhost:4310/r/{name}.json`.

## Where to edit

| Task | Location |
|------|----------|
| BS calendar logic, grid, selection, formatters | `packages/core/src/` — then `pnpm registry:build` |
| Web calendar / picker UI | `registry/web/files/components/` (+ `components/ui/bs-calendar.tsx`, `popover.tsx`) |
| Web time selects | `registry/web/files/components/bs-time-selects.tsx` |
| Native wheels, sheets, Material dialogs | `registry/native/files/components/ui/` |
| Native-only day picker engine | `registry/native/files/lib/bs-day-picker/bs-day-picker.tsx` |
| Registry item list / deps | `scripts/build-registry.mjs` |
| User-facing docs | `apps/docs/*.md`, `apps/docs/api/` |
| Playground | `apps/docs/components/Playground.vue` |

**Do not** edit copied files under `registry/*/files/lib/bs-day-picker/` by hand for logic that belongs in core — `registry:build` overwrites them from `packages/core/src`.

## Web conventions (shadcn)

- **Style:** `components.json` — new-york, CSS variables, `lucide` icons.
- **Theme:** project Tailwind tokens (`bg-background`, `text-primary`, …) — no v1 Tailwind plugin.
- **Month grid:** `BsDayPicker` uses a **flex row/column grid** (`div` + `role="grid"`), not `<table>`. Week rows need `mt-2 flex w-full`; weekday/day cells use `flex-1`. Required for Safari column spacing.
- **`--cell-size`:** use explicit `[--cell-size:2rem]` on calendar root (not `--spacing(8)` alone).
- **`popover` item:** `data-slot="popover-content"` + `overflow-hidden` on `PopoverContent`.
- **Time UI:** `bs-time-selects` uses shadcn `Select`; datetime picker shows **Time / समय** and **OK / ठीक**.
- **Callbacks:** `onChange` / `onSelect`.
- **Cross-picker imports** in registry sources: relative paths (`../../lib/bs-time-picker`) so shadcn does not rewrite to `@/components/ui/…`.

## Native conventions (RNR + NativeWind)

- **Platform files:** Metro resolves `.ios.tsx` / `.android.tsx` automatically.
- **iOS:** `bs-wheel-sheet` + wheel columns; **Android:** Material calendar / time dialogs.
- **`registryDependencies`:** full RNR URLs (`reactnativereusables.com/r/nativewind/button.json`, `icon.json`) — never bare `"button"`.
- **RNR CLI:** use full hosted `https://…/r-native/*.json` URLs; short names fail. Local dev: `shadcn add` with absolute paths to built JSON.
- **Callbacks:** `onValueChange` (not `onChange`).
- **`PortalHost`:** required at app root when pickers nest inside other portal overlays.

## i18n

- `BsLocale = 'en' | 'ne'` via `locale` prop on all pickers.
- BS months are **1-indexed** (Baishakh = 1).
- Time stored internally as 24h; `is24Hour` hides AM/PM UI.
- See `apps/docs/localization.md`.

## Consumer install (downstream apps)

After `pnpm registry:build`, consumers install from **built** JSON under `apps/docs/public/`:

**Web** — register in `components.json`, then:

```bash
pnpm dlx shadcn@latest add @react-nepali-datetime-picker/bs-calendar
pnpm dlx shadcn@latest add @react-nepali-datetime-picker/bs-date-picker
# … bs-time-picker, bs-datetime-picker
```

Or use hosted/full file URLs — see `apps/docs/getting-started.md`.

**Native** — full `https://…/r-native/*.json` URLs with RNR CLI or `shadcn add` with absolute paths to built JSON. See `apps/docs/react-native.md`.

**Local registry dev:** `pnpm registry:serve` (port 4310), then point `components.json` at `http://localhost:4310/r/{name}.json`.

App-specific helpers copied outside the registry (formatters, wrappers) live in the consumer repo and are not overwritten by `shadcn add`.

## Testing and CI

- Unit tests: `packages/core` (`pattern.test.ts`, `calendar-grid.test.ts`).
- PR / `main`: `.github/workflows/ci.yml` runs `pnpm lint` + `pnpm release:check`.
- Calendar data PRs: `validate-calendar-data.yml`.

## Releases

- **release-please** on `main` — semver on root `package.json`, git tags, GitHub Releases (not npm).
- Conventional commits: `feat:`, `fix:`, `data:` (calendar refresh), `feat!:` for breaking.
- Squash-merge PR titles must follow Conventional Commits (see `CONTRIBUTING.md`, `VERSIONING.md`).
- Merge Release PR only after `apps/docs/public/r*` are committed on `main`.

## Related documentation

| Doc | Path |
|-----|------|
| README | `README.md` |
| Contributing | `CONTRIBUTING.md` |
| Versioning | `VERSIONING.md` |
| Getting started (web) | `apps/docs/getting-started.md` |
| React Native | `apps/docs/react-native.md` |
| Styling | `apps/docs/styling.md` |
| API | `apps/docs/api.md`, `apps/docs/api/` |
| Data / Hamro Patro | `apps/docs/data.md` |
| Migration v1→v2 | `apps/docs/migration.md` |

## Agent tips

1. **Logic vs UI** — calendar math in `packages/core`; styled shells in `registry/*/files`.
2. **Always `registry:build`** after core or registry file edits; commit `public/r*`.
3. **Safari / flex grid** — do not revert week rows to empty classes or reintroduce `<table>` + `flex-1` on cells.
4. **PR autofix bots** — review automated commits; semantic `role="grid"` is fine; removing `flex w-full` from `week` breaks Safari layout.
5. **Native lint** — `BsWheelRow` uses a keyed inner component (`key={flatChildren.length}`) to reset layout without `setState` in `useEffect`.

---

**Last reviewed**: July 12, 2026
