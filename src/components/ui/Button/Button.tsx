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
          'ne-dt-p-1 ne-dt-rounded-full',
          active && 'ne-dt-border ne-dt-border-gray-500 ne-dt-bg-gray-200',
          inactive && 'ne-dt-text-gray-400',
          selected &&
            'ne-dt-border ne-dt-border-gray-900 ne-dt-bg-gray-900 ne-dt-text-white hover:ne-dt-bg-gray-800 focus:ne-dt-bg-gray-800',
        )

      case 'pilled':
        return cn(
          'ne-dt-px-4 ne-dt-py-2 ne-dt-rounded-full',
          active && 'ne-dt-border ne-dt-border-gray-500 ne-dt-bg-gray-200',
          selected &&
            'ne-dt-border ne-dt-border-gray-900 ne-dt-bg-gray-900 ne-dt-text-white hover:ne-dt-bg-gray-800 focus:ne-dt-bg-gray-800',
        )
      case 'outline':
        return cn(
          'ne-dt-px-2 ne-dt-py-1 ne-dt-rounded-md',
          active && 'ne-dt-border ne-dt-border-gray-500 ne-dt-bg-gray-200',
          !active && 'ne-dt-border ne-dt-border-gray-500',
          selected &&
            'ne-dt-border ne-dt-border-gray-900 ne-dt-bg-gray-900 ne-dt-text-white hover:ne-dt-bg-gray-800 focus:ne-dt-bg-gray-800',
        )

      case 'text':
        return cn('ne-dt-px-2 ne-dt-py-1 ne-dt-rounded-md')

      default:
        return ''
    }
  }

  return (
    <button
      disabled={inactive}
      type="button"
      className={cn(
        'ne-dt-flex ne-dt-items-center ne-dt-justify-center hover:ne-dt-bg-gray-100 focus:ne-dt-outline-none focus:ne-dt-bg-gray-100',
        getButtonClass(variant),
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
