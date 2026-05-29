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

const metodosTabla = [
  { method: 'GET',    color: 'text-sky-400',    badge: 'bg-sky-400/10 text-sky-400',    desc: 'Obtener datos del servidor. Es el que usamos con fetch() por defecto.' },
  { method: 'POST',   color: 'text-green-400',  badge: 'bg-green-400/10 text-green-400',  desc: 'Enviar datos nuevos para crear un recurso (ej: registrar un usuario).' },
  { method: 'PUT',    color: 'text-yellow-400', badge: 'bg-yellow-400/10 text-yellow-400', desc: 'Reemplazar un recurso existente completo (ej: editar un perfil entero).' },
  { method: 'DELETE', color: 'text-red-400',    badge: 'bg-red-400/10 text-red-400',    desc: 'Eliminar un recurso del servidor (ej: borrar un comentario).' },
]

const postEjemplo = `async function crearPost() {
  const nuevoPost = {
    title:  'Mi primer post',
    body:   'Este es el contenido del post.',
    userId: 1,
  }

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(nuevoPost),
    })

    if (!response.ok) throw new Error('Error: ' + response.status)

    const data = await response.json()
    console.log('Post creado:', data)
    // { id: 101, title: 'Mi primer post', ... }

  } catch (error) {
    console.error(error)
  }
}

crearPost()`

const putEjemplo = `async function actualizarPost(id) {
  const postActualizado = {
    title:  'Título editado',
    body:   'Contenido actualizado.',
    userId: 1,
  }

  try {
    const response = await fetch(\`https://jsonplaceholder.typicode.com/posts/\${id}\`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(postActualizado),
    })

    if (!response.ok) throw new Error('Error: ' + response.status)

    const data = await response.json()
    console.log('Post actualizado:', data)

  } catch (error) {
    console.error(error)
  }
}

actualizarPost(1)`

const deleteEjemplo = `async function eliminarPost(id) {
  try {
    const response = await fetch(\`https://jsonplaceholder.typicode.com/posts/\${id}\`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Error: ' + response.status)

    console.log('Post eliminado correctamente')

  } catch (error) {
    console.error(error)
  }
}

eliminarPost(1)`

const formularioCompleto = `// index.html
// <form id="form-post">
//   <input type="text" id="titulo"    placeholder="Título"    required />
//   <textarea        id="contenido"  placeholder="Contenido" required></textarea>
//   <button type="submit">Publicar</button>
// </form>
// <p id="mensaje"></p>

// scripts/main.js
const form    = document.getElementById('form-post')
const mensaje = document.getElementById('mensaje')

form.addEventListener('submit', async function(event) {
  event.preventDefault() // evita que la página se recargue

  const titulo    = document.getElementById('titulo').value
  const contenido = document.getElementById('contenido').value

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titulo, body: contenido, userId: 1 }),
    })

    if (!response.ok) throw new Error('Error al publicar')

    const data = await response.json()
    mensaje.textContent = 'Post publicado con ID: ' + data.id
    form.reset()

  } catch (error) {
    mensaje.textContent = 'Ocurrió un error: ' + error.message
  }
})`

export function PostPutDeleteLesson() {
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
            Módulo 3 · Conexión de Frontend con Backend
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Enviar datos: POST, PUT y DELETE
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 8 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="Los métodos HTTP">
            <p className="text-muted-foreground leading-relaxed mb-6">
              Hasta ahora solo obtuvimos datos con <code className="text-[#C3E41D]">GET</code>. Pero
              las APIs también permiten crear, modificar y eliminar. Cada acción tiene su propio
              método HTTP:
            </p>
            <div className="flex flex-col gap-3">
              {metodosTabla.map(({ method, badge, desc }) => (
                <div key={method} className="flex items-start gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-4">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-md font-mono shrink-0 mt-0.5 ${badge}`}>
                    {method}
                  </span>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="POST — crear un recurso">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Para enviar datos al servidor necesitas tres cosas dentro del segundo argumento de
              <code className="text-[#C3E41D]"> fetch()</code>:
            </p>
            <div className="flex flex-col gap-3 mb-6">
              {[
                { key: 'method', val: '"POST"', desc: 'Le dice al servidor qué tipo de operación quieres hacer.' },
                { key: 'headers', val: '{ "Content-Type": "application/json" }', desc: 'Le avisa al servidor que estás enviando datos en formato JSON.' },
                { key: 'body', val: 'JSON.stringify(objeto)', desc: 'Los datos que envías, convertidos a texto JSON.' },
              ].map(({ key, val, desc }) => (
                <div key={key} className="flex gap-4 bg-secondary/40 border border-border rounded-xl px-5 py-4">
                  <code className="text-[#C3E41D] text-sm font-bold shrink-0">{key}</code>
                  <div>
                    <code className="text-zinc-400 text-xs block mb-1">{val}</code>
                    <p className="text-muted-foreground text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <CodeSnippet label="scripts/main.js" code={postEjemplo} />
            <Callout type="tip">
              <code className="text-[#C3E41D]">JSON.stringify()</code> convierte un objeto de JavaScript
              a texto JSON para poder enviarlo. Es el proceso inverso de{' '}
              <code className="text-[#C3E41D]">response.json()</code> que convierte el texto recibido
              de vuelta a objeto.
            </Callout>
          </Section>

          <Section title="PUT — actualizar un recurso">
            <p className="text-muted-foreground leading-relaxed mb-4">
              PUT funciona igual que POST pero la URL incluye el ID del recurso que quieres
              modificar, y el servidor reemplaza ese recurso completo con los datos que envías:
            </p>
            <CodeSnippet label="scripts/main.js" code={putEjemplo} />
            <Callout type="warning">
              Con PUT envías el objeto <strong className="text-foreground">completo</strong>, no solo
              el campo que cambia. Si solo quieres modificar un campo, existe el método{' '}
              <code className="text-yellow-300">PATCH</code>, aunque no todos los backends lo implementan.
            </Callout>
          </Section>

          <Section title="DELETE — eliminar un recurso">
            <p className="text-muted-foreground leading-relaxed mb-4">
              DELETE es el más simple: solo necesita el método y la URL con el ID. No se envía
              body porque no hay datos que mandar, solo la intención de eliminar:
            </p>
            <CodeSnippet label="scripts/main.js" code={deleteEjemplo} />
          </Section>

          <Section title="Ejemplo real: formulario con POST">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Aquí está el flujo completo que usarás en proyectos reales: un formulario HTML que
              al enviarse hace un POST con los datos y muestra el resultado en la página:
            </p>
            <CodeSnippet label="scripts/main.js" code={formularioCompleto} />
            <Callout type="tip">
              <code className="text-[#C3E41D]">event.preventDefault()</code> es clave: sin él,
              el formulario recarga la página al enviarse, lo que cancela la petición fetch antes
              de que termine.
            </Callout>
          </Section>

          <Section title="Resumen">
            <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed list-none">
              {[
                'GET obtiene datos, POST crea, PUT actualiza y DELETE elimina.',
                'Para POST y PUT necesitas method, headers con Content-Type y body con JSON.stringify().',
                'Para DELETE solo necesitas el method y la URL con el ID del recurso.',
                'Siempre verifica response.ok para saber si la operación fue exitosa.',
                'En formularios usa event.preventDefault() para evitar que la página se recargue.',
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
            onClick={() => navigate('/blog/conexion-frontend-backend/async-await')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/conexion-frontend-backend/errores-loading')}
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
