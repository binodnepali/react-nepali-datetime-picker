export type NativeInputProps = React.HTMLAttributes<HTMLInputElement> & {
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
}

export type IconProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
  onClick?: () => void
}

interface InputProps {
  children?: React.ReactNode
  className?: string
  icon?: IconProps
  input?: NativeInputProps
}

export const Input = ({
  className = '',
  input = {},
  icon = {},
  children,
}: InputProps) => {
  const { className: inputClassName = '', ...inputRest } = input

  const { className: iconClassName = '', ...iconRest } = icon

  return (
    <div className={`relative w-fit ${className}`}>
      <input
        className={`border border-gray-300 rounded-md px-2 py-2 ${inputClassName}`}
        type="text"
        autoComplete="off"
        {...inputRest}
      />

      <div
        className={`absolute inset-y-0 right-0 mr-1 flex items-center cursor-pointer ${iconClassName}`}
        {...iconRest}
      >
        {children}
      </div>
    </div>
  )
}
