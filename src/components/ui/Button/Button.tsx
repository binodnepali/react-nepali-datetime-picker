interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'circle' | 'pilled' | 'outline'
  active?: boolean
  inactive?: boolean
  selected?: boolean
}

export const Button: React.FC<IconButtonProps> = ({
  children,
  variant = 'circle',
  active = false,
  inactive = false,
  selected = false,
  className,
  ...rest
}: IconButtonProps) => {
  const getButtonClass = () => {
    const activeClass = active
      ? 'ne-dt-border ne-dt-border-gray-500 ne-dt-bg-gray-100'
      : ''

    const inactiveClass = inactive ? 'ne-dt-text-gray-400' : ''

    const selectedClass = selected
      ? 'ne-dt-border ne-dt-border-gray-900 ne-dt-bg-gray-900 ne-dt-text-white ne-dt-hover:bg-gray-800 ne-dt-focus:bg-gray-800'
      : ''

    switch (variant) {
      case 'circle':
        return `ne-dt-p-1 ne-dt-rounded-full ${activeClass} ${selectedClass} ${inactiveClass}`
      case 'pilled':
        return `ne-dt-px-4 ne-dt-py-2 ne-dt-rounded-full ${activeClass} ${selectedClass}`

      case 'outline':
        return `ne-dt-px-2 ne-dt-py-1 ne-dt-rounded-md ne-dt-border ne-dt-border-gray-500 ${selectedClass}`

      default:
        throw new Error(`Invalid variant: ${variant}`)
    }
  }

  return (
    <button
      {...rest}
      disabled={inactive}
      type="button"
      className={`ne-dt-flex ne-dt-items-center ne-dt-justify-center ne-dt-hover:bg-gray-100 ne-dt-focus:outline-none ne-dt-focus:bg-gray-100 ${getButtonClass()} ${
        className ?? ''
      }`}
    >
      {children}
    </button>
  )
}
