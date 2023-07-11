import { convertToNepaliDigit } from './convertToNepaliDigit';
import { years } from './year';

export const dates = (year: number, month: number) => {
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
    ne: string;
    en: string;
    value: number;
  }[] = [];

  if (typeof currentMonthDates === 'number') {
    for (let date = 1; date <= currentMonthDates; date++) {
      dates.push({
        id: `${year}-${month}-${date}`,
        en: date.toString(),
        ne: convertToNepaliDigit(date),
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
      id: `${year}-${prevMonth}-${date}`,
      en: date.toString(),
      ne: convertToNepaliDigit(date),
      value: date,
    });
  }

  for (let date = 1; date <= currentMonthDays; date++) {
    dates.push({
      id: `${year}-${month}-${date}`,
      en: date.toString(),
      ne: convertToNepaliDigit(date),
      value: date,
    });
  }

  for (let date = 1; date <= endMonthOffset; date++) {
    dates.push({
      id: `${year}-${month + 1}-${date}`,
      en: date.toString(),
      ne: convertToNepaliDigit(date),
      value: date,
    });
  }

  return dates;
};
