import { NepaliTimeInput } from '../NepaliTimeInput/NepaliTimeInput'

interface NepaliTimePickerProps {
  className?: string
}

export const NepaliTimePicker = ({ className = '' }: NepaliTimePickerProps) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <NepaliTimeInput />
    </div>
  )
}
