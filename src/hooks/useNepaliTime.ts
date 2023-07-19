import { dayjs } from '@/plugins/dayjs'

import { addLeadingNepaliZero, addLeadingZero } from '@/utils/digit'

export const useNepaliTime = () => {
  const date = dayjs().tz('Asia/Kathmandu')

  const hour = date.hour()
  const minute = date.minute()

  return {
    value: {
      hour,
      minute,
    },
    label: {
      hour: {
        ne: addLeadingNepaliZero(hour),
        en: addLeadingZero(hour),
      },
      minute: {
        ne: addLeadingNepaliZero(minute),
        en: addLeadingZero(minute),
      },
    },
  }
}
