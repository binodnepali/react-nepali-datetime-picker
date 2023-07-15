import { useEffect, useRef, useState } from 'react';

import { validateDate } from './validation';
import { Language } from '@/types/Locale';
import { NepaliDate } from '@/types/NepaliDate';

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  lang?: Language;
  value?: NepaliDate;
}
export const Input = ({
  icon,
  className,
  lang = 'ne',
  value,
  ...rest
}: InputProps): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);
  const [val, setVal] = useState<string>('');

  const [isValid, setIsValid] = useState<boolean>(true);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const { isValid } = validateDate(value, lang);

    setIsValid(() => isValid);

    setVal(() => value);
  };

  useEffect(() => {
    const { isValid, value: val } = validateDate(value, lang);

    if (isValid) {
      setVal(() => val);
    } else {
      setIsValid(() => false);
    }
  }, [lang, value]);

  return (
    <div className='relative'>
      <input
        ref={ref}
        className={`border border-gray-300 rounded-md px-2 py-2 w-full ${
          className || ''
        }`}
        type='text'
        autoComplete='off'
        onChange={handleOnChange}
        value={val}
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
