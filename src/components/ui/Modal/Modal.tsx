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
}: ModalProps) => {
  return (
    <>
      <div
        className="ne-dt-hidden md:ne-dt-block ne-dt-fixed ne-dt-top-0 ne-dt-left-0 ne-dt-w-full ne-dt-h-full ne-dt-opactiy-0 ne-dt-border"
        onClick={onClose}
      />

      <div
        className={`ne-dt-fixed md:ne-dt-absolute ne-dt-h-full ne-dt-w-full ne-dt-inset-0 ne-dt-bg-black ne-dt-bg-opacity-50 ne-dt-flex md:ne-dt-block ne-dt-items-center ne-dt-justify-center ne-dt-z-[1000] ${
          className || ''
        }`}
      >
        <div className="md:ne-dt-hidden">
          <div
            className="ne-dt-fixed ne-dt-top-0 ne-dt-left-0 ne-dt-w-full ne-dt-h-full ne-dt-opactiy-0 ne-dt-z-[999]"
            onClick={onClose}
          />
        </div>

        <div className="ne-dt-z-[1000]">{children}</div>
      </div>
    </>
  )
}
