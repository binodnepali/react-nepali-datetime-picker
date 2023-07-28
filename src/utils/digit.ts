const DIGIT_MAP: {
  [key: string]: string
} = {
  '०': '0',
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
} as const

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

  for (let i = 0; i < number.length; i++) {
    englishNumber += DIGIT_MAP[number[i]]
  }

  return parseInt(englishNumber)
}
