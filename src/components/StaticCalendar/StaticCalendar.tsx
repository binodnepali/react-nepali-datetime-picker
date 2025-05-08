import { cn } from "@/plugins/twMerge";

import type { CalendarProps } from "../Calendar/Calendar";
import { Calendar } from "../Calendar/Calendar";

export const StaticCalendar = ({ className = "", ...rest }: CalendarProps) => (
  <Calendar
    className={cn(
      "nedt:border nedt:border-primary nedt:bg-base-100 nedt:text-base-content nedt:p-2 md:nedt:p-4 nedt:rounded-md",
      className,
    )}
    {...rest}
  />
);
