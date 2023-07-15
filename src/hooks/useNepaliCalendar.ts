import { useEffect, useMemo, useState } from 'react';
import {
  getCurrentNepaliDate,
  getDates,
  getDays,
  getMonths,
  getYears,
} from '@utils/date-fns';
import { Language } from '@/types/Locale';

interface UseNepaliCalendarParams {
  lang?: Language;
}

export const useNepaliCalendar = ({ lang = 'ne' }: UseNepaliCalendarParams) => {
  const {
    date: currentDate,
    month: currentMonth,
    year: currentYear,
  } = getCurrentNepaliDate();

  const years = useMemo(() => getYears(lang), [lang]);
  const months = useMemo(() => getMonths(lang), [lang]);
  const days = useMemo(() => getDays(lang), [lang]);

  const [currentLocalisedYear, setCurrentLocalisedYear] = useState<{
    label: string;
    value: number;
  }>();
  const [currentLocalisedMonth, setCurrentLocalisedMonth] = useState<{
    label: string;
    value: {
      en: number;
      ne: string;
    };
  }>();

  useEffect(() => {
    setCurrentLocalisedYear(() => years.find((y) => y.value === currentYear));

    setCurrentLocalisedMonth(() =>
      months.find((m) => m.value.en === currentMonth)
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
          lang,
          currentLocalisedYear?.value,
          currentLocalisedMonth?.value.en
        ),
      [currentLocalisedMonth?.value.en, currentLocalisedYear?.value, lang]
    ),
    currentMonth,
    currentYear,
    currentDate,
    years,
    months,
    days,
  };
};
