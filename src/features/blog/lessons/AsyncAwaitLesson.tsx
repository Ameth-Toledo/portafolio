import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lightbulb, AlertTriangle, Copy, Check } from 'lucide-react'
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

function Compare({ badLabel, goodLabel, badCode, goodCode, language = 'javascript' }: {
  badLabel?: string; goodLabel?: string; badCode: string; goodCode: string; language?: string
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4 my-4">
      <div>
        <p className="text-xs font-bold text-red-400 mb-2 uppercase tracking-widest">Con .then()</p>
        <CodeBlock className="border-zinc-600">
          {badLabel && (
            <CodeBlockGroup className="border-b border-zinc-700 py-2 pr-2 pl-4">
              <span className="text-zinc-500 text-xs font-mono">{badLabel}</span>
            </CodeBlockGroup>
          )}
          <CodeBlockCode code={badCode} language={language} theme="github-dark" />
        </CodeBlock>
      </div>
      <div>
        <p className="text-xs font-bold text-[#C3E41D] mb-2 uppercase tracking-widest">Con async/await</p>
        <CodeBlock className="border-[#C3E41D]/40">
          {goodLabel && (
            <CodeBlockGroup className="border-b border-zinc-700 py-2 pr-2 pl-4">
              <span className="text-zinc-500 text-xs font-mono">{goodLabel}</span>
            </CodeBlockGroup>
          )}
          <CodeBlockCode code={goodCode} language={language} theme="github-dark" />
        </CodeBlock>
      </div>
    </div>
  )
}

/* ── Ejemplos ── */

const thenVsAsync = `// Con .then() — encadenado
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => {
    console.log(data.title)
  })`

const asyncVersion = `// Con async/await — más legible
async function obtenerPost() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
  const data = await response.json()
  console.log(data.title)
}

obtenerPost()`

const asyncConTryCatch = `async function obtenerPost() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')

    if (!response.ok) {
      throw new Error('Error del servidor: ' + response.status)
    }

    const data = await response.json()
    console.log(data.title)

  } catch (error) {
    console.error('Algo salió mal:', error.message)
  }
}

obtenerPost()`

const asyncMostrarDOM = `async function cargarPost() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')

    if (!response.ok) throw new Error('Error: ' + response.status)

    const post = await response.json()

    document.getElementById('titulo').textContent = post.title
    document.getElementById('cuerpo').textContent  = post.body

  } catch (error) {
    document.getElementById('titulo').textContent = 'No se pudo cargar el post'
    console.error(error)
  }
}

cargarPost()`

const asyncLista = `async function cargarPosts() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')

    if (!response.ok) throw new Error('Error: ' + response.status)

    const posts = await response.json()
    const lista  = document.getElementById('lista')

    posts.forEach(post => {
      const li = document.createElement('li')
      li.textContent = post.title
      lista.appendChild(li)
    })

  } catch (error) {
    console.error('Error al cargar los posts:', error.message)
  }
}

cargarLista()`

const asyncMultiple = `async function cargarDatos() {
  try {
    // Espera a que ambas terminen antes de continuar
    const [resUsuario, resPosts] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/users/1'),
      fetch('https://jsonplaceholder.typicode.com/posts?userId=1'),
    ])

    const usuario = await resUsuario.json()
    const posts   = await resPosts.json()

    console.log('Usuario:', usuario.name)
    console.log('Sus posts:', posts.length)

  } catch (error) {
    console.error(error)
  }
}

cargarDatos()`

