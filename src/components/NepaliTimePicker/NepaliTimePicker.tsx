interface NepaliTimePickerProps {
  className?: string;
}

export const NepaliTimePicker: React.FC<NepaliTimePickerProps> = ({
  className,
}: NepaliTimePickerProps) => {
  return (
    <>
      <h1 className={className}>TimePicker</h1>
    </>
  );
};
