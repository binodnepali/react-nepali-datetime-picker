import { extendTailwindMerge } from 'tailwind-merge'

class TwMergeExtender {
  public twMerge

  constructor(prefix = 'ne-dt-') {
    this.twMerge = extendTailwindMerge({
      prefix,
    })
  }
}

export const twMergeExtender = new TwMergeExtender()
