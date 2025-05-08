import { forwardRef, useEffect, useState } from "react";

import CalendarMonth from "@/assets/CalendarMonth.svg";
import { Button } from "@/components/ui/Button/Button";
import { Hint } from "@/components/ui/Hint/Hint";
import type { InputProps } from "@/components/ui/Input/Input";
import { Input } from "@/components/ui/Input/Input";
import { cn } from "@/plugins/twMerge";
import type { Language } from "@/types/Language";
import type { NepaliDate } from "@/types/NepaliDate";
import {
  formatNepaliDate,
  MAX_DATE_LENGTH,
  validateDate,
} from "@/utils/nepaliDate";

export interface DateInputProps {
  className?: string;
  lang?: Language;
  value?: NepaliDate;
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

export const DateInput = forwardRef<HTMLDivElement, DateInputProps>(
  function DateInput(
    {
      className = "",
      input = {},
      lang = "ne",
      fullWidth = false,
      value,
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
    }: DateInputProps,
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
            <CalendarMonth
              width="36"
              height="36"
              className="nedt:rounded-full nedt:p-1 nedt:bg-base-100 nedt:hover:bg-base-200 nedt:fill-base-content"
            />
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

      if (value.length > MAX_DATE_LENGTH) {
        return;
      }

      const { valid, value: val } = validateDate(value, lang);

      setIsValid(() => valid);

      setVal(() => value);

      e.target.value = JSON.stringify({
        isValid: valid,
        ...(valid
          ? {
              value: val,
            }
          : {}),
      });

      onInputChange?.(e);
    };

    useEffect(() => {
      if (!value) {
        setVal(() => "");

        return;
      }

      setVal(() => formatNepaliDate(value, lang));
      setIsValid(() => true);
    }, [lang, value]);

    return (
      <div className={cn("nedt:flex nedt:flex-col", className)} ref={ref}>
        <Input
          className={cn(inputClassName, fullWidth && "nedt:w-full")}
          nativeInput={{
            onChange: handleOnChange,
            value: val,
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

export type DateInputTargetValue = {
  valid: boolean;
  value: NepaliDate | undefined;
};
