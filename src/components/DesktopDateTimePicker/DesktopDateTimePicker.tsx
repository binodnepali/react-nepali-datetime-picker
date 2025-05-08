import { useEffect, useRef, useState } from "react";

import CalendarMonth from "@/assets/CalendarMonth.svg";
import ClockOutlineIcon from "@/assets/ClockOutline.svg";
import type { CalendarProps } from "@/components/Calendar/Calendar";
import { Calendar } from "@/components/Calendar/Calendar";
import type {
  DateTimeInputProps,
  DateTimeInputTargetValue,
} from "@/components/DateTimeInput/DateTimeInput";
import { DateTimeInput } from "@/components/DateTimeInput/DateTimeInput";
import type { DesktopTimeProps } from "@/components/DesktopTime/DesktopTime";
import { DesktopTime } from "@/components/DesktopTime/DesktopTime";
import type { ModalProps } from "@/components/Modal/Modal";
import { Modal } from "@/components/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { useNepaliCalendar } from "@/hooks/useNepaliCalendar";
import { useNepaliTime } from "@/hooks/useNepaliTime";
import { cn } from "@/plugins/twMerge";
import transData from "@/translations/DesktopDatetimePicker.json";
import type { NepaliTime } from "@/types";
import type { HourFormat } from "@/types/HourFormat";
import type { Language } from "@/types/Language";
import type { NepaliDate } from "@/types/NepaliDate";
import type { NepaliDateTime } from "@/types/NepaliDateTime";
import { getMonthLabel } from "@/utils/nepaliDate";
import { validateNepaliDateTime } from "@/utils/nepaliDateTime";

interface DesktopDateTimePickerProps {
  className?: string;
  lang?: Language;
  defaultValue?: string;
  fullWidth?: boolean;
  onDateTimeSelect?: (selectedDateTime?: NepaliDateTime) => void;
  modal?: ModalProps;
  hourFormat?: HourFormat;
  datetimeInput?: DateTimeInputProps;
  calendar?: CalendarProps;
  time?: DesktopTimeProps;
  trans?: DesktopDateTimePickerTrans;
}

