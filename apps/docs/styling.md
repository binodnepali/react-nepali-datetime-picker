# Styling

Web `bs-calendar` follows the [shadcn Calendar](https://ui.shadcn.com/docs/components/base/calendar) slot pattern.

## CSS variables

The default web calendar uses `--cell-size`:

```tsx
<BsCalendar className="[--cell-size:2.75rem]" />
```

## classNames map

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

## Custom day button

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

## Theming

Components use your project's Tailwind theme tokens (`bg-background`, `text-muted-foreground`, `border-input`, etc.). No separate CSS file or Tailwind plugin is required.
