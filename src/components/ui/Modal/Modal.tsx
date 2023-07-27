export interface ModalProps {
  children?: React.ReactNode
  className?: string
  onClose?: () => void
  variant?: 'desktop' | 'mobile' | 'responsive'
}

export const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
  className,
  variant = 'responsive',
}: ModalProps) => {
  const isDesktop = variant === 'desktop'
  const isMobile = variant === 'mobile'
  const isResponsive = variant === 'responsive'

  const contentClassName = isResponsive
    ? 'fixed md:absolute w-full flex md:block items-center justify-center bg-black bg-opacity-50'
    : isMobile
    ? 'fixed w-full flex items-center justify-center bg-black bg-opacity-50'
    : 'md:absolute w-fit md:block'

  return (
    <>
      {(isDesktop || isResponsive) && (
        <div
          className={`block fixed top-0 left-0 w-full h-full opactiy-0`}
          onClick={onClose}
        />
      )}

      <div
        className={`${contentClassName} h-full inset-0 z-[1000] ${
          className || ''
        }`}
      >
        {(isMobile || isResponsive) && (
          <div
            className="fixed top-0 left-0 w-full h-full opactiy-0 z-[999]"
            onClick={onClose}
          />
        )}

        <div className="z-[1000]">{children}</div>
      </div>
    </>
  )
}
