import type { BsLocale } from './types'

export const BS_MIN_YEAR = 2000
export const BS_MAX_YEAR = 2089

export const BS_MONTHS = [
  { en: { long: 'Baishakh', short: 'Bai' }, ne: { long: 'बैशाख', short: 'बैशा' } },
  { en: { long: 'Jestha', short: 'Jes' }, ne: { long: 'जेठ', short: 'जेठ' } },
  { en: { long: 'Ashad', short: 'Ash' }, ne: { long: 'असार', short: 'असा' } },
  { en: { long: 'Shrawan', short: 'Shra' }, ne: { long: 'साउन', short: 'साउ' } },
  { en: { long: 'Bhadra', short: 'Bha' }, ne: { long: 'भदौ', short: 'भदौ' } },
  { en: { long: 'Ashwin', short: 'Ash' }, ne: { long: 'असोज', short: 'असो' } },
  { en: { long: 'Kartik', short: 'Kar' }, ne: { long: 'कात्तिक', short: 'कात' } },
  { en: { long: 'Mangsir', short: 'Man' }, ne: { long: 'मंसिर', short: 'मंसि' } },
  { en: { long: 'Paush', short: 'Pau' }, ne: { long: 'पुष', short: 'पुष' } },
  { en: { long: 'Magh', short: 'Mag' }, ne: { long: 'माघ', short: 'माघ' } },
  { en: { long: 'Falgun', short: 'Fal' }, ne: { long: 'फागुन', short: 'फाग' } },
  { en: { long: 'Chaitra', short: 'Cha' }, ne: { long: 'चैत', short: 'चैत' } },
] as const

export const BS_WEEKDAYS = [
  { en: { long: 'Sunday', short: 'Sun' }, ne: { long: 'आइतबार', short: 'आइत' } },
  { en: { long: 'Monday', short: 'Mon' }, ne: { long: 'सोमबार', short: 'सोम' } },
  { en: { long: 'Tuesday', short: 'Tue' }, ne: { long: 'मङ्गलबार', short: 'मङ्गल' } },
  { en: { long: 'Wednesday', short: 'Wed' }, ne: { long: 'बुधबार', short: 'बुध' } },
  { en: { long: 'Thursday', short: 'Thu' }, ne: { long: 'बिहिबार', short: 'बिहि' } },
  { en: { long: 'Friday', short: 'Fri' }, ne: { long: 'शुक्रबार', short: 'शुक्र' } },
  { en: { long: 'Saturday', short: 'Sat' }, ne: { long: 'शनिबार', short: 'शनि' } },
] as const

const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'] as const

export function toNepaliDigit(value: number | string): string {
  return String(value)
    .split('')
    .map((char) => {
      const digit = Number(char)
      return Number.isNaN(digit) ? char : NEPALI_DIGITS[digit]
    })
    .join('')
}

export function pad2(value: number, locale: BsLocale): string {
  const padded = value.toString().padStart(2, '0')
  return locale === 'ne' ? toNepaliDigit(padded) : padded
}

export function getMonthLabel(month: number, locale: BsLocale, short = false): string {
  const entry = BS_MONTHS[month - 1]
  if (!entry) return ''
  return short ? entry[locale].short : entry[locale].long
}

export function getWeekdayLabel(weekday: number, locale: BsLocale, short = true): string {
  const entry = BS_WEEKDAYS[weekday]
  if (!entry) return ''
  return short ? entry[locale].short : entry[locale].long
}

export function getYearOptions(): number[] {
  return Array.from(
    { length: BS_MAX_YEAR - BS_MIN_YEAR + 1 },
    (_, index) => BS_MIN_YEAR + index,
  )
}
