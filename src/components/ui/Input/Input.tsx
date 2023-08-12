import { cn } from '@/plugins/twMerge'

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
    <div className={cn('relative w-fit', className)}>
      <input
        className={cn(
          'border rounded-md px-2 py-2 outline-none border-gray-500 focus:border-gray-500',
          inputClassName,
        )}
        type="text"
        autoComplete="off"
        {...nativeInputRest}
      />

      <div
        className={cn(
          'absolute inset-y-0 right-0 mr-1 flex items-center cursor-pointer',
          iconClassName,
        )}
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
