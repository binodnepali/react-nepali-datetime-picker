//import { NepaliDatePicker } from '@components/NepaliDatePicker/NepaliDatePicker';

export default function App() {
  return (
    <>
      <header>
        <nav
          className='bg-gray-800
        flex justify-between items-center
        px-4 py-2
        sm:px-6 sm:py-4
        lg:px-8 lg:py-6'
        >
          <h1 className='text-white text-2xl font-bold p-2'>
            React Nepali Date Time Picker
          </h1>

          <div className='flex justify-end'>
            <a
              href='https://github.com/binodnepali/packages'
              target='_blank'
              rel='noreferrer'
              className='text-white text-lg font-bold p-2'
            >
              GitHub
            </a>
          </div>
        </nav>
      </header>

      <main className='bg-gray-100  p-4 md:p-8'>
        <h1 className='text-3xl font-bold'>React Nepali Date Time Picker</h1>
        <p className='text-lg text-gray-600 my-2'>
          A simple and reusable date time picker component for React.
        </p>

        <div className='flex flex-col max-w-lg mt-4 md:mt-6'>
          <label htmlFor='date-picker' className='text-lg'>
            Date Picker
          </label>

          {/* <NepaliDatePicker /> */}
        </div>
      </main>
    </>
  );
}
