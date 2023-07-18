import { useRef, useState } from 'react';

import { NepaliCalendar } from '@/components/NepaliCalendar/NepaliCalendar';
import {
  NepaliDateInput,
  TargetValue,
} from '@/components/NepaliDateInput/NepaliDateInput';
import { Modal } from '@/components/ui/Modal/Modal';

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

    const targetValue =
      value !== 'undefined' ? (JSON.parse(value) as TargetValue) : undefined;

    selectedDateRef.current = targetValue?.value;

    onDateSelect?.(selectedDateRef.current);
  };

  return (
    <div className='relative'>
      <div className='flex flex-col space-y-2'>
        <NepaliDateInput
          lang={lang}
          value={selectedDate}
          input={{
            onChange: handleOnChange,
            placeholder: lang === 'ne' ? 'बर्ष/महिना/दिन' : 'YYYY/MM/DD',
          }}
          icon={{
            onClick: handleOnInputDateClick,
          }}
          error={{
            message: 'Please enter a valid date',
          }}
        />
      </div>

      {showModal && (
        <Modal
          onClose={() => setShowModal(() => false)}
          className='md:mt-11 rounded-md'
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
