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

/* ── Ejemplos ── */

const fetchBasico = `fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(function(response) {
    return response.json()
  })
  .then(function(data) {
    console.log(data)
  })`

const fetchConArrowFn = `fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => console.log(data))`

const fetchMostrarDOM = `fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => {
    const titulo = document.getElementById('titulo')
    const cuerpo = document.getElementById('cuerpo')

    titulo.textContent = data.title
    cuerpo.textContent = data.body
  })`

const htmlContenedor = `<!-- index.html -->
<div id="tarjeta">
  <h2 id="titulo">Cargando...</h2>
  <p  id="cuerpo"></p>
</div>

<script src="scripts/main.js" defer></script>`

const fetchLista = `fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(posts => {
    const lista = document.getElementById('lista-posts')

    posts.forEach(post => {
      const item = document.createElement('li')
      item.textContent = post.title
      lista.appendChild(item)
    })
  })`

const htmlLista = `<!-- index.html -->
<ul id="lista-posts"></ul>

<script src="scripts/main.js" defer></script>`

const responseCheck = `fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => {
    // Verificar que la respuesta fue exitosa (status 200-299)
    if (!response.ok) {
      throw new Error('Error en la petición: ' + response.status)
    }
    return response.json()
  })
  .then(data => console.log(data))
  .catch(error => console.error(error))`

export function ConsumoAPIsFetchLesson() {
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
            Módulo 1 · Conexión de Frontend con Backend
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Consumo de APIs con fetch
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 7 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="¿Qué es una API?">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Una API (Application Programming Interface) es como un menú de restaurante: tú haces
              un pedido y el cocinero (el servidor) te trae lo que pediste. En el mundo web, tu
              página hace una petición a un servidor y este responde con datos, normalmente en
              formato <code className="text-[#C3E41D]">JSON</code>.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              El navegador incluye una función nativa llamada <code className="text-[#C3E41D]">fetch</code> que
              te permite hacer estas peticiones directamente desde JavaScript, sin instalar nada.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                { step: '1', label: 'El navegador pide datos', desc: 'fetch("https://api.com/datos")', color: 'text-sky-400' },
                { step: '2', label: 'El servidor responde', desc: 'Devuelve un JSON con la información', color: 'text-purple-400' },
                { step: '3', label: 'Mostramos en el DOM', desc: 'JS pinta los datos en el HTML', color: 'text-[#C3E41D]' },
              ].map(({ step, label, desc, color }) => (
                <div key={step} className="bg-secondary/40 border border-border rounded-xl p-4 text-center overflow-hidden">
                  <p className={`text-2xl font-black mb-1 ${color}`}>{step}</p>
                  <p className="text-foreground font-semibold text-sm mb-1">{label}</p>
                  <code className="text-muted-foreground text-xs break-all">{desc}</code>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Tu primera petición con fetch">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vamos a usar <strong className="text-foreground">JSONPlaceholder</strong>, una API de práctica
              gratuita que devuelve datos falsos pero reales para aprender. Empieza con esto en tu
              archivo <code className="text-[#C3E41D]">main.js</code>:
            </p>
            <CodeSnippet label="scripts/main.js" code={fetchBasico} />
            <p className="text-muted-foreground leading-relaxed mb-4">
              <code className="text-[#C3E41D]">fetch()</code> devuelve una <strong className="text-foreground">Promesa</strong>.
              Una promesa es una operación que tarda un tiempo en completarse (la petición al servidor).
              Con <code className="text-[#C3E41D]">.then()</code> le dices qué hacer cuando esté lista.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">
              El primer <code className="text-[#C3E41D]">.then()</code> convierte la respuesta a JSON.
              El segundo recibe el objeto ya listo para usar:
            </p>
            <CodeSnippet label="scripts/main.js — con arrow functions" code={fetchConArrowFn} />
            <Callout type="tip">
              Abre la consola del navegador (F12 → Console) para ver el resultado del
              <code className="text-[#C3E41D]"> console.log(data)</code>. Verás un objeto con{' '}
              <code className="text-[#C3E41D]">id</code>, <code className="text-[#C3E41D]">title</code>,{' '}
              <code className="text-[#C3E41D]">body</code> y <code className="text-[#C3E41D]">userId</code>.
            </Callout>
          </Section>

          <Section title="Mostrar los datos en la página">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Obtener datos en la consola es útil para aprender, pero el objetivo real es mostrarlos
              en el HTML. Primero prepara el HTML con elementos que tengan IDs:
            </p>
            <CodeSnippet label="index.html" language="html" code={htmlContenedor} />
            <p className="text-muted-foreground leading-relaxed mb-2">
              Luego en tu JS, busca esos elementos y asígnales el contenido:
            </p>
            <CodeSnippet label="scripts/main.js" code={fetchMostrarDOM} />
            <Callout type="tip">
              <code className="text-[#C3E41D]">textContent</code> es más seguro que{' '}
              <code className="text-[#C3E41D]">innerHTML</code> cuando los datos vienen de una API externa,
              porque no interpreta HTML y evita ataques de inyección.
            </Callout>
          </Section>

          <Section title="Mostrar una lista de resultados">
            <p className="text-muted-foreground leading-relaxed mb-4">
              La mayoría de APIs devuelven un arreglo de objetos. Para mostrarlos todos, usamos
              <code className="text-[#C3E41D]"> forEach</code> para recorrer el arreglo y
              <code className="text-[#C3E41D]"> createElement</code> para crear un elemento por cada uno:
            </p>
            <CodeSnippet label="index.html" language="html" code={htmlLista} />
            <CodeSnippet label="scripts/main.js" code={fetchLista} />
          </Section>

          <Section title="Verificar que la respuesta fue exitosa">
            <p className="text-muted-foreground leading-relaxed mb-4">
              <code className="text-[#C3E41D]">fetch()</code> no lanza un error automáticamente si el
              servidor responde con un código de error como <code className="text-[#C3E41D]">404</code> o{' '}
              <code className="text-[#C3E41D]">500</code>. Para detectarlo, debes revisar{' '}
              <code className="text-[#C3E41D]">response.ok</code> que es <code className="text-[#C3E41D]">true</code> solo
              cuando el status es 200–299:
            </p>
            <CodeSnippet label="scripts/main.js" code={responseCheck} />
            <Callout type="warning">
              Siempre verifica <code className="text-yellow-300">response.ok</code> antes de llamar a{' '}
              <code className="text-yellow-300">response.json()</code>. Si el servidor devuelve un error
              en formato HTML (como una página 404), intentar parsearlo como JSON lanzará un error
              confuso.
            </Callout>
          </Section>

          <Section title="Resumen">
            <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed list-none">
              {[
                'fetch() hace peticiones HTTP desde el navegador, sin necesitar librerías externas.',
                'Devuelve una Promesa: usa .then() para trabajar con la respuesta cuando esté lista.',
                'Convierte la respuesta a JSON con response.json() antes de usarla.',
                'Usa document.getElementById() y textContent para mostrar los datos en el HTML.',
                'Verifica siempre response.ok para detectar respuestas con error del servidor.',
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
            onClick={() => navigate('/blog/conexion-frontend-backend')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulos
          </button>

          <button
            onClick={() => navigate('/blog/conexion-frontend-backend/async-await')}
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
