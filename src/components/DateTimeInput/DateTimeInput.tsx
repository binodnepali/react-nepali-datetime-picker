import { forwardRef, useEffect, useState } from "react";

import CalendarClock from "@/assets/CalendarClock.svg";
import { Button } from "@/components/ui/Button/Button";
import { Hint } from "@/components/ui/Hint/Hint";
import type { InputProps } from "@/components/ui/Input/Input";
import { Input } from "@/components/ui/Input/Input";
import { cn } from "@/plugins/twMerge";
import type { HourFormat } from "@/types/HourFormat";
import type { Language } from "@/types/Language";
import type { NepaliDate } from "@/types/NepaliDate";
import type { NepaliDateTime } from "@/types/NepaliDateTime";
import type { NepaliTime } from "@/types/NepaliTime";
import {
  formatNepaliDateTime,
  MAX_ENGLISH_DATETIME_LENGTH_IN_12_FORMAT,
  MAX_ENGLISH_DATETIME_LENGTH_IN_24_FORMAT,
  MAX_NEPALI_DATETIME_LENGTH_IN_12_FORMAT,
  MAX_NEPALI_DATETIME_LENGTH_IN_24_FORMAT,
  validateNepaliDateTime,
} from "@/utils/nepaliDateTime";

export interface DateTimeInputProps {
  className?: string;
  lang?: Language;
  hourFormat?: HourFormat;
  value?: NepaliDateTime;
  input?: InputProps;
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
  fullWidth?: boolean;
}

export const DateTimeInput = forwardRef<HTMLDivElement, DateTimeInputProps>(
  function DateTimeInput(
    {
      className = "",
      input = {},
      lang = "ne",
      fullWidth = false,
      value,
      hourFormat = "12",
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
        onChange: onInputChange,
        className: nativeInputClassName = "",
        ...nativeInputRest
      } = {},
      icon: {
        children = (
          <Button variant="icon">
            <CalendarClock width="36" height="36" />
          </Button>
        ),
        ...inputIconRest
      } = {},
      className: inputClassName = "",
      ...inputRest
    } = input;

    const [val, setVal] = useState<string>("");

    const [isValid, setIsValid] = useState<boolean>(true);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const validatedDateTime = validateNepaliDateTime(value, lang, hourFormat);

      setIsValid(() => validatedDateTime.valid);

      setVal(() => value);

      e.target.value = JSON.stringify(validatedDateTime);

      onInputChange?.(e);
    };

    useEffect(() => {
      if (!value) {
        setVal(() => "");

        return;
      }

      setVal(() => formatNepaliDateTime(value, lang));

      setIsValid(() => true);
    }, [lang, value]);

    return (
      <div
        className={cn("nedt:flex nedt:flex-col", className)}
        ref={ref}
        data-auto-id="dateTimeInput"
      >
        <Input
          className={cn(fullWidth && "nedt:w-full", inputClassName)}
          nativeInput={{
            onChange: handleOnChange,
            value: val,
            className: cn(
              fullWidth && "nedt:w-full",
              showError &&
                !isValid &&
                "nedt:border-error nedt:focus:outline-error",
              showSuccess &&
                isValid &&
                val.length > 0 &&
                "nedt:border-success nedt:focus:outline-success",
              nativeInputClassName,
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

export type DateTimeInputTargetValue = {
  valid: boolean;
  value?: {
    date: NepaliDate;
    time: NepaliTime;
  };
};
