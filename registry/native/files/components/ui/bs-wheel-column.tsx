import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import * as React from 'react'
import {
  FlatList,
  Platform,
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

type BsWheelColumnProps<T extends string | number> = {
  items: readonly T[]
  selected: T
  onSelect: (value: T) => void
  formatLabel: (value: T) => string
  className?: string
  showOverlay?: boolean
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
  showOverlay = true,
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
      setFocusedIndex(index)
    }
  }

  const handleMomentumEnd = (offsetY: number) => {
    commitIndex(offsetY / ITEM_HEIGHT)
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<T>) => {
    const isFocused = index === focusedIndex
    return (
      <Pressable
        className="w-full items-center justify-center px-3"
        style={{ height: ITEM_HEIGHT }}
        onPress={() => {
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
            'w-full text-center text-[17px] leading-[22px]',
            isFocused
              ? 'font-semibold text-foreground'
              : 'font-normal text-muted-foreground/70',
          )}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {formatLabel(item)}
        </Text>
      </Pressable>
    )
  }

  return (
    <View
      className={cn('relative flex-1', className)}
      style={{ height: BS_WHEEL_HEIGHT }}
    >
      {showOverlay ? (
        <View
          pointerEvents="none"
          className="absolute inset-x-3 top-1/2 z-0 -mt-[22px] h-11 rounded-[10px] bg-[#787880]/20"
        />
      ) : null}
      <FlatList
        ref={listRef}
        data={data}
        style={{ zIndex: 1 }}
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
