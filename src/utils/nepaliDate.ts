import { yearsWithDaysInMonth } from '@/constants/yearsWithDaysInMonth';
import { months } from '@/constants/months';
import { weekDays } from '@/constants/weekDays';
import { Language } from '@/types/Language';
import {
  addLeadingNepaliZero,
  addLeadingZero,
  convertToNepaliDigit,
} from './digit';
import { WeekDay } from '@/types/WeekDay';
import { Day, Month, NepaliDate, Year } from '@/types/NepaliDate';

const GREGORIAN_START_YEAR = 1943; // Start year of the Gregorian calendar
const NEPALI_START_YEAR = 2000; // Start year of the Nepali calendar
const NEPALI_END_YEAR = 2089; // End year of the Nepali calendar
const NEPALI_YEAR_OFFSET = NEPALI_START_YEAR - GREGORIAN_START_YEAR; // Convert Gregorian year to Nepali year
const NEPALI_MONTH_OFFSET = 8; // Add an offset of 8 to convert Gregorian month to Nepali month
const NEPALI_DATE_OFFSET = 15; // Add an offset of 15 to convert Gregorian date to Nepali date
const NEPALI_MONTHS_IN_YEAR = 12; // Number of months in a year
const LOCALE = 'ne-NP'; // Locale
const DATE_LOCALIZATION_OPTIONS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: 'Asia/Kathmandu',
} as const;

export const YEAR_MONTH_DATE_SEPARATOR = '/'; // Separator between year, month and date

export const currentNepaliDate = () => {
  const date = new Date();

  const localizedDate = date.toLocaleString(LOCALE, DATE_LOCALIZATION_OPTIONS);

  const [currentDate, currentMonth, currentYear] = localizedDate
    .split(YEAR_MONTH_DATE_SEPARATOR)
    .map((item) => parseInt(item, 10));

  let nepaliYear = currentYear + NEPALI_YEAR_OFFSET;
  let nepaliMonth = currentMonth + NEPALI_MONTH_OFFSET;
  let nepaliDate = currentDate + NEPALI_DATE_OFFSET;

  // Adjust Nepali month and year if it exceeds the maximum values
  if (nepaliMonth > NEPALI_MONTHS_IN_YEAR) {
    nepaliMonth -= NEPALI_MONTHS_IN_YEAR;
  }

  // Adjust Nepali year if it exceeds the maximum value
  if (nepaliMonth - 1 === 11) {
    nepaliYear += 1;
  }

  const days = yearsWithDaysInMonth as unknown as {
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

const years = generateYears(NEPALI_START_YEAR, NEPALI_END_YEAR);
export const getYears = (lang: Language): Year[] => {
  return years.map((year) => {
    if (lang === 'ne') {
      return {
        value: year.value,
        label: year.label.ne,
      };
    }

    return {
      value: year.value,
      label: year.label.en,
    };
  });
};

function generateYears(startYear: number, endYear: number) {
  const years: {
    label: {
      ne: string;
      en: string;
    };
    value: number;
    daysInMonth: [number, number, number][];
  }[] = [];

  const days = yearsWithDaysInMonth as unknown as {
    [year: number]: {
      daysInMonth: [number, number, number][];
    };
  };

  for (let year = startYear; year <= endYear; year++) {
    years.push({
      label: {
        ne: convertToNepaliDigit(year),
        en: year.toString(),
      },
      value: year,
      daysInMonth: days[year].daysInMonth,
    });
  }

  return years;
}

export const getMonths = (lang: Language): Month[] => {
  return months.map((month) => {
    if (lang === 'ne') {
      return {
        value: month.value.en,
        label: month.label.ne,
      };
    }

    return {
      value: month.value.en,
      label: month.label.en,
    };
  });
};

export const getMonthDatesByYear = ({
  year,
  month,
  lang = 'ne',
}: {
  year: number;
  month: number;
  lang?: Language;
}): Day[] => {
  return getDatesInMonthByYear(year, month).map((date) => {
    if (lang === 'ne') {
      return {
        id: date.id,
        value: date.value,
        label: convertToNepaliDigit(date.value),
      };
    }

    return {
      id: date.id,
      value: date.value,
      label: date.value.toString(),
    };
  });
};

const getDatesInMonthByYear = (year: number, month: number) => {
  const prevMonth = month - 1 < 0 ? 11 : month - 1;

  const prevMonthDates = years.find((y) => y.value === year)?.daysInMonth[
    prevMonth
  ];
  const currentMonthDates = years.find((y) => y.value === year)?.daysInMonth[
    month
  ];

  if (!prevMonthDates || !currentMonthDates) {
    return [];
  }

  const dates: {
    id: string;
    value: number;
  }[] = [];

  if (typeof currentMonthDates === 'number') {
    for (let date = 1; date <= currentMonthDates; date++) {
      dates.push({
        id: `${year}${YEAR_MONTH_DATE_SEPARATOR}${month}${YEAR_MONTH_DATE_SEPARATOR}${date}`,
        value: date,
      });
    }

    return dates;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, prevMonthDays, __] = prevMonthDates;
  const [beginningMonthOffset, currentMonthDays, endMonthOffset] =
    currentMonthDates;

  for (
    let date = prevMonthDays - beginningMonthOffset + 1;
    date <= prevMonthDays;
    date++
  ) {
    dates.push({
      id: `${year}${YEAR_MONTH_DATE_SEPARATOR}${prevMonth}${YEAR_MONTH_DATE_SEPARATOR}${date}`,
      value: date,
    });
  }

  for (let date = 1; date <= currentMonthDays; date++) {
    dates.push({
      id: `${year}${YEAR_MONTH_DATE_SEPARATOR}${month}${YEAR_MONTH_DATE_SEPARATOR}${date}`,
      value: date,
    });
  }

  for (let date = 1; date <= endMonthOffset; date++) {
    dates.push({
      id: `${year}${YEAR_MONTH_DATE_SEPARATOR}${
        month + 1
      }${YEAR_MONTH_DATE_SEPARATOR}${date}`,
      value: date,
    });
  }

  return dates;
};

export const getWeekDays = (lang: Language, short = true): WeekDay[] => {
  return weekDays.map((day) => {
    if (lang === 'ne') {
      return {
        value: day.value,
        label: short ? day.label.ne.short : day.label.ne.long,
      };
    }

    return {
      value: day.value,
      label: short ? day.label.en.short : day.label.en.long,
    };
  });
};

export const formatNepaliDate = (date: NepaliDate, lang: Language) => {
  const format = `YYYY${YEAR_MONTH_DATE_SEPARATOR}MM${YEAR_MONTH_DATE_SEPARATOR}DD`;

  const formattedDate = format
    .replace('YYYY', date.year.label)
    .replace(
      'MM',
      lang == 'ne'
        ? addLeadingNepaliZero(date.month.value)
        : addLeadingZero(date.month.value)
    )
    .replace(
      'DD',
      lang == 'ne'
        ? addLeadingNepaliZero(date.date.value)
        : addLeadingZero(date.date.value)
    );

  return formattedDate;
};
