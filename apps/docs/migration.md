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

## Removed in v2

- `TimePicker` / `DateTimePicker` — planned for v2.1
- `StaticDesktopTime`
- `nedtTwPlugin` Tailwind plugin
- npm publish / `dist/style.css`

## Styling migration

v1 required a Tailwind plugin and bundled CSS. v2 components use your existing shadcn theme tokens. Customize via `classNames` on `BsCalendar`.

## Data migration

v2 uses Hamro Patro–sourced `bs-calendar.json` instead of hand-maintained `monthsData`. Re-validate critical dates after migrating.
