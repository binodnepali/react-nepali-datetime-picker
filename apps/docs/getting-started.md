# Getting Started

**react-nepali-datetime-picker** is a registry-first Bikram Sambat calendar and picker suite. Install components into your project the same way you add [shadcn/ui](https://ui.shadcn.com) components — they are copied into your codebase, not installed from npm.

## Registry items

| Item | Description |
| ---- | ----------- |
| **`bs-calendar`** | Inline BS calendar grid + headless `lib/bs-day-picker/` |
| **`bs-date-picker`** | Trigger + popover / sheet / Material dialog |
| **`bs-time-picker`** | 12h/24h time selection |
| **`bs-datetime-picker`** | Combined BS date + time |

**Install order:** `bs-calendar` → `bs-date-picker` → `bs-time-picker` → `bs-datetime-picker` (each step pulls shared libs).

See [API overview](/api) for types and [Pickers](/api/pickers) for props.

## Web (React + Tailwind)

### Prerequisites

- React 18+
- Tailwind CSS
- shadcn/ui `button` and `popover` components

### Install

From the picker repo root, build the registry (embeds file content for the CLI):

```bash
pnpm registry:build
```

Then install from your app or UI package (use the **built** JSON under `apps/docs/public/r/`, not `registry/web/`):

```bash
REG="/absolute/path/to/react-nepali-datetime-picker/apps/docs/public/r"

pnpm dlx shadcn@latest add "$REG/bs-calendar.json" --overwrite
pnpm dlx shadcn@latest add "$REG/bs-date-picker.json" --overwrite
pnpm dlx shadcn@latest add "$REG/bs-time-picker.json" --overwrite
pnpm dlx shadcn@latest add "$REG/bs-datetime-picker.json" --overwrite
```

When docs are deployed ([GitHub Pages](https://binodnepali.github.io/react-nepali-datetime-picker/)):

```bash
pnpm dlx shadcn@latest add https://binodnepali.github.io/react-nepali-datetime-picker/r/bs-calendar.json
pnpm dlx shadcn@latest add https://binodnepali.github.io/react-nepali-datetime-picker/r/bs-date-picker.json
pnpm dlx shadcn@latest add https://binodnepali.github.io/react-nepali-datetime-picker/r/bs-time-picker.json
pnpm dlx shadcn@latest add https://binodnepali.github.io/react-nepali-datetime-picker/r/bs-datetime-picker.json
```

For namespaced installs over HTTP, register the registry once:

```bash
pnpm dlx shadcn@latest registry add @react-nepali-datetime-picker=https://binodnepali.github.io/react-nepali-datetime-picker/r/{name}.json
pnpm dlx shadcn@latest add @react-nepali-datetime-picker/bs-calendar
pnpm dlx shadcn@latest add @react-nepali-datetime-picker/bs-date-picker
pnpm dlx shadcn@latest add @react-nepali-datetime-picker/bs-time-picker
pnpm dlx shadcn@latest add @react-nepali-datetime-picker/bs-datetime-picker
```

### Usage

**Inline calendar**

```tsx
import { useState } from "react"
import { BsCalendar, type BsDate } from "@/components/bs-calendar"

export function Example() {
  const [selected, setSelected] = useState<BsDate>()

  return (
    <BsCalendar
      mode="single"
      locale="ne"
      selected={selected}
      onSelect={setSelected}
      captionLayout="dropdown"
    />
  )
}
```

**Date picker**

```tsx
import { useState } from "react"
import { BsDatePicker } from "@/components/bs-date-picker"
import type { BsDate } from "@/components/bs-calendar"

export function Example() {
  const [value, setValue] = useState<BsDate>()

  return (
    <BsDatePicker
      value={value}
      onChange={setValue}
      locale="ne"
      placeholder="मिति छान्नुहोस्"
    />
  )
}
```

**Time picker**

```tsx
import { useState } from "react"
import { BsTimePicker } from "@/components/bs-time-picker"
import type { BsTime } from "@/lib/bs-time-picker/time/types"

export function Example() {
  const [value, setValue] = useState<BsTime>()

  return (
    <BsTimePicker
      value={value}
      onChange={setValue}
      locale="ne"
      is24Hour={false}
      placeholder="समय छान्नुहोस्"
    />
  )
}
```

**Date + time picker**

```tsx
import { useState } from "react"
import { BsDateTimePicker } from "@/components/bs-datetime-picker"
import { toAdDate } from "@/lib/bs-datetime-picker"
import type { BsDateTime } from "@/lib/bs-time-picker/time/types"

export function Example() {
  const [value, setValue] = useState<BsDateTime>()

  const handleSubmit = () => {
    if (!value) return
    const ad = toAdDate(value) // Gregorian Date for APIs (e.g. trip planner)
    if (!ad) return
    // …
  }

  return (
    <BsDateTimePicker
      value={value}
      onChange={setValue}
      locale="ne"
      placeholder="मिति र समय छान्नुहोस्"
    />
  )
}
```

## React Native

See [React Native](/react-native) for the NativeWind registry install, platform files, and `PortalHost` notes.

## Headless usage

The copied `lib/bs-day-picker/` folder includes a headless [BsDayPicker](/api/day-picker) and `useBsCalendar` hook if you want to build a fully custom UI. Time helpers live under `lib/bs-time-picker/`.
