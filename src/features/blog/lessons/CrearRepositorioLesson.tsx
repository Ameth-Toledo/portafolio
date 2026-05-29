import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lightbulb, AlertTriangle, Copy, Check, GitBranch, Globe, Terminal, Upload, X, ZoomIn } from 'lucide-react'
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

const flujoCompleto = `git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git push -u origin main`

export function CrearRepositorioLesson() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="px-6 pt-28 pb-10 sm:px-12 lg:px-24 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/blog/github-proyectos-colaborativos')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al módulo
          </button>

          <p className="font-mono text-xs tracking-widest text-[#C3E41D] uppercase mb-2">
            Módulo 1 · GitHub para Proyectos Colaborativos
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Crear y subir proyecto a repositorio
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 8 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="¿Qué es Git y GitHub?">
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  icon: Terminal,
                  title: 'Git',
                  desc: 'Sistema de control de versiones que vive en tu computadora. Registra cada cambio que haces en tu código y te permite volver a versiones anteriores.',
                },
                {
                  icon: Globe,
                  title: 'GitHub',
                  desc: 'Plataforma en la nube donde subes tu repositorio de Git para guardarlo de forma segura y compartirlo con tu equipo.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-secondary/40 border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-[#C3E41D]" />
                    <p className="text-foreground font-bold text-sm">{title}</p>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <Callout type="tip">
              Antes de empezar, asegúrate de tener Git instalado en tu computadora. Puedes verificarlo
              ejecutando <strong className="text-foreground">git --version</strong> en tu terminal.
              Si no lo tienes, descárgalo en{' '}
              <a
                href="https://git-scm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
              >
                git-scm.com
              </a>.
            </Callout>
          </Section>

          <Section title="Crear el repositorio en GitHub">

            <Step number={1} title="Ir a la sección de repositorios y crear uno nuevo">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Entra a tu perfil de GitHub, da clic en la pestaña{' '}
                <strong className="text-foreground">Repositories</strong> para ver la lista
                de tus repositorios. Después da clic en el botón verde{' '}
                <strong className="text-foreground">New</strong> que se encuentra a la derecha.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/github_repositories/github1.png"
                  alt="Pestaña Repositories en el perfil de GitHub"
                  caption="Perfil → Repositories → botón New"
                />
                <Screenshot
                  src="/assets/blog/github_repositories/github2.png"
                  alt="Formulario para crear nuevo repositorio"
                  caption="Escribir el nombre y dar clic en Create repository"
                />
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mt-4 mb-3">
                GitHub te pedirá el nombre del repositorio. Escríbelo y da clic en{' '}
                <strong className="text-foreground">Create repository</strong>. Te mostrará
                una página con la URL del repositorio recién creado — cópiala, la necesitarás
                más adelante.
              </p>

              <div className="flex flex-col gap-3 mt-4">
                {[
                  { label: 'Repository name', desc: 'El nombre de tu proyecto. Usa guiones en lugar de espacios, por ejemplo: mi-proyecto-web.' },
                  { label: 'Description', desc: 'Opcional pero recomendado. Una línea que describa de qué trata el proyecto.' },
                  { label: 'Visibility', desc: 'Public para que cualquiera lo vea, Private para que solo tú y tus colaboradores tengan acceso.' },
                  { label: 'Initialize this repository', desc: 'Deja esta opción sin marcar si ya tienes el proyecto en tu computadora.' },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-4">
                    <code className="text-[#C3E41D] text-xs font-bold shrink-0 mt-0.5">{label}</code>
                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              <Callout type="tip">
                Elige un nombre de usuario profesional — aparecerá en la URL de todos tus
                repositorios y en tu perfil público.
              </Callout>
            </Step>

          </Section>

          <Section title="Subir el proyecto desde tu computadora">

            <Step number={2} title="Abrir la terminal en la carpeta del proyecto">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Abre tu terminal (Git Bash en Windows, Terminal en Mac/Linux) y navega hasta
                la carpeta raíz de tu proyecto. Si tu proyecto está en el escritorio:
              </p>
              <CommandBlock command="cd Desktop/mi-proyecto-web" />
              <Callout type="tip">
                En Visual Studio Code puedes abrir la terminal integrada directamente en la
                carpeta del proyecto con <strong className="text-foreground">Ctrl + `</strong>.
                Así no necesitas navegar con cd.
              </Callout>
            </Step>

            <Step number={3} title="Inicializar Git en el proyecto">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Este comando crea un repositorio de Git local en tu carpeta. Solo se ejecuta
                una vez por proyecto:
              </p>
              <CommandBlock command="git init" />
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                Verás un mensaje indicando que se inicializó el repositorio. Git creará una
                carpeta oculta <strong className="text-foreground">.git</strong> donde guardará
                todo el historial.
              </p>
            </Step>

            <Step number={4} title="Agregar todos los archivos al área de staging">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                El comando <strong className="text-foreground">git add</strong> le dice a Git
                qué archivos quieres incluir en el próximo commit. El punto{' '}
                <strong className="text-foreground">.</strong> significa "todos los archivos
                de la carpeta actual":
              </p>
              <CommandBlock command="git add ." />
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                Para verificar qué archivos se agregaron puedes ejecutar:
              </p>
              <CommandBlock command="git status" />
            </Step>

            <Step number={5} title="Crear el primer commit">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Un commit es una fotografía de tu proyecto en un momento específico. El mensaje
                entre comillas describe qué cambios hiciste:
              </p>
              <CommandBlock command='git commit -m "first commit"' />
              <Callout type="tip">
                Escribe mensajes de commit en inglés y en forma imperativa:{' '}
                <strong className="text-foreground">"Add login form"</strong>,{' '}
                <strong className="text-foreground">"Fix navigation bug"</strong>,{' '}
                <strong className="text-foreground">"Update styles"</strong>. Evita mensajes
                vagos como "cambios" o "arreglos".
              </Callout>
            </Step>

            <Step number={6} title="Renombrar la rama principal a main">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Por convención, la rama principal de un repositorio se llama{' '}
                <strong className="text-foreground">main</strong>. Este comando la renombra
                si Git la creó con otro nombre:
              </p>
              <CommandBlock command="git branch -M main" />
            </Step>

            <Step number={7} title="Conectar el repositorio local con GitHub">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Este comando le dice a Git en qué URL de GitHub debe subir los archivos.
                Reemplaza la URL por la de tu repositorio que copiaste al crearlo:
              </p>
              <CommandBlock command="git remote add origin https://github.com/tu-usuario/tu-repositorio.git" />
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                Para verificar que la conexión quedó correcta:
              </p>
              <CommandBlock command="git remote -v" />
            </Step>

            <Step number={8} title="Subir el proyecto a GitHub">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                El flag <strong className="text-foreground">-u</strong> configura el tracking
                entre tu rama local y la remota, para que en el futuro solo necesites escribir{' '}
                <strong className="text-foreground">git push</strong>:
              </p>
              <CommandBlock command="git push -u origin main" />
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                GitHub te pedirá tus credenciales la primera vez. Ingresa tu usuario y contraseña
                (o un token de acceso si tienes autenticación en dos pasos). Una vez subido,
                recarga tu repositorio en GitHub y verás todos tus archivos.
              </p>
              <Callout type="warning">
                GitHub ya no acepta contraseñas directas en la terminal. Si te pide autenticación,
                necesitarás crear un{' '}
                <strong className="text-foreground">Personal Access Token</strong> en
                Settings → Developer settings → Tokens. Úsalo como si fuera tu contraseña.
              </Callout>
            </Step>

          </Section>

          <Section title="Resumen del flujo completo">
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Estos son todos los comandos en orden, listos para copiar y ejecutar una sola vez
              al iniciar cualquier proyecto:
            </p>
            <CodeSnippet label="Bash — flujo completo" code={flujoCompleto} />

            <div className="flex flex-col gap-3 mt-6">
              {[
                { icon: GitBranch, cmd: 'git init',          desc: 'Inicializa el repositorio local.' },
                { icon: Upload,    cmd: 'git add .',         desc: 'Agrega todos los archivos al staging.' },
                { icon: Upload,    cmd: 'git commit -m ""',  desc: 'Crea un punto de guardado con un mensaje.' },
                { icon: GitBranch, cmd: 'git branch -M main', desc: 'Renombra la rama principal a main.' },
                { icon: Globe,     cmd: 'git remote add origin <url>', desc: 'Conecta tu repo local con GitHub.' },
                { icon: Upload,    cmd: 'git push -u origin main', desc: 'Sube los archivos a GitHub.' },
              ].map(({ icon: Icon, cmd, desc }) => (
                <div key={cmd} className="flex items-start gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-3">
                  <Icon className="w-4 h-4 text-[#C3E41D] shrink-0 mt-0.5" />
                  <code className="text-[#C3E41D] text-xs font-mono shrink-0 w-52">{cmd}</code>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>

      {/* Navegación inferior */}
      <div className="px-6 sm:px-12 lg:px-24 pb-20 border-t border-border">
        <div className="max-w-5xl mx-auto pt-10 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/blog/github-proyectos-colaborativos')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulos
          </button>

          <button
            onClick={() => navigate('/blog/github-proyectos-colaborativos/estrategia-ramas')}
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
