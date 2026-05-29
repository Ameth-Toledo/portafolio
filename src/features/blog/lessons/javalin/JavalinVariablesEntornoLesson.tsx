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

const envEjemplo = `HOST=50.17.245.12
PORT=3306
DB_NAME=ejemplo
DB_USER=ameth
DB_PASSWORD=Ameth2005`

const envVars = [
  { key: 'HOST',        desc: 'IP de la instancia donde está corriendo la base de datos.' },
  { key: 'PORT',        desc: 'Puerto de MySQL. Por defecto es 3306, no es necesario cambiarlo.' },
  { key: 'DB_NAME',     desc: 'Nombre exacto de la base de datos (sensible a mayúsculas).' },
  { key: 'DB_USER',     desc: 'Usuario creado con permisos de acceso a la base de datos.' },
  { key: 'DB_PASSWORD', desc: 'Contraseña asociada al usuario de la base de datos.' },
]

export function JavalinVariablesEntornoLesson() {
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
            Módulo 6 · Deploy de API Rest con Javalin
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Creación de variables de entorno
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 8 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Ingresar al proyecto">

            <Step number={1} title="Entrar a la carpeta del proyecto">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Ingresa a la carpeta del proyecto clonado usando el comando{' '}
                <strong className="text-foreground">cd</strong> seguido del nombre de la carpeta.
                Luego ejecuta <strong className="text-foreground">ls</strong> para listar
                los archivos que contiene:
              </p>

              <CommandBlock command="cd <nombre de la carpeta>" />
              <CommandBlock command="ls" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws33.png`}
                  alt="Comando cd para entrar a la carpeta del proyecto"
                  caption="Entrar a la carpeta del proyecto"
                />
                <Screenshot
                  src={`${BASE}/aws34.png`}
                  alt="ls muestra los archivos del proyecto"
                  caption="Archivos listados dentro del proyecto"
                />
              </div>
            </Step>

          </Section>

          <Section title="Crear el archivo .env">

            <Step number={2} title="Abrir nano y copiar el contenido del .env">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Crea el archivo <strong className="text-foreground">.env</strong> con el
                editor nano:
              </p>

              <CommandBlock command="sudo nano .env" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Regresa a Visual Studio Code, abre tu archivo{' '}
                <strong className="text-foreground">.env</strong> local y copia su contenido
                para pegarlo en la consola.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws35.png`}
                  alt="nano .env abierto en la consola"
                  caption="Editor nano con el archivo .env"
                />
                <Screenshot
                  src={`${BASE}/aws36.png`}
                  alt="Archivo .env en Visual Studio Code"
                  caption="Copiar el contenido del .env desde VSCode"
                />
              </div>
            </Step>

            <Step number={3} title="Llenar las variables con los datos correctos">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Para obtener la IP del host de la base de datos, regresa a la lista de
                instancias en AWS y copia la IP de la instancia de base de datos, o
                solicítasela a quien tenga acceso. Luego completa cada variable:
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {envVars.map(({ key, desc }) => (
                  <div key={key} className="flex gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-4">
                    <code className="text-[#C3E41D] text-xs font-bold shrink-0 mt-0.5 w-28">{key}</code>
                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Este archivo contiene todas las variables necesarias para que la aplicación
                pueda conectarse a la base de datos y funcionar correctamente. Como referencia,
                el archivo <strong className="text-foreground">.env</strong> de este ejemplo
                quedó así:
              </p>

              <CodeSnippet label=".env" language="bash" code={envEjemplo} />

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src={`${BASE}/aws37.png`}
                  alt="IP de la instancia de base de datos en AWS"
                  caption="Copiar la IP de la instancia de base de datos"
                />
                <Screenshot
                  src={`${BASE}/aws38.png`}
                  alt="Archivo .env con las variables completadas"
                  caption="Archivo .env listo con todas las variables"
                />
              </div>

              <Callout type="warning">
                El nombre de la base de datos en <strong className="text-foreground">DB_NAME</strong>{' '}
                es sensible a mayúsculas y minúsculas — escríbelo exactamente igual que
                en tu servidor MySQL. Un error aquí impedirá que la API se conecte.
              </Callout>
            </Step>

          </Section>

        </div>
      </div>

      {/* Navegación inferior */}
      <div className="px-6 sm:px-12 lg:px-24 pb-20 border-t border-border">
        <div className="max-w-5xl mx-auto pt-10 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/blog/deploy-api-javalin/instalar-git-clonar')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-api-javalin/gradlew')}
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
