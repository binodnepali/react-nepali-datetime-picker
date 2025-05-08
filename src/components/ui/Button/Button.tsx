import { cn } from "@/plugins/twMerge";

type ButtonVariant = "circle" | "pilled" | "outline" | "text" | "icon";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  active?: boolean;
  selected?: boolean;
  disabled?: boolean;
}
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "circle",
  active = false,
  selected = false,
  disabled = false,
  className,
  ...rest
}: ButtonProps) => (
  <button
    disabled={disabled}
    type="button"
    className={cn(
      "nedt:flex nedt:items-center nedt:justify-center nedt:hover:!bg-primary-content hover:nedt:text-netural nedt:focus:outline-2 nedt:focus:outline-offset-1 nedt:focus:outline-primary",
      variant === "circle" && "nedt:p-1 nedt:rounded-full",
      variant === "pilled" && "nedt:px-4 nedt:py-2 nedt:rounded-full",
      variant === "outline" &&
        "nedt:px-2 nedt:py-1 nedt:rounded-md nedt:border nedt:border-neutral",
      variant === "text" && "nedt:px-2 nedt:py-1 nedt:rounded-md",
      variant === "icon" &&
        "nedt:rounded-md !nedt:bg-base-100 nedt:hover:!bg-base-200 nedt:fill-base-content nedt:mr-1",
      active && "nedt:border nedt:border-primary !nedt:bg-base-300",
      selected &&
        "!nedt:bg-primary nedt:text-primary-content nedt:hover:!bg-primary",
      disabled && "nedt:opacity-50 nedt:cursor-not-allowed",
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);
