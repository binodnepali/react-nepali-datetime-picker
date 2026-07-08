# Styling

Components use your project's Tailwind / NativeWind theme tokens (`bg-background`, `text-muted-foreground`, `border-input`, `bg-primary`, etc.). No separate CSS file or Tailwind plugin is required.

## Calendar (`bs-calendar`)

Web `bs-calendar` follows the [shadcn Calendar](https://ui.shadcn.com/docs/components/base/calendar) slot pattern.

### CSS variables

```tsx
<BsCalendar className="[--cell-size:2.75rem]" />
```

### classNames map

Override any slot:

```tsx
<BsCalendar
  classNames={{
    day_button: "rounded-md hover:bg-accent",
    selected: "bg-primary text-primary-foreground",
    today: "border border-primary",
    outside: "text-muted-foreground opacity-50",
  }}
/>
```

### Custom day button

```tsx
<BsCalendar
  components={{
    DayButton: ({ label, selected, onClick }) => (
      <button
        type="button"
        onClick={onClick}
        className={selected ? "bg-primary text-white" : ""}
      >
        {label}
      </button>
    ),
  }}
/>
```

See [BsDayPicker](/api/day-picker) for the full slot list.

## Date picker (`bs-date-picker`)

Web: `className` on the trigger `Button`; popover content inherits popover tokens.

Native:

- iOS sheet — `className` on trigger; wheel columns use shared `BsWheelColumn` styles
- Android Material dialog — headline and grid use `bg-background`, `text-foreground`, `border-border`

## Time picker (`bs-time-picker`)

Web: three `<select>` columns inside a popover (hour, minute, optional AM/PM). Style via your shadcn `Button` trigger and global input/select tokens.

Native:

| Platform | Surface | Theming notes |
| -------- | ------- | ------------- |
| **iOS** | Bottom sheet + wheels | Same wheel styling as date picker |
| **Android** | `BsTimePickerDialog` | Dialog `bg-background`; clock face `bg-input` + `border-border`; hand uses primary teal; selected dial node `bg-primary` |

Android clock hand color is currently fixed in `bs-time-picker-dialog.android.tsx` (`HAND_COLOR`). Override that constant or fork the dialog if you need a different brand color.

## Date + time picker (`bs-datetime-picker`)

Composes date + time pickers. Web popover stacks calendar above time selects. Native iOS uses one sheet with date + time wheels; Android runs calendar dialog then time dialog sequentially.

Shared trigger styling: pass `className` to the root component.

## Cross-platform tokens

For sufficient contrast in light mode (especially Android clock dial vs dialog background), ensure your theme defines distinct values for:

- `--background` (dialog surface)
- `--input` (clock face, inactive digit boxes)
- `--primary` / `--primary-foreground` (selected hour/minute, clock hand)

Yatra apps use a warm off-white background with a slightly darker `input` token — see your `global.css` / `tailwind.css`.
