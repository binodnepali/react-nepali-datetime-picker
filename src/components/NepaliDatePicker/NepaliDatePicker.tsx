import { useRef, useState } from 'react';

import { NepaliCalendar } from '@components/NepaliCalendar/NepaliCalendar';
import { NepaliDatePickerInput } from './NepaliDatePickerInput';
import { Modal } from '@ui/Modal/Modal';

import Date from '@assets/Date.svg';
import { Language } from '@/types/Language';
import { NepaliDate } from '@/types/NepaliDate';

interface NepaliDatePickerProps {
  lang?: Language;
  onDateSelect?: (date: NepaliDate | undefined) => void;
}

export const NepaliDatePicker = ({
  lang = 'ne',
  onDateSelect,
}: NepaliDatePickerProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<NepaliDate>();
  const selectedDateRef = useRef<NepaliDate>();

  const handleOnInputDateClick = () => {
    setShowModal(() => true);
  };

  const handleOnSelectDate = (date: NepaliDate) => {
    selectedDateRef.current = date;
    onDateSelect?.(date);
    setSelectedDate(() => date);
    setShowModal(() => false);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    selectedDateRef.current =
      value !== 'undefined' ? JSON.parse(value) : undefined;

    onDateSelect?.(selectedDateRef.current);
  };

  return (
    <div className='relative'>
      <div className='flex flex-col space-y-2'>
        <NepaliDatePickerInput
          icon={
            <Date
              width='36'
              height='36'
              onClick={handleOnInputDateClick}
              className='rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 p-1'
            />
          }
          lang={lang}
          value={selectedDate}
          onChange={handleOnChange}
          placeholder={lang === 'ne' ? 'बर्ष/महिना/दिन' : 'YYYY/MM/DD'}
        />
      </div>

      {showModal && (
        <Modal
          onClose={() => setShowModal(() => false)}
          className='mt-11 rounded-md'
        >
          <NepaliCalendar
            onDateSelect={handleOnSelectDate}
            lang={lang}
            selectedDate={selectedDateRef.current}
          />
        </Modal>
      )}
    </div>
  );
};
