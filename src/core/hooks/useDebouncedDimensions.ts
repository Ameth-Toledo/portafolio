import { useState, useEffect, useRef, useCallback } from 'react'

interface Dimensions {
  width: number
  height: number
}

export function useDebouncedDimensions<T extends HTMLElement>(delay = 200) {
  const ref = useRef<T>(null)
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const measure = useCallback(() => {
    if (ref.current) {
      setDimensions({ width: ref.current.offsetWidth, height: ref.current.offsetHeight })
    }
  }, [])

  useEffect(() => {
    measure()
    const handler = () => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(measure, delay)
    }
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
      clearTimeout(timerRef.current)
    }
  }, [measure, delay])

  return { ref, dimensions }
}
