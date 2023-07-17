import { useEffect, useState } from 'react';

import ExpandMoreIcon from '@assets/More.svg';
import NextIcon from '@assets/Next.svg';
import PrevIcon from '@assets/Prev.svg';

import { Button } from '@ui/Button/Button';
import { useNepaliCalendar } from '@hooks/useNepaliCalendar';
import { Language } from '@/types/Language';
import { NepaliDate } from '@/types/NepaliDate';

interface NepaliCalendarProps {
  className?: string;
  lang?: Language;
  separator?: string;
  selectedDate?: NepaliDate;
  onDateSelect?: (date: NepaliDate) => void;
}

export const NepaliCalendar = ({
  className,
  lang = 'ne',
  selectedDate,
  onDateSelect,
}: NepaliCalendarProps) => {
  const [showYearSelector, setShowYearSelector] = useState(false);

  const {
    selectedLocalisedYear,
    selectedLocalisedMonth,
    setSelectedLocalisedYear,
    setSelectedLocalisedMonth,
    selectedLocalisedDates,
    currentLocalisedDate,

    years,
    months,
    days,
  } = useNepaliCalendar({
    lang,
  });

  useEffect(() => {
    if (!selectedDate) return;

    const foundYear = years.find((y) => y.value === selectedDate.year.value);
    if (!foundYear) {
      console.warn('Year not found');
      return;
    }

    const foundMonth = months.find(
      (m) => m.value === selectedDate.month.value - 1
    );
    if (!foundMonth) {
      console.warn('Month not found');
      return;
    }

    setSelectedLocalisedYear(() => foundYear);
    setSelectedLocalisedMonth(() => foundMonth);
  }, [
    months,
    selectedDate,
    setSelectedLocalisedMonth,
    setSelectedLocalisedYear,
    years,
  ]);

  const handleOnSelectDate = (date: {
    id: string;
    value: number;
    label: string;
  }) => {
    if (!selectedLocalisedYear || !selectedLocalisedMonth) {
      return;
    }

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
      console.warn('Year not found');

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
        console.warn('Year not found');
        return;
      }

      const foundPrevMonth = months.find((m) => m.value === 11);
      if (!foundPrevMonth) {
        console.warn('Month not found');
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
      console.warn('Month not found');
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
        console.warn('Year not found');
        return;
      }

      const foundNextMonth = months.find((m) => m.value === 0);
      if (!foundNextMonth) {
        console.warn('Month not found');
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
      console.warn('Month not found');
      return;
    }

    setSelectedLocalisedMonth(() => foundNextMonth);
  };

  return (
    <div className={`bg-neutral-50 py-4 px-4 rounded-md ${className || ''}`}>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row gap-2 items-center'>
          <span>{selectedLocalisedMonth?.label}</span>
          <span>{selectedLocalisedYear?.label}</span>
          <Button onClick={() => setShowYearSelector((value) => !value)}>
            <ExpandMoreIcon
              width='36'
              height='36'
              className={`transition-transform duration-500
      ${showYearSelector ? 'transform rotate-180' : ''}
        `}
            />
          </Button>
        </div>

        <div
          className={`grid grid-cols-2 gap-2 ${
            showYearSelector ? 'hidden' : ''
          }`}
        >
          <Button onClick={handleOnPrevClick}>
            <PrevIcon width='36' height='36' />
          </Button>
          <Button onClick={handleOnNextClick}>
            <NextIcon width='36' height='36' />
          </Button>
        </div>
      </div>

      {!showYearSelector && (
        <>
          <div className='grid grid-cols-7 gap-2 justify-items-center mt-4 '>
            {days.map((day) => (
              <span key={day.value}>{day.label}</span>
            ))}
          </div>

          <div className='grid grid-cols-7 gap-2 justify-items-center mt-4'>
            {selectedLocalisedDates.map((date) => (
              <Button
                key={date.id}
                id={date.id}
                className={`w-9 h-9 p-2`}
                active={date.id === currentLocalisedDate?.id}
                inactive={!date.currentMonth}
                selected={date.id === selectedDate?.date?.id}
                onClick={() => handleOnSelectDate(date)}
              >
                <span>{date.label}</span>
              </Button>
            ))}
          </div>
        </>
      )}

      {showYearSelector && (
        <div className='max-h-72 overflow-y-auto'>
          <div className='grid grid-cols-4 gap-2 justify-items-center mt-4 max-h-xs'>
            {years.map((y) => (
              <Button
                key={y.value}
                onClick={() => handleOnYearClick(y.value)}
                active={currentLocalisedDate?.id.includes(y.value.toString())}
                selected={selectedLocalisedYear?.label.includes(
                  y.value.toString()
                )}
                variant='pilled'
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
