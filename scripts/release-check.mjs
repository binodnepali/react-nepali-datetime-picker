import { execSync } from 'node:child_process'

execSync('pnpm test', { stdio: 'inherit' })
execSync('pnpm check-types', { stdio: 'inherit' })
execSync('pnpm registry:build', { stdio: 'inherit' })

try {
  execSync('git diff --exit-code -- apps/docs/public/r apps/docs/public/r-native', {
    stdio: 'pipe',
  })
} catch {
  console.error(
    'Registry JSON is out of date. Run `pnpm registry:build` and commit apps/docs/public/r/ and r-native/ before releasing.',
  )
  process.exit(1)
}
