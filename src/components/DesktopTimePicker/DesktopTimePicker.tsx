import type { HTMLAttributes } from "react";
import { useRef, useState } from "react";

import type { DesktopTimeProps } from "@/components/DesktopTime/DesktopTime";
import { DesktopTime } from "@/components/DesktopTime/DesktopTime";
import type { ModalProps } from "@/components/Modal/Modal";
import { Modal } from "@/components/Modal/Modal";
import type {
  TimeInputProps,
  TimeInputTargetValue,
} from "@/components/TimeInput/TimeInput";
import { TimeInput } from "@/components/TimeInput/TimeInput";
import { cn } from "@/plugins/twMerge";
import transData from "@/translations/DesktopTimePicker.json";
import type { HourFormat } from "@/types/HourFormat";
import type { Language } from "@/types/Language";
import type { NepaliTime } from "@/types/NepaliTime";

interface DesktopTimePickerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  desktopTime?: DesktopTimeProps;
  hourFormat?: HourFormat;
  lang?: Language;
  modal?: ModalProps;
  onTimeSelect?: (time?: NepaliTime) => void;
  timeInput?: TimeInputProps;
  trans?: DesktopTimePickerTrans;
}

export const DesktopTimePicker = ({
  className = "",
  onTimeSelect,
  modal = {},
  timeInput = {},
  desktopTime = {},
  lang = "ne",
  hourFormat = "12",
  trans = {},
  ...rest
}: DesktopTimePickerProps) => {
  const {
    input: { nativeInput = {}, icon: inputIcon = {}, ...inputRest } = {},
    ...timeInputRest
  } = timeInput;

  const { className: timeClassName = "", ...desktopTimeRest } = desktopTime;

  const {
    onClose: onCloseModal,
    modalContentClassName = "",
    ...modalRest
  } = modal;

  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectedTime, setSelectedTime] = useState<NepaliTime>();
  const selectedTimeRef = useRef<NepaliTime>(undefined);

  const handleOnTimeSelect = (time: NepaliTime) => {
    const isTimeValid =
      hourFormat === "12" ? time?.day?.value !== undefined : true;

    if (!isTimeValid) {
      return;
    }

    setSelectedTime(() => time);
    selectedTimeRef.current = time;
    onTimeSelect?.(time);

    setShowModal(() => false);
  };

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const targetValue = JSON.parse(value) as TimeInputTargetValue;

    if (!targetValue.valid) {
      selectedTimeRef.current = undefined;
      return;
    }

    selectedTimeRef.current = targetValue.value;
    onTimeSelect?.(targetValue.value);
  };

  const handleOnIconClick = () => {
    setShowModal(() => !showModal);
  };

  const { timeInputPlaceholder12HourFormat, timeInputPlaceholder24HourFormat } =
    trans[lang] ?? transData[lang];

  const timeInputRef = useRef<HTMLDivElement>(null);

  const handleOnModalClose = () => {
    setShowModal(() => false);
    onCloseModal?.();
  };

  return (
    <div
      className={cn("nedt:relative nedt:flex nedt:flex-col", className)}
      {...rest}
    >
      <TimeInput
        selectedTime={selectedTime}
        ref={timeInputRef}
        input={{
          nativeInput: {
            onChange: handleOnInputChange,
            placeholder:
              hourFormat === "12"
                ? timeInputPlaceholder12HourFormat
                : timeInputPlaceholder24HourFormat,
            ...nativeInput,
          },
          icon: {
            onClick: handleOnIconClick,
            ...inputIcon,
          },
          ...inputRest,
        }}
        lang={lang}
        hourFormat={hourFormat}
        {...timeInputRest}
      />

      {showModal && (
        <Modal
          onClose={handleOnModalClose}
          showModal={showModal}
          inputRef={timeInputRef}
          modalContentClassName={cn(
            "nedt:px-4 nedt:md:px-0",
            modalContentClassName,
          )}
          {...modalRest}
        >
          <DesktopTime
            onTimeSelect={handleOnTimeSelect}
            selectedTime={selectedTimeRef.current}
            lang={lang}
            hourFormat={hourFormat}
            className={cn(
              "nedt:border nedt:border-primary nedt:rounded-md nedt:bg-base-100 nedt:text-base-content nedt:p-1 nedt:md:p-2",
              timeClassName,
            )}
            {...desktopTimeRest}
          />
        </Modal>
      )}
    </div>
  );
};

type DesktopTimePickerTrans = {
  [lang in Language]?: {
    timeInputPlaceholder12HourFormat: string;
    timeInputPlaceholder24HourFormat: string;
    timeInputError: string;
  };
};
