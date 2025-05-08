import { cn } from "@/plugins/twMerge";

export interface InputProps {
  className?: string;
  icon?: IconProps;
  nativeInput?: NativeInputProps;
}
export const Input = ({
  className = "",
  nativeInput = {},
  icon = {},
}: InputProps) => {
  const { className: inputClassName = "", ...nativeInputRest } = nativeInput;

  const {
    className: iconClassName = "",
    children: iconChildren,
    ...iconRest
  } = icon;

  return (
    <div className={cn("nedt:relative nedt:rounded-md nedt:w-fit", className)}>
      <input
        className={cn(
          "nedt:h-12 nedt:border nedt:border-primary nedt:rounded-md nedt:px-2 nedt:focus:outline-2 nedt:focus:outline-offset-2 nedt:focus:outline-primary nedt:bg-base-100",
          inputClassName,
        )}
        type="text"
        autoComplete="off"
        {...nativeInputRest}
      />

      {iconChildren && (
        <div
          className={cn(
            "nedt:absolute nedt:inset-y-0 nedt:right-0 nedt:mr-1 nedt:flex nedt:items-center nedt:cursor-pointer",
            iconClassName,
          )}
          {...iconRest}
        >
          {iconChildren}
        </div>
      )}
    </div>
  );
};

type NativeInputProps = React.HTMLAttributes<HTMLInputElement> & {
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
};

type IconProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};
