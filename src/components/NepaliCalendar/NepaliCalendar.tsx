import { useState } from 'react';

import ExpandMoreIcon from '@assets/expand_more.svg';
import NextIcon from '@assets/chevron_right.svg';
import PrevIcon from '@assets/chevron_left.svg';

import { Button } from '@ui/Button/Button';
import { useNepaliCalendar } from './useNepaliCalendar';

export const NepaliCalendar = () => {
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
  } = useNepaliCalendar();

  const handleOnYearClick = (year: number) => {
    setCurrentLocalisedYear(() => years.find((y) => y.value === year));
    setShowYearSelector(false);
  };

  const handleOnPrevClick = () => {
    if (!currentLocalisedYear || !currentLocalisedMonth) {
      return;
    }

    const prevMonth = currentLocalisedMonth.value - 1;
    const prevYear = currentLocalisedYear.value - 1;

    if (prevMonth < 0 && years.find((y) => y.value === prevYear)) {
      setCurrentLocalisedYear(() => years.find((y) => y.value === prevYear));
      setCurrentLocalisedMonth(() => months.find((m) => m.value === 11));
      return;
    }

    if (prevMonth < 0) {
      return;
    }

    setCurrentLocalisedMonth(() => months.find((m) => m.value === prevMonth));
  };

  const handleOnNextClick = () => {
    if (!currentLocalisedYear || !currentLocalisedMonth) {
      return;
    }

    const nextMonth = currentLocalisedMonth.value + 1;
    const nextYear = currentLocalisedYear.value + 1;

    if (
      nextMonth > months.length - 1 &&
      years.find((y) => y.value === nextYear)
    ) {
      setCurrentLocalisedYear(() => years.find((y) => y.value === nextYear));
      setCurrentLocalisedMonth(() => months.find((m) => m.value === 0));
      return;
    }

    if (nextMonth > months.length - 1) {
      return;
    }

    setCurrentLocalisedMonth(() => months.find((m) => m.value === nextMonth));
  };

  return (
    <div className='bg-neutral-50 py-4 px-4'>
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
