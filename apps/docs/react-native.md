# React Native

Bikram Sambat pickers for Expo / React Native, built for [React Native Reusables](https://reactnativereusables.com/docs) (NativeWind v4, `@/` aliases).

## Prerequisites

- RNR project setup: `components.json`, NativeWind v4, `lib/utils` (`cn`)
- Expo SDK 50+ / React Native 0.74+
- `react-native-safe-area-context` (iOS sheets)
- `react-native-svg` (Android time clock — added with time/datetime items)

Missing RNR `button`, `text`, and `icon` are installed automatically when you add picker items (see [Registry deps](#registry-deps) below).

## Install

Use [@react-native-reusables/cli](https://reactnativereusables.com/docs/cli) with **full `*.json` URLs** — not short names like `@react-nepali-datetime-picker-native/bs-date-picker` (RNR CLI prefixes its own registry and fails).

Install in order: **bs-calendar** → **bs-date-picker** → **bs-time-picker** → **bs-datetime-picker**.

**Hosted** (recommended):

```bash
pnpm dlx @react-native-reusables/cli@latest add \
  https://binodnepali.github.io/react-nepali-datetime-picker/r-native/bs-calendar.json \
  https://binodnepali.github.io/react-nepali-datetime-picker/r-native/bs-date-picker.json \
  https://binodnepali.github.io/react-nepali-datetime-picker/r-native/bs-time-picker.json \
  https://binodnepali.github.io/react-nepali-datetime-picker/r-native/bs-datetime-picker.json \
  --yes
```

Use `--yes` without `--overwrite` so existing files (especially your RNR `button.tsx`) are kept. Add `--overwrite` only when you want to refresh every file.

**Local** (picker repo dev): run `pnpm registry:build`, then point at `apps/docs/public/r-native/*.json` (built JSON with embedded source — not `registry/native/`).

<details>
<summary>shadcn alternative</summary>

Same JSON URLs work with `pnpm dlx shadcn@latest add …`. For namespaced installs, register the registry in `components.json` then use `shadcn add @react-nepali-datetime-picker-native/bs-calendar` (etc.).

</details>

### Registry deps

Picker items declare RNR primitives as **full URLs** in `registryDependencies`:

- `https://reactnativereusables.com/r/nativewind/button.json` (also pulls `text`)
- `https://reactnativereusables.com/r/nativewind/icon.json`

Bare `"button"` in any registry JSON resolves to the **web** shadcn button (`ui.shadcn.com`), not RNR’s `Pressable` button — even when using the RNR CLI.

After sync, confirm lib imports stayed on `@/lib/bs-time-picker` and `@/lib/bs-datetime-picker`.

## Usage

```tsx
import { useState } from "react"
import { BsDatePicker } from "@/components/ui/bs-date-picker"
import { BsTimePicker } from "@/components/ui/bs-time-picker"
import { BsDateTimePicker } from "@/components/ui/bs-datetime-picker"
import { BsCalendar } from "@/components/ui/bs-calendar"
import { toAdDate } from "@/lib/bs-datetime-picker"
import type { BsDate } from "@/lib/bs-day-picker/types"
import type { BsTime, BsDateTime } from "@/lib/bs-time-picker/time/types"

// Date — onValueChange returns BsDate; use getDayAdDate for AD (see /api#bs-ad)
<BsDatePicker value={date} onValueChange={setDate} locale="ne" placeholder="मिति छान्नुहोस्" />

// Time
<BsTimePicker value={time} onValueChange={setTime} locale="ne" cancelLabel="रद्द" confirmLabel="ठीक" />

// Date + time — toAdDate(value) for Gregorian APIs (see /api/pickers#bs-ad-datetime)
<BsDateTimePicker value={dt} onValueChange={setDt} locale="ne" placeholder="मिति र समय छान्नुहोस्" />

// Inline calendar only
<BsCalendar mode="single" selected={date} onSelect={setDate} locale="ne" />
```

Native pickers use `onValueChange` (not web `onChange`). Icons use `lucide-react-native` via the RNR `Icon` wrapper.

## Platform behavior

Metro resolves `.ios.tsx` / `.android.tsx` automatically — install once.

| Component | iOS | Android | Web |
| --------- | --- | ------- | --- |
| **Date** | Sheet + chronological wheel | Material calendar dialog | Popover + grid or `<select>` |
| **Time** | Hour / minute / AM·PM wheels | Material time dialog (clock) | Popover + `<select>` |
| **DateTime** | Date + time wheels in one sheet | Calendar dialog → time dialog | Popover: calendar + selects |
| **Calendar** | Inline grid | Inline grid | Inline grid |

Shared: `bs-wheel-column.tsx` (iOS wheels), `lib/bs-day-picker/` (calendar engine), `lib/bs-time-picker/` (time helpers).

Optional: `@expo/ui/community/picker` for web HTML `<select>` wheels only.

## PortalHost

If pickers sit inside other portal-based overlays, mount a `PortalHost` at the app root per RNR docs.
