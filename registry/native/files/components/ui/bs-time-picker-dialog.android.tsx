import {
  clampBsTime,
  formatMinuteOption,
  formatPeriodOption,
  formatTimeDigit,
  resolveDisplayHour,
  resolveDisplayPeriod,
  to12Hour,
  from12Hour,
} from '../../lib/bs-time-picker'
import type { BsLocale, BsPeriod, BsTime } from '@/lib/bs-time-picker/time/types'
import { cn } from '@/lib/utils'
import * as React from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle, Line } from 'react-native-svg'
import { Text } from '@/components/ui/text'

const CLOCK_SIZE = 256
const CLOCK_RADIUS = 98
const NODE_SIZE = 40
const CENTER = CLOCK_SIZE / 2
/** Reach the center of dial labels (Material hand length). */
const HAND_RADIUS = CLOCK_RADIUS - NODE_SIZE / 2
const HAND_COLOR = 'hsl(180, 82%, 24%)'
const DIAL_TRANSITION_MS = 320

type SelectionMode = 'hour' | 'minute'

type BsTimePickerDialogProps = {
  visible: boolean
  value: BsTime
  locale: BsLocale
  is24Hour?: boolean
  title?: string
  cancelLabel: string
  confirmLabel: string
  onChange: (value: BsTime) => void
  onCancel: () => void
  onConfirm: () => void
}

/** Degrees clockwise from 12 o'clock (Material clock convention). */
function hour12ToClockDegrees(hour12: number): number {
  const normalized = hour12 === 12 ? 0 : hour12
  return normalized * 30
}

function hour24ToClockDegrees(hour24: number): number {
  return (hour24 / 24) * 360
}

function minuteToClockDegrees(minute: number): number {
  return (minute / 60) * 360
}

function positionForClockDegrees(clockDegrees: number, radius: number) {
  const radians = (clockDegrees - 90) * (Math.PI / 180)
  return {
    left: CENTER + radius * Math.cos(radians) - NODE_SIZE / 2,
    top: CENTER + radius * Math.sin(radians) - NODE_SIZE / 2,
  }
}

function getHourDialValues(is24Hour: boolean): number[] {
  return is24Hour
    ? Array.from({ length: 24 }, (_, index) => index)
    : Array.from({ length: 12 }, (_, index) => index + 1)
}

function getMinuteDialValues(): number[] {
  return Array.from({ length: 12 }, (_, index) => index * 5)
}

function isMinuteDialSelected(dialValue: number, selectedMinute: number): boolean {
  return (
    Math.abs(dialValue - selectedMinute) < 3 ||
    (selectedMinute >= 58 && dialValue === 0)
  )
}

function resolveSelectedMinuteDial(minute: number): number {
  return (
    getMinuteDialValues().find((dialValue) =>
      isMinuteDialSelected(dialValue, minute),
    ) ?? 0
  )
}

function hourValueToClockDegrees(hour: number, is24Hour: boolean): number {
  return is24Hour ? hour24ToClockDegrees(hour) : hour12ToClockDegrees(hour)
}

function minuteValueToClockDegrees(minute: number): number {
  return minuteToClockDegrees(minute)
}

function clockHandEnd(clockDegrees: number, radius: number) {
  const radians = (clockDegrees - 90) * (Math.PI / 180)
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  }
}

type BsTimePickerClockProps = {
  mode: SelectionMode
  value: BsTime
  locale: BsLocale
  is24Hour: boolean
  onSelectHour: (hour: number) => void
  onSelectMinute: (minute: number) => void
}

function ClockHand({ clockDegrees }: { clockDegrees: number }) {
  const end = clockHandEnd(clockDegrees, HAND_RADIUS)

  return (
    <Svg
      width={CLOCK_SIZE}
      height={CLOCK_SIZE}
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}
    >
      <Line
        x1={CENTER}
        y1={CENTER}
        x2={end.x}
        y2={end.y}
        stroke={HAND_COLOR}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx={CENTER} cy={CENTER} r={5} fill={HAND_COLOR} />
    </Svg>
  )
}

type ClockDialNodesProps = {
  mode: SelectionMode
  value: BsTime
  locale: BsLocale
  is24Hour: boolean
  onSelectHour: (hour: number) => void
  onSelectMinute: (minute: number) => void
}

