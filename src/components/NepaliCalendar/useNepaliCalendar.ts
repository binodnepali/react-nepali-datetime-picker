import { useEffect, useMemo, useState } from 'react';
import {
  getCurrentNepaliDate,
  getDates,
  getDays,
  getMonths,
  getYears,
} from '@utils/date-fns';

export const useNepaliCalendar = () => {
  const {
    date: currentDate,
    month: currentMonth,
    year: currentYear,
  } = getCurrentNepaliDate();

  const years = useMemo(() => getYears('ne'), []);
  const months = useMemo(() => getMonths('ne'), []);
  const days = useMemo(() => getDays('ne'), []);

  const [currentLocalisedYear, setCurrentLocalisedYear] = useState<{
    label: string;
    value: number;
  }>();
  const [currentLocalisedMonth, setCurrentLocalisedMonth] = useState<{
    label: string;
    value: number;
  }>();

  useEffect(() => {
    setCurrentLocalisedYear(() => years.find((y) => y.value === currentYear));

    setCurrentLocalisedMonth(() =>
      months.find((m) => m.value === currentMonth)
    );
  }, [currentMonth, currentYear, months, years]);

  return {
    currentLocalisedYear,
    setCurrentLocalisedYear,
    currentLocalisedMonth,
    setCurrentLocalisedMonth,
    currentLocalisedDates: useMemo(
      () =>
        getDates(
          'ne',
          currentLocalisedYear?.value,
          currentLocalisedMonth?.value
        ),
      [currentLocalisedMonth?.value, currentLocalisedYear?.value]
    ),
    currentMonth,
    currentYear,
    currentDate,
    years,
    months,
    days,
  };
};
