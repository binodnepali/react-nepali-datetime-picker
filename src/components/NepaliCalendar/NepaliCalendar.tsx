import { useState } from 'react';

import ExpandMoreIcon from '@assets/More.svg';
import NextIcon from '@assets/Next.svg';
import PrevIcon from '@assets/Prev.svg';

import { Button } from '@ui/Button/Button';
import { useNepaliCalendar } from '@hooks/useNepaliCalendar';
import { Language } from '@/types/Locale';
import {
  addLeadingNepaliZero,
  addLeadingZero,
} from '@/utils/convertToNepaliDigit';
import { NepaliDate } from '@/types/NepaliDate';

interface NepaliCalendarProps {
  className?: string;
  lang?: Language;
  separator?: string;
  onDateSelect?: (date: NepaliDate) => void;
}

export const NepaliCalendar = ({
  className,
  separator = '/',
  lang = 'ne',
  onDateSelect,
}: NepaliCalendarProps) => {
  const [showYearSelector, setShowYearSelector] = useState(false);

  const {
    currentLocalisedYear,
    currentLocalisedMonth,
    setCurrentLocalisedYear,
    setCurrentLocalisedMonth,
    currentLocalisedDates,
    years,
    months,
    days,
    currentYear,
    currentMonth,
    currentDate,
  } = useNepaliCalendar({
    lang,
  });

  const handleOnSelectDate = (date: {
    id: string;
    value: number;
    label: string;
  }) => {
    if (!currentLocalisedYear || !currentLocalisedMonth) {
      return;
    }

    if (lang === 'ne') {
      onDateSelect?.({
        value: {
          year: currentLocalisedYear.value,
          month: currentLocalisedMonth.value.en + 1,
          date: date.value,
        },
        label: `${currentLocalisedYear?.label}${separator}${
          currentLocalisedMonth?.value.ne
        }${separator}${addLeadingNepaliZero(date.value)}`,
      });
      return;
    }

    onDateSelect?.({
      value: {
        year: currentLocalisedYear.value,
        month: currentLocalisedMonth.value.en + 1,
        date: date.value,
      },
      label: `${currentLocalisedYear.label}${separator}${addLeadingZero(
        currentLocalisedMonth.value.en + 1
      )}${separator}${addLeadingZero(date.value)}`,
    });
  };

  const handleOnYearClick = (year: number) => {
    setCurrentLocalisedYear(() => years.find((y) => y.value === year));
    setShowYearSelector(false);
  };

  const handleOnPrevClick = () => {
    if (!currentLocalisedYear || !currentLocalisedMonth) {
      return;
    }

    const prevMonth = currentLocalisedMonth.value.en - 1;
    const prevYear = currentLocalisedYear.value - 1;

    if (prevMonth < 0 && years.find((y) => y.value === prevYear)) {
      setCurrentLocalisedYear(() => years.find((y) => y.value === prevYear));
      setCurrentLocalisedMonth(() => months.find((m) => m.value.en === 11));
      return;
    }

    if (prevMonth < 0) {
      return;
    }

    setCurrentLocalisedMonth(() =>
      months.find((m) => m.value.en === prevMonth)
    );
  };

  const handleOnNextClick = () => {
    if (!currentLocalisedYear || !currentLocalisedMonth) {
      return;
    }

    const nextMonth = currentLocalisedMonth.value.en + 1;
    const nextYear = currentLocalisedYear.value + 1;

    if (
      nextMonth > months.length - 1 &&
      years.find((y) => y.value === nextYear)
    ) {
      setCurrentLocalisedYear(() => years.find((y) => y.value === nextYear));
      setCurrentLocalisedMonth(() => months.find((m) => m.value.en === 0));
      return;
    }

    if (nextMonth > months.length - 1) {
      return;
    }

    setCurrentLocalisedMonth(() =>
      months.find((m) => m.value.en === nextMonth)
    );
  };

  return (
    <div className={`bg-neutral-50 py-4 px-4 rounded-md ${className || ''}`}>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row gap-2 items-center'>
          <span>{currentLocalisedMonth?.label}</span>
          <span>{currentLocalisedYear?.label}</span>
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
            {currentLocalisedDates.map((date) => (
              <Button
                key={date.id}
                className={`w-9 h-9 p-2`}
                active={date.id.includes(
                  `${currentYear}-${currentMonth}-${currentDate}`
                )}
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
                active={currentYear === y.value}
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
