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

const puertos = [
  { name: 'SSH',   port: '22',  color: 'text-sky-400',    badge: 'bg-sky-400/10 text-sky-400',    desc: 'Permite conectarte a la instancia desde tu terminal.' },
  { name: 'HTTP',  port: '80',  color: 'text-green-400',  badge: 'bg-green-400/10 text-green-400',  desc: 'Tráfico web sin cifrar. Los navegadores lo usan por defecto.' },
  { name: 'HTTPS', port: '443', color: 'text-yellow-400', badge: 'bg-yellow-400/10 text-yellow-400', desc: 'Tráfico web cifrado. Necesario si configuras un certificado SSL.' },
]

export function ConfigurarPuertosLesson() {
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
            Módulo 3 · Deploy Frontend con Nginx en AWS
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Configuración de puertos
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 5 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="¿Qué puertos necesitamos?">
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Para desplegar un frontend solo necesitas habilitar tres puertos en el grupo de
              seguridad de tu instancia:
            </p>
            <div className="flex flex-col gap-3">
              {puertos.map(({ name, port, badge, desc }) => (
                <div key={name} className="flex items-start gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-4">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-md font-mono shrink-0 mt-0.5 ${badge}`}>
                    {name}
                  </span>
                  <div>
                    <span className="text-muted-foreground text-xs font-mono block mb-1">Puerto {port}</span>
                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Editar las reglas de entrada">

            <Step number={1} title="Acceder al grupo de seguridad">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Selecciona tu instancia en la lista. En la parte inferior aparecerán varias pestañas;
                da clic en <strong className="text-foreground">Seguridad</strong>. Desplázate hacia
                abajo hasta la sección <strong className="text-foreground">Grupos de seguridad</strong>{' '}
                y da clic sobre el enlace. Verás los puertos abiertos actualmente; por defecto solo
                estará el de SSH (puerto 22).
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws21.png"
                  alt="Pestaña Seguridad de la instancia"
                  caption="Pestaña Seguridad → enlace del grupo de seguridad"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws22.png"
                  alt="Grupo de seguridad con solo SSH abierto"
                  caption="Por defecto solo está abierto el puerto SSH"
                />
              </div>
            </Step>

            <Step number={2} title="Agregar el puerto HTTP (80)">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Da clic en <strong className="text-foreground">Editar reglas de entrada</strong>.
                En la nueva vista da clic en <strong className="text-foreground">Agregar regla</strong>,
                selecciona el protocolo <strong className="text-foreground">HTTP</strong> (puerto 80)
                y en Origen elige <strong className="text-foreground">Anywhere</strong>. El valor
                que se asignará automáticamente es{' '}
                <strong className="text-foreground bg-[#C3E41D]/10 px-1.5 py-0.5 rounded font-mono text-xs">0.0.0.0/0</strong>,
                que significa que cualquier dirección IP podrá acceder a ese puerto.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws23.png"
                  alt="Botón Editar reglas de entrada"
                  caption="Clic en Editar reglas de entrada"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws24.png"
                  alt="Regla HTTP configurada con origen 0.0.0.0/0"
                  caption="HTTP puerto 80 — Origen: Anywhere (0.0.0.0/0)"
                />
              </div>
            </Step>

            <Step number={3} title="Agregar el puerto HTTPS (443)">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Repite el mismo proceso: da clic en <strong className="text-foreground">Agregar regla</strong>,
                selecciona el protocolo <strong className="text-foreground">HTTPS</strong> (puerto 443)
                y en Origen elige de nuevo <strong className="text-foreground">Anywhere</strong>{' '}
                (<strong className="text-foreground bg-[#C3E41D]/10 px-1.5 py-0.5 rounded font-mono text-xs">0.0.0.0/0</strong>).
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws25.png"
                  alt="Regla HTTPS configurada"
                  caption="HTTPS puerto 443 — Origen: Anywhere (0.0.0.0/0)"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws26.png"
                  alt="Las tres reglas configuradas"
                  caption="SSH, HTTP y HTTPS listos para guardar"
                />
              </div>

              <Callout type="tip">
                El valor <strong className="text-foreground font-mono">0.0.0.0/0</strong> indica que
                el puerto acepta conexiones desde cualquier dirección IP del mundo. Para un frontend
                público esto es lo correcto; para bases de datos u otros servicios internos deberías
                restringirlo.
              </Callout>
            </Step>

            <Step number={4} title="Guardar las reglas">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Una vez que hayas agregado HTTP y HTTPS, da clic en{' '}
                <strong className="text-foreground">Guardar reglas</strong>. AWS mostrará un mensaje
                de éxito y en la lista de reglas de entrada ya aparecerán los tres puertos
                habilitados: SSH, HTTP y HTTPS.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws27.png"
                  alt="Botón Guardar reglas"
                  caption="Guardar las reglas de entrada"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws28.png"
                  alt="Lista con los tres puertos habilitados"
                  caption="SSH, HTTP y HTTPS habilitados correctamente"
                />
              </div>
            </Step>

          </Section>

        </div>
      </div>

      {/* Navegación inferior */}
      <div className="px-6 sm:px-12 lg:px-24 pb-20 border-t border-border">
        <div className="max-w-5xl mx-auto pt-10 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/blog/deploy-frontend-nginx-aws/ip-elastica')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-frontend-nginx-aws/instalar-nginx')}
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
