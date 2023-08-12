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
          'ne-dt-hidden md:ne-dt-block ne-dt-w-full ne-dt-h-full ne-dt-fixed ne-dt-inset-0 ne-dt-opactiy-0',
          desktopOverlayClassName,
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'ne-dt-absolute ne-dt-h-full ne-dt-w-full md:ne-dt-h-fit md:ne-dt-w-fit ne-dt-inset-0 ne-dt-bg-black ne-dt-bg-opacity-50 md:ne-dt-bg-opacity-0 ne-dt-flex md:ne-dt-block ne-dt-items-center ne-dt-justify-center ne-dt-z-[1000]',
          modalClassName,
        )}
        style={style}
      >
        <div
          className={cn(
            'ne-dt-fixed md:ne-dt-hidden ne-dt-top-0 ne-dt-left-0 ne-dt-w-full ne-dt-h-full ne-dt-opactiy-0 ne-dt-z-[999]',
            mobileOverlayClassName,
          )}
          onClick={onClose}
        />

        <div className={cn('ne-dt-z-[1000]', modalContentClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
})
