import dayjs, { Dayjs } from 'dayjs'
import neLocale from 'dayjs/locale/ne'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale(neLocale)

export { Dayjs, dayjs }
