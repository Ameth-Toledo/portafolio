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

const BASE = '/assets/blog/api_aws'

export function JavalinCrearRepositorioLesson() {
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
            Módulo 2 · Deploy de API Rest con Javalin
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Creación de repositorio y subida de archivos a GitHub
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 8 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Crear el repositorio en GitHub">

            <Step number={1} title="Crear el repositorio">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Ingresa a{' '}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
                >
                  github.com
                </a>{' '}
                y crea una cuenta o inicia sesión con una existente. En el menú principal
                da clic en el botón verde <strong className="text-foreground">New</strong>.
                Se abrirá una ventana donde escribirás el nombre del repositorio; en este
                caso lo llamaremos <strong className="text-foreground">api-user-javalin</strong>.
                Una vez colocado el nombre da clic en{' '}
                <strong className="text-foreground">Create repository</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws11.png`}
                  alt="Botón New en GitHub"
                  caption="Menú principal → botón verde New"
                />
                <Screenshot
                  src={`${BASE}/aws12.png`}
                  alt="Formulario de creación de repositorio"
                  caption="Escribir nombre y dar clic en Create repository"
                />
              </div>
            </Step>

          </Section>

          <Section title="Subir el proyecto a GitHub">

            <Step number={2} title="Inicializar Git y hacer el primer commit">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                GitHub mostrará una ventana con los comandos necesarios para subir el proyecto.
                Regresa a Visual Studio Code, abre una nueva terminal y ejecuta los siguientes
                comandos en orden:
              </p>

              <CommandBlock command="git init" />
              <CommandBlock command="git add ." />
              <CommandBlock command="git commit -m 'deploy to git'" />
              <CommandBlock command="git branch -M main" />
              <CommandBlock command="git remote add origin <url de tu repositorio>" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws13.png`}
                  alt="Comandos mostrados en GitHub tras crear el repositorio"
                  caption="GitHub muestra los comandos a ejecutar"
                />
                <Screenshot
                  src={`${BASE}/aws14.png`}
                  alt="Ejecución de comandos en la terminal de VSCode"
                  caption="Ejecutar los comandos en la terminal de VSCode"
                />
              </div>

              <Callout type="tip">
                Para obtener la URL de tu repositorio, regresa a GitHub y copia el comando
                que dice <strong className="text-foreground">git remote add origin &lt;url&gt;</strong>.
                La URL tendrá el formato{' '}
                <strong className="text-foreground">https://github.com/tu-usuario/api-user-javalin.git</strong>.
              </Callout>
            </Step>

            <Step number={3} title="Enviar el proyecto a GitHub">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Pega el comando <strong className="text-foreground">git remote add origin</strong>{' '}
                con tu URL en la terminal y luego ejecuta el siguiente comando para subir
                los archivos:
              </p>

              <CommandBlock command="git push -u origin main" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws15.png`}
                  alt="Copiar la URL del repositorio desde GitHub"
                  caption="Copiar el comando git remote add origin desde GitHub"
                />
                <Screenshot
                  src={`${BASE}/aws16.png`}
                  alt="git push ejecutado en la terminal"
                  caption="Ejecutar git push para subir el proyecto"
                />
              </div>
            </Step>

            <Step number={4} title="Verificar la subida en GitHub">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Regresa a tu repositorio en GitHub y actualiza la página. Verás que el
                proyecto se ha subido correctamente. Dirígete a la sección de{' '}
                <strong className="text-foreground">Commits</strong> para visualizar
                el último cambio realizado.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws17.png`}
                  alt="Repositorio con archivos subidos en GitHub"
                  caption="Proyecto subido correctamente a GitHub"
                />
                <Screenshot
                  src={`${BASE}/aws18.png`}
                  alt="Sección de commits del repositorio"
                  caption="Sección Commits — último cambio registrado"
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
            onClick={() => navigate('/blog/deploy-api-javalin/crear-instancia-ec2')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-api-javalin/habilitar-puertos')}
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
