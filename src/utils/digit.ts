import digitMap from '@/constants/digit.json'

export const convertToNepaliDigit = (number: number): string => {
  const nepaliDigits: string[] = [
    '०',
    '१',
    '२',
    '३',
    '४',
    '५',
    '६',
    '७',
    '८',
    '९',
  ]
  const numberString: string = number.toString()
  let nepaliNumber = ''

  for (let i = 0; i < numberString.length; i++) {
    const digit: number = parseInt(numberString[i])
    nepaliNumber += nepaliDigits[digit]
  }

  return nepaliNumber
}

export const addLeadingNepaliZero = (number: number): string => {
  const nepaliDigit = convertToNepaliDigit(number)

  return number < 10 ? `०${nepaliDigit}` : `${nepaliDigit}`
}

export const addLeadingZero = (number: number): string => {
  return number < 10 ? `0${number}` : `${number}`
}

export const convertNepaliDigitToEnglishDigit = (number: string): number => {
  let englishNumber = ''

  const map: { [key: string]: string } = digitMap as { [key: string]: string }

  for (let i = 0; i < number.length; i++) {
    englishNumber += map[number[i]]
  }

  return parseInt(englishNumber)
}
