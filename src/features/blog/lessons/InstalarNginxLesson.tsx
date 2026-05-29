import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Lightbulb, AlertTriangle,
  X, ZoomIn, Copy, Check,
  Globe, Server, Lock, User, Key,
} from 'lucide-react'

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
    <div className="flex items-center gap-3 bg-[#0d1117] border border-zinc-700 rounded-xl px-4 py-3 my-4">
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

const sftpConfig = [
  { icon: Globe,  label: 'Protocolo',      value: 'SFTP — SSH File Transfer Protocol' },
  { icon: Server, label: 'Servidor',       value: 'IP pública de tu instancia EC2' },
  { icon: Lock,   label: 'Modo de acceso', value: 'Archivo de claves' },
  { icon: User,   label: 'Usuario',        value: 'ubuntu' },
  { icon: Key,    label: 'Archivo de claves', value: 'Ruta del archivo .pem que descargaste' },
]

export function InstalarNginxLesson() {
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
            Módulo 4 · Deploy Frontend con Nginx en AWS
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Instalación de Nginx
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 8 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Conectarse a la instancia">

            <Step number={1} title="Abrir la terminal de EC2">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Selecciona tu instancia y da clic sobre el botón{' '}
                <strong className="text-foreground">Conectar</strong>. Te llevará a una vista
                con tu IP y opciones de conexión. Desplázate hacia abajo y da clic en el botón
                amarillo que dice <strong className="text-foreground">Conectar</strong>. Espera
                a que se abra la terminal en el navegador.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws29.png"
                  alt="Botón Conectar en la instancia"
                  caption="Clic en el botón Conectar de la instancia"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws30.png"
                  alt="Vista de conexión con botón amarillo"
                  caption="Clic en el botón amarillo Conectar"
                />
              </div>
            </Step>

          </Section>

          <Section title="Instalar Nginx">

            <Step number={2} title="Actualizar paquetes del sistema">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Una vez que se abra la terminal, lo primero es actualizar los paquetes del sistema
                operativo. Ejecuta el siguiente comando y espera a que termine:
              </p>
              <CommandBlock command="sudo apt update && sudo apt upgrade -y" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws31.png"
                  alt="Terminal de EC2 abierta"
                  caption="Terminal de EC2 lista para recibir comandos"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws32.png"
                  alt="Actualización de paquetes en progreso"
                  caption="Actualización de paquetes completada"
                />
              </div>
            </Step>

            <Step number={3} title="Instalar Nginx">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Una vez terminada la actualización, instala Nginx con el siguiente comando.
                El proceso puede tardar unos segundos; espera a que finalice:
              </p>
              <CommandBlock command="sudo apt install nginx -y" />

              <Callout type="tip">
                El flag <strong className="text-foreground">-y</strong> responde automáticamente
                "sí" a las confirmaciones de instalación. Sin él, el sistema te preguntará
                si deseas continuar.
              </Callout>
            </Step>

          </Section>

          <Section title="Subir archivos con FileZilla">

            <Step number={4} title="Hacer build de la aplicación y descargar FileZilla">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Regresa a tu proyecto en Visual Studio Code y ejecuta el comando de build
                correspondiente a tu framework para generar la carpeta{' '}
                <strong className="text-foreground">dist</strong>. El comando varía según el
                framework que uses, así que consulta su documentación si no lo recuerdas.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Para transferir los archivos a EC2 usaremos{' '}
                <strong className="text-foreground">FileZilla</strong>. Si no lo tienes
                instalado, puedes descargarlo en:{' '}
                <a
                  href="https://filezilla-project.org/download.php?platform=win64"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors break-all"
                >
                  https://filezilla-project.org/download.php?platform=win64
                </a>
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws33.png"
                  alt="Carpeta dist generada en VSCode"
                  caption="Carpeta dist generada por el build"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws34.png"
                  alt="Descarga de FileZilla"
                  caption="Descarga e instalación de FileZilla"
                />
              </div>
            </Step>

            <Step number={5} title="Abrir el administrador de sitios en FileZilla">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Abre FileZilla y da clic sobre el ícono de servidores que se encuentra en la
                parte superior izquierda. En la imagen se muestra exactamente sobre cuál ícono
                debes dar clic.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws35.png"
                  alt="Ícono de administrador de sitios en FileZilla"
                  caption="Clic en el ícono de administrador de sitios"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws36.png"
                  alt="Vista del administrador de sitios vacío"
                  caption="Administrador de sitios — inicialmente vacío"
                />
              </div>
            </Step>

            <Step number={6} title="Crear un nuevo sitio con conexión SFTP">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Da clic en <strong className="text-foreground">Nuevo sitio</strong> y llena
                los siguientes campos:
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {sftpConfig.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-4">
                    <Icon className="w-4 h-4 text-[#C3E41D] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground text-sm font-semibold mb-0.5">{label}</p>
                      <p className="text-muted-foreground text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws37.png"
                  alt="Formulario de nuevo sitio en FileZilla"
                  caption="Llenar los datos del nuevo sitio"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws38.png"
                  alt="Configuración SFTP completada"
                  caption="Configuración lista para conectar"
                />
              </div>
            </Step>

            <Step number={7} title="Seleccionar el archivo .pem y conectar">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Para el campo <strong className="text-foreground">Archivo de claves</strong> da
                clic en el botón <strong className="text-foreground">Examinar</strong>; se abrirá
                el explorador de archivos para que ubiques y selecciones tu archivo{' '}
                <strong className="text-foreground">.pem</strong>. Una vez que hayas llenado
                todos los datos, da clic en <strong className="text-foreground">Conectar</strong>.
                Si todo está correcto, FileZilla mostrará las carpetas de tu instancia EC2.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws39.png"
                  alt="Botón Examinar para seleccionar el .pem"
                  caption="Examinar → seleccionar el archivo .pem"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws40.png"
                  alt="FileZilla conectado a EC2"
                  caption="Conexión exitosa — carpetas de EC2 visibles"
                />
              </div>

              <Callout type="warning">
                Si FileZilla te pide confirmar el certificado del servidor, da clic en{' '}
                <strong className="text-foreground">Aceptar</strong> o{' '}
                <strong className="text-foreground">Confiar</strong>. Es normal la primera
                vez que te conectas a una instancia nueva.
              </Callout>
            </Step>

          </Section>

        </div>
      </div>

      {/* Navegación inferior */}
      <div className="px-6 sm:px-12 lg:px-24 pb-20 border-t border-border">
        <div className="max-w-5xl mx-auto pt-10 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/blog/deploy-frontend-nginx-aws/configurar-puertos')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-frontend-nginx-aws/configurar-nginx')}
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
