export interface InputProps {
  className?: string
  icon?: IconProps
  nativeInput?: NativeInputProps
}
export const Input = ({
  className = '',
  nativeInput = {},
  icon = {},
}: InputProps) => {
  const { className: inputClassName = '', ...nativeInputRest } = nativeInput

  const { className: iconClassName = '', children, ...iconRest } = icon

  return (
    <div className={`ne-dt-relative ne-dt-w-fit ${className}`}>
      <input
        className={`ne-dt-border ne-dt-border-gray-300 ne-dt-rounded-md ne-dt-px-2 ne-dt-py-2 ${inputClassName}`}
        type="text"
        autoComplete="off"
        {...nativeInputRest}
      />

      <div
        className={`ne-dt-absolute ne-dt-inset-y-0 ne-dt-right-0 ne-dt-mr-1 ne-dt-flex ne-dt-items-center ne-dt-cursor-pointer ${iconClassName}`}
        {...iconRest}
      >
        {children}
      </div>
    </div>
  )
}

type NativeInputProps = React.HTMLAttributes<HTMLInputElement> & {
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
}

type IconProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}
