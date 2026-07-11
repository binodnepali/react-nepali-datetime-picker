#!/usr/bin/env node

import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const execAsync = promisify(exec)

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const CORE_SRC = join(ROOT, 'packages/core/src')
const WEB_FILES = join(ROOT, 'registry/web/files')
const NATIVE_FILES = join(ROOT, 'registry/native/files')

const CORE_COPY_FILES = [
  'types.ts',
  'constants.ts',
  'formatters.ts',
  'pattern.ts',
  'navigation.ts',
  'calendar-grid.ts',
  'selection.ts',
  'use-bs-calendar.ts',
  'bs-day-picker.tsx',
  'index.ts',
]

const NATIVE_CORE_COPY_FILES = CORE_COPY_FILES.filter(
  (file) => file !== 'bs-day-picker.tsx',
)

const CORE_TIME_FILES = [
  'types.ts',
  'helpers.ts',
  'formatters.ts',
  'datetime.ts',
  'pattern.ts',
  'index.ts',
]

async function copyTimeCoreTo(targetDir, prefix = 'lib/bs-time-picker/time') {
  const destinationRoot = join(targetDir, prefix)
  await mkdir(destinationRoot, { recursive: true })

  for (const file of CORE_TIME_FILES) {
    const source = join(CORE_SRC, 'time', file)
    const destination = join(destinationRoot, file)
    let contents = await readFile(source, 'utf8')
    contents = contents.replaceAll("from '../", "from '../../bs-day-picker/")
    await writeFile(destination, contents)
  }
}

async function copyCoreTo(
  targetDir,
  prefix = 'lib/bs-day-picker',
  files = CORE_COPY_FILES,
) {
  const destinationRoot = join(targetDir, prefix)
  await mkdir(destinationRoot, { recursive: true })

  for (const file of files) {
    const source = join(CORE_SRC, file)
    const destination = join(destinationRoot, file)
    if (file === 'index.ts') {
      let contents = await readFile(source, 'utf8')
      contents = contents.replace(/^export \* from '\.\/time'\n/m, '')
      await writeFile(destination, contents)
      continue
    }
    await cp(source, destination)
  }

  await cp(
    join(CORE_SRC, 'data/bs-calendar.json'),
    join(destinationRoot, 'data/bs-calendar.json'),
  )
}

async function buildWebRegistry() {
  await copyCoreTo(WEB_FILES)
  await copyTimeCoreTo(WEB_FILES)

  const CORE_TIME_REGISTRY_FILES = CORE_TIME_FILES.map((file) => ({
    path: `registry/web/files/lib/bs-time-picker/time/${file}`,
    type: 'registry:lib',
    target: `lib/bs-time-picker/time/${file}`,
  }))

  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'react-nepali-datetime-picker',
    homepage: 'https://github.com/binodnepali/react-nepali-datetime-picker',
    items: [
      {
        name: 'bs-calendar',
        type: 'registry:ui',
        title: 'Bikram Sambat Calendar',
        description:
          'A Bikram Sambat calendar component styled like shadcn Calendar.',
        dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
        registryDependencies: ['button'],
        files: [
          {
            path: 'registry/web/files/components/ui/bs-calendar.tsx',
            type: 'registry:ui',
            target: 'components/bs-calendar.tsx',
          },
          ...CORE_COPY_FILES.map((file) => ({
            path: `registry/web/files/lib/bs-day-picker/${file}`,
            type: 'registry:lib',
            target: `lib/bs-day-picker/${file}`,
          })),
          {
            path: 'registry/web/files/lib/bs-day-picker/data/bs-calendar.json',
            type: 'registry:lib',
            target: 'lib/bs-day-picker/data/bs-calendar.json',
          },
        ],
      },
      {
        name: 'bs-date-picker',
        type: 'registry:component',
        title: 'Bikram Sambat Date Picker',
        description:
          'Popover date picker built on the Bikram Sambat calendar.',
        dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
        registryDependencies: ['button', 'popover'],
        docs: 'Install bs-calendar before this component: `shadcn add <registry-url>/bs-calendar.json`',
        files: [
          {
            path: 'registry/web/files/components/bs-date-picker.tsx',
            type: 'registry:component',
            target: 'components/bs-date-picker.tsx',
          },
        ],
      },
      {
        name: 'bs-time-picker',
        type: 'registry:component',
        title: 'Bikram Sambat Time Picker',
        description:
          'Popover time picker with 12h/24h support for Bikram Sambat apps.',
        dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
        registryDependencies: ['button', 'popover'],
        docs: 'Install bs-calendar before this component if you need shared locale helpers.',
        files: [
          {
            path: 'registry/web/files/components/bs-time-picker.tsx',
            type: 'registry:component',
            target: 'components/bs-time-picker.tsx',
          },
          {
            path: 'registry/web/files/lib/bs-time-picker.ts',
            type: 'registry:lib',
            target: 'lib/bs-time-picker.ts',
          },
          ...CORE_TIME_REGISTRY_FILES,
        ],
      },
      {
        name: 'bs-datetime-picker',
        type: 'registry:component',
        title: 'Bikram Sambat Date Time Picker',
        description:
          'Combined Bikram Sambat date and time picker with BS to AD conversion helpers.',
        dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
        registryDependencies: ['button', 'popover'],
        docs: 'Install bs-calendar and bs-date-picker first. Uses `toAdDate()` for API submission.',
        files: [
          {
            path: 'registry/web/files/components/bs-datetime-picker.tsx',
            type: 'registry:component',
            target: 'components/bs-datetime-picker.tsx',
          },
          {
            path: 'registry/web/files/lib/bs-datetime-picker.ts',
            type: 'registry:lib',
            target: 'lib/bs-datetime-picker.ts',
          },
          {
            path: 'registry/web/files/lib/bs-time-picker.ts',
            type: 'registry:lib',
            target: 'lib/bs-time-picker.ts',
          },
          ...CORE_TIME_REGISTRY_FILES,
        ],
      },
    ],
  }

  await writeFile(
    join(ROOT, 'registry/web/registry.json'),
    JSON.stringify(registry, null, 2),
  )

  for (const item of registry.items) {
    await writeFile(
      join(ROOT, 'registry/web', `${item.name}.json`),
      JSON.stringify(item, null, 2),
    )
  }
}

