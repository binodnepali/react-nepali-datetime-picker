import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import neLocale from 'dayjs/locale/ne';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(neLocale);

export { dayjs };
