import { cn } from '@/plugins/twMerge'

export interface HintProps {
  className?: string
  error?: {
    message: string
  }
  success?: {
    message: string
  }
}

export const Hint = ({ className = '', error, success }: HintProps) => {
  const baseClassName = 'text-xs'

  if (success) {
    return (
      <p className={cn('text-green-500', baseClassName, className)}>
        {success.message}
      </p>
    )
  }

  if (error) {
    return (
      <p className={cn('text-red-500', baseClassName, className)}>
        {error.message}
      </p>
    )
  }

  return null
}