const NATIVE_DATE_PICKER_FILES = [
  {
    path: 'registry/native/files/lib/bs-picker.ts',
    type: 'registry:lib',
    target: 'lib/bs-picker.ts',
  },
  {
    path: 'registry/native/files/components/ui/bs-wheel-column.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-wheel-column.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-wheel-sheet.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-wheel-sheet.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-date-picker-wheels.ios.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-date-picker-wheels.ios.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-date-picker.ios.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-date-picker.ios.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-date-picker.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-date-picker.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-date-picker.android.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-date-picker.android.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-date-picker-dialog.android.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-date-picker-dialog.android.tsx',
  },
]

const CORE_TIME_REGISTRY_FILES = CORE_TIME_FILES.map((file) => ({
  path: `registry/native/files/lib/bs-time-picker/time/${file}`,
  type: 'registry:lib',
  target: `lib/bs-time-picker/time/${file}`,
}))

const NATIVE_TIME_PICKER_FILES = [
  {
    path: 'registry/native/files/lib/bs-time-picker.ts',
    type: 'registry:lib',
    target: 'lib/bs-time-picker.ts',
  },
  ...CORE_TIME_REGISTRY_FILES,
  {
    path: 'registry/native/files/components/ui/bs-wheel-column.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-wheel-column.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-wheel-sheet.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-wheel-sheet.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-time-picker-dialog.android.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-time-picker-dialog.android.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-time-picker-wheels.ios.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-time-picker-wheels.ios.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-time-picker.ios.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-time-picker.ios.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-time-picker.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-time-picker.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-time-picker.android.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-time-picker.android.tsx',
  },
]

const NATIVE_DATETIME_PICKER_FILES = [
  {
    path: 'registry/native/files/lib/bs-datetime-picker.ts',
    type: 'registry:lib',
    target: 'lib/bs-datetime-picker.ts',
  },
  {
    path: 'registry/native/files/components/ui/bs-time-picker-dialog.android.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-time-picker-dialog.android.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-wheel-column.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-wheel-column.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-wheel-sheet.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-wheel-sheet.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-datetime-picker-wheels.ios.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-datetime-picker-wheels.ios.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-datetime-picker.ios.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-datetime-picker.ios.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-datetime-picker.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-datetime-picker.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-datetime-picker.android.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-datetime-picker.android.tsx',
  },
]

/** RNR nativewind primitives — never bare `button` (resolves to web shadcn). */
const NATIVE_RNR_REGISTRY_DEPS = [
  'https://reactnativereusables.com/r/nativewind/button.json',
  'https://reactnativereusables.com/r/nativewind/icon.json',
]

