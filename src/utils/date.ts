import { convertToNepaliDigit } from './convertToNepaliDigit';
import { years } from './year';

export const dates = (year: number, month: number) => {
  const daysInMonth = years.find((y) => y.value === year)?.daysInMonth[month];

  if (!daysInMonth) {
    return [];
  }

  const dates: {
    ne: string;
    en: string;
    value: number;
  }[] = [];

  for (let date = 1; date <= daysInMonth; date++) {
    dates.push({
      en: date.toString(),
      ne: convertToNepaliDigit(date),
      value: date,
    });
  }

  return dates;
};
