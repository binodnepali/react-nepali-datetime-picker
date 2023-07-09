import { useState } from 'react';

import ExpandMoreIcon from '@assets/expand_more.svg';
import NextIcon from '@assets/chevron_right.svg';
import PrevIcon from '@assets/chevron_left.svg';

import {
  getDays,
  getDates,
  getCurrentNepaliDate,
  getMonths,
  getYears,
} from '../../utils/date-fns';

interface NepaliDatePickerProps {
  className?: string;
}

export const NepaliDatePicker: React.FC<NepaliDatePickerProps> = ({
  className,
}: NepaliDatePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const [showYearSelector, setShowYearSelector] = useState(false);

  const years = getYears('ne');
  const months = getMonths('ne');
  const days = getDays('ne');

  const { date, month, year } = getCurrentNepaliDate();

  const [currentYear, setCurrentYear] = useState(
    years.find((y) => y.value === year)
  );
  const [currentMonth, setCurrentMonth] = useState(
    months.find((m) => m.value === month)
  );
  const dates = getDates('ne', currentYear?.value, currentMonth?.value);
  const currentDate = dates.find((d) => d.value === date);

  const handleOnYearClick = (year: number) => {
    setCurrentYear(() => years.find((y) => y.value === year));
    setShowYearSelector(false);
  };

  const handleOnNextClick = () => {
    if (!currentYear || !currentMonth) {
      return;
    }

    const nextMonth = currentMonth.value + 1;
    const nextYear = currentYear.value + 1;

    if (
      nextMonth > months.length - 1 &&
      years.find((y) => y.value === nextYear)
    ) {
      setCurrentYear(() => years.find((y) => y.value === nextYear));
      setCurrentMonth(() => months.find((m) => m.value === 0));
      return;
    }

    if (nextMonth > months.length - 1) {
      return;
    }

    setCurrentMonth(() => months.find((m) => m.value === nextMonth));
  };

  const handleOnPrevClick = () => {
    if (!currentYear || !currentMonth) {
      return;
    }

    const prevMonth = currentMonth.value - 1;
    const prevYear = currentYear.value - 1;

    if (prevMonth < 0 && years.find((y) => y.value === prevYear)) {
      setCurrentYear(() => years.find((y) => y.value === prevYear));
      setCurrentMonth(() => months.find((m) => m.value === 11));
      return;
    }

    if (prevMonth < 0) {
      return;
    }

    setCurrentMonth(() => months.find((m) => m.value === prevMonth));
  };

  return (
    <div className={className}>
      <div className='flex flex-col space-y-2'>
        <input
          type='text'
          id='date-picker'
          className='border border-gray-300 rounded-md px-2 py-1'
          placeholder='Select Date'
          onClick={() => setShowPicker(true)}
        />
      </div>

      {showPicker && (
        <div className='bg-neutral-50 pt-4 px-4 pb-8'>
          <div className='flex flex-row justify-between'>
            <div className='flex flex-row gap-2 items-center'>
              <span>{currentMonth?.label}</span>
              <span>{currentYear?.label}</span>
              <ExpandMoreIcon
                onClick={() => setShowYearSelector((value) => !value)}
              />
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <PrevIcon onClick={handleOnPrevClick} />
              <NextIcon onClick={handleOnNextClick} />
            </div>
          </div>

          {!showYearSelector && (
            <>
              <div className='grid grid-cols-7 gap-2 justify-items-center mt-4'>
                {days.map((day) => (
                  <span key={day.value}>{day.label}</span>
                ))}
              </div>

              <div className='grid grid-cols-7 gap-2 justify-items-center mt-4'>
                {dates.map((date) => (
                  <span
                    key={date.value}
                    className={`${
                      date.value === currentDate?.value
                        ? 'border border-green-500 rounded-md px-2 py-1'
                        : ''
                    }`}
                  >
                    {date.label}
                  </span>
                ))}
              </div>
            </>
          )}

          {showYearSelector && (
            <>
              <div className='grid grid-cols-4 gap-2 justify-items-center mt-4 max-h-xs'>
                {years.map((year) => (
                  <span
                    key={year.value}
                    className={`${
                      year.value === currentYear?.value
                        ? 'border border-green-500 rounded-md px-2 py-1'
                        : ''
                    } hover:cursor-pointer`}
                    onClick={() => handleOnYearClick(year.value)}
                  >
                    {year.label}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
