interface Props {
  className?: string
  children?: React.ReactNode
  input?: InputProps
  icon?: IconProps
}

type InputProps = React.HTMLAttributes<HTMLInputElement> & {
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type IconProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
  onClick?: () => void
}

export const Input = ({
  className = '',
  input = {},
  icon = {},
  children,
}: Props) => {
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
