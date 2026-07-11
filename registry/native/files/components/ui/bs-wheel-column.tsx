import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import * as Haptics from 'expo-haptics'
import * as React from 'react'
import {
  FlatList,
  Platform,
  useColorScheme,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  View,
} from 'react-native'

const ITEM_HEIGHT = Platform.OS === 'ios' ? 44 : 48
const VISIBLE_COUNT = 5
export const BS_WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT
const EDGE_PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2)
const DEFAULT_LOOP_REPEATS = 51
/** iOS UIDatePicker-style selection band height (44pt row). */
export const BS_WHEEL_SELECTION_HEIGHT = ITEM_HEIGHT
/** Horizontal padding beyond measured column edges. */
const BS_WHEEL_PILL_H_PAD = 6

function wheelItemOpacity(distance: number): number {
  if (distance <= 0) return 1
  if (distance === 1) return 0.48
  if (distance === 2) return 0.28
  return 0.14
}

/** Gap between wheel columns (native UIDatePicker is tight). */
export const BS_WHEEL_COLUMN_GAP = 6
export const BS_WHEEL_DATE_COL_WIDTH = 172
export const BS_WHEEL_HOUR_COL_WIDTH = 46
export const BS_WHEEL_MIN_COL_WIDTH = 46
export const BS_WHEEL_PERIOD_COL_WIDTH = 50

function triggerWheelSelectionHaptic() {
  if (Platform.OS === 'web') return
  void Haptics.selectionAsync()
}

function flattenWheelChildren(children: React.ReactNode): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  React.Children.forEach(children, (child) => {
    if (child == null || child === false) return
    if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment) {
      flattenWheelChildren(child.props.children).forEach((node) => nodes.push(node))
      return
    }
    nodes.push(child)
  })
  return nodes
}

type BsWheelSelectionBandProps = {
  /** When set, pill hugs measured column group (native UIDatePicker). */
  left?: number
  width?: number
}

/** One centered pill spanning all columns (native iOS wheel — not per-column). */
export function BsWheelSelectionBand({
  left,
  width,
}: BsWheelSelectionBandProps = {}) {
  const colorScheme = useColorScheme()
  const radius = BS_WHEEL_SELECTION_HEIGHT / 2
  const top = (BS_WHEEL_HEIGHT - BS_WHEEL_SELECTION_HEIGHT) / 2
  const hugContent = width != null && width > 0 && left != null

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        zIndex: 1,
        top,
        ...(hugContent
          ? {
              left: left - BS_WHEEL_PILL_H_PAD,
              width: width + BS_WHEEL_PILL_H_PAD * 2,
            }
          : {
              left: BS_WHEEL_PILL_H_PAD,
              right: BS_WHEEL_PILL_H_PAD,
            }),
        height: BS_WHEEL_SELECTION_HEIGHT,
        borderRadius: radius,
        backgroundColor:
          colorScheme === 'dark'
            ? 'rgba(120, 120, 128, 0.36)'
            : 'rgba(120, 120, 128, 0.24)',
      }}
    />
  )
}

type BsWheelRowProps = {
  children: React.ReactNode
  className?: string
  /** Show the shared selection band (default true for multi-column rows). */
  showSelectionBand?: boolean
  /** Gap between column groups (default BS_WHEEL_COLUMN_GAP). */
  columnGap?: number
}

type BsWheelRowMeasuredProps = {
  flatChildren: React.ReactNode[]
  showSelectionBand: boolean
  columnGap: number
}

