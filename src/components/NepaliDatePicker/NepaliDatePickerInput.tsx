import { useEffect, useState } from 'react';

import { Language } from '@/types/Language';
import { NepaliDate } from '@/types/NepaliDate';
import { useNepaliCalendar } from '@/hooks/useNepaliCalendar';
import { formatNepaliDate } from '@/utils/nepaliDate';

interface NepaliDatePickerInputProps
  extends React.HTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  lang?: Language;
  value?: NepaliDate;
}
export const NepaliDatePickerInput = ({
  icon,
  className,
  lang = 'ne',
  value,
  onChange,
  ...rest
}: NepaliDatePickerInputProps): JSX.Element => {
  const { validateDate } = useNepaliCalendar({
    lang,
  });

  const [val, setVal] = useState<string>('');

  const [isValid, setIsValid] = useState<boolean>(true);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const { valid, value: val } = validateDate(value);

    setIsValid(() => valid);

    setVal(() => value);

    e.target.value = JSON.stringify(val);

    onChange?.(e);
  };

  useEffect(() => {
    if (!value) {
      setVal(() => '');

      return;
    }

    setVal(() => formatNepaliDate(value, lang));
    setIsValid(() => true);
  }, [lang, value]);

  return (
    <div className='relative'>
      <input
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
