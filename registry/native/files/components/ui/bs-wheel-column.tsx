import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import * as Haptics from 'expo-haptics'
import * as React from 'react'
import {
  FlatList,
  Platform,
  ScrollView,
  useColorScheme,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  View,
} from 'react-native'

const ITEM_HEIGHT = Platform.OS === 'ios' ? 44 : 48
/** Room for Devanagari matras above/below the nominal line box. */
const WHEEL_LABEL_LINE_HEIGHT = Platform.OS === 'ios' ? 34 : 32
const VISIBLE_COUNT = 5
export const BS_WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT
const EDGE_PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2)
/** Cap virtual row count for looped wheels (51× repeats blew past 1k+ rows). */
const MAX_LOOP_VIRTUAL_ITEMS = 180
/** Non-virtualized snap scroll for short finite lists (e.g. BS year column). */
const FINITE_WHEEL_MAX_ITEMS = 120

function getAdaptiveLoopRepeats(itemCount: number): number {
  if (itemCount <= 0) return 1
  const repeats = Math.ceil(MAX_LOOP_VIRTUAL_ITEMS / itemCount)
  const oddRepeats = repeats % 2 === 0 ? repeats + 1 : repeats
  return Math.max(7, Math.min(oddRepeats, 11))
}
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
/** Horizontal inset for date picker wheels (day / month / year). */
export const BS_WHEEL_DATE_ROW_INSET = 20
export const BS_WHEEL_DATE_COL_WIDTH = 172
export const BS_WHEEL_YEAR_COL_WIDTH = 56
export const BS_WHEEL_YEAR_COL_WIDTH_NE = 72
export const BS_WHEEL_MONTH_COL_WIDTH = 80
export const BS_WHEEL_MONTH_COL_WIDTH_NE = 100
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
  /** Horizontal inset inside the wheel row container. */
  horizontalInset?: number
  /** `even` spreads columns with equal space; `grouped` keeps a tight centered cluster. */
  columnLayout?: 'grouped' | 'even'
}

type BsWheelRowMeasuredProps = {
  flatChildren: React.ReactNode[]
  showSelectionBand: boolean
  columnGap: number
  columnLayout: 'grouped' | 'even'
}

