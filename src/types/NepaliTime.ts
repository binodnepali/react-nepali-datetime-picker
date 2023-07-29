export type NepaliTime = {
  value: {
    hour: number
    minute: number
    day?: string
  }
  label: {
    hour: string
    minute: string
    day?: string
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
  value: string
  label: string
}
