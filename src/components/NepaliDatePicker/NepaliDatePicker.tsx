import React, { useState } from 'react';

import { Modal } from '@ui/Modal/Modal';
import { NepaliCalendar } from '@components/NepaliCalendar/NepaliCalendar';

export const NepaliDatePicker: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOnInputDateClick = () => {
    setShowModal(() => true);
  };

  return (
    <div className='relative'>
      <div className='flex flex-col space-y-2'>
        <input
          type='text'
          id='date-picker'
          className='border border-gray-300 rounded-md px-2 py-1'
          placeholder='Select Date'
          onClick={handleOnInputDateClick}
        />
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(() => false)}>
          <NepaliCalendar />
        </Modal>
      )}
    </div>
  );
};
