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

function CommandBlock({ command, label = 'Bash' }: { command: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center gap-3 bg-[#0d1117] border border-zinc-700 rounded-xl px-4 py-3 my-3">
      <span className="text-zinc-500 text-xs font-mono shrink-0">{label}</span>
      <div className="w-px h-4 bg-zinc-700 shrink-0" />
      <code className="text-green-400 font-mono text-sm flex-1 min-w-0 break-all">{command}</code>
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

export function MySQLOpcionesSeguridadLesson() {
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
            Módulo 5 · Deploy Base de datos MySQL en AWS
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Configuración de las Opciones de Seguridad
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 8 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Ingresar a la terminal de MySQL">

            <Step number={1} title="Acceder como root a MySQL">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Para configurar la seguridad de la base de datos necesitamos entrar a la
                terminal de MySQL como usuario root. Ejecuta el siguiente comando y cuando
                pida contraseña presiona Enter (sin escribir nada):
              </p>

              <CommandBlock command="sudo mysql -u root -p" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws31.png`}
                  alt="Ejecutar sudo mysql -u root -p"
                  caption="Acceder a MySQL como root"
                />
                <Screenshot
                  src={`${BASE}/aws32.png`}
                  alt="Terminal de MySQL abierta"
                  caption="Terminal de MySQL lista para recibir comandos"
                />
              </div>
            </Step>

          </Section>

          <Section title="Crear base de datos y usuario">

            <Step number={2} title="Crear la base de datos y el usuario">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Crea la base de datos con el nombre de tu proyecto. Reemplaza{' '}
                <strong className="text-foreground">ejemplo</strong> por el nombre correcto:
              </p>

              <CommandBlock label="MySQL" command="CREATE DATABASE ejemplo;" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Ahora crea un usuario con acceso desde cualquier host (<code className="text-[#C3E41D] text-xs">%</code>).
                Reemplaza <strong className="text-foreground">usuario</strong> y{' '}
                <strong className="text-foreground">contraseña-segura</strong> por los
                valores que usarás en tu proyecto:
              </p>

              <CommandBlock label="MySQL" command="CREATE USER 'usuario'@'%' IDENTIFIED BY 'contraseña-segura';" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws33.png`}
                  alt="CREATE DATABASE ejecutado"
                  caption="Base de datos creada exitosamente"
                />
                <Screenshot
                  src={`${BASE}/aws34.png`}
                  alt="CREATE USER ejecutado"
                  caption="Usuario creado con acceso remoto"
                />
              </div>

              <Callout type="warning">
                Usa el mismo nombre de usuario y contraseña que pondrás en las variables
                de entorno de tu API (<strong className="text-foreground">DB_USER</strong> y{' '}
                <strong className="text-foreground">DB_PASSWORD</strong>). Si no coinciden
                la conexión fallará.
              </Callout>
            </Step>

            <Step number={3} title="Otorgar privilegios y aplicar cambios">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Otorga todos los privilegios al usuario sobre la base de datos. Esto le
                permite crear, leer, actualizar y eliminar datos:
              </p>

              <CommandBlock label="MySQL" command="GRANT ALL PRIVILEGES ON ejemplo.* TO 'usuario'@'%';" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Actualiza los privilegios para que los cambios se apliquen inmediatamente
                sin necesidad de reiniciar el servicio:
              </p>

              <CommandBlock label="MySQL" command="FLUSH PRIVILEGES;" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws35.png`}
                  alt="GRANT ALL PRIVILEGES ejecutado"
                  caption="Privilegios otorgados al usuario"
                />
                <Screenshot
                  src={`${BASE}/aws36.png`}
                  alt="FLUSH PRIVILEGES ejecutado"
                  caption="Cambios aplicados con FLUSH PRIVILEGES"
                />
              </div>
            </Step>

            <Step number={4} title="Salir de la terminal de MySQL">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Una vez configurados los usuarios y privilegios, sal de la terminal de MySQL:
              </p>

              <CommandBlock label="MySQL" command="EXIT;" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Volverás a la terminal de la instancia EC2 para continuar con los siguientes pasos.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws37.png`}
                  alt="Comando EXIT en la terminal de MySQL"
                  caption="Salir de la terminal de MySQL"
                />
                <Screenshot
                  src={`${BASE}/aws38.png`}
                  alt="Terminal de EC2 tras salir de MySQL"
                  caption="De vuelta en la terminal de EC2"
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
            onClick={() => navigate('/blog/deploy-mysql-aws/acceso-remoto')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-mysql-aws/verificacion-mysql')}
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
