export type NepaliTime = {
  hour: {
    value: number
    label: string
  }
  minute: {
    value: number
    label: string
  }
  day?: {
    value: string
    label: string
  }
}

export const NepaliAMOrPM = {
  AM: 'विहानी',
  PM: 'बेलुका',
} as const

export const EnglishAMOrPM = {
  AM: 'AM',
  PM: 'PM',
} as const

export type Time = {
  value: number
  label: string
}

export type Day = {
  value?: string
  label?: string
}
