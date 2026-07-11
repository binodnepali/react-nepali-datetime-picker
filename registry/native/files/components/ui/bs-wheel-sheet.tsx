import { Text } from '@/components/ui/text'
import * as React from 'react'
import { Pressable, View } from 'react-native'

type BsWheelSheetChromeProps = {
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  bottomInset: number
  children: React.ReactNode
}

/** iOS-style bottom sheet chrome for BS wheel pickers. */
export function BsWheelSheetChrome({
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  bottomInset,
  children,
}: BsWheelSheetChromeProps) {
  return (
    <View
      className="overflow-hidden rounded-t-[20px] bg-background"
      style={{ paddingBottom: Math.max(bottomInset, 8) }}
    >
      <View className="flex-row items-center justify-between border-b border-border/30 px-1 pb-1.5 pt-2">
        <Pressable
          accessibilityRole="button"
          className="min-h-11 items-center justify-center px-4"
          onPress={onCancel}
        >
          <Text className="text-[17px] text-foreground">{cancelLabel}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          className="min-h-11 items-center justify-center px-4"
          onPress={onConfirm}
        >
          <Text className="text-[17px] font-semibold text-foreground">
            {confirmLabel}
          </Text>
        </Pressable>
      </View>

      <View className="w-full py-2">{children}</View>
    </View>
  )
}
