import { convertToNepaliDigit } from './convertToNepaliDigit';

import { yearsDateMapInMonth } from '../constants/yearsDateMapInMonth';

export const startYear = 2000;

export const endYear = 2089;

export const years = generateYears(startYear, endYear);

function generateYears(startYear: number, endYear: number) {
  const years: {
    ne: string;
    en: string;
    value: number;
    daysInMonth: [number, number, number][];
  }[] = [];

  const days = yearsDateMapInMonth as unknown as {
    [year: number]: {
      daysInMonth: [number, number, number][];
    };
  };

  for (let year = startYear; year <= endYear; year++) {
    years.push({
      ne: convertToNepaliDigit(year),
      en: year.toString(),
      value: year,
      daysInMonth: days[year].daysInMonth,
    });
  }

  return years;
}
