import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lightbulb, X, ZoomIn, Copy, Check } from 'lucide-react'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/ui/code-block'

function Callout({ type, children }: { type: 'tip' | 'warning'; children: React.ReactNode }) {
  const isTip = type === 'tip'
  return (
    <div className={`flex gap-3 rounded-xl border p-4 my-6 ${
      isTip ? 'border-[#C3E41D]/30 bg-[#C3E41D]/5' : 'border-yellow-500/30 bg-yellow-500/5'
    }`}>
      {isTip ? <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-[#C3E41D]" /> : null}
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

function CommandBlock({ command, label = 'MySQL' }: { command: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center gap-3 bg-[#0d1117] border border-zinc-700 rounded-xl px-4 py-3 my-3">
      <span className="text-zinc-500 text-xs font-mono shrink-0">{label}</span>
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

function CodeSnippet({ label, language = 'sql', code }: { label: string; language?: string; code: string }) {
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

const BASE = '/assets/blog/bd_aws'

const createTable = `CREATE TABLE user (
  id_user         INT NOT NULL AUTO_INCREMENT,
  nombre          VARCHAR(100) NOT NULL,
  email           VARCHAR(150) NOT NULL UNIQUE,
  password        VARCHAR(255) NOT NULL,
  fecha_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_user)
);`

export function MySQLVerificacionLesson() {
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
            Módulo 6 · Deploy Base de datos MySQL en AWS
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Verificación de la Configuración de MySQL
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 8 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Conectarse desde MySQL Workbench">

            <Step number={1} title="Abrir Workbench y copiar la IP de la instancia">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Copia la IP elástica de tu instancia de base de datos y abre{' '}
                <strong className="text-foreground">MySQL Workbench</strong>. Aquí crearemos
                una nueva conexión para verificar que el acceso remoto funcione correctamente.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws39.png`}
                  alt="IP de la instancia copiada en AWS"
                  caption="Copiar la IP elástica de la instancia"
                />
                <Screenshot
                  src={`${BASE}/aws40.png`}
                  alt="MySQL Workbench abierto"
                  caption="Abrir MySQL Workbench"
                />
              </div>
            </Step>

            <Step number={2} title="Crear la nueva conexión">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Da clic en el ícono <strong className="text-foreground">+</strong> para
                agregar una conexión. Llena los campos con la siguiente información:
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {[
                  { label: 'Connection Name', desc: 'Cualquier nombre — es solo para identificar la conexión.' },
                  { label: 'Hostname',         desc: 'La IP elástica que copiaste de la instancia EC2.' },
                  { label: 'Port',             desc: '3306 (valor por defecto de MySQL, no lo cambies).' },
                  { label: 'Username',         desc: 'El usuario que creaste en el módulo anterior.' },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-4">
                    <code className="text-[#C3E41D] text-xs font-bold shrink-0 mt-0.5 w-36">{label}</code>
                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Da clic en <strong className="text-foreground">OK</strong>. La conexión
                aparecerá en la lista de conexiones de Workbench.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws41.png`}
                  alt="Formulario de nueva conexión en Workbench"
                  caption="Llenar los datos de la conexión"
                />
                <Screenshot
                  src={`${BASE}/aws42.png`}
                  alt="Conexión creada en la lista de Workbench"
                  caption="Conexión creada y visible en la lista"
                />
              </div>
            </Step>

            <Step number={3} title="Ingresar la contraseña y conectarse">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Haz doble clic sobre la conexión creada. Se abrirá una ventana solicitando
                la contraseña del usuario. Ingrésala y da clic en{' '}
                <strong className="text-foreground">OK</strong>. Espera a que la conexión
                se establezca.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws43.png`}
                  alt="Ventana de ingreso de contraseña en Workbench"
                  caption="Ingresar la contraseña del usuario"
                />
                <Screenshot
                  src={`${BASE}/aws44.png`}
                  alt="Workbench conectado a la base de datos remota"
                  caption="Conexión establecida correctamente"
                />
              </div>
            </Step>

          </Section>

          <Section title="Usar la base de datos">

            <Step number={4} title="Seleccionar la base de datos y crear una tabla">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                En el editor de Workbench selecciona la base de datos que creaste:
              </p>

              <CommandBlock command="USE ejemplo;" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Si todo está correcto, verás el mensaje{' '}
                <strong className="text-green-400">0 rows affected</strong>, indicando que
                no hubo errores. Ahora puedes crear tablas, editar o eliminar datos
                libremente. Como ejemplo, aquí tienes la estructura de una tabla de usuarios:
              </p>

              <CodeSnippet label="MySQL — ejemplo" code={createTable} />

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src={`${BASE}/aws45.png`}
                  alt="USE ejemplo ejecutado en Workbench"
                  caption="Base de datos seleccionada — 0 rows affected"
                />
                <Screenshot
                  src={`${BASE}/aws46.png`}
                  alt="Tabla user creada en Workbench"
                  caption="Tabla creada correctamente en la base de datos"
                />
              </div>

              <Callout type="tip">
                Ajusta los tamaños de los campos <strong className="text-foreground">VARCHAR</strong>{' '}
                según los datos que vayas a almacenar. Por ejemplo,{' '}
                <strong className="text-foreground">VARCHAR(100)</strong> para nombres y{' '}
                <strong className="text-foreground">VARCHAR(255)</strong> para contraseñas
                hasheadas son valores habituales.
              </Callout>
            </Step>

          </Section>

          <div className="mt-4 text-center border border-[#C3E41D]/20 bg-[#C3E41D]/5 rounded-xl px-6 py-8">
            <p className="text-2xl font-black text-foreground mb-2">¡Listo!</p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
              Tu base de datos MySQL ha sido creada y desplegada correctamente en AWS.
              Si, a pesar de seguir estos pasos, no lograste desplegarla, puedes
              contactarme a través de mis redes sociales.
            </p>
          </div>

        </div>
      </div>

      {/* Navegación inferior */}
      <div className="px-6 sm:px-12 lg:px-24 pb-20 border-t border-border">
        <div className="max-w-5xl mx-auto pt-10 flex items-center justify-start gap-4">
          <button
            onClick={() => navigate('/blog/deploy-mysql-aws/opciones-seguridad')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-mysql-aws')}
            className="flex items-center gap-2 bg-[#C3E41D] hover:bg-[#b0d018] text-black text-sm font-bold px-5 py-3 rounded-xl transition-colors"
          >
            Finalizar curso
          </button>
        </div>
      </div>

    </div>
  )
}
