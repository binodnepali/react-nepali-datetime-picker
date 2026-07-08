# Getting Started

**react-nepali-datetime-picker** is a registry-first Bikram Sambat calendar. Install components into your project the same way you add [shadcn/ui](https://ui.shadcn.com) components — they are copied into your codebase, not installed from npm.

Registry items: **`bs-calendar`**, **`bs-date-picker`**. Headless engine: **`lib/bs-day-picker/`** (`BsDayPicker`, `useBsCalendar`).

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
# From your shadcn app or UI package root
pnpm dlx shadcn@latest add /absolute/path/to/react-nepali-datetime-picker/apps/docs/public/r/bs-calendar.json --overwrite
pnpm dlx shadcn@latest add /absolute/path/to/react-nepali-datetime-picker/apps/docs/public/r/bs-date-picker.json --overwrite
```

Install **bs-calendar first**, then **bs-date-picker**.

When hosting docs, use the published registry JSON:

```bash
pnpm dlx shadcn@latest add https://your-docs-host/r/bs-calendar.json
pnpm dlx shadcn@latest add https://your-docs-host/r/bs-date-picker.json
```

For namespaced installs over HTTP, register the registry once:

```bash
pnpm dlx shadcn@latest registry add @react-nepali-datetime-picker=https://your-docs-host/r/{name}.json
pnpm dlx shadcn@latest add @react-nepali-datetime-picker/bs-calendar
pnpm dlx shadcn@latest add @react-nepali-datetime-picker/bs-date-picker
```

### Usage

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

### Date picker with popover

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

## React Native

See [React Native](/react-native) for the NativeWind registry install and `PortalHost` notes.

## Headless usage

The copied `lib/bs-day-picker/` folder includes a headless `BsDayPicker` and `useBsCalendar` hook if you want to build a fully custom UI.
