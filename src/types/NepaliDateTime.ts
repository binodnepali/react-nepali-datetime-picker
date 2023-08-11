import { NepaliDate } from './NepaliDate'
import { NepaliTime } from './NepaliTime'

export type NepaliDateTime = {
  valid: boolean
  date?: NepaliDate
  time?: NepaliTime
}