export function AsyncAwaitLesson() {
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
            Módulo 2 · Conexión de Frontend con Backend
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Peticiones con async/await
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 7 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="¿Qué es async/await?">
            <p className="text-muted-foreground leading-relaxed mb-4">
              En el módulo anterior usamos <code className="text-[#C3E41D]">.then()</code> para
              trabajar con promesas. <strong className="text-foreground">async/await</strong> es una
              forma más moderna de hacer lo mismo, pero el código se parece más a código normal y es
              mucho más fácil de leer, especialmente cuando hay varias peticiones seguidas.
            </p>
            <div className="flex flex-col gap-3 mb-4">
              {[
                { kw: 'async', color: 'text-sky-400', desc: 'Se pone antes de function. Le dice a JavaScript que esa función va a hacer operaciones que tardan tiempo.' },
                { kw: 'await', color: 'text-purple-400', desc: 'Se pone antes de una promesa. Le dice "espera aquí hasta que esto termine" antes de continuar.' },
              ].map(({ kw, color, desc }) => (
                <div key={kw} className="flex gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-4">
                  <code className={`text-sm font-bold shrink-0 ${color}`}>{kw}</code>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title=".then() vs async/await">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ambas formas hacen exactamente lo mismo. La diferencia es solo de estilo y legibilidad:
            </p>
            <Compare badCode={thenVsAsync} goodCode={asyncVersion} />
            <Callout type="tip">
              Con <code className="text-[#C3E41D]">async/await</code> el código se lee de arriba a abajo
              como si fuera síncrono, sin anidaciones. Cuando tengas varias peticiones seguidas,
              la diferencia se vuelve mucho más notoria.
            </Callout>
          </Section>

          <Section title="Manejo de errores con try/catch">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Con <code className="text-[#C3E41D]">.then()</code> usábamos <code className="text-[#C3E41D]">.catch()</code> al final.
              Con async/await el equivalente es un bloque <code className="text-[#C3E41D]">try/catch</code>:
              envuelve el código que puede fallar en <code className="text-[#C3E41D]">try</code>, y en
              el <code className="text-[#C3E41D]">catch</code> manejas el error si ocurre.
            </p>
            <CodeSnippet label="scripts/main.js" code={asyncConTryCatch} />
            <Callout type="warning">
              Recuerda que <code className="text-yellow-300">await</code> solo funciona dentro de una
              función marcada con <code className="text-yellow-300">async</code>. Si intentas usarlo
              fuera, obtendrás un error de sintaxis.
            </Callout>
          </Section>

          <Section title="Ejemplo completo: mostrar datos en el DOM">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Combinando todo: una función async que carga un post y lo muestra en la página,
              con manejo de errores incluido:
            </p>
            <CodeSnippet label="scripts/main.js" code={asyncMostrarDOM} />
            <CodeSnippet label="scripts/main.js — lista de posts" code={asyncLista} />
          </Section>

          <Section title="Peticiones en paralelo con Promise.all">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Si necesitas hacer varias peticiones al mismo tiempo (no una después de la otra),
              usa <code className="text-[#C3E41D]">Promise.all()</code>. Lanza todas las peticiones
              a la vez y espera a que <strong className="text-foreground">todas</strong> terminen:
            </p>
            <CodeSnippet label="scripts/main.js" code={asyncMultiple} />
            <Callout type="tip">
              <code className="text-[#C3E41D]">Promise.all</code> es mucho más rápido que hacer las
              peticiones una por una con varios <code className="text-[#C3E41D]">await</code> seguidos,
              porque las ejecuta en paralelo en lugar de esperar a que termine cada una antes de
              empezar la siguiente.
            </Callout>
          </Section>

          <Section title="Resumen">
            <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed list-none">
              {[
                'async/await es una forma más legible de trabajar con promesas que .then().',
                'Marca la función con async y usa await antes de cada operación que tarda tiempo.',
                'Usa try/catch para manejar errores, igual que lo harías con código síncrono.',
                'No olvides verificar response.ok antes de parsear el JSON.',
                'Promise.all() ejecuta varias peticiones en paralelo y espera a que todas terminen.',
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
            onClick={() => navigate('/blog/conexion-frontend-backend/consumo-apis-fetch')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/conexion-frontend-backend/post-put-delete')}
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
