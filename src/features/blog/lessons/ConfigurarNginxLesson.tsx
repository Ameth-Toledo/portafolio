import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Lightbulb, AlertTriangle,
  X, ZoomIn, Copy, Check,
} from 'lucide-react'
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

function Step({ number, title, children, id }: { number: number; title: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="flex gap-5 mb-10 scroll-mt-28">
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

function CodeSnippet({ label, language = 'nginx', code }: { label: string; language?: string; code: string }) {
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

const locationV1 = `location / {
    try_files @uri /index.html;
}`

const locationV2 = `location / {
    try_files $uri /index.html;
}`

export function ConfigurarNginxLesson() {
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
            Módulo 5 · Deploy Frontend con Nginx en AWS
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Configuración de Nginx para despliegue
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 10 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Preparar el directorio de Nginx">

            <Step number={1} title="Navegar al directorio de Nginx y borrar el archivo por defecto">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Regresa a la consola de EC2 y navega a la carpeta donde Nginx sirve los archivos:
              </p>
              <CommandBlock command="cd /var/www/html/" />
              <p className="text-muted-foreground text-sm leading-relaxed my-3">
                Ejecuta <strong className="text-foreground">ls</strong> para ver el contenido.
                Encontrarás el archivo <strong className="text-foreground">index.nginx-debian.html</strong>{' '}
                que viene por defecto. Vamos a eliminarlo para reemplazarlo por el de nuestra app:
              </p>
              <CommandBlock command="ls" />
              <CommandBlock command="sudo rm -r index.nginx-debian.html" />
            </Step>

            <Step number={2} title="Transferir los archivos con FileZilla">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Regresa a FileZilla. En el panel izquierdo navega hasta tu carpeta local del proyecto
                y ubica la carpeta <strong className="text-foreground">dist</strong>. Arrástrala
                al panel derecho, dentro de la carpeta <strong className="text-foreground">ubuntu</strong>.
                Espera a que FileZilla termine la transferencia.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws41.png"
                  alt="Arrastrar carpeta dist en FileZilla"
                  caption="Arrastrar la carpeta dist al servidor"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws42.png"
                  alt="Transferencia completada en FileZilla"
                  caption="Transferencia completada"
                />
              </div>
            </Step>

            <Step number={3} title="Verificar la carpeta dist y entrar como super usuario">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Regresa a la consola de EC2 y ejecuta <strong className="text-foreground">ls</strong>{' '}
                para confirmar que la carpeta <strong className="text-foreground">dist</strong> ya
                está en el home. Después entra como super usuario para no tener que escribir{' '}
                <strong className="text-foreground">sudo</strong> en cada comando:
              </p>
              <CommandBlock command="ls" />
              <CommandBlock command="sudo su" />
            </Step>

            <Step number={4} title="Mover los archivos a /var/www/html">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Entra a la carpeta <strong className="text-foreground">dist</strong> y copia cada
                archivo y carpeta que tenga dentro hacia <strong className="text-foreground">/var/www/html/</strong>.
                Repite el comando para cada archivo o carpeta dentro de dist:
              </p>
              <CommandBlock command="cp -R archivo.txt /var/www/html/" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws43.png"
                  alt="Comandos para mover archivos"
                  caption="Copiar archivos de dist a /var/www/html"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws44.png"
                  alt="Archivos copiados correctamente"
                  caption="Archivos transferidos al directorio de Nginx"
                />
              </div>
            </Step>

          </Section>

          <Section title="Verificar el despliegue">

            <Step number={5} title="Abrir la IP en el navegador">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Copia la IP elástica de tu instancia, pégala en una nueva pestaña del navegador
                y presiona Enter. Tu página web debería aparecer correctamente.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Sin embargo, si recargas la página o navegas directamente a una ruta, obtendrás
                un <strong className="text-foreground">error 404</strong>. Esto ocurre porque
                Nginx no sabe que debe servir siempre el <strong className="text-foreground">index.html</strong>{' '}
                de tu app — lo resolvemos en el siguiente paso.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws45.png"
                  alt="Página web funcionando en el navegador"
                  caption="La app carga correctamente con la IP"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws46.png"
                  alt="Error 404 al recargar la página"
                  caption="Error 404 al recargar o cambiar de ruta"
                />
              </div>
            </Step>

          </Section>

          <Section title="Corregir el error 404">

            <Step number={6} id="paso-nginx-config" title="Editar la configuración de Nginx">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Navega a la carpeta de configuración de sitios de Nginx y lista su contenido:
              </p>
              <CommandBlock command="cd /etc/nginx/sites-enabled/" />
              <CommandBlock command="ls" />
              <p className="text-muted-foreground text-sm leading-relaxed my-3">
                Encontrarás un archivo llamado <strong className="text-foreground">default</strong>.
                Ábrelo con el editor nano:
              </p>
              <CommandBlock command="nano default" />
              <p className="text-muted-foreground text-sm leading-relaxed my-3">
                Desplázate hacia abajo hasta encontrar el bloque{' '}
                <strong className="text-foreground">location</strong>. Borra esa sección y
                reemplázala por la siguiente:
              </p>
              <CodeSnippet label="nginx — /etc/nginx/sites-enabled/default" code={locationV1} />

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws47.png"
                  alt="Bloque location original en nano"
                  caption="Bloque location original que se reemplaza"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws48.png"
                  alt="Nuevo bloque location configurado"
                  caption="Nuevo bloque location con try_files"
                />
              </div>
            </Step>

            <Step number={7} title="Guardar cambios y reiniciar Nginx">
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Guarda el archivo en nano con{' '}
                <strong className="text-foreground">Ctrl + O</strong> y luego{' '}
                <strong className="text-foreground">Ctrl + X</strong> para cerrar.
                Después sal del modo super usuario y regresa al home:
              </p>
              <CommandBlock command="exit" />
              <CommandBlock command="cd" />
              <p className="text-muted-foreground text-sm leading-relaxed my-3">
                Reinicia el servicio de Nginx y confirma que esté corriendo correctamente:
              </p>
              <CommandBlock command="sudo service nginx restart" />
              <CommandBlock command="sudo service nginx status" />

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws49.png"
                  alt="Reinicio de Nginx"
                  caption="Reiniciar el servicio de Nginx"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws50.png"
                  alt="Estado activo de Nginx"
                  caption="Nginx corriendo correctamente"
                />
              </div>
            </Step>

            <Step number={8} title="Verificar que el error 404 ya no aparece">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Regresa al navegador, recarga la página con tu IP y navega a diferentes rutas.
                Todo debería funcionar sin error 404.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws51.png"
                  alt="Página cargando correctamente tras reinicio"
                  caption="La página carga sin error 404"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws52.png"
                  alt="Rutas funcionando correctamente"
                  caption="Todas las rutas responden correctamente"
                />
              </div>
            </Step>

          </Section>

          <Section title="Solución de problemas — Error 500">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
              <p className="text-foreground text-sm font-semibold mb-3">
                Si el navegador muestra un error 500 (Internal Server Error)
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Para algunos servicios el bloque anterior no funciona y es necesario usar{' '}
                <strong className="text-foreground">$uri</strong> en lugar de{' '}
                <strong className="text-foreground">@uri</strong>. Reemplaza el bloque{' '}
                <strong className="text-foreground">location</strong> por este:
              </p>
              <CodeSnippet label="nginx — /etc/nginx/sites-enabled/default" code={locationV2} />
              <p className="text-muted-foreground text-sm leading-relaxed mt-4 mb-4">
                Una vez corregido, repite todos los pasos desde la edición del archivo de configuración
                hasta el reinicio del servicio de Nginx.{' '}
                <a
                  href="#paso-nginx-config"
                  className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
                >
                  Clic aquí para volver al paso de configuración
                </a>.
                Si ya hiciste todo de nuevo y reiniciaste el servicio, recarga tu IP y debería funcionar correctamente.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws53.png"
                  alt="Configuración corregida con $uri"
                  caption="Bloque location con $uri corregido"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws54.png"
                  alt="Página funcionando tras corrección"
                  caption="Frontend desplegado correctamente"
                />
              </div>

              <Callout type="warning">
                Después de corregir el bloque <strong className="text-foreground">location</strong>{' '}
                es obligatorio volver a ejecutar{' '}
                <strong className="text-foreground">sudo service nginx restart</strong> para que
                los cambios tengan efecto.
              </Callout>
            </div>

            <div className="mt-8 text-center border border-[#C3E41D]/20 bg-[#C3E41D]/5 rounded-xl px-6 py-8">
              <p className="text-2xl font-black text-foreground mb-2">¡Listo!</p>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
                Tu frontend ha sido desplegado correctamente. Si, a pesar de seguir estos pasos,
                no lograste desplegar tu frontend, puedes contactarme a través de mis redes sociales.
              </p>
            </div>
          </Section>

        </div>
      </div>

      {/* Navegación inferior */}
      <div className="px-6 sm:px-12 lg:px-24 pb-20 border-t border-border">
        <div className="max-w-5xl mx-auto pt-10 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/blog/deploy-frontend-nginx-aws/instalar-nginx')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/deploy-frontend-nginx-aws')}
            className="flex items-center gap-2 bg-[#C3E41D] hover:bg-[#b0d018] text-black text-sm font-bold px-5 py-3 rounded-xl transition-colors"
          >
            Finalizar curso
          </button>
        </div>
      </div>

    </div>
  )
}
