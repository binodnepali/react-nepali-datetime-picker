import { forwardRef, useEffect, useState } from "react";

import ClockOutlineIcon from "@/assets/ClockOutline.svg";
import { Button } from "@/components/ui/Button/Button";
import { Hint } from "@/components/ui/Hint/Hint";
import type { InputProps } from "@/components/ui/Input/Input";
import { Input } from "@/components/ui/Input/Input";
import { cn } from "@/plugins/twMerge";
import type { NepaliTime } from "@/types";
import type { HourFormat } from "@/types/HourFormat";
import type { Language } from "@/types/Language";
import {
  formatTime,
  MAX_ENGLISH_DATETIME_LENGTH_IN_12_FORMAT,
  MAX_ENGLISH_DATETIME_LENGTH_IN_24_FORMAT,
  MAX_NEPALI_DATETIME_LENGTH_IN_12_FORMAT,
  MAX_NEPALI_DATETIME_LENGTH_IN_24_FORMAT,
  validateTime,
} from "@/utils/nepaliTime";

export type TimeInputTargetValue = {
  valid: boolean;
  value?: NepaliTime;
};

export interface TimeInputProps {
  className?: string;
  selectedTime?: NepaliTime;
  input?: InputProps;
  lang?: Language;
  hourFormat?: HourFormat;
  fullWidth?: boolean;
  error?: {
    message?: string;
    show?: boolean;
    rootClassName?: string;
    className?: string;
  };
  success?: {
    message?: string;
    show?: boolean;
    rootClassName?: string;
    className?: string;
  };
}
export const TimeInput = forwardRef<HTMLDivElement, TimeInputProps>(
  function TimeInput(
    {
      className = "",
      lang = "ne",
      input = {},
      fullWidth = false,
      hourFormat = "12",
      selectedTime,
      error: {
        message: errorMessage = "",
        show: showError = false,
        rootClassName: errorRootClassName = "",
        className: errorClassName = "",
      } = {},
      success: {
        message: successMessage = "",
        show: showSuccess = false,
        rootClassName: successRootClassName = "",
        className: successClassName = "",
      } = {},
    },
    ref,
  ) {
    const {
      nativeInput: {
        value,
        onChange,
        className: nativeInputClassName = "",
        ...nativeInputRest
      } = {},
      icon: {
        children = (
          <Button variant="icon">
            <ClockOutlineIcon
              width={"36"}
              height={"36"}
              className="nedt:rounded-full nedt:p-1 nedt:bg-base-100 nedt:hover:bg-base-200 nedt:fill-base-content"
            />
          </Button>
        ),
        ...inputIconRest
      } = {},
      className: inputClassName = "",
      ...inputRest
    } = input;

    const [val, setVal] = useState<string>(value || "");
    const [isValid, setIsValid] = useState<boolean>(true);

    const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      if (
        (lang === "ne" &&
          hourFormat === "12" &&
          value.length > MAX_NEPALI_DATETIME_LENGTH_IN_12_FORMAT) ||
        (lang === "ne" &&
          hourFormat === "24" &&
          value.length > MAX_NEPALI_DATETIME_LENGTH_IN_24_FORMAT) ||
        (lang === "en" &&
          hourFormat === "12" &&
          value.length > MAX_ENGLISH_DATETIME_LENGTH_IN_12_FORMAT) ||
        (lang === "en" &&
          hourFormat === "24" &&
          value.length > MAX_ENGLISH_DATETIME_LENGTH_IN_24_FORMAT)
      ) {
        return;
      }

      const { valid, value: validatedValue } = validateTime(
        value,
        lang,
        hourFormat,
      );

      setIsValid(() => valid);

      setVal(() => value);

      e.target.value = JSON.stringify({
        valid,
        ...(valid ? { value: validatedValue } : {}),
      });

      onChange?.(e);
    };

    useEffect(() => {
      if (!selectedTime) {
        setVal(() => "");

        return;
      }
      const formattedTime = formatTime(selectedTime, lang, hourFormat);

      const { valid } = validateTime(formattedTime, lang, hourFormat);

      setVal(() => formattedTime);

      setIsValid(() => valid);
    }, [hourFormat, lang, selectedTime, value]);

    return (
      <div className={cn("nedt:flex nedt:flex-col", className)} ref={ref}>
        <Input
          className={cn(inputClassName, fullWidth && "nedt:w-full")}
          nativeInput={{
            value: val,
            onChange: handleOnInputChange,
            className: cn(
              nativeInputClassName,
              fullWidth && "nedt:w-full",
              showError &&
                !isValid &&
                "nedt:border-error focus:nedt:outline-error",
              showSuccess &&
                isValid &&
                val.length > 0 &&
                "nedt:border-success focus:nedt:outline-success",
            ),
            ...nativeInputRest,
          }}
          icon={{
            children,
            ...inputIconRest,
          }}
          {...inputRest}
        />

        {showError && errorMessage && !isValid && (
          <div
            className={cn(
              "nedt:absolute nedt:bottom-0 nedt:left-0 nedt:translate-y-full",
              errorRootClassName,
            )}
          >
            <Hint errorMessage={errorMessage} errorClassName={errorClassName} />
          </div>
        )}

        {showSuccess && successMessage && isValid && val.length > 0 && (
          <div
            className={cn(
              "nedt:absolute nedt:bottom-0 nedt:left-0 nedt:translate-y-full",
              successRootClassName,
            )}
          >
            <Hint
              successMessage={successMessage}
              successClassName={successClassName}
            />
          </div>
        )}
      </div>
    );
  },
);
