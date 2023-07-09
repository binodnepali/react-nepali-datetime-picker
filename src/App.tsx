//import { useState } from 'react';
//import { Modal } from './components/Modal/Modal';
//import { NepaliDateTimePicker } from './components/NepaliDateTimePicker/NepaliDateTimePicker';
import { NepaliDatePicker } from './components/NepaliDatePicker/NepaliDatePicker';
//import { NepaliTimePicker } from './components/NepaliTimePicker/NepaliTimePicker';

//type ModalContent = 'date' | 'time' | 'datetime';

export default function App() {
  //const [modalContent, setModalContent] = useState<ModalContent | undefined>();

  return (
    <>
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

      <div className='flex flex-col  min-h-screen p-2'>
        <h1 className='text-3xl font-bold'>React Nepali Date Time Picker</h1>
        <p className='text-lg text-gray-600 my-2'>
          A simple and reusable date time picker component for React.
        </p>

        <div className='flex flex-col space-y-2 max-w-lg'>
          <NepaliDatePicker />
        </div>

        {/* <div className='flex flex-col space-y-2'>
          <label htmlFor='date-picker' className='text-lg'>
            Date Picker
          </label>
          <input
            type='text'
            id='date-picker'
            className='border border-gray-300 rounded-md px-2 py-1'
            placeholder='Select Date'
            onClick={() => setModalContent('date')}
          />
        </div> */}

        {/* <div className='flex flex-col space-y-2'>
          <label htmlFor='time-picker' className='text-lg'>
            Time Picker
          </label>
          <input
            type='text'
            id='time-picker'
            className='border border-gray-300 rounded-md px-2 py-1'
            placeholder='Select Time'
            onClick={() => setModalContent('time')}
          />
        </div> */}
      </div>

      {/* {modalContent && (
        <Modal onClick={() => setModalContent(undefined)}>
          {modalContent === 'datetime' && <NepaliDateTimePicker />}

          {modalContent === 'date' && <NepaliDatePicker />}

          {modalContent === 'time' && <NepaliTimePicker />}
        </Modal>
      )} */}
    </>
  );
}
