interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'circle' | 'pilled';
  active?: boolean;
  selected?: boolean;
}

export const Button: React.FC<IconButtonProps> = ({
  children,
  variant = 'circle',
  active = false,
  selected = false,
  className,
  ...rest
}: IconButtonProps) => {
  const getButtonClass = () => {
    const activeClass = active ? 'border border-gray-500 bg-gray-100' : '';

    const selectedClass = selected
      ? 'border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
      : '';

    switch (variant) {
      case 'circle':
        return `p-1 rounded-full ${activeClass} ${selectedClass}`;
      case 'pilled':
        return `px-4 py-2 rounded-full ${activeClass} ${selectedClass}`;
      default:
        throw new Error(`Invalid variant: ${variant}`);
    }
  };

  return (
    <button
      {...rest}
      type='button'
      className={`flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${getButtonClass()} ${
        className ?? ''
      }`}
    >
      {children}
    </button>
  );
};
