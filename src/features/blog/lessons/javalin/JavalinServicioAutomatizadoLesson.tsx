import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lightbulb, AlertTriangle, X, ZoomIn, Copy, Check } from 'lucide-react'
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

const scriptContenido = `#!/bin/bash
cd /home/ubuntu/api-users-javalin
./gradlew run`

export function JavalinServicioAutomatizadoLesson() {
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
            Módulo 9 · Deploy de API Rest con Javalin
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Creación de servicio para ejecución automatizada
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 12 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Instalar Node.js y PM2">

            <Step number={1} title="Configurar el repositorio e instalar Node.js">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Primero configuramos el repositorio de NodeSource para preparar el entorno,
                luego instalamos Node.js:
              </p>

              <CommandBlock command="curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -" />
              <CommandBlock command="sudo apt install nodejs -y" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws55.png`}
                  alt="Configuración del repositorio NodeSource"
                  caption="Configurar el repositorio de NodeSource"
                />
                <Screenshot
                  src={`${BASE}/aws56.png`}
                  alt="Instalación de Node.js"
                  caption="Instalación de Node.js completada"
                />
              </div>
            </Step>

            <Step number={2} title="Verificar la instalación e instalar PM2">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Confirma que Node.js y npm quedaron correctamente instalados:
              </p>

              <CommandBlock command="node --version" />
              <CommandBlock command="npm --version" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Una vez confirmada la instalación, instala PM2 de manera global. PM2 es un
                administrador de procesos que mantendrá la API ejecutándose de forma continua
                y automática, incluso tras un reinicio del servidor:
              </p>

              <CommandBlock command="sudo npm install -g pm2" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws57.png`}
                  alt="Versiones de node y npm verificadas"
                  caption="Verificar node --version y npm --version"
                />
                <Screenshot
                  src={`${BASE}/aws58.png`}
                  alt="PM2 instalado globalmente"
                  caption="PM2 instalado con -g"
                />
              </div>
            </Step>

          </Section>

          <Section title="Crear y configurar el script de inicio">

            <Step number={3} title="Crear el script start-api.sh">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Crea un script <strong className="text-foreground">.sh</strong> que PM2
                usará para ejecutar la API. Los archivos Bash son necesarios para que PM2
                pueda lanzar el proceso sin errores:
              </p>

              <CommandBlock command="nano ~/start-api.sh" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-3">
                Dentro del editor escribe el siguiente contenido:
              </p>

              <CodeSnippet label="~/start-api.sh" language="bash" code={scriptContenido} />

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src={`${BASE}/aws59.png`}
                  alt="Editor nano con el script start-api.sh"
                  caption="Contenido del script en nano"
                />
                <Screenshot
                  src={`${BASE}/aws60.png`}
                  alt="Script guardado correctamente"
                  caption="Guardar con Ctrl+O y cerrar con Ctrl+X"
                />
              </div>

              <Callout type="warning">
                La ruta <strong className="text-foreground">/home/ubuntu/api-users-javalin</strong>{' '}
                debe coincidir exactamente con la ubicación de tu proyecto en la instancia.
                Si la ruta es incorrecta PM2 no podrá ejecutar la API.
              </Callout>
            </Step>

            <Step number={4} title="Asignar permisos de ejecución y verificar">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Asigna permisos de ejecución al script para que el sistema lo reconozca
                como un programa ejecutable:
              </p>

              <CommandBlock command="chmod +x ~/start-api.sh" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Verifica que los permisos se hayan asignado correctamente. El archivo debe
                mostrar la letra <strong className="text-foreground">x</strong> en los permisos
                del propietario, grupo y otros:
              </p>

              <CommandBlock command="ls -l ~/start-api.sh" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws61.png`}
                  alt="chmod +x ejecutado"
                  caption="Permisos de ejecución asignados"
                />
                <Screenshot
                  src={`${BASE}/aws62.png`}
                  alt="ls -l muestra los permisos del script"
                  caption="Verificar que aparece la x en los permisos"
                />
              </div>
            </Step>

          </Section>

          <Section title="Iniciar y configurar PM2">

            <Step number={5} title="Iniciar la API con PM2">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Inicia la API a través de PM2. En el parámetro{' '}
                <strong className="text-foreground">--name</strong> coloca un nombre
                identificativo para tu servicio — preferiblemente relacionado con la API:
              </p>

              <CommandBlock command="pm2 start ~/start-api.sh --name api-usuarios" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws63.png`}
                  alt="PM2 iniciando el servicio api-usuarios"
                  caption="PM2 lanzando el script de la API"
                />
                <Screenshot
                  src={`${BASE}/aws64.png`}
                  alt="Servicio api-usuarios corriendo en PM2"
                  caption="Servicio iniciado correctamente"
                />
              </div>
            </Step>

            <Step number={6} title="Configurar el inicio automático y guardar">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Genera el script de inicio automático. Al ejecutarlo se mostrará un PATH;
                cópialo y ejecútalo en la terminal para completar la configuración:
              </p>

              <CommandBlock command="pm2 startup" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Luego guarda la configuración actual para que PM2 recuerde los procesos
                activos tras cada reinicio:
              </p>

              <CommandBlock command="pm2 save" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src={`${BASE}/aws65.png`}
                  alt="pm2 startup mostrando el PATH"
                  caption="pm2 startup genera el PATH de inicio automático"
                />
                <Screenshot
                  src={`${BASE}/aws66.png`}
                  alt="pm2 save guardando la configuración"
                  caption="pm2 save guarda los procesos activos"
                />
              </div>
            </Step>

            <Step number={7} title="Verificar el estado y los logs">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Revisa el estado del servicio. Debe aparecer el nombre asignado y el campo{' '}
                <strong className="text-foreground">status</strong> debe mostrar{' '}
                <strong className="text-green-400">online</strong>:
              </p>

              <CommandBlock command="pm2 status" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Luego revisa los logs para confirmar que la API se conectó correctamente
                a la base de datos y que no hay errores. Reemplaza{' '}
                <strong className="text-foreground">api-usuarios</strong> por el nombre
                que asignaste a tu servicio:
              </p>

              <CommandBlock command="pm2 logs api-usuarios" />

              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                Debería mostrarse un mensaje indicando que el servidor está corriendo
                o que la conexión con la base de datos fue exitosa. El contenido exacto
                dependerá de los logs configurados en tu código.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws67.png`}
                  alt="pm2 status mostrando api-usuarios online"
                  caption="status: online — el servicio está activo"
                />
                <Screenshot
                  src={`${BASE}/aws68.png`}
                  alt="pm2 logs mostrando la conexión exitosa"
                  caption="Logs muestran conexión exitosa a la base de datos"
                />
              </div>
            </Step>

          </Section>

          <Section title="Probar la API">

            <Step number={8} title="Verificar los métodos HTTP en Postman">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Prueba la API en Postman o Insomnia. Copia la IP de la instancia y construye
                la URL con el puerto y el endpoint correspondiente. Verifica que los métodos
                GET, POST, PUT y DELETE respondan correctamente.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws69.png`}
                  alt="Prueba GET en Postman"
                  caption="Método GET respondiendo correctamente"
                />
                <Screenshot
                  src={`${BASE}/aws70.png`}
                  alt="Prueba POST en Postman"
                  caption="Método POST funcionando"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Screenshot
                  src={`${BASE}/aws71.png`}
                  alt="Prueba PUT en Postman"
                  caption="Método PUT funcionando"
                />
                <Screenshot
                  src={`${BASE}/aws72.png`}
                  alt="Prueba DELETE en Postman"
                  caption="Método DELETE funcionando"
                />
              </div>

              <Callout type="tip">
                Si todos los métodos responden correctamente, el despliegue fue exitoso.
                A partir de ahora, cada vez que la instancia se encienda, PM2 levantará
                la API automáticamente sin necesidad de ejecutar ningún comando manual.
              </Callout>
            </Step>

          </Section>

          <div className="mt-4 text-center border border-[#C3E41D]/20 bg-[#C3E41D]/5 rounded-xl px-6 py-8">
            <p className="text-2xl font-black text-foreground mb-2">¡Listo!</p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
              Tu API REST con Javalin ha sido desplegada y configurada para ejecutarse
              automáticamente. Si tuviste algún problema durante el proceso, puedes
              contactarme a través de mis redes sociales.
            </p>
          </div>

        </div>
      </div>

      {/* Navegación inferior */}
      <div className="px-6 sm:px-12 lg:px-24 pb-20 border-t border-border">
        <div className="max-w-5xl mx-auto pt-10 flex items-center justify-start gap-4">
          <button
            onClick={() => navigate('/blog/deploy-api-javalin/ip-elastica')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-api-javalin')}
            className="flex items-center gap-2 bg-[#C3E41D] hover:bg-[#b0d018] text-black text-sm font-bold px-5 py-3 rounded-xl transition-colors"
          >
            Finalizar curso
          </button>
        </div>
      </div>

    </div>
  )
}
