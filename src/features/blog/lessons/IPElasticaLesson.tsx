import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lightbulb, AlertTriangle, X, ZoomIn } from 'lucide-react'

function Callout({ type, children }: { type: 'tip' | 'warning'; children: React.ReactNode }) {
  const isTip = type === 'tip'
  return (
    <div className={`flex gap-3 rounded-xl border p-4 my-6 ${
      isTip ? 'border-[#C3E41D]/30 bg-[#C3E41D]/5' : 'border-yellow-500/30 bg-yellow-500/5'
    }`}>
      {isTip
        ? <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-[#C3E41D]" />
        : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-yellow-400" />
      }
      <p className="text-sm leading-relaxed text-foreground/80">{children}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">{title}</h2>
      {children}
    </section>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5 mb-10">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#C3E41D] text-black text-sm font-black flex items-center justify-center shrink-0">
          {number}
        </div>
        <div className="w-px flex-1 bg-border mt-2" />
      </div>
      <div className="pb-2 flex-1 min-w-0">
        <p className="text-foreground font-semibold text-sm mb-3">{title}</p>
        {children}
      </div>
    </div>
  )
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

function Screenshot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <figure className="my-4">
        <button
          onClick={() => setOpen(true)}
          className="relative w-full group block rounded-xl overflow-hidden border border-border focus:outline-none"
        >
          <img
            src={src}
            alt={alt}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
          </div>
        </button>
        {caption && (
          <figcaption className="text-center text-xs text-muted-foreground mt-2">{caption}</figcaption>
        )}
      </figure>
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  )
}

export function IPElasticaLesson() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="px-6 pt-28 pb-10 sm:px-12 lg:px-24 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/blog/deploy-frontend-nginx-aws')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al módulo
          </button>

          <p className="font-mono text-xs tracking-widest text-[#C3E41D] uppercase mb-2">
            Módulo 2 · Deploy Frontend con Nginx en AWS
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Asociación de IP elástica
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 5 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="¿Para qué sirve una IP elástica?">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Por defecto, cada vez que detienes y vuelves a iniciar tu instancia EC2, AWS le asigna
              una IP pública diferente. Esto haría que tu sitio web dejara de funcionar cada vez que
              reinicias el servidor. Una <strong className="text-foreground">IP elástica</strong> es
              una dirección fija que siempre apunta a tu instancia, sin importar cuántas veces la
              reinicies.
            </p>
          </Section>

          <Section title="Crear y asociar la IP elástica">

            <Step number={1} title="Acceder a Direcciones IP elásticas">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                En el menú izquierdo de EC2, busca la sección{' '}
                <strong className="text-foreground">Red y Seguridad</strong> y selecciona{' '}
                <strong className="text-foreground">Direcciones IP elásticas</strong>. Da clic sobre
                el botón amarillo <strong className="text-foreground">Asignar dirección IP elástica</strong>.
                Se abrirá otra vista; no modificas nada, simplemente da clic en{' '}
                <strong className="text-foreground">Asignar</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws13.png"
                  alt="Menú Direcciones IP elásticas"
                  caption="Red y Seguridad → Direcciones IP elásticas"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws14.png"
                  alt="Vista de asignación de IP elástica"
                  caption="Dejar los valores por defecto y dar clic en Asignar"
                />
              </div>
            </Step>

            <Step number={2} title="Confirmar y nombrar la IP elástica">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                AWS mostrará un mensaje de éxito. Puedes dejar el nombre como viene o asignarle
                uno para identificarla fácilmente. En este ejemplo usaremos{' '}
                <strong className="text-foreground">Front-End</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws15.png"
                  alt="Mensaje de éxito al crear IP elástica"
                  caption="IP elástica creada exitosamente"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws16.png"
                  alt="Nombre asignado a la IP elástica"
                  caption="Nombrar la IP elástica para identificarla"
                />
              </div>
            </Step>

            <Step number={3} title="Asociar la IP a la instancia">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Da clic sobre el botón{' '}
                <strong className="text-foreground">Asociar esta dirección IP elástica</strong>.
                En la vista que aparece, desplázate hacia abajo hasta la sección{' '}
                <strong className="text-foreground">Instancia</strong>. Despliega la lista y selecciona
                la instancia que creaste. Da clic en el botón amarillo{' '}
                <strong className="text-foreground">Asociar</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws17.png"
                  alt="Botón asociar dirección IP elástica"
                  caption="Botón para asociar la IP a una instancia"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws18.png"
                  alt="Selección de instancia para asociar"
                  caption="Seleccionar la instancia y dar clic en Asociar"
                />
              </div>
            </Step>

            <Step number={4} title="Verificar la IP fija en la instancia">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Regresa a la sección de instancias. Verás que la dirección IP pública de tu
                instancia ha cambiado a la IP elástica que acabas de asignar. A partir de ahora
                esa IP siempre será la misma, sin importar cuántas veces reinicies el servidor.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws19.png"
                  alt="Lista de instancias con IP elástica"
                  caption="La instancia ahora muestra la IP elástica"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws20.png"
                  alt="Detalle de la instancia con IP fija"
                  caption="La IP ya no cambiará al reiniciar"
                />
              </div>

              <Callout type="tip">
                Guarda esta IP elástica; la necesitarás en los siguientes módulos para conectarte
                a la instancia por SSH y para configurar Nginx.
              </Callout>
            </Step>

          </Section>

        </div>
      </div>

      {/* Navegación inferior */}
      <div className="px-6 sm:px-12 lg:px-24 pb-20 border-t border-border">
        <div className="max-w-5xl mx-auto pt-10 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/blog/deploy-frontend-nginx-aws/crear-instancia-ec2')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-frontend-nginx-aws/configurar-puertos')}
            className="flex items-center gap-2 bg-[#C3E41D] hover:bg-[#b0d018] text-black text-sm font-bold px-5 py-3 rounded-xl transition-colors"
          >
            Siguiente módulo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  )
}
