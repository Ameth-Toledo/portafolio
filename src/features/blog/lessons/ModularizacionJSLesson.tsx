import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lightbulb, AlertTriangle, Copy, Check } from 'lucide-react'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/ui/code-block'
import { Tree, Folder, File } from '@/components/magicui/file-tree'

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
      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
    </button>
  )
}

function CodeSnippet({ label, language = 'javascript', code }: { label: string; language?: string; code: string }) {
  return (
    <div className="my-4">
      <CodeBlock>
        <CodeBlockGroup className="border-b border-border py-2 pr-2 pl-4">
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
        <p className="text-xs font-bold text-red-400 mb-2 uppercase tracking-widest">✗ Evitar</p>
        <CodeBlock className="border-red-500/40">
          {badLabel && (
            <CodeBlockGroup className="border-b border-red-500/10 py-2 pr-2 pl-4">
              <span className="text-zinc-500 text-xs font-mono">{badLabel}</span>
            </CodeBlockGroup>
          )}
          <CodeBlockCode code={badCode} language={language} theme="github-dark" />
        </CodeBlock>
      </div>
      <div>
        <p className="text-xs font-bold text-[#C3E41D] mb-2 uppercase tracking-widest">✓ Preferir</p>
        <CodeBlock className="border-[#C3E41D]/40">
          {goodLabel && (
            <CodeBlockGroup className="border-b border-[#C3E41D]/10 py-2 pr-2 pl-4">
              <span className="text-zinc-500 text-xs font-mono">{goodLabel}</span>
            </CodeBlockGroup>
          )}
          <CodeBlockCode code={goodCode} language={language} theme="github-dark" />
        </CodeBlock>
      </div>
    </div>
  )
}

/* ── Código de los ejemplos ── */

const sinModulos = `// script.js — todo junto, 200+ líneas
function calcularTotal(items) { /* ... */ }
function renderizarCarrito(items) { /* ... */ }
function guardarEnStorage(data) { /* ... */ }
function fetchProductos(url) { /* ... */ }
function mostrarError(msg) { /* ... */ }
// ... y así sigue`

const conModulos = `// Cada archivo hace una sola cosa
// carrito.js  → lógica del carrito
// storage.js  → guardar en localStorage
// api.js      → peticiones al servidor
// ui.js       → actualizar el DOM`

const helpersSinExport = `// helpers.js
function formatearPrecio(precio) {
  return '$' + precio.toFixed(2)
}

function calcularDescuento(precio, pct) {
  return precio - (precio * pct / 100)
}`

const helpersConExport = `// helpers.js
export function formatearPrecio(precio) {
  return '$' + precio.toFixed(2)
}

export function calcularDescuento(precio, pct) {
  return precio - (precio * pct / 100)
}`

const importNombrado = `// main.js
import { formatearPrecio, calcularDescuento } from './helpers.js'

const precio = calcularDescuento(100, 10)
console.log(formatearPrecio(precio)) // $90.00`

const exportDefault = `// carrito.js
export default class Carrito {
  constructor() {
    this.items = []
  }

  agregar(producto) {
    this.items.push(producto)
  }

  total() {
    return this.items.reduce((sum, p) => sum + p.precio, 0)
  }
}`

const importDefault = `// main.js
import Carrito from './carrito.js'

const miCarrito = new Carrito()
miCarrito.agregar({ nombre: 'Libro', precio: 150 })
console.log(miCarrito.total()) // 150`

const htmlModuleScript = `<!-- index.html -->
<!-- Agrega type="module" para que funcionen los imports -->
<script type="module" src="scripts/main.js"></script>`


