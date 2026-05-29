import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)

export function useLenisInstance() {
  return useContext(LenisContext)
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const tickerFn = useRef<(time: number) => void>()

  useEffect(() => {
    const instance = new Lenis()

    instance.on('scroll', ScrollTrigger.update)

    tickerFn.current = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tickerFn.current)
    gsap.ticker.lagSmoothing(0)

    setLenis(instance)

    return () => {
      if (tickerFn.current) gsap.ticker.remove(tickerFn.current)
      instance.destroy()
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
