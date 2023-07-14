import React, { useState } from 'react';

import { NepaliCalendar } from '@components/NepaliCalendar/NepaliCalendar';
import { Input } from '@ui/Input/Input';
import { Modal } from '@ui/Modal/Modal';

import Date from '@assets/Date.svg';

export const NepaliDatePicker: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOnInputDateClick = () => {
    setShowModal(() => true);
  };

  return (
    <div className='relative'>
      <div className='flex flex-col space-y-2'>
        <Input
          icon={
            <Date
              width='36'
              height='36'
              onClick={handleOnInputDateClick}
              className='rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 p-1'
            />
          }
        />
      </div>

      {showModal && (
        <Modal
          onClose={() => setShowModal(() => false)}
          className='mt-11 rounded-md'
        >
          <NepaliCalendar />
        </Modal>
      )}
    </div>
  );
};
