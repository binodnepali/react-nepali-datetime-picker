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
  const baseClassName = 'ne-dt-text-xs'

  if (success) {
    return (
      <p className={`${baseClassName} ne-dt-text-green-500 ${className}`}>
        {success.message}
      </p>
    )
  }

  if (error) {
    return (
      <p className={`${baseClassName} ne-dt-text-red-500 ${className}`}>
        {error.message}
      </p>
    )
  }

  return null
}
