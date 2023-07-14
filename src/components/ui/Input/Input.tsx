import { useState } from 'react';

import { years as localisedYears } from '@utils/year';
import { months as localisedMonths } from '@utils/month';
import { dates as localisedDates } from '@constants/date';

const SEPARATOR = '/';

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  locale?: 'en' | 'ne';
}
export const Input: React.FC<InputProps> = ({
  icon,
  className,
  locale = 'ne',
  ...rest
}: InputProps): JSX.Element => {
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (locale === 'ne') {
      const yearValue = value.split(SEPARATOR)[0];
      const foundYear =
        localisedYears.findIndex((year) => year.ne === yearValue) !== -1;

      const monthValue = value.split(SEPARATOR)[1];
      const foundMonth =
        localisedMonths.findIndex((month) => month.label === monthValue) !== -1;

      const dateValue = value.split(SEPARATOR)[2];
      const foundDate =
        localisedDates.findIndex((date) => date.label === dateValue) !== -1;

      setIsValid(() => foundYear && foundMonth && foundDate);

      return;
    }

    if (value === '') {
      setIsValid(() => true);
      return;
    }

    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const isValidDate = dateRegex.test(value);
    setIsValid(() => isValidDate);
  };

  return (
    <div className='relative'>
      <input
        className={`border border-gray-300 rounded-md px-2 py-2 w-full ${
          className || ''
        }`}
        type='text'
        placeholder='YYYY/MM/DD'
        autoComplete='off'
        onChange={handleOnChange}
        {...rest}
      />

      {icon && (
        <div className='absolute inset-y-0 right-0 mr-1 flex items-center cursor-pointer'>
          {icon}
        </div>
      )}

      {!isValid && (
        <p
          className='absolute bottom-0 left-0 text-xs text-red-500'
          style={{
            transform: 'translateY(100%)',
          }}
        >
          Invalid date
        </p>
      )}
    </div>
  );
};
