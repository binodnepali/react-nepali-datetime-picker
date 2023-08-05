import { clsx } from '@/plugins/clsx'

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
        return clsx(
          'ne-dt-p-1 ne-dt-rounded-full',
          active && 'ne-dt-border ne-dt-border-gray-500 ne-dt-bg-gray-100',
          inactive && 'ne-dt-text-gray-400',
          selected &&
            'ne-dt-border ne-dt-border-gray-900 ne-dt-bg-gray-900 ne-dt-text-white hover:ne-dt-bg-gray-800 focus:ne-dt-bg-gray-800',
        )

      case 'pilled':
        return clsx(
          'ne-dt-px-4 ne-dt-py-2 ne-dt-rounded-full',
          active && 'ne-dt-border ne-dt-border-gray-500 ne-dt-bg-gray-100',
          selected &&
            'ne-dt-border ne-dt-border-gray-900 ne-dt-bg-gray-900 ne-dt-text-white hover:ne-dt-bg-gray-800 focus:ne-dt-bg-gray-800',
        )
      case 'outline':
        return clsx(
          'ne-dt-px-2 ne-dt-py-1 ne-dt-rounded-md',
          !selected && 'ne-dt-border ne-dt-border-gray-500',
          selected &&
            'ne-dt-border ne-dt-border-gray-900 ne-dt-bg-gray-900 ne-dt-text-white hover:ne-dt-bg-gray-800 focus:ne-dt-bg-gray-800',
        )

      case 'text':
        return clsx('ne-dt-px-2 ne-dt-py-1 ne-dt-rounded-md')

      default:
        return ''
    }
  }

  return (
    <button
      disabled={inactive}
      type="button"
      className={clsx(
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
