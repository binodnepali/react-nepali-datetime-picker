import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "nedt:flex nedt:items-center nedt:gap-2 nedt:text-sm nedt:leading-none nedt:font-medium nedt:select-none group-data-[disabled=true]:nedt:pointer-events-none group-data-[disabled=true]:nedt:opacity-50 peer-disabled:nedt:cursor-not-allowed peer-disabled:nedt:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