function BsWheelRowMeasured({
  flatChildren,
  showSelectionBand,
  columnGap,
}: BsWheelRowMeasuredProps) {
  const childLayouts = React.useRef<Array<{ x: number; width: number }>>([])
  const [pillBox, setPillBox] = React.useState({ left: 0, width: 0 })

  const updatePillBox = React.useCallback(() => {
    const layouts = childLayouts.current
    if (layouts.length < flatChildren.length) return
    if (layouts.some((layout) => layout == null || layout.width <= 0)) return

    const left = Math.min(...layouts.map((layout) => layout.x))
    const right = Math.max(...layouts.map((layout) => layout.x + layout.width))
    setPillBox({ left, width: right - left })
  }, [flatChildren.length])

  const wrappedChildren = flatChildren.map((child, index) => (
    <View
      key={index}
      collapsable={false}
      onLayout={(event) => {
        const { x, width } = event.nativeEvent.layout
        childLayouts.current[index] = { x, width }
        updatePillBox()
      }}
    >
      {child}
    </View>
  ))

  return (
    <View className="relative flex-row items-stretch" style={{ gap: columnGap }}>
      {showSelectionBand && pillBox.width > 0 ? (
        <BsWheelSelectionBand left={pillBox.left} width={pillBox.width} />
      ) : null}
      {wrappedChildren}
    </View>
  )
}

export function BsWheelRow({
  children,
  className,
  showSelectionBand = true,
  columnGap = BS_WHEEL_COLUMN_GAP,
}: BsWheelRowProps) {
  const flatChildren = React.useMemo(
    () => flattenWheelChildren(children),
    [children],
  )

  return (
    <View
      className={cn('relative w-full', className)}
      style={{ height: BS_WHEEL_HEIGHT }}
    >
      <View
        className="h-full w-full items-center justify-center"
        style={{ zIndex: 2 }}
      >
        <BsWheelRowMeasured
          key={flatChildren.length}
          flatChildren={flatChildren}
          showSelectionBand={showSelectionBand}
          columnGap={columnGap}
        />
      </View>
    </View>
  )
}

type BsWheelColumnProps<T extends string | number> = {
  items: readonly T[]
  selected: T
  onSelect: (value: T) => void
  formatLabel: (value: T) => string
  className?: string
  /** Fixed column width (preferred over Tailwind width classes). */
  columnWidth?: number
  showOverlay?: boolean
  /** Tighter horizontal padding for numeric columns. */
  compact?: boolean
  /** Repeat items and recenter while scrolling for a native infinite wheel feel. */
  loop?: boolean
  loopRepeats?: number
  /** Avoid O(n) lookup when the item list is large (e.g. chronological dates). */
  selectedIndex?: number
}

function normalizeIndex(index: number, length: number): number {
  if (length === 0) return 0
  return ((index % length) + length) % length
}