async function buildNativeRegistry() {
  await copyCoreTo(NATIVE_FILES, 'lib/bs-day-picker', NATIVE_CORE_COPY_FILES)
  await copyTimeCoreTo(NATIVE_FILES)

  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'react-nepali-datetime-picker-native',
    homepage: 'https://github.com/binodnepali/react-nepali-datetime-picker',
    items: [
      {
        name: 'bs-calendar',
        type: 'registry:ui',
        title: 'Bikram Sambat Calendar (Native)',
        description:
          'NativeWind Bikram Sambat calendar for React Native / Expo.',
        dependencies: ['clsx', 'tailwind-merge', 'lucide-react-native'],
        files: [
          {
            path: 'registry/native/files/components/ui/bs-calendar.tsx',
            type: 'registry:ui',
            target: 'components/ui/bs-calendar.tsx',
          },
          {
            path: 'registry/native/files/components/ui/bs-calendar.android.tsx',
            type: 'registry:ui',
            target: 'components/ui/bs-calendar.android.tsx',
          },
          {
            path: 'registry/native/files/lib/bs-day-picker/bs-day-picker.tsx',
            type: 'registry:lib',
            target: 'lib/bs-day-picker/bs-day-picker.tsx',
          },
          ...NATIVE_CORE_COPY_FILES.map((file) => ({
            path: `registry/native/files/lib/bs-day-picker/${file}`,
            type: 'registry:lib',
            target: `lib/bs-day-picker/${file}`,
          })),
          {
            path: 'registry/native/files/lib/bs-day-picker/data/bs-calendar.json',
            type: 'registry:lib',
            target: 'lib/bs-day-picker/data/bs-calendar.json',
          },
        ],
      },
      {
        name: 'bs-date-picker',
        type: 'registry:component',
        title: 'Bikram Sambat Date Picker (Native)',
        description:
          'Platform Bikram Sambat date picker for React Native / Expo (iOS wheel, Android Material calendar, web dropdowns).',
        dependencies: [
          'clsx',
          'tailwind-merge',
          'lucide-react-native',
          'react-native-safe-area-context',
        ],
        registryDependencies: NATIVE_RNR_REGISTRY_DEPS,
        docs:
          'Installs RNR `button` (and `text`) + `icon` when missing. Install bs-calendar first. iOS: sheet + wheels (`.ios.tsx`). Android: Material calendar dialog.',
        files: NATIVE_DATE_PICKER_FILES,
      },
      {
        name: 'bs-time-picker',
        type: 'registry:component',
        title: 'Bikram Sambat Time Picker (Native)',
        description:
          'Platform Bikram Sambat time picker (iOS wheels, Android Material dialog).',
        dependencies: [
          'clsx',
          'tailwind-merge',
          'lucide-react-native',
          'react-native-safe-area-context',
          'react-native-svg',
        ],
        registryDependencies: NATIVE_RNR_REGISTRY_DEPS,
        docs:
          'Installs RNR `button` (and `text`) + `icon` when missing. Install bs-calendar and bs-date-picker first. Android uses Material-style `BsTimePickerDialog` (no native time picker).',
        files: NATIVE_TIME_PICKER_FILES,
      },
      {
        name: 'bs-datetime-picker',
        type: 'registry:component',
        title: 'Bikram Sambat Date Time Picker (Native)',
        description:
          'Combined BS date and time picker (iOS sheet, Android calendar then time dialog).',
        dependencies: [
          'clsx',
          'tailwind-merge',
          'lucide-react-native',
          'react-native-safe-area-context',
          'react-native-svg',
        ],
        registryDependencies: NATIVE_RNR_REGISTRY_DEPS,
        docs:
          'Installs RNR `button` (and `text`) + `icon` when missing. Install bs-calendar, bs-date-picker, and bs-time-picker first. Android: BS calendar dialog then `BsTimePickerDialog`.',
        files: NATIVE_DATETIME_PICKER_FILES,
      },
    ],
  }

  await writeFile(
    join(ROOT, 'registry/native/registry.json'),
    JSON.stringify(registry, null, 2),
  )

  for (const item of registry.items) {
    await writeFile(
      join(ROOT, 'registry/native', `${item.name}.json`),
      JSON.stringify(item, null, 2),
    )
  }
}

async function buildShadcnOutput() {
  await execAsync(
    'pnpm dlx shadcn@latest build registry/web/registry.json -o apps/docs/public/r',
    { cwd: ROOT },
  )
  await execAsync(
    'pnpm dlx shadcn@latest build registry/native/registry.json -o apps/docs/public/r-native',
    { cwd: ROOT },
  )
}

async function main() {
  await buildWebRegistry()
  await buildNativeRegistry()
  await buildShadcnOutput()
  console.log('Registry files built.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
