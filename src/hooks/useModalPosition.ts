import { useEffect, useState } from 'react'

import { useDevice } from './useDevice'

interface ModalPosition {
  ref?: React.RefObject<HTMLDivElement>
  showModal: boolean
}
export const useModalPosition = ({ ref, showModal }: ModalPosition) => {
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const { isMobile } = useDevice()

  useEffect(() => {
    if (!ref?.current) {
      return
    }

    const { height } = ref.current.getBoundingClientRect()

    setModalPosition(() => ({
      x: 0,
      y: isMobile ? 0 : height,
    }))
  }, [isMobile, ref, showModal])

  return modalPosition
}
