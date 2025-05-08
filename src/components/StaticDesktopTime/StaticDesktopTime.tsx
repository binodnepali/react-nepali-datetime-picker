import { cn } from "@/plugins/twMerge";

import type { DesktopTimeProps } from "../DesktopTime/DesktopTime";
import { DesktopTime } from "../DesktopTime/DesktopTime";

export const StaticDesktopTime = ({
  className = "",
  ...rest
}: DesktopTimeProps) => (
  <DesktopTime
    className={cn(
      "nedt:border nedt:border-primary nedt:bg-base-100 nedt:text-base-content nedt:p-2 nedt:md:p-4 nedt:rounded-md",
      className,
    )}
    {...rest}
  />
);
