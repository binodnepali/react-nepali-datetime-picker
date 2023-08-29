import { cn } from '@/plugins/twMerge'

export interface HintProps {
  errorClassName?: string
  errorMessage?: string
  successClassName?: string
  successMessage?: string
}

export const Hint = ({
  errorMessage,
  successMessage,
  errorClassName = '',
  successClassName = '',
}: HintProps) => {
  const baseClassName = 'ne-dt-text-xs'

  if (successMessage) {
    return (
      <p className={cn(baseClassName, 'ne-dt-text-success', successClassName)}>
        {successMessage}
      </p>
    )
  }

  if (errorMessage) {
    return (
      <p className={cn(baseClassName, 'ne-dt-text-error', errorClassName)}>
        {errorMessage}
      </p>
    )
  }

  return null
}