export function ModularizacionJSLesson() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="px-6 pt-28 pb-10 sm:px-12 lg:px-24 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/blog/arquitectura-frontend-limpia')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al módulo
          </button>

          <p className="font-mono text-xs tracking-widest text-[#C3E41D] uppercase mb-2">
            Módulo 3 · Arquitectura Frontend Limpia
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Modularización con JavaScript vanilla
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 7 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="¿Qué es la modularización?">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Modularizar significa dividir tu código en archivos pequeños donde cada uno tiene
              una responsabilidad clara. En lugar de tener un solo archivo enorme con 300 líneas
              mezclando lógica, llamadas a APIs y manipulación del DOM, tienes varios archivos
              pequeños que se enfocan en una sola tarea.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              JavaScript moderno (ES6+) incluye un sistema de módulos nativo con las palabras
              clave <code className="text-[#C3E41D]">import</code> y <code className="text-[#C3E41D]">export</code>,
              lo que significa que puedes hacer esto sin necesitar ningún framework ni herramienta extra.
            </p>
            <Compare
              badLabel="script.js"
              goodLabel="scripts/"
              badCode={sinModulos}
              goodCode={conModulos}
            />
          </Section>

          <Section title="export — compartir funciones entre archivos">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Para que una función, clase o variable esté disponible en otros archivos, necesitas
              exportarla con la palabra <code className="text-[#C3E41D]">export</code> antes de su definición.
              Sin eso, todo lo que escribas en un archivo queda privado para ese archivo.
            </p>
            <Compare
              badLabel="helpers.js — sin export"
              goodLabel="helpers.js — con export"
              badCode={helpersSinExport}
              goodCode={helpersConExport}
            />
            <Callout type="tip">
              Este tipo de export se llama <strong className="text-foreground">export nombrado</strong>.
              Puedes tener varios en el mismo archivo. Cada función se exporta individualmente
              con su propio nombre.
            </Callout>
          </Section>

          <Section title="import — usar código de otro archivo">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Con <code className="text-[#C3E41D]">import</code> traes al archivo actual las funciones
              que necesitas. Usas llaves <code className="text-[#C3E41D]">{`{ }`}</code> para los exports
              nombrados y escribes la ruta relativa del archivo desde donde se importa.
            </p>
            <CodeSnippet label="main.js" code={importNombrado} />
            <Callout type="warning">
              Siempre incluye la extensión <code className="text-yellow-300">.js</code> en la ruta del
              import cuando trabajas con módulos nativos en el navegador. Sin ella, el navegador
              no encontrará el archivo.
            </Callout>
          </Section>

          <Section title="export default — exportar una sola cosa principal">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cuando un archivo tiene una sola cosa importante (como una clase o una función
              principal), puedes usar <code className="text-[#C3E41D]">export default</code>. Solo puede
              haber un <code className="text-[#C3E41D]">export default</code> por archivo.
            </p>
            <CodeSnippet label="carrito.js" code={exportDefault} />
            <p className="text-muted-foreground leading-relaxed mb-2 mt-4">
              Al importar un default, no usas llaves y puedes elegir cualquier nombre:
            </p>
            <CodeSnippet label="main.js" code={importDefault} />
          </Section>

          <Section title="Activar módulos en el HTML">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Para que el navegador entienda los módulos ES6, necesitas agregar{' '}
              <code className="text-[#C3E41D]">type="module"</code> al tag{' '}
              <code className="text-[#C3E41D]">&lt;script&gt;</code> en tu HTML.
              Solo necesitas importar el archivo de entrada (<code className="text-[#C3E41D]">main.js</code>),
              él se encarga de importar todo lo demás.
            </p>
            <CodeSnippet label="index.html" language="html" code={htmlModuleScript} />
            <Callout type="warning">
              Los módulos ES6 no funcionan si abres el HTML directamente desde el explorador de
              archivos (<code className="text-yellow-300">file://</code>). Necesitas un servidor local.
              Puedes usar la extensión <strong className="text-foreground">Live Server</strong> de VS Code
              o ejecutar <code className="text-yellow-300">npx serve .</code> en la terminal.
            </Callout>
          </Section>

          <Section title="Estructura final con módulos">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Así quedaría una carpeta <code className="text-[#C3E41D]">scripts/</code> bien organizada
              aplicando todo lo que vimos:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-2">
              <Tree
                className="text-foreground text-sm"
                initialExpendedItems={['mi-proyecto', 'scripts']}
                elements={[]}
              >
                <Folder element="mi-proyecto/" value="mi-proyecto">
                  <Folder element="scripts/" value="scripts">
                    <File value="main-js">main.js</File>
                    <File value="api-js">api.js</File>
                    <File value="carrito-js">carrito.js</File>
                    <File value="helpers-js">helpers.js</File>
                    <File value="ui-js">ui.js</File>
                  </Folder>
                  <File value="index-html">index.html</File>
                </Folder>
              </Tree>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              {[
                { file: 'main.js', color: 'text-[#C3E41D]', desc: 'Es el punto de entrada. Importa todo lo necesario y arranca la aplicación.' },
                { file: 'api.js', color: 'text-sky-400', desc: 'Contiene todas las funciones que hacen fetch a servicios externos. Nada de lógica de negocio aquí.' },
                { file: 'carrito.js', color: 'text-purple-400', desc: 'Lógica pura del carrito: agregar, eliminar, calcular total. Sin tocar el DOM.' },
                { file: 'helpers.js', color: 'text-yellow-400', desc: 'Funciones pequeñas y genéricas que se reutilizan en varios módulos.' },
                { file: 'ui.js', color: 'text-pink-400', desc: 'Todo lo que actualiza el HTML: renderizar listas, mostrar mensajes, actualizar contadores.' },
              ].map(({ file, color, desc }) => (
                <div key={file} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                  <code className={`text-sm font-bold shrink-0 ${color}`}>{file}</code>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Resumen">
            <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed list-none">
              {[
                'Divide tu código en archivos pequeños con una sola responsabilidad cada uno.',
                'Usa export para compartir funciones y clases entre archivos.',
                'Usa import para consumir lo que otros archivos exportan.',
                'export default sirve para exportar la cosa principal de un archivo.',
                'Agrega type="module" al <script> en tu HTML y usa un servidor local para probar.',
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
      <div className="px-6 sm:px-12 lg:px-24 pb-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto pt-10 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/blog/arquitectura-frontend-limpia/convenciones-nomenclatura')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/arquitectura-frontend-limpia/optimizacion-assets')}
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
