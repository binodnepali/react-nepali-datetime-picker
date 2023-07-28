import { DesktopTimePicker } from './components/DesktopTimePicker'

export default function App() {
  return (
    <div className="bg-gray-100  p-4 md:p-8 min-h-screen">
      <p className="text-lg text-gray-600">
        This is a playground for rendering components.
      </p>

      <div className="flex flex-col max-w-lg mt-4 md:mt-6">
        <div className="mb-8">
          <label htmlFor="desktoptimepicker" className="text-lg">
            DesktopTime Picker
          </label>

          <DesktopTimePicker lang="en" />
        </div>
      </div>
    </div>
  )
}