function ClockDialNodes({
  mode,
  value,
  locale,
  is24Hour,
  onSelectHour,
  onSelectMinute,
}: ClockDialNodesProps) {
  const dialValues =
    mode === 'hour' ? getHourDialValues(is24Hour) : getMinuteDialValues()

  const selectedHour = is24Hour ? value.hour : resolveDisplayHour(value.hour, false)
  const selectedMinute = value.minute

  return (
    <>
      {dialValues.map((dialValue) => {
        const clockDegrees =
          mode === 'hour'
            ? hourValueToClockDegrees(dialValue, is24Hour)
            : minuteValueToClockDegrees(dialValue)

        const isSelected =
          mode === 'hour'
            ? dialValue === selectedHour
            : isMinuteDialSelected(dialValue, selectedMinute)

        const position = positionForClockDegrees(clockDegrees, CLOCK_RADIUS)
        const label =
          mode === 'hour'
            ? formatTimeDigit(dialValue, locale)
            : formatMinuteOption(dialValue, locale)

        return (
          <Pressable
            key={`${mode}-${dialValue}`}
            className={cn(
              'absolute z-20 items-center justify-center rounded-full',
              isSelected ? 'bg-primary' : 'bg-transparent',
            )}
            style={{
              left: position.left,
              top: position.top,
              width: NODE_SIZE,
              height: NODE_SIZE,
            }}
            onPress={() => {
              if (mode === 'hour') {
                if (is24Hour) {
                  onSelectHour(dialValue)
                } else {
                  const period = resolveDisplayPeriod(value.hour, false)
                  onSelectHour(from12Hour(dialValue, period))
                }
              } else {
                onSelectMinute(dialValue)
              }
            }}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                isSelected ? 'text-primary-foreground' : 'text-foreground',
              )}
            >
              {label}
            </Text>
          </Pressable>
        )
      })}
    </>
  )
}

type ClockDialLayerProps = {
  mode: SelectionMode
  value: BsTime
  locale: BsLocale
  is24Hour: boolean
  handClockDegrees: number
  onSelectHour: (hour: number) => void
  onSelectMinute: (minute: number) => void
}

function ClockDialLayer({
  mode,
  value,
  locale,
  is24Hour,
  handClockDegrees,
  onSelectHour,
  onSelectMinute,
}: ClockDialLayerProps) {
  return (
    <>
      <ClockHand clockDegrees={handClockDegrees} />
      <ClockDialNodes
        mode={mode}
        value={value}
        locale={locale}
        is24Hour={is24Hour}
        onSelectHour={onSelectHour}
        onSelectMinute={onSelectMinute}
      />
    </>
  )
}

function BsTimePickerClock({
  mode,
  value,
  locale,
  is24Hour,
  onSelectHour,
  onSelectMinute,
}: BsTimePickerClockProps) {
  const selectedHour = is24Hour ? value.hour : resolveDisplayHour(value.hour, false)
  const selectedMinute = value.minute
  const dialProgress = useSharedValue(mode === 'hour' ? 0 : 1)
  const hasAnimatedDial = React.useRef(false)

  React.useEffect(() => {
    const target = mode === 'hour' ? 0 : 1
    if (!hasAnimatedDial.current) {
      dialProgress.value = target
      hasAnimatedDial.current = true
      return
    }

    dialProgress.value = withTiming(target, {
      duration: DIAL_TRANSITION_MS,
      easing: Easing.inOut(Easing.cubic),
    })
  }, [dialProgress, mode])

  const hourDialStyle = useAnimatedStyle(() => ({
    opacity: 1 - dialProgress.value,
    transform: [{ scale: 1 - dialProgress.value * 0.06 }],
  }))

  const minuteDialStyle = useAnimatedStyle(() => ({
    opacity: dialProgress.value,
    transform: [{ scale: 0.94 + dialProgress.value * 0.06 }],
  }))

  const hourHandDegrees = hourValueToClockDegrees(selectedHour, is24Hour)
  const minuteHandDegrees = minuteValueToClockDegrees(
    resolveSelectedMinuteDial(selectedMinute),
  )

  return (
    <View
      className="relative self-center rounded-full border border-border/70 bg-input"
      style={{ width: CLOCK_SIZE, height: CLOCK_SIZE }}
    >
      <Animated.View
        pointerEvents={mode === 'hour' ? 'auto' : 'none'}
        style={[styles.dialLayer, hourDialStyle]}
      >
        <ClockDialLayer
          mode="hour"
          value={value}
          locale={locale}
          is24Hour={is24Hour}
          handClockDegrees={hourHandDegrees}
          onSelectHour={onSelectHour}
          onSelectMinute={onSelectMinute}
        />
      </Animated.View>

      <Animated.View
        pointerEvents={mode === 'minute' ? 'auto' : 'none'}
        style={[styles.dialLayer, minuteDialStyle]}
      >
        <ClockDialLayer
          mode="minute"
          value={value}
          locale={locale}
          is24Hour={is24Hour}
          handClockDegrees={minuteHandDegrees}
          onSelectHour={onSelectHour}
          onSelectMinute={onSelectMinute}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  dialLayer: {
    ...StyleSheet.absoluteFill,
  },
})

