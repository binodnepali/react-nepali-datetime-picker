import { useEffect, useState } from 'react'

import type { Language, NepaliDate, NepaliDateTime, NepaliTime } from '.'
import {
  DatePicker,
  DateTimePicker,
  StaticCalendar,
  StaticDesktopTime,
  TimePicker,
} from '.'

export default function App() {
  const { toggleTheme, theme } = useThemeToggle()
  const [selectLang, setSelectLang] = useState<Language>('ne')

  const handleOnDateSelect = (date?: NepaliDate) => {
    // eslint-disable-next-line no-console
    console.log('handleOnDateSelect', date)
  }

  const handleOnTimeSelect = (time?: NepaliTime) => {
    // eslint-disable-next-line no-console
    console.log('handleOnTimeSelect', time)
  }

  const handleOnDateTimeSelect = (date: NepaliDateTime) => {
    // eslint-disable-next-line no-console
    console.log('handleOnDateTimeSelect', date)
  }

  return (
    <div className="ne-dt-p-4 ne-dt-min-h-screen">
      <p className="ne-dt-text-lg ne-dt-text-gray-600">
        This is a playground for rendering components.
      </p>

      <div className="ne-dt-flex ne-dt-flex-col ne-dt-max-w-lg ne-dt-mt-4 ne-dt-md:mt-6">
        <div>
          <label htmlFor="lang" className="ne-dt-text-lg ne-dt-mr-2">
            Choose Language
          </label>
          <select
            className="ne-dt-py-2 ne-dt-px-4 ne-dt-text-lg ne-dt-bg-white ne-dt-border ne-dt-border-gray-300 ne-dt-rounded-md ne-dt-shadow-sm focus:ne-dt-outline-none focus:ne-dt-ring-1 focus:ne-dt-ring-blue-500 ne-dt-appearance-none ne-dt-w-fit"
            onChange={(e) => setSelectLang(e.target.value as Language)}
          >
            <option value="ne">Nepali</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="ne-dt-mt-4">
          <label htmlFor="theme" className="ne-dt-text-lg ne-dt-mr-2">
            Choose Theme
          </label>
          <select
            className="ne-dt-py-2 ne-dt-px-4 ne-dt-text-lg ne-dt-bg-white ne-dt-border ne-dt-border-gray-300 ne-dt-rounded-md ne-dt-shadow-sm focus:ne-dt-outline-none focus:ne-dt-ring-1 focus:ne-dt-ring-blue-500 ne-dt-appearance-none ne-dt-w-fit"
            onChange={(e) => toggleTheme(e.target.value)}
            value={theme}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="ne-dt-flex ne-dt-flex-col ne-dt-max-w-lg ne-dt-mt-4 ne-dt-md:mt-6">
        <div className="ne-dt-mb-8">
          <label htmlFor="datepicker" className="ne-dt-text-lg">
            Date Picker
          </label>

          <DatePicker
            lang={selectLang}
            dateInput={{
              fullWidth: true,
            }}
            onDateSelect={handleOnDateSelect}
          />
        </div>

        <div className="ne-dt-mb-8">
          <label htmlFor="timepicker" className="ne-dt-text-lg">
            Time Picker
          </label>

          <TimePicker
            lang={selectLang}
            timeInput={{
              fullWidth: true,
            }}
            onTimeSelect={handleOnTimeSelect}
          />
        </div>

        <div className="ne-dt-mb-8">
          <label htmlFor="datetimepicker" className="ne-dt-text-lg">
            Datetime Picker
          </label>

          <DateTimePicker
            lang={selectLang}
            datetimeInput={{
              fullWidth: true,
            }}
            onDateTimeSelect={handleOnDateTimeSelect}
          />
        </div>

        <div className="ne-dt-mb-8">
          <label htmlFor="static-calendar" className="ne-dt-text-lg">
            Static Calendar
          </label>

          <StaticCalendar />
        </div>

        <div className="ne-dt-mb-8">
          <label htmlFor="static-time" className="ne-dt-text-lg">
            Static Time
          </label>

          <StaticDesktopTime />
        </div>
      </div>
    </div>
  )
}

function useThemeToggle() {
  const [theme, setTheme] = useState<string>('light')

  const handleOnToggleTheme = (theme: string) => {
    if (theme === 'dark') {
      //document.documentElement.classList.add('ne-dt-dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      setTheme('dark')
    } else {
      //document.documentElement.classList.remove('ne-dt-dark')
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
      //document.documentElement.classList.add('ne-dt-dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.theme = 'dark'
      setTheme('dark')
    } else {
      //document.documentElement.classList.remove('ne-dt-dark')
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
