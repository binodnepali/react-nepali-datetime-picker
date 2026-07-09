import { pad2, toNepaliDigit } from "../../bs-day-picker/constants";
import { formatBsDatePattern } from "../../bs-day-picker/pattern";
import type { BsDate, BsLocale } from "../../bs-day-picker/types";
import { to12Hour } from "./helpers";
import { formatPeriodLabel } from "./formatters";
import type { BsDateTime, BsTime } from "./types";

/** Default time picker trigger pattern (12-hour). */
export const BS_TIME_DISPLAY_PATTERN = "h:mm a";

/** Default datetime picker trigger pattern (12-hour). */
export const BS_DATETIME_DISPLAY_PATTERN = "EEEE, d MMMM yyyy, h:mm a";

const TIME_PATTERN_TOKEN = /'([^']*)'|(HH|H|hh|h|mm|m|a)/g;

const DATETIME_PATTERN_TOKEN =
  /'([^']*)'|(EEEE|EEE|MMMM|MMM|yyyy|yy|MM|M|dd|d|HH|H|hh|h|mm|m|a)/g;

function formatHour24(hour: number, token: string, locale: BsLocale): string {
  if (token === "HH") return pad2(hour, locale);
  return locale === "ne" ? toNepaliDigit(hour) : String(hour);
}

function formatHour12(hour12: number, token: string, locale: BsLocale): string {
  if (token === "hh") return pad2(hour12, locale);
  return locale === "ne" ? toNepaliDigit(hour12) : String(hour12);
}

function formatMinute(minute: number, token: string, locale: BsLocale): string {
  if (token === "mm") return pad2(minute, locale);
  return locale === "ne" ? toNepaliDigit(minute) : String(minute);
}

function resolveTimeToken(
  time: BsTime,
  token: string,
  locale: BsLocale,
  is24Hour: boolean,
): string {
  const { hour: hour12, period } = to12Hour(time.hour);

  switch (token) {
    case "HH":
    case "H":
      return formatHour24(time.hour, token, locale);
    case "hh":
    case "h":
      if (is24Hour) {
        return formatHour24(time.hour, token === "hh" ? "HH" : "H", locale);
      }
      return formatHour12(hour12, token, locale);
    case "mm":
    case "m":
      return formatMinute(time.minute, token, locale);
    case "a":
      if (is24Hour) return "";
      return formatPeriodLabel(period, locale);
    default:
      return token;
  }
}

/** Format BS time with date-fns-style tokens. */
export function formatBsTimePattern(
  time: BsTime,
  pattern: string,
  locale: BsLocale = "en",
  is24Hour = false,
): string {
  const formatted = pattern.replace(
    TIME_PATTERN_TOKEN,
    (_match, literal, token) => {
      if (literal != null) return literal;
      return resolveTimeToken(time, token, locale, is24Hour);
    },
  );
  return formatted.replace(/\s+/g, " ").trim();
}

/** Format BS date + time with date-fns-style tokens. */
export function formatBsDateTimePattern(
  value: BsDateTime,
  pattern: string,
  locale: BsLocale = "en",
  is24Hour = false,
): string {
  const date: BsDate = {
    year: value.year,
    month: value.month,
    day: value.day,
  };
  const time: BsTime = { hour: value.hour, minute: value.minute };

  const formatted = pattern.replace(
    DATETIME_PATTERN_TOKEN,
    (_match, literal, token) => {
      if (literal != null) return literal;
      if (
        token === "HH" ||
        token === "H" ||
        token === "hh" ||
        token === "h" ||
        token === "mm" ||
        token === "m" ||
        token === "a"
      ) {
        return resolveTimeToken(time, token, locale, is24Hour);
      }
      return formatBsDatePattern(date, token, locale);
    },
  );

  return formatted.replace(/\s+,/g, ",").replace(/\s+/g, " ").trim();
}
