import {
  ForwardedRef,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react'

export interface UseModalPositionProps {
  modalRef: RefObject<HTMLDivElement>
  ref: ForwardedRef<HTMLDivElement>
  showModal: boolean
  isMobile: boolean
}

export const useModalPosition = ({
  modalRef,
  ref: forwardRef,
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

  const ref = forwardRef as RefObject<HTMLDivElement>

  const calculateModalPosition = useCallback(() => {
    if (!modalRef.current || !ref.current || typeof window === 'undefined') {
      return
    }

    const { scrollY, innerHeight } = window
    const {
      x: dateInputX,
      y: dateInputY,
      height: dateInputHeight,
    } = ref.current.getBoundingClientRect()

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
  }, [ref, modalRef])

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
