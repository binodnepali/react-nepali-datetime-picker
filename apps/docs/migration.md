# Migration from v1 (npm)

The v1 `react-nepali-datetime-picker` npm package is replaced by registry-copied components.

## Install

| v1 (npm) | v2 (registry) |
|----------|---------------|
| `npm install react-nepali-datetime-picker` | `shadcn add @react-nepali-datetime-picker/bs-calendar` (or direct JSON URL) |
| `import { DatePicker } from 'react-nepali-datetime-picker'` | `import { BsDatePicker } from '@/components/bs-date-picker'` |
| `nedtTwPlugin()` + `dist/style.css` | Tailwind classes in copied components |
| `onDateSelect({ year, month, date })` | `onSelect({ year, month, day })` |

## Type changes

```ts
// v1
type NepaliDate = {
  year: { value: number; label: string }
  month: { value: number; label: string }  // 0-indexed internally
  date: { value: number; label: string; id: string }
}

// v2
type BsDate = {
  year: number
  month: number  // 1-indexed
  day: number
}
```

## Removed in v2 (v1 npm)

- `StaticDesktopTime`
- `nedtTwPlugin` Tailwind plugin
- npm publish / `dist/style.css`

## Time pickers (v2.1)

| v1 | v2 registry |
|----|-------------|
| `TimePicker` | `BsTimePicker` — `shadcn add …/bs-time-picker.json` |
| `DateTimePicker` | `BsDateTimePicker` — `shadcn add …/bs-datetime-picker.json` |

Install order: `bs-calendar` → `bs-date-picker` → `bs-time-picker` → `bs-datetime-picker`.

## Styling migration

v1 required a Tailwind plugin and bundled CSS. v2 components use your existing shadcn theme tokens. Customize via `classNames` on `BsCalendar` or theme CSS variables — see [Styling](/styling).

Time and datetime pickers on Android use `bg-input` / `border-border` for clock contrast; tune `--input` in your theme if the dial blends into the dialog in light mode.

## Data migration

v2 uses Hamro Patro–sourced `bs-calendar.json` instead of hand-maintained `monthsData`. Re-validate critical dates after migrating.
