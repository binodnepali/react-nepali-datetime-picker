import { useCallback, useEffect, useState } from 'react'

interface UseModalPositionProps {
  modalRef: React.RefObject<HTMLDivElement>
  dateInputRef: React.RefObject<HTMLDivElement>
  showModal: boolean
  isMobile: boolean
}

export const useModalPosition = ({
  modalRef,
  dateInputRef,
  showModal,
  isMobile,
}: UseModalPositionProps) => {
  const [modalPosition, setModalPosition] = useState<{
    x: number
    y: number
  }>({
    x: 0,
    y: 0,
  })

  const calculateModalPosition = useCallback(() => {
    if (
      !modalRef.current ||
      !dateInputRef.current ||
      typeof window === 'undefined'
    ) {
      return
    }

    const { scrollY, innerHeight } = window
    const {
      x: dateInputX,
      y: dateInputY,
      height: dateInputHeight,
    } = dateInputRef.current.getBoundingClientRect()

    const { height: modalHeight } = modalRef.current.getBoundingClientRect()

    if (dateInputY + modalHeight > innerHeight) {
      setModalPosition(() => ({
        x: dateInputX,
        y: dateInputY - modalHeight + scrollY,
      }))
    } else {
      setModalPosition(() => ({
        x: dateInputX,
        y: dateInputY + dateInputHeight + scrollY,
      }))
    }
  }, [dateInputRef, modalRef])

  const handleOnScroll = useCallback(() => {
    calculateModalPosition()
  }, [calculateModalPosition])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.addEventListener('scroll', handleOnScroll)

    calculateModalPosition()

    return () => {
      window.removeEventListener('scroll', handleOnScroll)
    }
  }, [calculateModalPosition, handleOnScroll, showModal, isMobile])

  return modalPosition
}
