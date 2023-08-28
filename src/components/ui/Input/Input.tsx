import { cn } from '@/plugins/twMerge'

export interface InputProps {
  className?: string
  icon?: IconProps
  nativeInput?: NativeInputProps
  children?: React.ReactNode
}
export const Input = ({
  className = '',
  nativeInput = {},
  icon = {},
  children,
}: InputProps) => {
  const { className: inputClassName = '', ...nativeInputRest } = nativeInput

  const { className: iconClassName = '', ...iconRest } = icon

  return (
    <div
      className={cn('ne-dt-relative ne-dt-rounded-md ne-dt-w-fit', className)}
    >
      <input
        className={cn(
          'ne-dt-h-12 ne-dt-border ne-dt-border-primary ne-dt-rounded-md ne-dt-px-2 focus:ne-dt-outline focus:ne-dt-outline-2 focus:ne-dt-outline-offset-2 focus:ne-dt-outline-primary ne-dt-bg-base-100',
          inputClassName,
        )}
        type="text"
        autoComplete="off"
        {...nativeInputRest}
      />

      {children && (
        <div
          className={cn(
            'ne-dt-absolute ne-dt-inset-y-0 ne-dt-right-0 ne-dt-mr-1 ne-dt-flex ne-dt-items-center ne-dt-cursor-pointer',
            iconClassName,
          )}
          {...iconRest}
        >
          {children}
        </div>
      )}
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
}
