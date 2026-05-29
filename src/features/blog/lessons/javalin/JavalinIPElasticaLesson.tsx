import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lightbulb, AlertTriangle, X, ZoomIn, Copy, Check } from 'lucide-react'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/ui/code-block'

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

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
    >
      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-zinc-400" />}
    </button>
  )
}

function CodeSnippet({ label, language = 'bash', code }: { label: string; language?: string; code: string }) {
  return (
    <div className="my-4">
      <CodeBlock>
        <CodeBlockGroup className="border-b border-zinc-700 py-2 pr-2 pl-4">
          <span className="text-zinc-400 text-xs font-mono">{label}</span>
          <CopyButton code={code} />
        </CodeBlockGroup>
        <CodeBlockCode code={code} language={language} theme="github-dark" />
      </CodeBlock>
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

const jdbcString = `jdbc:mysql://%s:%s/%s?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC`

export function JavalinIPElasticaLesson() {
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
            Módulo 8 · Deploy de API Rest con Javalin
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Asociación de IP Elásticas
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 10 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Crear y asociar la IP elástica">

            <Step number={1} title="Asignar una nueva dirección IP elástica">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                En el menú izquierdo accede a la sección{' '}
                <strong className="text-foreground">Direcciones IP Elásticas</strong>, donde
                se listarán todas las IPs elásticas existentes. Da clic en{' '}
                <strong className="text-foreground">Asignar dirección IP elástica</strong>;
                se abrirá otra ventana donde únicamente debes dar clic en{' '}
                <strong className="text-foreground">Asignar</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws43.png`}
                  alt="Sección Direcciones IP Elásticas"
                  caption="Red y Seguridad → Direcciones IP Elásticas"
                />
                <Screenshot
                  src={`${BASE}/aws44.png`}
                  alt="Pantalla de asignación de IP elástica"
                  caption="Dar clic en Asignar sin cambiar nada"
                />
              </div>
            </Step>

            <Step number={2} title="Nombrar la IP y asociarla a la instancia">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Una vez creada la IP elástica, asígnale un nombre para identificarla —
                en este ejemplo se usa <strong className="text-foreground">Backend</strong>.
                Da clic en <strong className="text-foreground">Guardar</strong> y luego
                en el botón verde{' '}
                <strong className="text-foreground">Asociar esta dirección IP Elástica</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws45.png`}
                  alt="Nombrar la IP elástica como Backend"
                  caption="Asignar nombre Backend y guardar"
                />
                <Screenshot
                  src={`${BASE}/aws46.png`}
                  alt="Botón Asociar esta dirección IP Elástica"
                  caption="Clic en Asociar esta dirección IP Elástica"
                />
              </div>
            </Step>

            <Step number={3} title="Seleccionar la instancia y confirmar">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Se abrirá una nueva ventana. Desplázate hacia abajo hasta la sección{' '}
                <strong className="text-foreground">Instancia</strong>, selecciona tu
                instancia de backend y da clic en{' '}
                <strong className="text-foreground">Asociar</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws47.png`}
                  alt="Sección de selección de instancia"
                  caption="Seleccionar la instancia Backend"
                />
                <Screenshot
                  src={`${BASE}/aws48.png`}
                  alt="IP elástica asociada a la instancia"
                  caption="Clic en Asociar para finalizar"
                />
              </div>
            </Step>

          </Section>

          <Section title="Actualizar la IP en el proyecto">

            <Step number={4} title="Editar Main.java con la nueva IP">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Copia la IP elástica recién asociada y regresa a la terminal de la instancia
                backend. Abre el archivo <strong className="text-foreground">Main.java</strong>{' '}
                con nano:
              </p>

              <CommandBlock command="sudo nano Main.java" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Reemplaza todas las líneas donde aparezca{' '}
                <strong className="text-foreground">localhost</strong> por tu IP elástica
                (en este ejemplo <strong className="text-foreground">35.172.85.206</strong>).
                Guarda con <strong className="text-foreground">Ctrl + O</strong> → Enter y
                cierra con <strong className="text-foreground">Ctrl + X</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws49.png`}
                  alt="IP elástica copiada en AWS"
                  caption="Copiar la IP elástica de la instancia"
                />
                <Screenshot
                  src={`${BASE}/aws50.png`}
                  alt="Main.java editado con la nueva IP"
                  caption="Reemplazar localhost por la IP en Main.java"
                />
              </div>
            </Step>

            <Step number={5} title="Levantar el servidor y probar la API">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Ejecuta nuevamente el servidor con la IP actualizada:
              </p>

              <CommandBlock command="./gradlew run" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Prueba la API en Postman o en el navegador. La URL debe construirse con
                la IP elástica y el puerto de la API, seguida del endpoint correspondiente:
              </p>

              <div className="flex items-center gap-3 bg-[#0d1117] border border-zinc-700 rounded-xl px-4 py-3 my-3">
                <code className="text-sky-400 font-mono text-sm break-all">http://35.172.85.206:8080/api/usuarios</code>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws51.png`}
                  alt="Prueba GET en Postman"
                  caption="Método GET respondiendo correctamente"
                />
                <Screenshot
                  src={`${BASE}/aws52.png`}
                  alt="Métodos POST, PUT y DELETE funcionando"
                  caption="GET, POST, PUT y DELETE funcionan correctamente"
                />
              </div>
            </Step>

            <Step number={6} title="Consideraciones al reiniciar la instancia">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Cada vez que se reinicie o cierre la instancia, deberás ingresar nuevamente
                a la carpeta del backend y ejecutar{' '}
                <strong className="text-foreground">./gradlew run</strong> para volver a
                levantar el servidor. Antes de hacerlo, verifica que en el archivo de
                conexión esté el parámetro{' '}
                <strong className="text-foreground">allowPublicKeyRetrieval</strong>{' '}
                inicializado en <strong className="text-foreground">true</strong>:
              </p>

              <CodeSnippet label="Cadena de conexión JDBC" language="bash" code={jdbcString} />

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src={`${BASE}/aws53.png`}
                  alt="Parámetro allowPublicKeyRetrieval en el archivo de conexión"
                  caption="Verificar allowPublicKeyRetrieval=true"
                />
                <Screenshot
                  src={`${BASE}/aws54.png`}
                  alt="API ejecutándose tras reinicio"
                  caption="Servidor levantado correctamente tras reinicio"
                />
              </div>

              <Callout type="tip">
                El siguiente módulo cubre la instalación de <strong className="text-foreground">PM2</strong>{' '}
                con Node.js y npm, que permitirá mantener la API ejecutándose de forma continua
                y levantarla automáticamente cada vez que el servidor se reinicie — sin necesidad
                de ejecutar el comando manualmente.
              </Callout>
            </Step>

          </Section>

        </div>
      </div>

      {/* Navegación inferior */}
      <div className="px-6 sm:px-12 lg:px-24 pb-20 border-t border-border">
        <div className="max-w-5xl mx-auto pt-10 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/blog/deploy-api-javalin/gradlew')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-api-javalin/servicio-automatizado')}
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
