import type { HTMLAttributes } from "react";
import { useRef, useState } from "react";

import type { CalendarProps } from "@/components/Calendar/Calendar";
import { Calendar } from "@/components/Calendar/Calendar";
import type {
  DateInputProps,
  DateInputTargetValue,
} from "@/components/DateInput/DateInput";
import { DateInput } from "@/components/DateInput/DateInput";
import type { ModalProps } from "@/components/Modal/Modal";
import { Modal } from "@/components/Modal/Modal";
import { cn } from "@/plugins/twMerge";
import transData from "@/translations/DatePicker.json";
import type { Language } from "@/types/Language";
import type { NepaliDate } from "@/types/NepaliDate";

interface DatePickerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  lang?: Language;
  onDateSelect?: (selectedDate?: NepaliDate) => void;
  modal?: ModalProps;
  dateInput?: DateInputProps;
  calendar?: CalendarProps;
  trans?: DatePickerTrans;
}
export const DatePicker = ({
  className = "",
  lang = "ne",
  modal = {},
  onDateSelect,
  dateInput = {},
  calendar = {},
  trans = {},
  ...rest
}: DatePickerProps) => {
  const {
    input: { nativeInput, icon: inputIcon, ...inputRest } = {},
    ...dateInputRest
  } = dateInput;

  const { className: calendarClassName = "", ...calendarRest } = calendar;

  const {
    onClose: onCloseModal,
    modalContentClassName = "",
    ...modalRest
  } = modal;

  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<NepaliDate>();
  const selectedDateRef = useRef<NepaliDate>(undefined);

  const handleOnInputDateClick = () => {
    setShowModal((prev) => !prev);
  };

  const handleOnSelectDate = (date: NepaliDate) => {
    selectedDateRef.current = date;
    onDateSelect?.(date);
    setSelectedDate(() => date);
    setShowModal(() => false);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const targetValue = JSON.parse(value) as DateInputTargetValue;

    selectedDateRef.current = targetValue.value;

    onDateSelect?.(targetValue.value);
  };

  const handleOnModalClose = () => {
    setShowModal(() => false);
    onCloseModal?.();
  };

  const dateInputRef = useRef<HTMLDivElement>(null);

  const { inputPlaceholder } = trans[lang] || transData[lang];

  return (
    <div
      className={cn("nedt:relative nedt:flex nedt:flex-col", className)}
      {...rest}
    >
      <DateInput
        ref={dateInputRef}
        lang={lang}
        value={selectedDate}
        input={{
          nativeInput: {
            onChange: handleOnChange,
            placeholder: inputPlaceholder,
            ...nativeInput,
          },
          icon: {
            onClick: handleOnInputDateClick,
            ...inputIcon,
          },
          ...inputRest,
        }}
        {...dateInputRest}
      />

      {showModal && (
        <Modal
          inputRef={dateInputRef}
          onClose={handleOnModalClose}
          showModal={showModal}
          modalContentClassName={cn(
            "nedt:px-4 nedt:md:px-0",
            modalContentClassName,
          )}
          {...modalRest}
        >
          <Calendar
            onDateSelect={handleOnSelectDate}
            lang={lang}
            selectedDate={selectedDateRef.current}
            className={cn(
              "nedt:border nedt:border-primary nedt:rounded-md nedt:bg-base-100 nedt:text-base-content nedt:p-2 nedt:md:p-4",
              calendarClassName,
            )}
            {...calendarRest}
          />
        </Modal>
      )}
    </div>
  );
};

type DatePickerTrans = {
  [lang in Language]?: {
    inputPlaceholder: string;
  };
};
