import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lightbulb, AlertTriangle, X, ZoomIn } from 'lucide-react'

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

export function CrearInstanciaEC2Lesson() {
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
            Módulo 1 · Deploy Frontend con Nginx en AWS
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Creación de instancia EC2 con IP elástica
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 5 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Iniciar el laboratorio de AWS">

            <Step number={1} title="Abrir el laboratorio de aprendizaje">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Dirígete al laboratorio de AWS y da clic en <strong className="text-foreground">Iniciar laboratorio de aprendizaje</strong>.
                Se abrirá una nueva ventana en el navegador con varias opciones como: Start Lab, End Lab, etc.
                Da clic sobre <strong className="text-foreground">Start Lab</strong> y espera a que
                el indicador de estado de AWS cambie a <strong className="text-green-400">verde</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws1.png"
                  alt="Laboratorio antes de iniciar"
                  caption="Estado inicial del laboratorio"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws2.png"
                  alt="Laboratorio con estado verde"
                  caption="Indicador verde — laboratorio activo"
                />
              </div>

              <Callout type="warning">
                No cierres esta ventana mientras trabajas. Si el laboratorio se detiene, perderás
                la instancia y tendrás que comenzar de nuevo.
              </Callout>
            </Step>

          </Section>

          <Section title="Crear la instancia EC2">

            <Step number={2} title="Buscar el servicio EC2">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Al entrar al panel de AWS verás un buscador en la parte superior. Escribe{' '}
                <strong className="text-foreground">EC2</strong> y da clic sobre la primera opción
                que aparezca. Esto te llevará a la sección de instancias. Si ya tienes instancias
                creadas las verás listadas; si es tu primera vez, la lista aparecerá vacía.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws3.png"
                  alt="Buscador de AWS con EC2"
                  caption="Buscar EC2 en el panel de AWS"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws4.png"
                  alt="Sección de instancias EC2"
                  caption="Vista de instancias EC2"
                />
              </div>
            </Step>

            <Step number={3} title="Lanzar una nueva instancia">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Da clic sobre el botón amarillo <strong className="text-foreground">Lanzar instancia</strong>{' '}
                que se encuentra en la parte derecha. Se abrirá la sección de configuración. Lo primero
                que te pedirá es un nombre para tu instancia; en este ejemplo usaremos{' '}
                <strong className="text-foreground">Front-End</strong>, aunque el nombre no afecta el funcionamiento.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws5.png"
                  alt="Botón lanzar instancia"
                  caption="Botón amarillo para lanzar instancia"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws6.png"
                  alt="Nombre de la instancia"
                  caption="Asignar un nombre a la instancia"
                />
              </div>
            </Step>

            <Step number={4} title="Seleccionar Ubuntu como sistema operativo">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                En la sección de imagen de máquina (AMI) selecciona <strong className="text-foreground">Ubuntu</strong>.
                Es importante elegir este sistema operativo; si seleccionas otro, el despliegue no
                funcionará correctamente. Después desplázate hacia abajo hasta encontrar la sección de{' '}
                <strong className="text-foreground">Par de claves</strong> y da clic en{' '}
                <strong className="text-foreground">Crear un nuevo par de claves</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws7.png"
                  alt="Selección de Ubuntu como AMI"
                  caption="Seleccionar Ubuntu como sistema operativo"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws8.png"
                  alt="Sección de par de claves"
                  caption="Crear un nuevo par de claves"
                />
              </div>

              <Callout type="warning">
                No elijas otro sistema operativo (Amazon Linux, Windows, etc.). Las instrucciones
                de este módulo están basadas en Ubuntu y los comandos serán diferentes en otros sistemas.
              </Callout>
            </Step>

            <Step number={5} title="Configurar el par de claves">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                En la ventana de creación del par de claves ingresa un nombre; puedes usar el mismo
                que el de tu instancia (<strong className="text-foreground">Front-End</strong>). Deja
                el tipo en <strong className="text-foreground">RSA</strong> y el formato en{' '}
                <strong className="text-foreground">.pem</strong>. Da clic en{' '}
                <strong className="text-foreground">Crear par de claves</strong> y guarda bien el archivo
                que se descargará automáticamente.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws9.png"
                  alt="Formulario del par de claves"
                  caption="Nombre, tipo RSA y formato .pem"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws10.png"
                  alt="Par de claves creado"
                  caption="Archivo .pem descargado"
                />
              </div>

              <Callout type="warning">
                Guarda el archivo <strong className="text-foreground">.pem</strong> en un lugar seguro.
                Es la única forma de conectarte a tu instancia mediante SSH. Si lo pierdes, no podrás
                recuperarlo y tendrás que crear una nueva instancia.
              </Callout>
            </Step>

            <Step number={6} title="Verificar que la instancia fue creada">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Una vez completada la configuración, AWS mostrará una pantalla confirmando que el
                lanzamiento fue exitoso. Da clic en el botón amarillo{' '}
                <strong className="text-foreground">Ver todas las instancias</strong>. Serás redirigido
                a la lista de instancias donde verás la que acabas de crear. Espera a que el estado
                de comprobación cambie a <strong className="text-green-400">2/2 comprobaciones superadas</strong>;
                en ese momento tu instancia estará lista.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Screenshot
                  src="/assets/blog/frontend_aws/aws11.png"
                  alt="Lanzamiento exitoso"
                  caption="Confirmación de lanzamiento exitoso"
                />
                <Screenshot
                  src="/assets/blog/frontend_aws/aws12.png"
                  alt="Instancia con 2/2 comprobaciones"
                  caption="Estado 2/2 comprobaciones — instancia lista"
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
            onClick={() => navigate('/blog/deploy-frontend-nginx-aws')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulos
          </button>

          <button
            onClick={() => navigate('/blog/deploy-frontend-nginx-aws/ip-elastica')}
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
