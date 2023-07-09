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
        label: month.ne,
      };
    }

    return {
      value: month.value,
      label: month.en,
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
        value: date.value,
        label: date.ne,
      };
    }

    return {
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

export const getCurrentNepaliDate = () => {
  const date = new Date(); // Get current date in Gregorian calendar
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; // Adding 1 since month is zero-based
  const currentDate = date.getDate();

  let nepaliYear = currentYear + 57; // Convert Gregorian year to Nepali year
  let nepaliMonth = currentMonth + 8; // Add an offset of 8 to convert Gregorian month to Nepali month
  let nepaliDate = currentDate + 16; // Add an offset of 16 to convert Gregorian date to Nepali date

  const nepaliMonthsInYear = 12;
  const nepaliDaysInMonth = [30, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30]; // Nepali days in each month

  // Adjust Nepali month and year if it exceeds the maximum values
  if (nepaliMonth > nepaliMonthsInYear) {
    nepaliYear++;
    nepaliMonth -= nepaliMonthsInYear;
  }

  // Adjust Nepali day if it exceeds the maximum value for the current month
  if (nepaliDate > nepaliDaysInMonth[nepaliMonth - 1]) {
    nepaliDate = nepaliDaysInMonth[nepaliMonth - 1];
  }

  return {
    year: nepaliYear - 1,
    month: nepaliMonth - 1,
    date: nepaliDate - 1,
  };
};
