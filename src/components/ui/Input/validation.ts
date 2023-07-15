import { Language } from '@/types/Locale';

import { years as localisedYears } from '@utils/year';
import { months as localisedMonths } from '@utils/month';
import { dates as localisedDates } from '@constants/date';
import { NepaliDate } from '@/types/NepaliDate';

const SEPARATOR = '/';

export function validateDate(
  date: NepaliDate | undefined | string,
  lang: Language
) {
  if (!date) {
    return {
      isValid: true,
      value: '',
    };
  }

  let value = '';
  if (typeof date === 'string') {
    value = date;
  } else {
    value = date.label;
  }

  if (lang === 'ne' && value.length > 0) {
    const yearValue = value.split(SEPARATOR)[0];
    const foundYear =
      localisedYears.findIndex((year) => year.ne === yearValue) !== -1;

    const monthValue = value.split(SEPARATOR)[1];
    const foundMonth =
      localisedMonths.findIndex((month) => month.value.ne === monthValue) !==
      -1;

    const dateValue = value.split(SEPARATOR)[2];
    const foundDate =
      localisedDates.findIndex((date) => date.label === dateValue) !== -1;

    return {
      isValid: foundYear && foundMonth && foundDate,
      value,
    };
  }

  if (value === '') {
    return {
      isValid: false,
      value,
    };
  }

  const dateRegex = /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01]|31|32)$/;

  return {
    isValid: dateRegex.test(value),
    value,
  };
}
