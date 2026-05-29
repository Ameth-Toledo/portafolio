import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { InteractiveHero } from '@/components/ui/interactive-hero-backgrounds'
import { CinematicFooter } from '@/components/ui/motion-footer'
import { SobreMiSection } from '@/components/ui/hero-04'
import { ProyectosSection } from './sections/ProyectosSection'
import { BlogSection } from './sections/BlogSection'
import { CertificacionesSection } from './sections/CertificacionesSection'
import { useLenisInstance } from '@/core/context/LenisContext'

function LandingPage() {
  const location = useLocation()
  const lenis = useLenisInstance()

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo
    if (!scrollTo) return
    const attempt = () => {
      const el = document.querySelector(scrollTo)
      if (el && lenis) {
        lenis.scrollTo(el as HTMLElement, { offset: -80 })
      }
    }
    // pequeño delay para que el DOM esté listo tras la navegación
    const t = setTimeout(attempt, 120)
    return () => clearTimeout(t)
  }, [location.state, lenis])

  return (
    <>
      <div id="inicio" className="relative h-screen w-full">
        <InteractiveHero
          showInternalHeader={false}
          heroTitle="FullStack Developer"
          heroDescription="Desarrollador FullStack especializado en Angular, con experiencia en React y Vue. Backend en Go, Java, TypeScript y Python. Bases de datos relacionales: MySQL y PostgreSQL."
          ballpitConfig={{
            count: 260,
            minSize: 0.35,
            maxSize: 0.9,
            size0: 1.2,
          }}
        />
      </div>

      <div id="proyectos" className="relative h-screen w-full">
        <ProyectosSection />
      </div>

      <div id="sobre-mi" className="relative w-full">
        <SobreMiSection />
      </div>

      <div id="blog" className="relative h-screen w-full">
        <BlogSection />
      </div>

      <div id="certificaciones" className="relative h-screen w-full">
        <CertificacionesSection />
      </div>

      <div id="contacto">
        <CinematicFooter />
      </div>
    </>
  )
}

export default LandingPage
