# BsDayPicker

The headless primitive mirrors the minimal [React DayPicker](https://daypicker.dev/) API. Install via **`bs-calendar`**; see [API overview](/api) for `BsDate` and [BS ↔ AD](/api#bs-ad).

## `BsDayPicker` props

| Prop              | Type                                | Default    | Description                                          |
| ----------------- | ----------------------------------- | ---------- | ---------------------------------------------------- |
| `mode`            | `"single" \| "multiple" \| "range"` | `"single"` | v1 implements `single` only                          |
| `selected`        | `BsDate \| undefined`               | —          | Selected date                                        |
| `onSelect`        | `(date?: BsDate) => void`           | —          | Selection callback (BS only — see [BS ↔ AD](/api#bs-ad)) |
| `locale`          | `"en" \| "ne"`                      | `"ne"`     | Labels and digit formatting                          |
| `month`           | `{ year, month }`                   | today      | Visible month                                        |
| `onMonthChange`   | `(month) => void`                   | —          | Month navigation callback                            |
| `captionLayout`   | `"label" \| "dropdown"`             | `"label"`  | Caption UI                                           |
| `showOutsideDays` | `boolean`                           | `true`     | Show adjacent-month days                             |
| `disabled`        | `boolean \| (date) => boolean`      | —          | Disable days                                         |
| `className`       | `string`                            | —          | Root class                                           |
| `classNames`      | `BsDayPickerClassNames`             | —          | Slot class map                                       |
| `components`      | `BsDayPickerComponents`             | —          | Sub-component overrides                              |
| `footer`          | `ReactNode`                         | —          | Footer below grid                                    |

## `useBsCalendar`

```ts
const {
  month,
  weeks,
  weekdayLabels,
  years,
  months,
  goToPreviousMonth,
  goToNextMonth,
  setMonth,
  selectDate,
} = useBsCalendar({
  locale: "ne",
  month: { year: 2083, month: 1 },
  selected,
  onSelect,
});
```

## Related

- [BsDatePicker](/api/pickers#bsdatepicker) — trigger + popover/dialog wrapper
- [Pickers](/api/pickers) — time and datetime components
