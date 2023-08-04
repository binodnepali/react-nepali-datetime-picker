import { useCallback, useEffect, useState } from 'react'

import { breakpoint } from '@/constants/breakpoint'

export const useDevice = () => {
  const [device, setDevice] = useState<{
    isMobile: boolean
    isTablet: boolean
    isLaptop: boolean
    isDesktop: boolean
  }>({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
  })

  const handleResize = useCallback(() => setDevice(getDevice()), [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    setDevice(getDevice())

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return device
}

function getDevice() {
  const { innerWidth } = window
  const isMobile = innerWidth < breakpoint.tablet
  const isTablet =
    innerWidth >= breakpoint.tablet && innerWidth < breakpoint.laptop
  const isLaptop =
    innerWidth >= breakpoint.laptop && innerWidth < breakpoint.desktop
  const isDesktop = innerWidth >= breakpoint.desktop

  return { isMobile, isTablet, isLaptop, isDesktop }
}
