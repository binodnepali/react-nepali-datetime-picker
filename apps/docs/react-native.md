# React Native

Native registry items follow [React Native Reusables](https://reactnativereusables.com/docs) conventions. Use the **built** JSON files (with embedded source), same idea as the web install.

## Prerequisites

From your Expo / React Native project:

- `components.json` with `@/` aliases (RNR / shadcn setup)
- NativeWind v4
- RNR primitives: `button`, `text`, `icon`
- `lib/utils` with `cn()` helper
- `react-native-safe-area-context` (iOS date picker bottom sheet)

## Local install (development)

Build the registry in the picker repo (copies core + embeds file content):

```bash
cd /path/to/react-nepali-datetime-picker
pnpm registry:build
```

Install from your Expo project root:

```bash
cd /path/to/your-expo-app

pnpm dlx shadcn@latest add /absolute/path/to/react-nepali-datetime-picker/apps/docs/public/r-native/bs-calendar.json --overwrite

pnpm dlx shadcn@latest add /absolute/path/to/react-nepali-datetime-picker/apps/docs/public/r-native/bs-date-picker.json --overwrite
```

Install **bs-calendar first**, then **bs-date-picker**.

> Use `apps/docs/public/r-native/`, not `registry/native/`. The source JSON only has paths; the built JSON embeds the files the CLI needs.
>
> `@react-native-reusables/cli add` with an absolute path is unreliable (it may treat the path as a remote item). Prefer `shadcn add` with the built `r-native` JSON — RNR projects use the same `components.json` format.

## Hosted install

When docs are deployed ([GitHub Pages](https://binodnepali.github.io/react-nepali-datetime-picker/)):

```bash
pnpm dlx shadcn@latest add https://binodnepali.github.io/react-nepali-datetime-picker/r-native/bs-calendar.json
pnpm dlx shadcn@latest add https://binodnepali.github.io/react-nepali-datetime-picker/r-native/bs-date-picker.json
```

Namespaced install:

```bash
pnpm dlx shadcn@latest registry add @react-nepali-datetime-picker-native=https://binodnepali.github.io/react-nepali-datetime-picker/r-native/{name}.json
pnpm dlx shadcn@latest add @react-nepali-datetime-picker-native/bs-calendar
pnpm dlx shadcn@latest add @react-nepali-datetime-picker-native/bs-date-picker
```

## Usage

```tsx
import { useState } from "react"
import { BsDatePicker } from "@/components/ui/bs-date-picker"
import type { BsDate } from "@/lib/bs-day-picker/types"

export function Example() {
  const [value, setValue] = useState<BsDate>()

  return (
    <BsDatePicker
      value={value}
      onValueChange={setValue}
      locale="ne"
      placeholder="मिति छान्नुहोस्"
    />
  )
}
```

Calendar only:

```tsx
import { BsCalendar, type BsDate } from "@/components/ui/bs-calendar"
```

## Platform files (Metro auto-resolution)

Install once; Expo Metro picks the right file per platform:

| File | Platform | UX |
|------|----------|-----|
| `bs-date-picker.tsx` | iOS, web default | Bottom sheet + Cancel / Confirm |
| `bs-date-picker.android.tsx` | Android | Material dialog trigger |
| `bs-date-picker-dialog.android.tsx` | Android | Material calendar modal |
| `bs-date-picker-wheels.ios.tsx` | iOS | Chronological wheel (`Sun 26 Bai`) |
| `bs-date-picker-wheels.android.tsx` | Android | Fallback wheels (if used) |
| `bs-date-picker-wheels.tsx` | Web | HTML `<select>` dropdowns (optional `@expo/ui/community/picker`) |
| `bs-calendar.tsx` | iOS, web | Inline grid |
| `bs-calendar.android.tsx` | Android | Material calendar grid + year picker |
| `bs-wheel-column.tsx` | iOS, Android | Shared infinite scroll wheel |

## Requirements

- Expo SDK 50+ / React Native 0.74+
- NativeWind v4
- `lucide-react-native` (trigger icon + calendar chevrons)
- `react-native-safe-area-context` (iOS sheet inset)
- `clsx`, `tailwind-merge` (installed by the CLI)
- `bs-calendar` core lib for Bikram Sambat month/day data (install first)
- Optional: `@expo/ui` for web HTML `<select>` wheels only

## Date picker patterns

| Platform | Pattern |
|----------|---------|
| **iOS** | Bottom sheet, native-style chronological date wheel (`weekday day month`), weekday in label |
| **Android** | Material dialog with headline + calendar grid + year grid |
| **Web** | Same sheet shell; three year/month/day `<select>` columns |

`BsCalendar` remains available for inline grid display.

## RNR differences

| Web | Native date picker |
|-----|-------------------|
| Popover + grid | Modal + platform wheels / calendar |
| lucide-react | lucide-react-native via `Icon` wrapper |
| Inherited text styles | Explicit `Text` classes |

| Web | Native calendar (`bs-calendar`) |
|-----|--------------------------------|
| `data-selected` attributes | `selected` prop styling on `Pressable` |
| lucide-react | lucide-react-native via `Icon` wrapper |

## PortalHost

If you embed the calendar inside other portal-based overlays, ensure a `PortalHost` is mounted at the app root per React Native Reusables docs.