function BsWheelRowMeasured({
  flatChildren,
  showSelectionBand,
  columnGap,
  columnLayout,
}: BsWheelRowMeasuredProps) {
  const childLayouts = React.useRef<{ x: number; width: number }[]>([])
  const [pillBox, setPillBox] = React.useState({ left: 0, width: 0 })

  const updatePillBox = React.useCallback(() => {
    const layouts = childLayouts.current
    if (layouts.length < flatChildren.length) return
    if (layouts.some((layout) => layout == null || layout.width <= 0)) return

    const left = Math.min(...layouts.map((layout) => layout.x))
    const right = Math.max(...layouts.map((layout) => layout.x + layout.width))
    const width = right - left
    setPillBox((prev) =>
      prev.left === left && prev.width === width ? prev : { left, width },
    )
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

  const spreadColumns = columnLayout === 'even'

  return (
    <View
      className="relative flex-row items-stretch"
      style={{
        gap: spreadColumns ? 0 : columnGap,
        width: spreadColumns ? '100%' : undefined,
        justifyContent: spreadColumns ? 'space-evenly' : undefined,
      }}
    >
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
  horizontalInset = 0,
  columnLayout = 'grouped',
}: BsWheelRowProps) {
  const flatChildren = React.useMemo(
    () => flattenWheelChildren(children),
    [children],
  )
  const spreadColumns = columnLayout === 'even'

  return (
    <View
      className={cn('relative w-full', className)}
      style={{ height: BS_WHEEL_HEIGHT }}
    >
      <View
        className={cn(
          'h-full w-full',
          spreadColumns ? '' : 'items-center justify-center',
        )}
        style={{ zIndex: 2, paddingHorizontal: horizontalInset }}
      >
        <BsWheelRowMeasured
          key={flatChildren.length}
          flatChildren={flatChildren}
          showSelectionBand={showSelectionBand}
          columnGap={columnGap}
          columnLayout={columnLayout}
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

type BsWheelListItemProps = {
  index: number
  focusedIndex: number
  compact: boolean
  label: string
  onPressIndex: (index: number) => void
}

const BsWheelListItem = React.memo(function BsWheelListItem({
  index,
  focusedIndex,
  compact,
  label,
  onPressIndex,
}: BsWheelListItemProps) {
  const opacity = wheelItemOpacity(Math.abs(index - focusedIndex))

  return (
    <Pressable
      className={cn(
        'w-full items-center justify-center',
        compact ? 'px-0' : 'px-1',
      )}
      style={{ height: ITEM_HEIGHT }}
      onPress={() => onPressIndex(index)}
    >
      <Text
        className="w-full text-center text-[20px] font-normal text-foreground"
        style={{
          opacity,
          lineHeight: WHEEL_LABEL_LINE_HEIGHT,
          paddingHorizontal: compact ? 2 : 4,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  )
}, (prev, next) => {
  if (prev.label !== next.label || prev.index !== next.index) return false
  const prevOpacity = wheelItemOpacity(Math.abs(prev.index - prev.focusedIndex))
  const nextOpacity = wheelItemOpacity(Math.abs(next.index - next.focusedIndex))
  return prevOpacity === nextOpacity
})

type BsWheelFiniteColumnProps<T extends string | number> = BsWheelColumnProps<T>

/** ScrollView wheel for finite lists — avoids VirtualizedList overhead (~90 years). */
function BsWheelFiniteColumn<T extends string | number>({
  items,
  selected,
  onSelect,
  formatLabel,
  className,
  columnWidth,
  showOverlay = true,
  compact = false,
  selectedIndex: selectedIndexProp,
}: BsWheelFiniteColumnProps<T>) {
  const scrollRef = React.useRef<ScrollView>(null)
  const selectedIndex = Math.max(
    0,
    selectedIndexProp ?? items.indexOf(selected),
  )
  const labels = React.useMemo(
    () => items.map((item) => formatLabel(item)),
    [items, formatLabel],
  )
  const [focusedIndex, setFocusedIndex] = React.useState(selectedIndex)
  const focusedIndexRef = React.useRef(selectedIndex)
  const isSyncingRef = React.useRef(false)

  React.useLayoutEffect(() => {
    if (selectedIndex < 0 || selectedIndex >= items.length) return
    isSyncingRef.current = true
    focusedIndexRef.current = selectedIndex
    scrollRef.current?.scrollTo({
      y: selectedIndex * ITEM_HEIGHT,
      animated: false,
    })
    requestAnimationFrame(() => {
      isSyncingRef.current = false
      setFocusedIndex(selectedIndex)
    })
  }, [items.length, selectedIndex])

  const commitIndex = React.useCallback(
    (offsetY: number) => {
      const index = Math.min(
        items.length - 1,
        Math.max(0, Math.round(offsetY / ITEM_HEIGHT)),
      )
      focusedIndexRef.current = index
      setFocusedIndex(index)
      const next = items[index]
      if (next !== undefined && next !== selected) {
        onSelect(next)
      }
    },
    [items, onSelect, selected],
  )

  const handleScrollEnd = React.useCallback(
    (offsetY: number) => {
      triggerWheelSelectionHaptic()
      commitIndex(offsetY)
    },
    [commitIndex],
  )

  const handlePressIndex = React.useCallback(
    (index: number) => {
      triggerWheelSelectionHaptic()
      scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true })
      focusedIndexRef.current = index
      setFocusedIndex(index)
      const next = items[index]
      if (next !== undefined) {
        onSelect(next)
      }
    },
    [items, onSelect],
  )

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
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, zIndex: 2 }}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: EDGE_PADDING }}
        scrollEventThrottle={32}
        onMomentumScrollEnd={(event) => {
          if (isSyncingRef.current) return
          handleScrollEnd(event.nativeEvent.contentOffset.y)
        }}
        onScrollEndDrag={(event) => {
          if (isSyncingRef.current) return
          if (event.nativeEvent.velocity?.y === 0) {
            handleScrollEnd(event.nativeEvent.contentOffset.y)
          }
        }}
      >
        {items.map((item, index) => (
          <BsWheelListItem
            key={String(item)}
            index={index}
            focusedIndex={focusedIndex}
            compact={compact}
            label={labels[index] ?? String(item)}
            onPressIndex={handlePressIndex}
          />
        ))}
      </ScrollView>
    </View>
  )
}

export function BsWheelColumn<T extends string | number>(props: BsWheelColumnProps<T>) {
  const useFiniteScroll =
    !props.loop &&
    props.items.length > 0 &&
    props.items.length <= FINITE_WHEEL_MAX_ITEMS

  if (useFiniteScroll) {
    return <BsWheelFiniteColumn {...props} />
  }

  return <BsWheelVirtualColumn {...props} />
}