export function BsWheelColumn<T extends string | number>({
  items,
  selected,
  onSelect,
  formatLabel,
  className,
  columnWidth,
  showOverlay = true,
  compact = false,
  loop = false,
  loopRepeats = DEFAULT_LOOP_REPEATS,
  selectedIndex: selectedIndexProp,
}: BsWheelColumnProps<T>) {
  const listRef = React.useRef<FlatList<T>>(null)
  const isRecenteringRef = React.useRef(false)
  const selectedIndex = Math.max(
    0,
    selectedIndexProp ?? items.indexOf(selected),
  )
  const middleOffset =
    loop && items.length > 0
      ? Math.floor(loopRepeats / 2) * items.length
      : 0

  const data = React.useMemo(() => {
    if (!loop || items.length === 0) return [...items]
    return Array.from(
      { length: items.length * loopRepeats },
      (_, index) => items[normalizeIndex(index, items.length)]!,
    )
  }, [items, loop, loopRepeats])

  const indexForSelected = React.useCallback(
    (index: number) => (loop ? middleOffset + index : index),
    [loop, middleOffset],
  )

  const [focusedIndex, setFocusedIndex] = React.useState(() =>
    indexForSelected(selectedIndex),
  )

  const scrollToIndex = React.useCallback(
    (index: number, animated = false) => {
      if (index < 0 || index >= data.length) return
      listRef.current?.scrollToOffset({
        offset: index * ITEM_HEIGHT,
        animated,
      })
      setFocusedIndex(index)
    },
    [data.length],
  )

  const recenterIfNeeded = React.useCallback(
    (index: number) => {
      if (!loop || items.length === 0) return index

      const edgeBuffer = items.length * 2
      if (index >= edgeBuffer && index < data.length - edgeBuffer) {
        return index
      }

      const normalizedIndex = normalizeIndex(index, items.length)
      const targetIndex = middleOffset + normalizedIndex
      isRecenteringRef.current = true
      listRef.current?.scrollToOffset({
        offset: targetIndex * ITEM_HEIGHT,
        animated: false,
      })
      setFocusedIndex(targetIndex)
      requestAnimationFrame(() => {
        isRecenteringRef.current = false
      })
      return targetIndex
    },
    [data.length, items.length, loop, middleOffset],
  )

  React.useEffect(() => {
    const targetIndex = indexForSelected(selectedIndex)
    // Scroll only — avoid setFocusedIndex here (react-hooks/set-state-in-effect).
    if (targetIndex < 0 || targetIndex >= data.length) return
    listRef.current?.scrollToOffset({
      offset: targetIndex * ITEM_HEIGHT,
      animated: false,
    })
  }, [data.length, indexForSelected, selectedIndex])

  const commitIndex = React.useCallback(
    (index: number) => {
      const boundedIndex = Math.min(
        data.length - 1,
        Math.max(0, Math.round(index)),
      )
      const settledIndex = recenterIfNeeded(boundedIndex)
      const normalizedIndex = loop
        ? normalizeIndex(settledIndex, items.length)
        : settledIndex
      const next = items[normalizedIndex]
      if (next !== undefined && next !== selected) {
        onSelect(next)
      }
    },
    [data.length, items, loop, onSelect, recenterIfNeeded, selected],
  )

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isRecenteringRef.current) return

    const index = Math.min(
      data.length - 1,
      Math.max(0, Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT)),
    )

    if (index !== focusedIndex) {
      triggerWheelSelectionHaptic()
      setFocusedIndex(index)
    }
  }

  const handleMomentumEnd = (offsetY: number) => {
    commitIndex(offsetY / ITEM_HEIGHT)
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<T>) => {
    const distance = Math.abs(index - focusedIndex)
    const opacity = wheelItemOpacity(distance)
    const isFocused = distance === 0
    return (
      <Pressable
        className={cn(
          'w-full items-center justify-center',
          compact ? 'px-0' : 'px-1',
        )}
        style={{ height: ITEM_HEIGHT }}
        onPress={() => {
          triggerWheelSelectionHaptic()
          scrollToIndex(index, true)
          const normalizedIndex = loop
            ? normalizeIndex(index, items.length)
            : index
          const next = items[normalizedIndex]
          if (next !== undefined) {
            onSelect(next)
          }
        }}
      >
        <Text
          className={cn(
            'w-full text-center text-[20px] leading-[25px]',
            isFocused ? 'font-semibold text-foreground' : 'font-normal text-foreground',
          )}
          style={{ opacity }}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {formatLabel(item)}
        </Text>
      </Pressable>
    )
  }

  return (
    <View
      className={cn('relative shrink-0', className)}
      style={{
        width: columnWidth,
        height: BS_WHEEL_HEIGHT,
        backgroundColor: 'transparent',
      }}
    >
      {showOverlay ? <BsWheelSelectionBand /> : null}
      <FlatList
        ref={listRef}
        data={data}
        style={{ flex: 1, backgroundColor: 'transparent', zIndex: 2 }}
        initialScrollIndex={
          data.length > 0 ? Math.min(focusedIndex, data.length - 1) : undefined
        }
        keyExtractor={(item, index) => `${String(item)}-${index}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        contentContainerStyle={{ paddingVertical: EDGE_PADDING }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) =>
          handleMomentumEnd(event.nativeEvent.contentOffset.y)
        }
        onScrollEndDrag={(event) => {
          if (event.nativeEvent.velocity?.y === 0) {
            handleMomentumEnd(event.nativeEvent.contentOffset.y)
          }
        }}
      />
    </View>
  )
}
