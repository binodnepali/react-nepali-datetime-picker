import { BsCalendar } from '@/components/ui/bs-calendar'
import { formatBsDateHeadline } from '@/lib/bs-day-picker/formatters'
import type { BsDate, BsLocale } from '@/lib/bs-day-picker/types'
import { Modal, Pressable, View } from 'react-native'
import { Text } from '@/components/ui/text'

/** Dialog calendar body — fits nav + weekdays + 6 week rows */
const BS_MATERIAL_CALENDAR_BODY_HEIGHT = 320

type BsDatePickerDialogProps = {
  visible: boolean
  value: BsDate
  locale: BsLocale
  title: string
  cancelLabel: string
  confirmLabel: string
  onChange: (value: BsDate) => void
  onCancel: () => void
  onConfirm: () => void
}

export function BsDatePickerDialog({
  visible,
  value,
  locale,
  title,
  cancelLabel,
  confirmLabel,
  onChange,
  onCancel,
  onConfirm,
}: BsDatePickerDialogProps) {
  if (!visible) return null

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-5 py-6"
        onPress={onCancel}
      >
        <Pressable
          className="max-h-[90%] w-full max-w-[360px] overflow-hidden rounded-[28px] bg-background"
          onPress={(event) => event.stopPropagation()}
        >
          <View className="shrink-0 border-b border-border/60 px-6 pb-4 pt-6">
            <Text className="text-sm font-medium text-muted-foreground">
              {title}
            </Text>
            <Text className="mt-2 text-[32px] leading-10 text-foreground">
              {formatBsDateHeadline(value, locale)}
            </Text>
          </View>

          <View
            className="shrink-0 overflow-hidden px-3 pb-2 pt-3"
            style={{ height: BS_MATERIAL_CALENDAR_BODY_HEIGHT }}
          >
            <BsCalendar
              className="h-full"
              mode="single"
              locale={locale}
              selected={value}
              onSelect={(date) => {
                if (date) onChange(date)
              }}
            />
          </View>

          <View className="shrink-0 flex-row justify-end px-2 pb-3 pt-1">
            <Pressable
              className="min-h-12 items-center justify-center px-4"
              onPress={onCancel}
            >
              <Text className="text-sm font-semibold uppercase text-primary">
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable
              className="min-h-12 items-center justify-center px-4"
              onPress={onConfirm}
            >
              <Text className="text-sm font-semibold uppercase text-primary">
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
