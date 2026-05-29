import { useRef, useEffect, useCallback, RefObject } from 'react'
import { GooeyFilter } from '@/components/ui/gooey-filter'
import { InfoCard } from '@/components/ui/info-card'
import { useScreenSize } from '@/core/hooks/useScreenSize'
import { useDimensions } from '@/components/hooks/use-debounced-dimensions'

// Canvas pixel trail — native 60fps, no framer-motion overhead.
// listenOnRef: the element to attach mousemove to (usually the outer section).
// Events bubble up from any child, so we capture the whole section area.
function CanvasPixelTrail({
  listenOnRef,
  pixelSize = 32,
  color = '#C3E41D',
  fadePerFrame = 0.02,
  filterId = 'gooey-filter-proyectos',
}: {
  listenOnRef: RefObject<HTMLDivElement | null>
  pixelSize?: number
  color?: string
  fadePerFrame?: number
  filterId?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  const handleMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    const container = listenOnRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = container.getBoundingClientRect()
    const gx = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize
    const gy = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = color
    ctx.fillRect(gx, gy, pixelSize, pixelSize)
  }, [listenOnRef, pixelSize, color])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = listenOnRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Attach to the outer section — events from ALL children bubble here,
    // including those inside pointer-events-auto grid wrappers.
    container.addEventListener('mousemove', handleMove)

    const tick = () => {
      // destination-out reduces real alpha → transparent pixels →
      // gooey blur+threshold cuts them off cleanly
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = `rgba(0,0,0,${fadePerFrame})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'source-over'
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      container.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(frameRef.current)
    }
  }, [handleMove, listenOnRef, fadePerFrame])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ filter: `url(#${filterId})` }}
    />
  )
}

interface Links { github?: string; npm?: string; web?: string }
interface Project { title: string; description: string; image: string; techs: string[]; links: Links }

const ICO = (name: string) => `/assets/icons/${name}.svg`

const projects: Project[] = [
  { title: 'ato-core-init', description: 'CLI open source para backends rápidos. Hexagonal/MVC, MySQL, JWT, TS/JS.',                                    image: '/assets/works/ato.jpg',         techs: [ICO('nodejs')],      links: { github: 'https://github.com/Ameth-Toledo/ato-core-init.git',    npm: 'https://www.npmjs.com/package/ato-core-init'                       } },
  { title: 'Nich-Ká',       description: 'Sistema automatizado para controlar fermentación de café. Automatizado con Inteligencia Artificial.',          image: '/assets/works/nich-ka.png',     techs: [ICO('react')],       links: { github: 'https://github.com/Ameth-Toledo/fermest_web.git',      web: 'https://www.nich-ka.space/'                                        } },
  { title: 'FreeGarden',    description: 'Sistema de monitoreo de jardín, ideal para personas con muy poco tiempo.',                                     image: '/assets/works/free-garden.png', techs: [ICO('angular')],     links: { github: 'https://github.com/Ameth-Toledo/FreeGardenFront.git'                                                                            } },
  { title: 'FermEST',       description: 'Algoritmo genético para optimizar parámetros de etanol. Procesamiento de residuos agroindustriales.',          image: '/assets/works/fermest.png',     techs: [ICO('react')],       links: { github: 'https://github.com/Ameth-Toledo/fermest.git',          web: 'https://fermest-three.vercel.app/'                                 } },
  { title: 'framearch',     description: 'CLI que genera features con Screaming Architecture, MVVM o MVC para React, Vue, Svelte y Angular.',            image: '/assets/works/framearch.png',   techs: [ICO('typescript')],  links: { github: 'https://github.com/Ameth-Toledo/framearch',            npm: 'https://www.npmjs.com/package/framearch'                           } },
  { title: 'EST SOFTWARE',  description: 'Plataforma de cursos de programación gratuitos.',                                                              image: '/assets/works/estsoftware.png', techs: [ICO('angular')],     links: { github: 'https://github.com/Ameth-Toledo/Software-EST.git',     web: 'https://est-software-eta.vercel.app/'                              } },
]

const COL_GAP = 8
const ROW_GAP = 16

export function ProyectosSection() {
  const screenSize = useScreenSize()
  const sectionRef = useRef<HTMLDivElement>(null)   // outer section — event source
  const gridRef    = useRef<HTMLDivElement>(null)   // grid container — for measuring

  const dimensions = useDimensions(gridRef)

  const cols   = screenSize.lessThan('sm') ? 1 : screenSize.lessThan('md') ? 2 : 3
  const rows   = Math.ceil(projects.length / cols)
  const rawW   = dimensions.width  > 0 ? Math.floor((dimensions.width  - (cols - 1) * COL_GAP) / cols) : 360
  const rawH   = dimensions.height > 0 ? Math.floor((dimensions.height - (rows - 1) * ROW_GAP) / rows) : 300
  const cardWidth  = Math.min(rawW, Math.floor(rawH * 1.1))
  const cardHeight = rawH
  const pixelSize  = screenSize.lessThan('md') ? 24 : 32

  return (
    <div ref={sectionRef} className="relative w-full h-full bg-background overflow-hidden">
      <GooeyFilter id="gooey-filter-proyectos" strength={5} />

      {/* Canvas listens on sectionRef so events from the whole section bubble in */}
      <CanvasPixelTrail
        listenOnRef={sectionRef}
        pixelSize={pixelSize}
        color="#C3E41D"
        fadePerFrame={0.012}
        filterId="gooey-filter-proyectos"
      />

      <div className="relative z-10 flex h-full flex-col px-6 pt-20 pb-5 sm:px-10 lg:px-14 pointer-events-none">
        <div className="flex-shrink-0 mb-4">
          <p className="mb-1 font-mono text-xs tracking-widest text-[#C3E41D] uppercase">./mis-proyectos</p>
          <h2 className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl md:text-5xl">Proyectos</h2>
        </div>

        <div ref={gridRef} className="flex-1 min-h-0 pointer-events-auto">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, ${cardWidth}px)`,
              gridTemplateRows:    `repeat(${rows}, ${cardHeight}px)`,
              columnGap: COL_GAP,
              rowGap:    ROW_GAP,
              justifyContent: 'center',
              alignContent:   'center',
              height: '100%',
            }}
          >
            {projects.map(project =>
              cardWidth > 0 && cardHeight > 0 && (
                <InfoCard
                  key={project.title}
                  image={project.image}
                  title={project.title}
                  description={project.description}
                  techs={project.techs}
                  links={project.links}
                  width={cardWidth}
                  height={cardHeight}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
