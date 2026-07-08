# React Native

Native registry items follow [React Native Reusables](https://reactnativereusables.com/docs) conventions. Use the **built** JSON files (with embedded source), same idea as the web install.

## Prerequisites

From your Expo / React Native project:

- `components.json` with `@/` aliases (RNR / shadcn setup)
- NativeWind v4
- RNR primitives: `button`, `text`, `icon`
- `lib/utils` with `cn()` helper
- `react-native-safe-area-context` (iOS bottom sheets)
- `react-native-svg` (Android Material time clock hand — installed with time/datetime items)

## Local install (development)

Build the registry in the picker repo (copies core + embeds file content):

```bash
cd /path/to/react-nepali-datetime-picker
pnpm registry:build
```

Install from your Expo project root:

```bash
REG="/absolute/path/to/react-nepali-datetime-picker/apps/docs/public/r-native"

pnpm dlx shadcn@latest add "$REG/bs-calendar.json" --overwrite
pnpm dlx shadcn@latest add "$REG/bs-date-picker.json" --overwrite
pnpm dlx shadcn@latest add "$REG/bs-time-picker.json" --overwrite
pnpm dlx shadcn@latest add "$REG/bs-datetime-picker.json" --overwrite
```

Install in order: **bs-calendar** → **bs-date-picker** → **bs-time-picker** → **bs-datetime-picker**.

> Use `apps/docs/public/r-native/`, not `registry/native/`. The source JSON only has paths; the built JSON embeds the files the CLI needs.
>
> `@react-native-reusables/cli add` with an absolute path is unreliable (it may treat the path as a remote item). Prefer `shadcn add` with the built `r-native` JSON — RNR projects use the same `components.json` format.

## Hosted install

When docs are deployed ([GitHub Pages](https://binodnepali.github.io/react-nepali-datetime-picker/)):

```bash
pnpm dlx shadcn@latest add https://binodnepali.github.io/react-nepali-datetime-picker/r-native/bs-calendar.json
pnpm dlx shadcn@latest add https://binodnepali.github.io/react-nepali-datetime-picker/r-native/bs-date-picker.json
pnpm dlx shadcn@latest add https://binodnepali.github.io/react-nepali-datetime-picker/r-native/bs-time-picker.json
pnpm dlx shadcn@latest add https://binodnepali.github.io/react-nepali-datetime-picker/r-native/bs-datetime-picker.json
```

Namespaced install:

```bash
pnpm dlx shadcn@latest registry add @react-nepali-datetime-picker-native=https://binodnepali.github.io/react-nepali-datetime-picker/r-native/{name}.json
pnpm dlx shadcn@latest add @react-nepali-datetime-picker-native/bs-calendar
pnpm dlx shadcn@latest add @react-nepali-datetime-picker-native/bs-date-picker
pnpm dlx shadcn@latest add @react-nepali-datetime-picker-native/bs-time-picker
pnpm dlx shadcn@latest add @react-nepali-datetime-picker-native/bs-datetime-picker
```

## Usage

**Date picker**

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

`onValueChange` returns **`BsDate` only**. To get the matching AD date, use `getDayAdDate` — see [BS ↔ AD](/api#bs-ad).

**Time picker**

```tsx
import { useState } from "react"
import { BsTimePicker } from "@/components/ui/bs-time-picker"
import type { BsTime } from "@/lib/bs-time-picker/time/types"

export function Example() {
  const [value, setValue] = useState<BsTime>()

  return (
    <BsTimePicker
      value={value}
      onValueChange={setValue}
      locale="ne"
      cancelLabel="रद्द"
      confirmLabel="ठीक"
    />
  )
}
```

**Date + time picker**

```tsx
import { useState } from "react"
import { BsDateTimePicker } from "@/components/ui/bs-datetime-picker"
import { toAdDate } from "@/lib/bs-datetime-picker"
import type { BsDateTime } from "@/lib/bs-time-picker/time/types"

export function Example() {
  const [value, setValue] = useState<BsDateTime>()

  return (
    <BsDateTimePicker
      value={value}
      onValueChange={setValue}
      locale="ne"
      placeholder="मिति र समय छान्नुहोस्"
    />
  )
}
```

Use `toAdDate(value)` when submitting to APIs that expect a Gregorian `Date` — see [Pickers](/api/pickers#bs-ad-datetime).

**Calendar only**

```tsx
import { BsCalendar, type BsDate } from "@/components/ui/bs-calendar"
```

## Platform files (Metro auto-resolution)

Install once; Expo Metro picks the right file per platform:

### Date

| File | Platform | UX |
|------|----------|-----|
| `bs-date-picker.tsx` | iOS, web default | Bottom sheet + Cancel / Confirm |
| `bs-date-picker.android.tsx` | Android | Material dialog trigger |
| `bs-date-picker-dialog.android.tsx` | Android | Material calendar modal |
| `bs-date-picker-wheels.ios.tsx` | iOS | Chronological wheel (`Sun 26 Bai`) |
| `bs-date-picker-wheels.tsx` | Web | HTML `<select>` dropdowns |

### Time

| File | Platform | UX |
|------|----------|-----|
| `bs-time-picker.tsx` | iOS, web default | Sheet / popover shell |
| `bs-time-picker.android.tsx` | Android | Opens `BsTimePickerDialog` |
| `bs-time-picker-dialog.android.tsx` | Android | Material digital + analog clock |
| `bs-time-picker-wheels.ios.tsx` | iOS | Hour / minute / AM·PM wheels |
| `bs-time-picker-wheels.tsx` | Web | HTML `<select>` columns |

### Date + time

| File | Platform | UX |
|------|----------|-----|
| `bs-datetime-picker.tsx` | iOS, web default | Combined sheet / popover |
| `bs-datetime-picker.android.tsx` | Android | Calendar dialog → time dialog |
| `bs-datetime-picker-wheels.ios.tsx` | iOS | Date wheel + time wheels |
| `bs-datetime-picker-wheels.tsx` | Web | Calendar + time selects |

### Shared

| File | Role |
|------|------|
| `bs-calendar.tsx` / `bs-calendar.android.tsx` | Inline grid |
| `bs-wheel-column.tsx` | iOS / Android infinite scroll wheel |
| `lib/bs-day-picker/` | BS calendar data + headless engine |
| `lib/bs-time-picker/` | Time formatters and helpers |
| `lib/bs-datetime-picker.ts` | `toAdDate`, `formatBsDateTime`, merge helpers |

## Requirements

- Expo SDK 50+ / React Native 0.74+
- NativeWind v4
- `lucide-react-native` (trigger icons)
- `react-native-safe-area-context` (iOS sheet inset)
- `react-native-svg` (Android time clock hand)
- `clsx`, `tailwind-merge` (installed by the CLI)
- `bs-calendar` core lib (install first)
- Optional: `@expo/ui` for web HTML `<select>` wheels only

## UX patterns

| Component | iOS | Android | Web |
| --------- | --- | ------- | --- |
| **Date** | Bottom sheet, chronological date wheel | Material calendar + year grid | Popover + grid or selects |
| **Time** | Hour / minute / AM·PM wheels | Material time dialog (clock) | Popover + selects |
| **DateTime** | Date wheel + time wheels in one sheet | Calendar dialog, then time dialog | Popover: calendar + selects |

`BsCalendar` remains available for inline grid display.

## RNR differences

| Web | Native pickers |
|-----|----------------|
| Popover + grid / selects | Modal + platform wheels / Material dialogs |
| `onChange` | `onValueChange` |
| lucide-react | lucide-react-native via `Icon` wrapper |
| Inherited text styles | Explicit `Text` classes |

## PortalHost

If you embed pickers inside other portal-based overlays, ensure a `PortalHost` is mounted at the app root per React Native Reusables docs.
