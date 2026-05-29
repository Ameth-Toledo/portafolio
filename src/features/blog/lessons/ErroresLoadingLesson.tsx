import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lightbulb, AlertTriangle, Copy, Check, Loader2, CheckCircle2, XCircle } from 'lucide-react'
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

function CodeSnippet({ label, language = 'javascript', code }: { label: string; language?: string; code: string }) {
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

/* ── Ejemplos ── */

const sinEstados = `// Sin manejo de estados — mala experiencia de usuario
async function cargarPosts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts    = await response.json()

  const lista = document.getElementById('lista')
  posts.forEach(post => {
    const li = document.createElement('li')
    li.textContent = post.title
    lista.appendChild(li)
  })
}`

const conEstados = `// Con estados de carga y error — buena experiencia
async function cargarPosts() {
  const lista    = document.getElementById('lista')
  const spinner  = document.getElementById('spinner')
  const errorMsg = document.getElementById('error')

  // Estado: cargando
  spinner.hidden  = false
  errorMsg.hidden = true
  lista.innerHTML = ''

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')

    if (!response.ok) throw new Error('Error del servidor: ' + response.status)

    const posts = await response.json()

    posts.forEach(post => {
      const li = document.createElement('li')
      li.textContent = post.title
      lista.appendChild(li)
    })

  } catch (error) {
    // Estado: error
    errorMsg.textContent = 'No se pudieron cargar los posts.'
    errorMsg.hidden      = false

  } finally {
    // Siempre se ejecuta, haya error o no
    spinner.hidden = true
  }
}`

const htmlEstados = `<!-- index.html -->
<div id="spinner">Cargando...</div>
<p   id="error"   hidden></p>
<ul  id="lista"></ul>

<script src="scripts/main.js" defer></script>`

const spinnerCSS = `/* css/components.css */
#spinner {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

#spinner::before {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-top-color: #333;
  border-radius: 50%;
  animation: girar 0.7s linear infinite;
}

@keyframes girar {
  to { transform: rotate(360deg); }
}

#error {
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
}`

const tiposError = `async function cargarDatos() {
  const errorMsg = document.getElementById('error')

  try {
    const response = await fetch('https://api.ejemplo.com/datos')

    // Error del servidor (404, 500, etc.)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('El recurso no existe.')
      }
      if (response.status === 401) {
        throw new Error('No tienes permiso para ver esto.')
      }
      if (response.status >= 500) {
        throw new Error('El servidor tuvo un problema. Intenta más tarde.')
      }
      throw new Error('Error inesperado: ' + response.status)
    }

    const data = await response.json()
    mostrarDatos(data)

  } catch (error) {
    // Error de red (sin internet, URL incorrecta, etc.)
    if (error.name === 'TypeError') {
      errorMsg.textContent = 'Sin conexión a internet.'
    } else {
      errorMsg.textContent = error.message
    }
    errorMsg.hidden = false
  }
}`

const reintento = `async function cargarConReintento(url, intentos = 3) {
  for (let i = 0; i < intentos; i++) {
    try {
      const response = await fetch(url)

      if (!response.ok) throw new Error('Error: ' + response.status)

      return await response.json()

    } catch (error) {
      const esElUltimo = i === intentos - 1

      if (esElUltimo) throw error // si ya no quedan intentos, lanza el error

      console.log(\`Intento \${i + 1} fallido. Reintentando...\`)
      await new Promise(r => setTimeout(r, 1000)) // espera 1 segundo
    }
  }
}

// Uso
cargarConReintento('https://jsonplaceholder.typicode.com/posts/1')
  .then(data  => console.log(data))
  .catch(error => console.error('Falló después de 3 intentos:', error.message))`

export function ErroresLoadingLesson() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="px-6 pt-28 pb-10 sm:px-12 lg:px-24 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/blog/conexion-frontend-backend')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al módulo
          </button>

          <p className="font-mono text-xs tracking-widest text-[#C3E41D] uppercase mb-2">
            Módulo 4 · Conexión de Frontend con Backend
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Manejo de errores y estados de carga
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 8 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="¿Por qué manejar estados?">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cuando haces una petición a una API, el usuario no sabe que algo está pasando a menos
              que se lo indiques. Una petición puede tardar varios segundos, y si algo falla, la
              página puede quedar en blanco sin ninguna explicación. Eso es una mala experiencia.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Toda petición pasa por tres posibles estados. Tu interfaz debe reflejar cada uno:
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { estado: 'Cargando', icon: <Loader2     className="w-6 h-6 text-sky-400"   />, color: 'border-sky-500/30 bg-sky-500/5',     desc: 'La petición está en camino. Muestra un spinner o texto "Cargando...".' },
                { estado: 'Éxito',    icon: <CheckCircle2 className="w-6 h-6 text-green-400" />, color: 'border-green-500/30 bg-green-500/5', desc: 'Los datos llegaron. Muéstralos en el DOM.' },
                { estado: 'Error',    icon: <XCircle      className="w-6 h-6 text-red-400"   />, color: 'border-red-500/30 bg-red-500/5',     desc: 'Algo falló. Muestra un mensaje claro al usuario.' },
              ].map(({ estado, icon, color, desc }) => (
                <div key={estado} className={`border rounded-xl p-4 text-center ${color}`}>
                  <div className="flex justify-center mb-2">{icon}</div>
                  <p className="text-foreground font-bold text-sm mb-1">{estado}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Implementar los tres estados">
            <p className="text-muted-foreground leading-relaxed mb-2">
              Primero prepara el HTML con los elementos para cada estado:
            </p>
            <CodeSnippet label="index.html" language="html" code={htmlEstados} />
            <p className="text-muted-foreground leading-relaxed mb-2 mt-6">
              Luego en JavaScript controla cuándo mostrar u ocultar cada elemento. El bloque
              <code className="text-[#C3E41D]"> finally</code> se ejecuta siempre, haya error o no,
              ideal para ocultar el spinner:
            </p>
            <CodeSnippet label="scripts/main.js — sin estados" code={sinEstados} />
            <CodeSnippet label="scripts/main.js — con estados" code={conEstados} />
          </Section>

          <Section title="Estilizar el spinner y el error con CSS">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Un spinner simple hecho solo con CSS, sin necesitar imágenes ni librerías, usando
              la propiedad <code className="text-[#C3E41D]">border</code> y una animación de rotación:
            </p>
            <CodeSnippet label="css/components.css" language="css" code={spinnerCSS} />
            <Callout type="tip">
              El atributo HTML <code className="text-[#C3E41D]">hidden</code> oculta un elemento
              sin necesitar CSS. Es equivalente a <code className="text-[#C3E41D]">display: none</code> pero
              más semántico. Para mostrarlo, basta con hacer{' '}
              <code className="text-[#C3E41D]">elemento.hidden = false</code>.
            </Callout>
          </Section>

          <Section title="Distinguir tipos de error">
            <p className="text-muted-foreground leading-relaxed mb-4">
              No todos los errores son iguales. Un 404 significa "no encontrado", un 401 significa
              "no autorizado", y un error de red significa que no hay internet. Dar mensajes
              específicos ayuda mucho al usuario:
            </p>
            <CodeSnippet label="scripts/main.js" code={tiposError} />
            <div className="flex flex-col gap-3 mt-4">
              {[
                { code: '400', color: 'text-yellow-400', desc: 'Bad Request — los datos que enviaste tienen algún error de formato.' },
                { code: '401', color: 'text-orange-400', desc: 'Unauthorized — necesitas iniciar sesión o el token expiró.' },
                { code: '403', color: 'text-orange-400', desc: 'Forbidden — estás autenticado pero no tienes permiso.' },
                { code: '404', color: 'text-red-400',    desc: 'Not Found — el recurso no existe en esa URL.' },
                { code: '500', color: 'text-red-500',    desc: 'Internal Server Error — el servidor tuvo un problema interno.' },
              ].map(({ code, color, desc }) => (
                <div key={code} className="flex gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-3">
                  <code className={`text-sm font-black shrink-0 ${color}`}>{code}</code>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Reintentar automáticamente si falla">
            <p className="text-muted-foreground leading-relaxed mb-4">
              A veces una petición falla por un problema temporal (la red tardó, el servidor estaba
              ocupado). Puedes hacer que tu función reintente automáticamente antes de mostrar el
              error al usuario:
            </p>
            <CodeSnippet label="scripts/main.js" code={reintento} />
            <Callout type="warning">
              No uses reintentos para errores del tipo 4xx (como 404 o 401) porque esos no son
              problemas temporales — reintentar no los va a resolver. Solo tiene sentido para
              errores de red o errores 5xx del servidor.
            </Callout>
          </Section>

          <Section title="Resumen">
            <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed list-none">
              {[
                'Toda petición tiene tres estados: cargando, éxito y error. Muéstralos en la interfaz.',
                'Usa el atributo hidden para mostrar/ocultar el spinner y el mensaje de error.',
                'El bloque finally se ejecuta siempre — úsalo para ocultar el spinner.',
                'Distingue el tipo de error por el status code para dar mensajes más útiles al usuario.',
                'Los errores de red (TypeError) indican falta de conexión, no un error del servidor.',
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#C3E41D] font-bold shrink-0">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

        </div>
      </div>

      {/* Navegación inferior */}
      <div className="px-6 sm:px-12 lg:px-24 pb-20 border-t border-border">
        <div className="max-w-5xl mx-auto pt-10 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/blog/conexion-frontend-backend/post-put-delete')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/conexion-frontend-backend')}
            className="flex items-center gap-2 bg-[#C3E41D] hover:bg-[#b0d018] text-black text-sm font-bold px-5 py-3 rounded-xl transition-colors"
          >
            Finalizar curso
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  )
}
