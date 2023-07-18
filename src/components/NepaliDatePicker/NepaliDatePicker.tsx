import { useRef, useState } from 'react';

import { NepaliCalendar } from '@/components/NepaliCalendar/NepaliCalendar';
import {
  NepaliDateInput,
  TargetValue,
  InputProps,
  IconProps,
  ErrorProps,
} from '@/components/NepaliDateInput/NepaliDateInput';
import { Modal } from '@/components/ui/Modal/Modal';

import { Language } from '@/types/Language';
import { NepaliDate } from '@/types/NepaliDate';

interface NepaliDatePickerProps {
  className?: string;
  lang?: Language;
  onDateSelect?: (selectedDate?: NepaliDate) => void;
  modal?: {
    className?: string;
    onClose?: () => void;
  };
  input?: InputProps;
  inputIcon?: IconProps;
  inputError?: ErrorProps;
}

export const NepaliDatePicker = ({
  className = '',
  lang = 'ne',
  modal = {},
  onDateSelect,
  input = {},
  inputIcon = {},
  inputError = {},
}: NepaliDatePickerProps) => {
  const { className: modalClassName = '', onClose: onCloseModal } = modal;

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

    onDateSelect?.(targetValue?.value);
  };

  const handleOnModalClose = () => {
    setShowModal(() => false);
    onCloseModal?.();
  };

  return (
    <div className={`relative ${className}`}>
      <NepaliDateInput
        lang={lang}
        value={selectedDate}
        input={{
          onChange: handleOnChange,
          placeholder: lang === 'ne' ? 'बर्ष/महिना/दिन' : 'YYYY/MM/DD',
          ...input,
        }}
        icon={{
          onClick: handleOnInputDateClick,
          ...inputIcon,
        }}
        error={{
          message: 'Please enter a valid date',
          ...inputError,
        }}
      />

      {showModal && (
        <Modal
          onClose={handleOnModalClose}
          className={`md:mt-11 md:bg-transparent ${modalClassName}`}
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
