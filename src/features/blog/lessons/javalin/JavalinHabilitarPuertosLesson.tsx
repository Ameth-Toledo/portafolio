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

const BASE = '/assets/blog/api_aws'

export function JavalinHabilitarPuertosLesson() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="px-6 pt-28 pb-10 sm:px-12 lg:px-24 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/blog/deploy-api-javalin')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al módulo
          </button>

          <p className="font-mono text-xs tracking-widest text-[#C3E41D] uppercase mb-2">
            Módulo 3 · Deploy de API Rest con Javalin
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Habilitación de puertos
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 5 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Acceder al grupo de seguridad">

            <Step number={1} title="Abrir las reglas de entrada de la instancia">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Selecciona tu instancia de backend y accede a la pestaña{' '}
                <strong className="text-foreground">Seguridad</strong>. Da clic en el enlace
                de <strong className="text-foreground">Grupos de seguridad</strong>; se abrirá
                una nueva ventana donde verás todos los puertos habilitados actualmente. Da
                clic en <strong className="text-foreground">Editar reglas de entrada</strong>{' '}
                para realizar los ajustes necesarios.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws19.png`}
                  alt="Pestaña Seguridad de la instancia backend"
                  caption="Seguridad → enlace del grupo de seguridad"
                />
                <Screenshot
                  src={`${BASE}/aws20.png`}
                  alt="Puertos habilitados y botón Editar reglas"
                  caption="Clic en Editar reglas de entrada"
                />
              </div>
            </Step>

          </Section>

          <Section title="Agregar el puerto de la API">

            <Step number={2} title="Identificar el puerto y agregar la regla">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Antes de agregar la regla, regresa a Visual Studio Code y abre el archivo{' '}
                <strong className="text-foreground">Main.java</strong> para identificar el
                puerto en el que corre tu API. En este ejemplo está corriendo en el puerto{' '}
                <strong className="text-foreground">8080</strong>.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Con ese dato, da clic en <strong className="text-foreground">Agregar regla</strong>{' '}
                y configura los siguientes campos:
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {[
                  { label: 'Tipo',               value: 'TCP personalizado' },
                  { label: 'Intervalo de puertos', value: '8080 (o el puerto de tu API)' },
                  { label: 'Origen',              value: '0.0.0.0/0' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-4">
                    <code className="text-[#C3E41D] text-xs font-bold shrink-0 mt-0.5 w-44">{label}</code>
                    <p className="text-muted-foreground text-sm">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws21.png`}
                  alt="Puerto 8080 en Main.java"
                  caption="Identificar el puerto en Main.java"
                />
                <Screenshot
                  src={`${BASE}/aws22.png`}
                  alt="Regla TCP personalizada con puerto 8080"
                  caption="TCP personalizado — puerto 8080 — origen 0.0.0.0/0"
                />
              </div>

              <Callout type="warning">
                Verifica que la configuración <strong className="text-foreground">no</strong> quede
                como se muestra en la imagen inferior — asegúrate de que el tipo sea{' '}
                <strong className="text-foreground">TCP personalizado</strong>, el puerto coincida
                exactamente con el de tu API y el origen sea{' '}
                <strong className="text-foreground bg-[#C3E41D]/10 px-1.5 py-0.5 rounded font-mono text-xs">0.0.0.0/0</strong>.
              </Callout>
            </Step>

            <Step number={3} title="Guardar las reglas">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Una vez configurada la regla, da clic en{' '}
                <strong className="text-foreground">Guardar reglas</strong>. Aparecerá una
                ventana confirmando que las reglas del grupo de seguridad se actualizaron
                correctamente.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws23.png`}
                  alt="Configuración incorrecta a evitar"
                  caption="Ejemplo de configuración incorrecta — no debe quedar así"
                />
                <Screenshot
                  src={`${BASE}/aws24.png`}
                  alt="Confirmación de reglas actualizadas"
                  caption="Reglas de seguridad actualizadas correctamente"
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
            onClick={() => navigate('/blog/deploy-api-javalin/crear-repositorio-github')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-api-javalin/instalar-java')}
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
