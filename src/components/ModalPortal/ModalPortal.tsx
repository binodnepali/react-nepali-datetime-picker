import { forwardRef, ReactNode, useRef } from 'react'
import { createPortal } from 'react-dom'

import { Modal, ModalProps } from '@/components/ui/Modal/Modal'
import { useDevice } from '@/hooks/useDevice'
import { cn } from '@/plugins/twMerge'

import { useModalPosition } from './useModalPosition'

export interface ModalPortalProps extends Omit<ModalProps, 'children'> {
  showModal?: boolean
  children?: ReactNode
}

export const ModalPortal = forwardRef<HTMLDivElement, ModalPortalProps>(
  function ModalPortal(
    { children, modalClassName = '', style = {}, showModal = false, ...rest },
    ref,
  ) {
    const { isMobile } = useDevice()

    const modalRef = useRef<HTMLDivElement>(null)

    const { x: modalPositionX, y: modalPositionY } = useModalPosition({
      modalRef,
      ref,
      showModal,
      isMobile,
    })

    return createPortal(
      <Modal
        modalClassName={cn(
          'ne-dt-transition-transform ne-dt-ease-out ',
          modalClassName,
        )}
        style={{
          transform: cn(
            isMobile && 'none',
            !isMobile &&
              `translate3d(${modalPositionX}px, ${modalPositionY}px, 0px)`,
          ),
          ...style,
        }}
        ref={modalRef}
        {...rest}
      >
        {children}
      </Modal>,
      document.body,
    )
  },
)
