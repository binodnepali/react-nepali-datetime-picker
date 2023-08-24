import { cn } from '@/plugins/twMerge'

type ButtonVariant = 'circle' | 'pilled' | 'outline' | 'text'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: ButtonVariant
  active?: boolean
  selected?: boolean
  disabled?: boolean
}
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'circle',
  active = false,
  selected = false,
  disabled = false,
  className,
  ...rest
}: ButtonProps) => (
  <button
    disabled={disabled}
    type="button"
    className={cn(
      'ne-dt-flex ne-dt-items-center ne-dt-justify-center hover:ne-dt-bg-primary-content hover:ne-dt-text-netural',
      variant === 'circle' && 'ne-dt-p-1 ne-dt-rounded-full',
      variant === 'pilled' && 'ne-dt-px-4 ne-dt-py-2 ne-dt-rounded-full',
      variant === 'outline' &&
        'ne-dt-px-2 ne-dt-py-1 ne-dt-rounded-md ne-dt-border ne-dt-border-neutral',
      variant === 'text' && 'ne-dt-px-2 ne-dt-py-1 ne-dt-rounded-md',
      active && 'ne-dt-border ne-dt-border-primary ne-dt-bg-base-300',
      selected &&
        'ne-dt-bg-primary ne-dt-text-primary-content hover:ne-dt-bg-primary',
      disabled && 'ne-dt-opacity-50 ne-dt-cursor-not-allowed',
      className,
    )}
    {...rest}
  >
    {children}
  </button>
)
