import { useEffect, useState } from 'react'
import type {
  HourFormat,
  Language,
  NepaliDate,
  NepaliDateTime,
  NepaliTime,
} from 'react-nepali-datetime-picker'
import {
  DatePicker,
  DateTimePicker,
  formatNepaliDateTime,
  getCurrentNepaliDate,
  getCurrentNepaliTime,
  StaticCalendar,
  StaticDesktopTime,
  TimePicker,
} from 'react-nepali-datetime-picker'

import 'react-nepali-datetime-picker/dist/style.css'

export default function App() {
  const { toggleTheme, theme } = useThemeToggle()
  const [selectedLang, setSelectLang] = useState<Language>('ne')
  const [selectedHourFormat, setSelectedHourFormat] = useState<HourFormat>('12')

  const handleOnDateSelect = (date?: NepaliDate) => {
    // eslint-disable-next-line no-console
    console.log('handleOnDateSelect', date)
  }

  const handleOnTimeSelect = (time?: NepaliTime) => {
    // eslint-disable-next-line no-console
    console.log('handleOnTimeSelect', time)
  }

  const handleOnDateTimeSelect = (dateTime?: NepaliDateTime) => {
    // eslint-disable-next-line no-console
    console.log('handleOnDateTimeSelect', dateTime)
  }

  return (
    <div className="p-4 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 mt-4 md:mt-6">
        <div>
          <label htmlFor="lang" className="text-lg mr-2">
            Choose Language
          </label>
          <select
            className="select select-bordered w-fit"
            onChange={(e) => setSelectLang(e.target.value as Language)}
          >
            <option value="ne">Nepali</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label htmlFor="hour-format" className="text-lg mr-2">
            Choose Hour Format
          </label>
          <select
            className="select select-bordered w-fit"
            defaultValue={selectedHourFormat}
            onChange={(e) =>
              setSelectedHourFormat(e.target.value as unknown as HourFormat)
            }
          >
            <option value={'12'}>12</option>
            <option value={'24'}>24</option>
          </select>
        </div>

        <div>
          <label htmlFor="theme" className="text-lg mr-2">
            Choose Theme
          </label>
          <select
            className="select select-bordered w-fit"
            onChange={(e) => toggleTheme(e.target.value)}
            value={theme}
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
            lang={selectedLang}
            dateInput={{
              fullWidth: true,
            }}
            onDateSelect={handleOnDateSelect}
          />
        </div>

        <div className="mb-8">
          <label htmlFor="timepicker" className="text-lg">
            Time Picker
          </label>

          <TimePicker
            lang={selectedLang}
            hourFormat={selectedHourFormat}
            timeInput={{
              fullWidth: true,
            }}
            onTimeSelect={handleOnTimeSelect}
          />
        </div>

        <div className="mb-8">
          <label htmlFor="datetimepicker" className="text-lg">
            Datetime Picker
          </label>

          <DateTimePicker
            lang={selectedLang}
            defaultValue={getCurrentDateTime(selectedLang)}
            hourFormat={selectedHourFormat}
            datetimeInput={{
              fullWidth: true,
              error: {
                show: true,
              },
            }}
            onDateTimeSelect={handleOnDateTimeSelect}
          />
        </div>

        <div className="mb-8">
          <label htmlFor="static-calendar" className="text-lg">
            Static Calendar
          </label>

          <StaticCalendar lang={selectedLang} />
        </div>

        <div className="mb-8">
          <label htmlFor="static-time" className="text-lg">
            Static Time
          </label>

          <StaticDesktopTime
            lang={selectedLang}
            hourFormat={selectedHourFormat}
          />
        </div>
      </div>
    </div>
  )
}

function useThemeToggle() {
  const [theme, setTheme] = useState<string>('light')

  const handleOnToggleTheme = (theme: string) => {
    if (theme === 'dark') {
      //document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      setTheme('dark')
    } else {
      //document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')

      setTheme('light')
    }
    localStorage.theme = theme
  }

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      //document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.theme = 'dark'
      setTheme('dark')
    } else {
      //document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.theme = 'light'
      setTheme('light')
    }
  }, [])

  return {
    toggleTheme: handleOnToggleTheme,
    theme,
  }
}

function getCurrentDateTime(lang: Language) {
  const nepaliDate = getCurrentNepaliDate(lang)
  const nepaliTime = getCurrentNepaliTime(lang)

  const nepaliDateTime = formatNepaliDateTime(
    {
      date: {
        ...nepaliDate,
        month: {
          ...nepaliDate.month,
          value: nepaliDate.month.value + 1,
        },
      },
      time: nepaliTime,
    },
    lang,
  )

  return nepaliDateTime
}