export const DesktopDateTimePicker = ({
  className = "",
  lang = "ne",
  modal = {},
  defaultValue = "",
  fullWidth = false,
  onDateTimeSelect,
  datetimeInput = {},
  hourFormat = "12",
  calendar = {},
  time = {},
  trans = {},
}: DesktopDateTimePickerProps) => {
  const {
    input: { nativeInput, icon: inputIcon, ...inputRest } = {},
    fullWidth: dateInputFullWidth = fullWidth,
    ...dateInputRest
  } = datetimeInput;
  const { onClose: onCloseModal, ...modalRest } = modal;

  const { className: calendarClassName = "", ...calendarRest } = calendar;
  const { className: timeClassName = "", ...timeRest } = time;

  const [showModal, setShowModal] = useState<boolean>(false);
  const handleOnInputDateClick = () => {
    setShowModal(() => true);
  };
  const handleOnModalClose = () => {
    setShowModal(() => false);
    onCloseModal?.();
  };
  const handleOnCancel = () => {
    setShowModal(() => false);
    onCloseModal?.();
  };

  const [selectedDateTime, setSelectedDateTime] = useState<NepaliDateTime>();
  const selectedDateTimeRef = useRef<NepaliDateTime>(undefined);
  useEffect(() => {
    const validatedDateTime = validateNepaliDateTime(
      defaultValue,
      lang,
      hourFormat,
    );

    setSelectedDateTime(() => ({
      ...(validatedDateTime.value ?? {}),
    }));

    selectedDateTimeRef.current = {
      ...(validatedDateTime.value ?? {}),
    };
  }, [defaultValue, hourFormat, lang]);

  const handleOnSelectDate = (date: NepaliDate) => {
    const isTimeValid =
      hourFormat === "12"
        ? selectedDateTime?.time?.day?.value !== undefined
        : true;

    const dateTime = {
      valid: isTimeValid,
      date,
      ...(selectedDateTime?.time ? { time: selectedDateTime.time } : {}),
    };
    if (isTimeValid) {
      onDateTimeSelect?.({
        date,
        ...(selectedDateTime?.time ? { time: selectedDateTime.time } : {}),
      });
    } else {
      onDateTimeSelect?.();
    }
    setSelectedDateTime(() => dateTime);
    selectedDateTimeRef.current = dateTime;
  };
  const handleOnTimeSelect = (time: NepaliTime) => {
    const isTimeValid =
      hourFormat === "12" ? time.day?.value !== undefined : true;
    const valid = selectedDateTime?.date && isTimeValid ? true : false;

    const dateTime = {
      valid,
      ...(isTimeValid ? { time } : {}),
      ...(selectedDateTime?.date ? { date: selectedDateTime.date } : {}),
    };

    if (valid) {
      onDateTimeSelect?.({
        ...(selectedDateTime?.date ? { date: selectedDateTime.date } : {}),
        ...(isTimeValid ? { time } : {}),
      });
    } else {
      onDateTimeSelect?.();
    }
    setSelectedDateTime(() => dateTime);
    selectedDateTimeRef.current = dateTime;
  };

  const handleOnDateTimeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;

    const targetValue = JSON.parse(value) as DateTimeInputTargetValue;

    if (targetValue.valid) {
      onDateTimeSelect?.({
        ...(targetValue.valid
          ? {
              date: targetValue.value?.date,
              time: targetValue.value?.time,
            }
          : {}),
      });
    } else {
      onDateTimeSelect?.();
    }

    selectedDateTimeRef.current = {
      ...(targetValue.valid
        ? {
            date: targetValue.value?.date,
            time: targetValue.value?.time,
          }
        : {}),
    };
  };
  const handleOnConfirm = () => {
    if (!selectedDateTime) {
      return;
    }
    onDateTimeSelect?.({
      date: selectedDateTime.date,
      time: selectedDateTime.time,
    });
    setShowModal(() => false);
  };

  const dateTimeInputRef = useRef<HTMLInputElement>(null);

  const [currentView, setCurrentView] = useState<"calendar" | "time">(
    "calendar",
  );
  const [userClickedOn, setUserClickedOn] = useState<
    "year" | "monthdate" | "hour" | "minute" | "AM" | "PM"
  >();
  const [timeDay, setTimeDay] = useState<"AM" | "PM">();
  const handleOnUserClickedOn = (
    userClickedOn: "year" | "monthdate" | "hour" | "minute" | "AM" | "PM",
  ) => {
    switch (userClickedOn) {
      case "year":
      case "monthdate":
        setCurrentView(() => "calendar");
        break;
      case "hour":
      case "minute":
        setCurrentView(() => "time");
        break;
      default:
        break;
    }
    setUserClickedOn(() => userClickedOn);
  };

  const handleOnTimeDaySelect = (timeDay: "AM" | "PM") => {
    setCurrentView(() => "time");

    setTimeDay(() => timeDay);
  };

  useEffect(() => {
    if (!selectedDateTime?.time?.day?.value) {
      return;
    }
    setTimeDay(() => selectedDateTime.time?.day?.value as "AM" | "PM");
  }, [selectedDateTime]);

  const {
    currentTime: { hour: currentHour, minute: currentMinute },
    timeDays,
  } = useNepaliTime({
    hourFormat,
    lang,
  });

  const {
    selectedLocalisedYear,
    selectedLocalisedMonth,
    currentLocalisedDate,
  } = useNepaliCalendar({
    lang,
    shortMonth: true,
  });

  const {
    title = "",
    cancel = "",
    confirm = "",
    dateTimeInputPlaceholder12HourFormat = "",
    dateTimeInputPlaceholder24HourFormat = "",
  } = trans[lang] ?? transData[lang];

  return (
    <div className={cn("nedt:relative nedt:flex nedt:flex-col", className)}>
      <DateTimeInput
        ref={dateTimeInputRef}
        lang={lang}
        value={selectedDateTime}
        hourFormat={hourFormat}
        input={{
          nativeInput: {
            onChange: handleOnDateTimeInputChange,
            placeholder:
              hourFormat === "12"
                ? dateTimeInputPlaceholder12HourFormat
                : dateTimeInputPlaceholder24HourFormat,
            ...nativeInput,
          },
          icon: {
            onClick: handleOnInputDateClick,
            ...inputIcon,
          },
          ...inputRest,
        }}
        fullWidth={dateInputFullWidth}
        {...dateInputRest}
      />

      {showModal && (
        <Modal
          onClose={handleOnModalClose}
          showModal={showModal}
          inputRef={dateTimeInputRef}
          dataAutoId="desktop-date-time-picker-modal"
          modalContentClassName="nedt:border nedt:border-primary nedt:rounded-md nedt:bg-base-100 nedt:text-base-content nedt:flex nedt:flex-col nedt:md:flex-row nedt:mx-4 nedt:md:mx-0 nedt:max-h-full nedt:overflow-y-auto"
          {...modalRest}
        >
          <div className="nedt:p-4 nedt:rounded-t-md nedt:md:hidden">
            <p className="nedt:text-neutral-500 nedt:text-sm nedt:font-normal">
              {title}
            </p>

            <div className="nedt:grid nedt:grid-cols-2">
              <div>
                <Button
                  variant="text"
                  onClick={() => handleOnUserClickedOn("year")}
                >
                  <span
                    className={cn(
                      "nedt:text-neutral-500 nedt:text-base nedt:font-normal",
                      userClickedOn === "year" && "nedt:text-neutral-900",
                    )}
                  >
                    {selectedDateTime?.date?.year.label ??
                      selectedLocalisedYear.label}
                  </span>
                </Button>

                <Button
                  variant="text"
                  onClick={() => handleOnUserClickedOn("monthdate")}
                >
                  <span
                    className={cn(
                      "nedt:text-neutral-500 nedt:text-4xl nedt:font-normal",
                      userClickedOn === "monthdate" && "nedt:text-neutral-900",
                    )}
                  >
                    {`${
                      getMonthLabel(
                        lang,
                        selectedDateTime?.date?.month.value,
                        true,
                      ) ?? selectedLocalisedMonth.label
                    } ${
                      selectedDateTime?.date?.date?.label ??
                      currentLocalisedDate?.label
                    }`}
                  </span>
                </Button>
              </div>

              <div className="nedt:flex nedt:flex-row nedt:justify-end nedt:gap-4">
                <div className="nedt:flex nedt:flex-row  nedt:items-center">
                  <Button
                    variant="text"
                    onClick={() => handleOnUserClickedOn("hour")}
                  >
                    <span
                      className={cn(
                        "nedt:text-neutral-500 nedt:text-5xl nedt:font-normal",
                        userClickedOn === "hour" && "nedt:text-neutral-900",
                      )}
                    >
                      {selectedDateTime?.time?.hour.label ?? currentHour.label}
                    </span>
                  </Button>
                  <span className="nedt:text-neutral-500 nedt:text-5xl nedt:font-normal">
                    :
                  </span>
                  <Button
                    variant="text"
                    onClick={() => handleOnUserClickedOn("minute")}
                  >
                    <span
                      className={cn(
                        "nedt:text-neutral-500 nedt:text-5xl nedt:font-normal",
                        userClickedOn === "minute" && "nedt:text-neutral-900",
                      )}
                    >
                      {selectedDateTime?.time?.minute?.label ??
                        currentMinute.label}
                    </span>
                  </Button>
                </div>

                {timeDays.length > 0 && (
                  <div
                    className={cn(
                      "nedt:flex nedt:flex-col nedt:gap-1 nedt:justify-center",
                    )}
                  >
                    {timeDays.map((td, index) => (
                      <Button
                        variant="text"
                        onClick={() => handleOnTimeDaySelect(td.value)}
                        selected={timeDay === td.value}
                        key={index}
                      >
                        <span
                          key={userClickedOn}
                          className={cn(
                            "nedt:text-neutral-500 nedt:text-base nedt:font-medium",
                            timeDay === td.value && "nedt:text-neutral-900",
                          )}
                        >
                          {td.label}
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="nedt:grid nedt:grid-cols-2 nedt:place-items-center nedt:pt-2 nedt:md:hidden">
            <div
              className={cn(
                "nedt:flex nedt:flex-col nedt:items-center nedt:w-full",
                currentView === "calendar" &&
                  "nedt:border-b-2 nedt:border-gray-500",
              )}
            >
              <CalendarMonth
                width="36"
                height="36"
                onClick={() => setCurrentView(() => "calendar")}
              />
            </div>

            <div
              className={cn(
                "nedt:flex nedt:flex-col nedt:items-center nedt:w-full",
                currentView === "time" &&
                  "nedt:border-b-2 nedt:border-gray-500",
              )}
            >
              <ClockOutlineIcon
                width="36"
                height="36"
                onClick={() => setCurrentView(() => "time")}
              />
            </div>
          </div>

          {currentView === "calendar" && (
            <Calendar
              onDateSelect={handleOnSelectDate}
              lang={lang}
              selectedDate={selectedDateTimeRef?.current?.date}
              openYearSelector={userClickedOn === "year"}
              className={cn(
                "nedt:md:border-r nedt:border-primary nedt:p-2 nedt:md:p-4 nedt:md:min-w-max",
                calendarClassName,
              )}
              {...calendarRest}
            />
          )}

          {currentView === "time" && (
            <div className="nedt:block nedt:w-full nedt:md:hidden">
              <DesktopTime
                className={cn("nedt:p-1 nedt:md:p-2", timeClassName)}
                onTimeSelect={handleOnTimeSelect}
                selectedTime={selectedDateTimeRef?.current?.time}
                lang={lang}
                hourFormat={hourFormat}
                {...timeRest}
              />
            </div>
          )}

          <div className="nedt:p-4 nedt:flex nedt:flex-row nedt:justify-end nedt:gap-4 nedt:rounded-b-md nedt:md:hidden ">
            <Button variant="outline" onClick={handleOnCancel}>
              {cancel}
            </Button>

            <Button variant="outline" onClick={handleOnConfirm}>
              {confirm}
            </Button>
          </div>

          <div className="nedt:hidden nedt:md:block">
            <DesktopTime
              onTimeSelect={handleOnTimeSelect}
              selectedTime={selectedDateTimeRef?.current?.time}
              className={cn("nedt:p-1 nedt:md:p-2", timeClassName)}
              lang={lang}
              hourFormat={hourFormat}
              {...timeRest}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export type DesktopDateTimePickerTrans = {
  [lang in Language]?: {
    title?: string;
    cancel?: string;
    confirm?: string;
    dateTimeInputPlaceholder12HourFormat?: string;
    dateTimeInputPlaceholder24HourFormat?: string;
    dateTimeInputError?: string;
  };
};
