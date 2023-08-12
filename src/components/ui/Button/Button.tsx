import { cn } from '@/plugins/twMerge'

type ButtonVariant = 'circle' | 'pilled' | 'outline' | 'text'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: ButtonVariant
  active?: boolean
  inactive?: boolean
  selected?: boolean
}
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'circle',
  active = false,
  inactive = false,
  selected = false,
  className,
  ...rest
}: ButtonProps) => {
  const getButtonClass = (variant: ButtonVariant) => {
    switch (variant) {
      case 'circle':
        return cn(
          'p-1 rounded-full',
          active && 'border border-gray-500 bg-gray-200',
          inactive && 'text-gray-400',
          selected &&
            'border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800',
        )

      case 'pilled':
        return cn(
          'px-4 py-2 rounded-full',
          active && 'border border-gray-500 bg-gray-200',
          selected &&
            'border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800',
        )
      case 'outline':
        return cn(
          'px-2 py-1 rounded-md',
          active && 'border border-gray-500 bg-gray-200',
          !active && 'border border-gray-500',
          selected &&
            'border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800',
        )

      case 'text':
        return cn('px-2 py-1 rounded-md')

      default:
        return ''
    }
  }

  return (
    <button
      disabled={inactive}
      type="button"
      className={cn(
        'flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:bg-gray-100',
        getButtonClass(variant),
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
