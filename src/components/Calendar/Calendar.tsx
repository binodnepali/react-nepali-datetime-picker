import ExpandMoreIcon from "@assets/More.svg";
import NextIcon from "@assets/Next.svg";
import PrevIcon from "@assets/Prev.svg";
import { useNepaliCalendar } from "@hooks/useNepaliCalendar";
import { Button } from "@ui/Button/Button";
import type { HTMLAttributes } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/plugins/twMerge";
import type { Language } from "@/types/Language";
import type { NepaliDate } from "@/types/NepaliDate";

export interface CalendarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  lang?: Language;
  selectedDate?: NepaliDate;
  openYearSelector?: boolean;
  onDateSelect?: (date: NepaliDate) => void;
}

export const Calendar = ({
  className = "",
  lang = "ne",
  selectedDate,
  onDateSelect,
  openYearSelector = false,
  ...rest
}: CalendarProps) => {
  const [showYearSelector, setShowYearSelector] = useState(false);
  useEffect(() => {
    setShowYearSelector(() => openYearSelector);
  }, [openYearSelector]);

  const {
    selectedLocalisedYear,
    selectedLocalisedMonth,
    setSelectedLocalisedYear,
    setSelectedLocalisedMonth,
    selectedLocalisedDates,
    currentLocalisedDate,
    selectedLocalisedDate,
    setSelectedLocalisedDate,
    years,
    months,
    days,
  } = useNepaliCalendar({
    lang,
  });

  const handleOnSelectDate = (date: {
    id: string;
    value: number;
    label: string;
  }) => {
    if (!selectedLocalisedYear || !selectedLocalisedMonth) {
      return;
    }

    setSelectedLocalisedDate(() => date);

    onDateSelect?.({
      year: selectedLocalisedYear,
      month: {
        ...selectedLocalisedMonth,
        value: selectedLocalisedMonth.value + 1,
      },
      date,
    });
  };

  const handleOnYearClick = (year: number) => {
    const selectedYear = years.find((y) => y.value === year);
    if (!selectedYear) {
      return;
    }

    setSelectedLocalisedYear(() => selectedYear);
    setShowYearSelector(() => false);
  };

  const handleOnPrevClick = () => {
    if (!selectedLocalisedYear || !selectedLocalisedMonth) {
      return;
    }

    const prevMonth = selectedLocalisedMonth.value - 1;
    const prevYear = selectedLocalisedYear.value - 1;

    if (prevMonth < 0 && years.find((y) => y.value === prevYear)) {
      const foundPrevYear = years.find((y) => y.value === prevYear);
      if (!foundPrevYear) {
        return;
      }

      const foundPrevMonth = months.find((m) => m.value === 11);
      if (!foundPrevMonth) {
        return;
      }

      setSelectedLocalisedYear(() => foundPrevYear);
      setSelectedLocalisedMonth(() => foundPrevMonth);

      return;
    }

    if (prevMonth < 0) {
      return;
    }

    const foundPrevMonth = months.find((m) => m.value === prevMonth);
    if (!foundPrevMonth) {
      return;
    }

    setSelectedLocalisedMonth(() => foundPrevMonth);
  };

  const handleOnNextClick = () => {
    if (!selectedLocalisedYear || !selectedLocalisedMonth) {
      return;
    }

    const nextMonth = selectedLocalisedMonth.value + 1;
    const nextYear = selectedLocalisedYear.value + 1;

    if (
      nextMonth > months.length - 1 &&
      years.find((y) => y.value === nextYear)
    ) {
      const foundNextYear = years.find((y) => y.value === nextYear);
      if (!foundNextYear) {
        return;
      }

      const foundNextMonth = months.find((m) => m.value === 0);
      if (!foundNextMonth) {
        return;
      }

      setSelectedLocalisedYear(() => foundNextYear);
      setSelectedLocalisedMonth(() => foundNextMonth);
      return;
    }

    if (nextMonth > months.length - 1) {
      return;
    }

    const foundNextMonth = months.find((m) => m.value === nextMonth);
    if (!foundNextMonth) {
      return;
    }

    setSelectedLocalisedMonth(() => foundNextMonth);
  };

  useEffect(() => {
    if (!selectedDate) return;

    const foundYear = years.find((y) => y.value === selectedDate.year.value);
    if (!foundYear) {
      return;
    }

    const foundMonth = months.find(
      (m) => m.value === selectedDate.month.value - 1,
    );
    if (!foundMonth) {
      return;
    }

    setSelectedLocalisedYear(() => foundYear);
    setSelectedLocalisedMonth(() => foundMonth);
    setSelectedLocalisedDate(() => selectedDate.date);
  }, [
    months,
    selectedDate,
    setSelectedLocalisedDate,
    setSelectedLocalisedMonth,
    setSelectedLocalisedYear,
    years,
  ]);

  return (
    <div className={cn("nedt:flex nedt:flex-col", className)} {...rest}>
      <div className="nedt:flex nedt:flex-row nedt:justify-between">
        <div className="nedt:flex nedt:flex-row nedt:gap-2 nedt:items-center">
          <span>{selectedLocalisedMonth?.label}</span>
          <span>{selectedLocalisedYear?.label}</span>
          <Button onClick={() => setShowYearSelector((value) => !value)}>
            <ExpandMoreIcon
              width="36"
              height="36"
              className={cn(
                "nedt:fill-base-content  nedt:transition-transform nedt:duration-500",
                showYearSelector && "nedt:transform nedt:rotate-180",
              )}
            />
          </Button>
        </div>

        <div
          className={cn(
            "nedt:grid nedt:grid-cols-2 nedt:gap-2",
            showYearSelector && "nedt:hidden",
          )}
        >
          <Button onClick={handleOnPrevClick}>
            <PrevIcon
              width="36"
              height="36"
              className="nedt:fill-base-content"
            />
          </Button>
          <Button onClick={handleOnNextClick}>
            <NextIcon
              width="36"
              height="36"
              className="nedt:fill-base-content"
            />
          </Button>
        </div>
      </div>

      {!showYearSelector && (
        <>
          <div className="nedt:grid nedt:grid-cols-7 nedt:gap-2 nedt:justify-items-center nedt:mt-4">
            {days.map((day) => (
              <span key={day.value}>{day.label}</span>
            ))}
          </div>

          <div className="nedt:grid nedt:grid-cols-7 nedt:gap-2 nedt:justify-items-center nedt:mt-4">
            {selectedLocalisedDates.map((date) => (
              <Button
                key={date.id}
                id={date.id}
                className="nedt:w-9 nedt:h-9 nedt:p-2"
                active={date.id === currentLocalisedDate?.id}
                disabled={!date.currentMonth}
                selected={date.id === selectedLocalisedDate?.id}
                onClick={() => handleOnSelectDate(date)}
              >
                <span>{date.label}</span>
              </Button>
            ))}
          </div>
        </>
      )}

      {showYearSelector && (
        <div className="nedt:max-h-80 nedt:overflow-y-auto">
          <div className="nedt:grid nedt:grid-cols-4 nedt:gap-2 nedt:justify-items-center nedt:mt-4 nedt:max-h-xs">
            {years.map((y) => (
              <Button
                key={y.value}
                onClick={() => handleOnYearClick(y.value)}
                active={currentLocalisedDate?.id.includes(y.value.toString())}
                selected={selectedLocalisedYear?.label.includes(
                  y.value.toString(),
                )}
                variant="pilled"
              >
                <span>{y.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
