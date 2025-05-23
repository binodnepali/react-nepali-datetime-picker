export const months = [
  {
    label: {
      en: {
        long: 'Baishakh',
        short: 'Bai',
      },
      ne: {
        long: 'बैशाख',
        short: 'बैशा',
      },
    },
    value: {
      en: 0,
      ne: '०१',
    },
  },
  {
    label: {
      en: {
        long: 'Jestha',
        short: 'Jes',
      },
      ne: {
        long: 'जेठ',
        short: 'जेठ',
      },
    },
    value: {
      en: 1,
      ne: '०२',
    },
  },
  {
    label: {
      en: {
        long: 'Ashad',
        short: 'Ash',
      },
      ne: {
        long: 'असार',
        short: 'असा',
      },
    },
    value: {
      en: 2,
      ne: '०३',
    },
  },
  {
    label: {
      en: {
        long: 'Shrawan',
        short: 'Shra',
      },
      ne: {
        long: 'साउन',
        short: 'साउ',
      },
    },
    value: {
      en: 3,
      ne: '०४',
    },
  },
  {
    label: {
      en: {
        long: 'Bhadra',
        short: 'Bha',
      },
      ne: {
        long: 'भदौ',
        short: 'भदौ',
      },
    },

    value: {
      en: 4,
      ne: '०५',
    },
  },
  {
    label: {
      en: {
        long: 'Ashwin',
        short: 'Ash',
      },
      ne: {
        long: 'असोज',
        short: 'असो',
      },
    },
    value: {
      en: 5,
      ne: '०६',
    },
  },
  {
    label: {
      en: {
        long: 'Kartik',
        short: 'Kar',
      },
      ne: {
        long: 'कार्तिक',
        short: 'कार्ति',
      },
    },
    value: {
      en: 6,
      ne: '०७',
    },
  },
  {
    label: {
      en: {
        long: 'Mangsir',
        short: 'Man',
      },
      ne: {
        long: 'मंसिर',
        short: 'मंसि',
      },
    },
    value: {
      en: 7,
      ne: '०८',
    },
  },
  {
    label: {
      en: {
        long: 'Poush',
        short: 'Pou',
      },
      ne: {
        long: 'पौष',
        short: 'पौष',
      },
    },
    value: {
      en: 8,
      ne: '०९',
    },
  },
  {
    label: {
      en: {
        long: 'Magh',
        short: 'Mag',
      },
      ne: {
        long: 'माघ',
        short: 'माघ',
      },
    },
    value: {
      en: 9,
      ne: '१०',
    },
  },
  {
    label: {
      en: {
        long: 'Falgun',
        short: 'Fal',
      },
      ne: {
        long: 'फाल्गुन',
        short: 'फाल्गु',
      },
    },
    value: {
      en: 10,
      ne: '११',
    },
  },
  {
    label: {
      en: {
        long: 'Chaitra',
        short: 'Cha',
      },
      ne: {
        long: 'चैत्र',
        short: 'चैत्र',
      },
    },
    value: {
      en: 11,
      ne: '१२',
    },
  },
] as const

/**
 * @description
 * This is the data for the months of the year.
 * The first element of the tuple is the number of days in each month.
 * Each month is an array of 3 elements. The first element is the number of days after which the month starts and the second element is the number of days in the month. The third element is the number of days after which next month starts.
 * The second element of the tuple is the total number of days in the year.
 * The data is from 2000 BS to 2099 BS.
 */
export const monthsData: Array<[Array<[number, number, number]>, number]> = [
  [
    [
      [0, 30, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    365,
  ], // 2000 BS - 1943/1944 AD
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2001 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2002 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2003 BS
  [
    [
      [0, 30, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    365,
  ], // 2004 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2005 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2006 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2007 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    365,
  ], // 2008 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2009 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2010 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2011 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2012 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2013 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2014 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2015 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2016 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2017 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2018 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2019 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2020 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2021 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2022 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2023 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2024 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2025 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2026 BS
  [
    [
      [0, 30, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    365,
  ], // 2027 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2028 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2029 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2030 BS
  [
    [
      [0, 30, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    365,
  ], // 2031 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2032 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2033 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2034 BS
  [
    [
      [0, 30, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    365,
  ], // 2035 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2036 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2037 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2038 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2039 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2040 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2041 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2042 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2043 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2044 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2045 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2046 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2047 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2048 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2049 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2050 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2051 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2052 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2053 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2054 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2055 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2056 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2057 BS
  [
    [
      [0, 30, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    365,
  ], // 2058 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2059 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2060 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2061 BS
  [
    [
      [0, 30, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    365,
  ], // 2062 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2063 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2064 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2065 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    365,
  ], // 2066 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2067 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2068 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2069 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2070 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2071 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2072 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2073 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2074 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2075 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2076 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    366,
  ], // 2077 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2078 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2079 BS
  [
    [
      [5, 31, 6],
      [1, 32, 9],
      [5, 31, 6],
      [1, 32, 9],
      [5, 31, 6],
      [1, 30, 11],
      [3, 30, 9],
      [5, 30, 7],
      [0, 29, 13],
      [1, 29, 12],
      [2, 30, 10],
      [4, 30, 8],
    ],
    365,
  ], // 2080 BS
  [
    [
      [6, 31, 5],
      [2, 32, 8],
      [6, 31, 5],
      [2, 32, 8],
      [6, 31, 5],
      [2, 30, 10],
      [4, 30, 8],
      [6, 30, 6],
      [1, 29, 12],
      [2, 30, 10],
      [4, 29, 9],
      [5, 31, 6],
    ],
    366,
  ], // 2081 BS
  [
    [
      [1, 31, 10],
      [4, 31, 7],
      [0, 32, 10],
      [4, 31, 7],
      [0, 31, 11],
      [3, 31, 8],
      [6, 30, 6],
      [1, 29, 12],
      [2, 30, 10],
      [4, 29, 9],
      [5, 30, 7],
      [0, 30, 12],
    ],
    365,
  ], // 2082 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2083 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2084 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 30, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    366,
  ], // 2085 BS
  [
    [
      [0, 30, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2086 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    366,
  ], // 2087 BS
  [
    [
      [0, 30, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 30, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2088 BS
  [
    [
      [0, 30, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2089 BS
  [
    [
      [0, 30, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2090 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    366,
  ], // 2091 BS
  [
    [
      [0, 30, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2092 BS
  [
    [
      [0, 30, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2093 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2094 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    366,
  ], // 2095 BS
  [
    [
      [0, 30, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    364,
  ], // 2096 BS
  [
    [
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    366,
  ], // 2097 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 31, 0],
    ],
    365,
  ], // 2098 BS
  [
    [
      [0, 31, 0],
      [0, 31, 0],
      [0, 32, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 31, 0],
      [0, 30, 0],
      [0, 29, 0],
      [0, 29, 0],
      [0, 30, 0],
      [0, 30, 0],
      [0, 30, 0],
    ],
    365,
  ], // 2099 BS - 2042/2043 AD
]