export function BsTimePickerDialog({
  visible,
  value,
  locale,
  is24Hour = false,
  title,
  cancelLabel,
  confirmLabel,
  onChange,
  onCancel,
  onConfirm,
}: BsTimePickerDialogProps) {
  const [selectionMode, setSelectionMode] = React.useState<SelectionMode>('hour')
  const clamped = clampBsTime(value)
  const displayHour = resolveDisplayHour(clamped.hour, is24Hour)
  const displayPeriod = resolveDisplayPeriod(clamped.hour, is24Hour)

  const updateTime = (patch: Partial<BsTime>) => {
    onChange(clampBsTime({ ...clamped, ...patch }))
  }

  const setPeriod = (period: BsPeriod) => {
    const { hour: hour12 } = to12Hour(clamped.hour)
    updateTime({ hour: from12Hour(hour12, period) })
  }

  const handleSelectHour = (hour24: number) => {
    updateTime({ hour: hour24 })
    setSelectionMode('minute')
  }

  if (!visible) return null

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-5 py-6"
        onPress={onCancel}
      >
        <Pressable
          className="w-full max-w-[360px] overflow-hidden rounded-[28px] bg-background"
          onPress={(event) => event.stopPropagation()}
        >
          {title ? (
            <View className="px-6 pb-2 pt-6">
              <Text className="text-sm font-medium text-muted-foreground">
                {title}
              </Text>
            </View>
          ) : null}

          <View className="flex-row items-center px-6 pb-4 pt-4">
            <View className="flex-1 flex-row items-center gap-2">
              <Pressable
                className={cn(
                  'min-w-[72px] rounded-xl px-3 py-3',
                  selectionMode === 'hour' ? 'bg-primary/15' : 'bg-input',
                )}
                onPress={() => setSelectionMode('hour')}
              >
                <Text className="text-center text-[44px] leading-none text-foreground">
                  {formatTimeDigit(displayHour, locale)}
                </Text>
              </Pressable>

              <Text className="text-[44px] leading-none text-muted-foreground">
                :
              </Text>

              <Pressable
                className={cn(
                  'min-w-[72px] rounded-xl px-3 py-3',
                  selectionMode === 'minute' ? 'bg-primary/15' : 'bg-input',
                )}
                onPress={() => setSelectionMode('minute')}
              >
                <Text className="text-center text-[44px] leading-none text-foreground">
                  {formatMinuteOption(clamped.minute, locale)}
                </Text>
              </Pressable>
            </View>

            {!is24Hour ? (
              <View className="ml-3 overflow-hidden rounded-xl border border-border/60">
                <Pressable
                  className={cn(
                    'min-w-12 items-center px-3 py-2',
                    displayPeriod === 'am' ? 'bg-primary/15' : 'bg-transparent',
                  )}
                  onPress={() => setPeriod('am')}
                >
                  <Text className="text-xs font-semibold uppercase text-foreground">
                    {formatPeriodOption('am', locale)}
                  </Text>
                </Pressable>
                <Pressable
                  className={cn(
                    'min-w-12 items-center px-3 py-2',
                    displayPeriod === 'pm' ? 'bg-primary/15' : 'bg-transparent',
                  )}
                  onPress={() => setPeriod('pm')}
                >
                  <Text className="text-xs font-semibold uppercase text-foreground">
                    {formatPeriodOption('pm', locale)}
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>

          <View className="items-center px-4 pb-4 pt-1">
            <BsTimePickerClock
              mode={selectionMode}
              value={clamped}
              locale={locale}
              is24Hour={is24Hour}
              onSelectHour={handleSelectHour}
              onSelectMinute={(minute) => updateTime({ minute })}
            />
          </View>

          <View className="flex-row justify-end px-2 pb-3 pt-1">
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
