#!/usr/bin/env node

import { cp, mkdir, writeFile } from 'node:fs/promises'
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

async function copyCoreTo(
  targetDir,
  prefix = 'lib/bs-day-picker',
  files = CORE_COPY_FILES,
) {
  const destinationRoot = join(targetDir, prefix)
  await mkdir(destinationRoot, { recursive: true })

  for (const file of files) {
    await cp(join(CORE_SRC, file), join(destinationRoot, file))
  }

  await cp(
    join(CORE_SRC, 'data/bs-calendar.json'),
    join(destinationRoot, 'data/bs-calendar.json'),
  )
}

async function buildWebRegistry() {
  await copyCoreTo(WEB_FILES)

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
    path: 'registry/native/files/components/ui/bs-date-picker-wheels.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-date-picker-wheels.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-date-picker-wheels.ios.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-date-picker-wheels.ios.tsx',
  },
  {
    path: 'registry/native/files/components/ui/bs-date-picker-wheels.android.tsx',
    type: 'registry:component',
    target: 'components/ui/bs-date-picker-wheels.android.tsx',
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

async function buildNativeRegistry() {
  await copyCoreTo(NATIVE_FILES, 'lib/bs-day-picker', NATIVE_CORE_COPY_FILES)

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
        registryDependencies: ['button'],
        docs: 'Install bs-calendar first. Metro resolves `.ios.tsx` / `.android.tsx` automatically. Web uses `bs-date-picker-wheels.tsx` (optional `@expo/ui/community/picker` for HTML selects).',
        files: NATIVE_DATE_PICKER_FILES,
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
