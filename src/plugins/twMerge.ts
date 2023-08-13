import { ClassValue, clsx } from 'clsx'

import { twMergeExtender } from '@/lib/twMergeExtender'

function cn(...args: ClassValue[]) {
  return twMergeExtender.twMerge(clsx(args))
}

export { clsx, cn }
