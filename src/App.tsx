// import { NepaliDatePicker } from '@components/NepaliDatePicker/NepaliDatePicker'
// import { NepaliDate } from './types/NepaliDate'
// import { useState } from 'react'
// import { DesktopTime } from './components/DesktopTimePicker/DesktopTime/DesktopTime'
import { DesktopTimePicker } from './components/DesktopTimePicker'

export default function App() {
  // const [selectedDate, setSelectedDate] = useState<NepaliDate>()

  return (
    <>
      <header>
        <nav
          className="bg-gray-800
        flex justify-between items-center
        px-4 py-2
        sm:px-6 sm:py-4"
        >
          <h1 className="text-white text-2xl font-bold p-2">
            React Nepali Date Time Picker
          </h1>

          <div className="flex justify-end">
            <a
              href="https://github.com/binodnepali/react-nepali-datetime-picker"
              target="_blank"
              rel="noreferrer"
              className="text-white text-lg font-bold p-2"
            >
              GitHub
            </a>
          </div>
        </nav>
      </header>

      <main className="bg-gray-100  p-4 md:p-8 min-h-screen">
        <p className="text-lg text-gray-600">
          A simple and reusable date time picker component for React.
        </p>

        {/* <div className="flex flex-col max-w-lg mt-4 md:mt-6">
          <label htmlFor="date-picker" className="text-lg">
            Date Picker
          </label>

          <NepaliDatePicker onDateSelect={setSelectedDate} className="mt-2" />

          <p className="text-gray-600 text-sm mt-6">
            Selected Date:{' '}
            {selectedDate ? JSON.stringify(selectedDate, null, 2) : 'None'}
          </p>
        </div> */}

        <div className="flex flex-col max-w-lg mt-4 md:mt-6">
          {/* <div className="mb-8">
            <label htmlFor="desktoptime" className="text-lg">
              Desktop Time
            </label>

            <DesktopTime />
          </div> */}

          <div className="mb-8">
            <label htmlFor="desktoptimepicker" className="text-lg">
              DesktopTime Picker
            </label>

            <DesktopTimePicker />
          </div>

          <input type="time" />
        </div>
      </main>
    </>
  )
}
