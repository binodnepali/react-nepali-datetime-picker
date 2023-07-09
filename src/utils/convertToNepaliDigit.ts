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
  ];
  const numberString: string = number.toString();
  let nepaliNumber = '';

  for (let i = 0; i < numberString.length; i++) {
    const digit: number = parseInt(numberString[i]);
    nepaliNumber += nepaliDigits[digit];
  }

  return nepaliNumber;
};
