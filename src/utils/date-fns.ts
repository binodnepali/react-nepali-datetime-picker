import { yearsDateMapInMonth } from '../constants/yearsDateMapInMonth';

import { years } from './year';
import { months } from './month';
import { days } from './day';
import { dates } from './date';

type Language = 'en' | 'ne';

export const getYears = (lang: Language) => {
  return years.map((year) => {
    if (lang === 'ne') {
      return {
        value: year.value,
        label: year.ne,
      };
    }

    return {
      value: year.value,
      label: year.en,
    };
  });
};

export const getMonths = (lang: Language) => {
  return months.map((month) => {
    if (lang === 'ne') {
      return {
        value: month.value,
        label: month.label.ne,
      };
    }

    return {
      value: month.value,
      label: month.label.en,
    };
  });
};

export const getDates = (lang: Language, year?: number, month?: number) => {
  if (year === undefined || month === undefined) {
    return [];
  }

  const newDates = dates(year, month);

  return newDates.map((date) => {
    if (lang === 'ne') {
      return {
        id: date.id,
        value: date.value,
        label: date.ne,
      };
    }

    return {
      id: date.id,
      value: date.value,
      label: date.en,
    };
  });
};

export const getDays = (lang: Language, short = true) => {
  return days.map((day) => {
    if (lang === 'ne') {
      return {
        value: day.value,
        label: short ? day.ne.short : day.ne.long,
      };
    }

    return {
      value: day.value,
      label: short ? day.en.short : day.en.long,
    };
  });
};

const GREGORIAN_START_YEAR = 1943;
const NEPALI_START_YEAR = 2000;
export const getCurrentNepaliDate = () => {
  const date = new Date();

  const localizedDate = date.toLocaleString('ne-NP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'Asia/Kathmandu',
  });

  const [currentDate, currentMonth, currentYear] = localizedDate
    .split('/')
    .map((item) => parseInt(item, 10));

  let nepaliYear = currentYear + (NEPALI_START_YEAR - GREGORIAN_START_YEAR); // Convert Gregorian year to Nepali year
  let nepaliMonth = currentMonth + 8; // Add an offset of 8 to convert Gregorian month to Nepali month
  let nepaliDate = currentDate + 15; // Add an offset of 15 to convert Gregorian date to Nepali date

  const nepaliMonthsInYear = 12;

  // Adjust Nepali month and year if it exceeds the maximum values
  if (nepaliMonth > nepaliMonthsInYear) {
    nepaliMonth -= nepaliMonthsInYear;
  }

  // Adjust Nepali year if it exceeds the maximum value
  if (nepaliMonth - 1 === 11) {
    nepaliYear += 1;
  }

  const days = yearsDateMapInMonth as unknown as {
    [year: number]: {
      daysInMonth: [number, number, number][];
    };
  };
  const nepaliDaysInMonth = days[nepaliYear].daysInMonth.map((day) => {
    if (typeof day === 'number') {
      return day;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, daysInMonth, __] = day;

    return daysInMonth;
  });

  // Adjust Nepali day if it exceeds the maximum value for the current month
  if (nepaliDate > nepaliDaysInMonth[nepaliMonth - 1]) {
    nepaliDate = nepaliDaysInMonth[nepaliMonth - 1];
  }

  return {
    year: nepaliYear,
    month: nepaliMonth - 1,
    date: nepaliDate,
  };
};
