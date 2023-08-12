import { useEffect, useState } from 'react'

import type { Language, NepaliDate, NepaliDateTime, NepaliTime } from '.'
import {
  DatePicker,
  DateTimePicker,
  StaticCalendar,
  StaticTime,
  TimePicker,
} from '.'

export default function App() {
  const { toggleTheme } = useThemeToggle()
  const [selectLang, setSelectLang] = useState<Language>('ne')

  const [selectedDate, setSelectedDate] = useState<NepaliDate>()
  const handleOnDateSelect = (date?: NepaliDate) => {
    if (!date) {
      setSelectedDate(undefined)
      return
    }

    setSelectedDate(date)
  }

  const [time, setTime] = useState<NepaliTime>()
  const handleOnTimeSelect = (time?: NepaliTime) => {
    if (!time) {
      setTime(undefined)
      return
    }

    setTime(time)
  }

  const [dateTime, setDateTime] = useState<NepaliDateTime>()
  const handleOnDateTimeSelect = (date: NepaliDateTime) => {
    if (!date.valid) {
      setDateTime(undefined)
      return
    }

    setDateTime(date)
  }

  return (
    <div className="p-4 min-h-screen">
      <p className="text-lg text-gray-600">
        This is a playground for rendering components.
      </p>

      <div className="flex flex-col max-w-lg mt-4 md:mt-6">
        <div>
          <label htmlFor="lang" className="text-lg mr-2">
            Choose Language
          </label>
          <select
            className="py-2 px-4 text-lg bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none w-fit"
            onChange={(e) => setSelectLang(e.target.value as Language)}
          >
            <option value="ne">Nepali</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="mt-4">
          <label htmlFor="theme" className="text-lg mr-2">
            Choose Theme
          </label>
          <select
            className="py-2 px-4 text-lg bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none w-fit"
            onChange={(e) => toggleTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col max-w-lg mt-4 md:mt-6">
        <div className="mb-8">
          <label htmlFor="datepicker" className="text-lg">
            Date Picker
          </label>

          <DatePicker
            lang={selectLang}
            dateInput={{
              fullWidth: true,
            }}
            onDateSelect={handleOnDateSelect}
          />

          {selectedDate && <p>{JSON.stringify(selectedDate)}</p>}
        </div>

        <div className="mb-8">
          <label htmlFor="timepicker" className="text-lg">
            Time Picker
          </label>

          <TimePicker
            lang={selectLang}
            timeInput={{
              fullWidth: true,
            }}
            onTimeSelect={handleOnTimeSelect}
          />

          {time && <p>{JSON.stringify(time)}</p>}
        </div>

        <div className="mb-8">
          <label htmlFor="datetimepicker" className="text-lg">
            Datetime Picker
          </label>

          <DateTimePicker
            lang={selectLang}
            dateInput={{
              fullWidth: true,
            }}
            onDateTimeSelect={handleOnDateTimeSelect}
          />

          {dateTime && <p>{JSON.stringify(dateTime)}</p>}
        </div>

        <div className="mb-8">
          <label htmlFor="static-calendar" className="text-lg">
            Static Calendar
          </label>

          <StaticCalendar />
        </div>

        <div className="mb-8">
          <label htmlFor="static-time" className="text-lg">
            Static Time
          </label>

          <StaticTime />
        </div>
      </div>
    </div>
  )
}

function useThemeToggle() {
  const handleOnToggleTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.theme = theme
  }

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return {
    toggleTheme: handleOnToggleTheme,
  }
}
