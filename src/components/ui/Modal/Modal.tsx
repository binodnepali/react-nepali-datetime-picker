import { forwardRef } from 'react'

import { cn } from '@/plugins/twMerge'

export interface ModalProps {
  children?: React.ReactNode
  className?: string
  modalClassName?: string
  desktopOverlayClassName?: string
  mobileOverlayClassName?: string
  modalContentClassName?: string
  onClose?: () => void
  style?: React.CSSProperties
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    children,
    onClose,
    className,
    modalClassName = '',
    desktopOverlayClassName = '',
    mobileOverlayClassName = '',
    modalContentClassName = '',
    style = {},
  },
  ref,
) {
  return (
    <div ref={ref} className={className}>
      <div
        className={cn(
          'hidden md:block w-full h-full fixed inset-0 opactiy-0',
          desktopOverlayClassName,
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'absolute h-full w-full md:h-fit md:w-fit inset-0 bg-black bg-opacity-50 md:bg-opacity-0 flex md:block items-center justify-center z-[1000]',
          modalClassName,
        )}
        style={style}
      >
        <div
          className={cn(
            'fixed md:hidden top-0 left-0 w-full h-full opactiy-0 z-[999]',
            mobileOverlayClassName,
          )}
          onClick={onClose}
        />

        <div className={cn('z-[1000]', modalContentClassName)}>{children}</div>
      </div>
    </div>
  )
})
