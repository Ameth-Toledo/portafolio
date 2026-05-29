import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lightbulb, AlertTriangle, X, ZoomIn, Copy, Check } from 'lucide-react'

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

function CommandBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center gap-3 bg-[#0d1117] border border-zinc-700 rounded-xl px-4 py-3 my-3">
      <span className="text-zinc-500 text-xs font-mono shrink-0">Bash</span>
      <div className="w-px h-4 bg-zinc-700 shrink-0" />
      <code className="text-green-400 font-mono text-sm flex-1 min-w-0">{command}</code>
      <button
        onClick={() => { navigator.clipboard.writeText(command); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
        className="shrink-0 h-7 w-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
      </button>
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

const BASE = '/assets/blog/bd_aws'

export function MySQLInstalarServerLesson() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="px-6 pt-28 pb-10 sm:px-12 lg:px-24 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/blog/deploy-mysql-aws')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al módulo
          </button>

          <p className="font-mono text-xs tracking-widest text-[#C3E41D] uppercase mb-2">
            Módulo 2 · Deploy Base de datos MySQL en AWS
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Actualización e instalación de MySQL Server
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 8 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Abrir el puerto de MySQL">

            <Step number={1} title="Acceder al grupo de seguridad">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Selecciona la instancia y accede a la pestaña{' '}
                <strong className="text-foreground">Seguridad</strong> en el menú inferior.
                Desplázate hacia abajo hasta{' '}
                <strong className="text-foreground">Grupos de seguridad</strong>, da clic
                en el enlace y en la ventana que se abre da clic en{' '}
                <strong className="text-foreground">Editar reglas de entrada</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws11.png`}
                  alt="Pestaña Seguridad de la instancia"
                  caption="Seguridad → Grupos de seguridad"
                />
                <Screenshot
                  src={`${BASE}/aws12.png`}
                  alt="Botón Editar reglas de entrada"
                  caption="Clic en Editar reglas de entrada"
                />
              </div>
            </Step>

            <Step number={2} title="Agregar la regla del puerto 3306">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Da clic en <strong className="text-foreground">Agregar regla</strong> y
                configura lo siguiente:
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {[
                  { label: 'Tipo',   value: 'MySQL/Aurora' },
                  { label: 'Puerto', value: '3306' },
                  { label: 'Origen', value: '0.0.0.0/0 — accesible desde cualquier conexión remota' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-4">
                    <code className="text-[#C3E41D] text-xs font-bold shrink-0 mt-0.5 w-16">{label}</code>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Da clic en <strong className="text-foreground">Guardar reglas</strong>. Verás
                la lista de puertos abiertos con el puerto{' '}
                <strong className="text-foreground">3306</strong> ya habilitado.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws13.png`}
                  alt="Regla MySQL/Aurora con origen 0.0.0.0/0"
                  caption="Puerto 3306 — MySQL/Aurora — origen 0.0.0.0/0"
                />
                <Screenshot
                  src={`${BASE}/aws14.png`}
                  alt="Puerto 3306 abierto en la lista"
                  caption="Puerto 3306 habilitado correctamente"
                />
              </div>
            </Step>

          </Section>

          <Section title="Instalar MySQL Server">

            <Step number={3} title="Conectarse a la instancia y actualizar paquetes">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Da clic en el botón <strong className="text-foreground">Conectar</strong>{' '}
                para abrir la consola de EC2. Una vez dentro, actualiza los paquetes del sistema:
              </p>

              <CommandBlock command="sudo apt update && sudo apt upgrade -y" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws15.png`}
                  alt="Botón Conectar en la instancia"
                  caption="Clic en Conectar para abrir la consola"
                />
                <Screenshot
                  src={`${BASE}/aws16.png`}
                  alt="Actualización de paquetes en progreso"
                  caption="Actualización de paquetes completada"
                />
              </div>
            </Step>

            <Step number={4} title="Instalar y verificar MySQL Server">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Instala MySQL Server con el siguiente comando:
              </p>

              <CommandBlock command="sudo apt install mysql-server -y" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Una vez instalado, verifica que la instalación fue exitosa:
              </p>

              <CommandBlock command="mysql --version" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                La consola mostrará la versión de MySQL instalada. Si aparece el número
                de versión la instalación fue exitosa.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws17.png`}
                  alt="Instalación de mysql-server en progreso"
                  caption="Instalación de MySQL Server"
                />
                <Screenshot
                  src={`${BASE}/aws18.png`}
                  alt="mysql --version mostrando la versión instalada"
                  caption="Verificación de la versión de MySQL"
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
            onClick={() => navigate('/blog/deploy-mysql-aws/crear-instancia-ec2')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-mysql-aws/ip-elastica')}
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
