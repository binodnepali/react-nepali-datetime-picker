import { useState } from 'react';

import { NepaliCalendar } from '@components/NepaliCalendar/NepaliCalendar';
import { Input } from '@ui/Input/Input';
import { Modal } from '@ui/Modal/Modal';

import Date from '@assets/Date.svg';
import { Language } from '@/types/Locale';
import { NepaliDate } from '@/types/NepaliDate';

interface NepaliDatePickerProps {
  lang?: Language;
}

export const NepaliDatePicker = ({ lang = 'ne' }: NepaliDatePickerProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<NepaliDate>();

  const handleOnInputDateClick = () => {
    setShowModal(() => true);
  };

  const handleOnSelectDate = (date: NepaliDate) => {
    setSelectedDate(() => date);
    setShowModal(() => false);
  };

  return (
    <div className='relative'>
      <div className='flex flex-col space-y-2'>
        <Input
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
          placeholder={lang === 'ne' ? 'बर्ष/महिना/दिन' : 'YYYY/MM/DD'}
        />
      </div>

      {showModal && (
        <Modal
          onClose={() => setShowModal(() => false)}
          className='mt-11 rounded-md'
        >
          <NepaliCalendar onDateSelect={handleOnSelectDate} lang={lang} />
        </Modal>
      )}
    </div>
  );
};
