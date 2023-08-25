import { cn } from '@/plugins/twMerge'

import { DesktopTime, DesktopTimeProps } from '../DesktopTime/DesktopTime'

export const StaticDesktopTime = ({
  className = '',
  ...rest
}: DesktopTimeProps) => (
  <DesktopTime
    className={cn(
      'ne-dt-border ne-dt-border-primary ne-dt-bg-base-100 ne-dt-text-base-content ne-dt-p-2 md:ne-dt-p-4 ne-dt-rounded-md',
      className,
    )}
    {...rest}
  />
)