function BsWheelVirtualColumn<T extends string | number>({
  items,
  selected,
  onSelect,
  formatLabel,
  className,
  columnWidth,
  showOverlay = true,
  compact = false,
  loop = false,
  loopRepeats: loopRepeatsProp,
  selectedIndex: selectedIndexProp,
}: BsWheelColumnProps<T>) {
  const listRef = React.useRef<FlatList<T>>(null)
  const isRecenteringRef = React.useRef(false)
  const focusedIndexRef = React.useRef(0)
  const focusFrameRef = React.useRef<number | null>(null)
  const effectiveLoopRepeats = React.useMemo(
    () =>
      loop
        ? (loopRepeatsProp ?? getAdaptiveLoopRepeats(items.length))
        : 1,
    [items.length, loop, loopRepeatsProp],
  )
  const selectedIndex = Math.max(
    0,
    selectedIndexProp ?? items.indexOf(selected),
  )
  const middleOffset =
    loop && items.length > 0
      ? Math.floor(effectiveLoopRepeats / 2) * items.length
      : 0

  const itemLabels = React.useMemo(
    () => items.map((item) => formatLabel(item)),
    [items, formatLabel],
  )

  const data = React.useMemo(() => {
    if (!loop || items.length === 0) return [...items]
    return Array.from(
      { length: items.length * effectiveLoopRepeats },
      (_, index) => items[normalizeIndex(index, items.length)]!,
    )
  }, [items, loop, effectiveLoopRepeats])

  const indexForSelected = React.useCallback(
    (index: number) => (loop ? middleOffset + index : index),
    [loop, middleOffset],
  )

  const [focusedIndex, setFocusedIndex] = React.useState(() =>
    indexForSelected(selectedIndex),
  )

  React.useLayoutEffect(() => {
    return () => {
      if (focusFrameRef.current != null) {
        cancelAnimationFrame(focusFrameRef.current)
      }
    }
  }, [])

  const scheduleFocusedIndex = React.useCallback((index: number) => {
    focusedIndexRef.current = index
    if (focusFrameRef.current != null) {
      cancelAnimationFrame(focusFrameRef.current)
    }
    focusFrameRef.current = requestAnimationFrame(() => {
      focusFrameRef.current = null
      setFocusedIndex(index)
    })
  }, [])

  const scrollToIndex = React.useCallback(
    (index: number, animated = false) => {
      if (index < 0 || index >= data.length) return
      listRef.current?.scrollToOffset({
        offset: index * ITEM_HEIGHT,
        animated,
      })
      scheduleFocusedIndex(index)
    },
    [data.length, scheduleFocusedIndex],
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
      scheduleFocusedIndex(targetIndex)
      requestAnimationFrame(() => {
        isRecenteringRef.current = false
      })
      return targetIndex
    },
    [data.length, items.length, loop, middleOffset, scheduleFocusedIndex],
  )

  React.useLayoutEffect(() => {
    const targetIndex = indexForSelected(selectedIndex)
    if (targetIndex < 0 || targetIndex >= data.length) return
    focusedIndexRef.current = targetIndex
    listRef.current?.scrollToOffset({
      offset: targetIndex * ITEM_HEIGHT,
      animated: false,
    })
    scheduleFocusedIndex(targetIndex)
  }, [data.length, indexForSelected, scheduleFocusedIndex, selectedIndex])

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

    focusedIndexRef.current = index
  }

  const handlePressIndex = React.useCallback(
    (index: number) => {
      triggerWheelSelectionHaptic()
      scrollToIndex(index, true)
      const normalizedIndex = loop
        ? normalizeIndex(index, items.length)
        : index
      const next = items[normalizedIndex]
      if (next !== undefined) {
        onSelect(next)
      }
    },
    [items, loop, onSelect, scrollToIndex],
  )

  const renderItem = React.useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      const labelIndex = loop
        ? normalizeIndex(index, items.length)
        : index
      return (
        <BsWheelListItem
          index={index}
          focusedIndex={focusedIndex}
          compact={compact}
          label={itemLabels[labelIndex] ?? formatLabel(item)}
          onPressIndex={handlePressIndex}
        />
      )
    },
    [compact, focusedIndex, formatLabel, handlePressIndex, itemLabels, items.length, loop],
  )

  const handleMomentumEnd = (offsetY: number) => {
    const index = Math.min(
      data.length - 1,
      Math.max(0, Math.round(offsetY / ITEM_HEIGHT)),
    )
    if (index !== focusedIndex) {
      triggerWheelSelectionHaptic()
      scheduleFocusedIndex(index)
    }
    commitIndex(offsetY / ITEM_HEIGHT)
  }

  const initialScrollIndex = React.useMemo(
    () => indexForSelected(selectedIndex),
    // Only used on mount — do not tie to scroll focus updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

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
        extraData={focusedIndex}
        style={{ flex: 1, backgroundColor: 'transparent', zIndex: 2 }}
        initialScrollIndex={
          data.length > 0
            ? Math.min(initialScrollIndex, data.length - 1)
            : undefined
        }
        keyExtractor={(item, index) => `${String(item)}-${index}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        removeClippedSubviews={false}
        initialNumToRender={VISIBLE_COUNT + 2}
        windowSize={5}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
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
