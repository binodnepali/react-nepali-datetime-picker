import { TimeInput } from '@/components/TimeInput/TimeInput'
import { useState } from 'react'
import { Modal } from '../ui/Modal/Modal'
import { DesktopTime } from '.'

interface DesktopTimePickerProps {
  className?: string
}

export const DesktopTimePicker = ({
  className = '',
}: DesktopTimePickerProps) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div className={`relative flex flex-col ${className}`}>
      <TimeInput
        icon={{
          onClick: () => setShowModal(true),
        }}
      />

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          className="md:mt-11 md:bg-transparent"
        >
          <DesktopTime />
        </Modal>
      )}
    </div>
  )
}
