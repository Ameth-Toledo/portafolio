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
      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
    </button>
  )
}

function CodeSnippet({ label, language = 'html', code }: { label: string; language?: string; code: string }) {
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

function Compare({ badLabel, goodLabel, badCode, goodCode, language = 'html' }: {
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

const bemHtml = `<div class="tarjeta tarjeta--destacada">
  <img    class="tarjeta__imagen" src="foto.jpg" alt="Producto" />
  <h2    class="tarjeta__titulo">Nombre del producto</h2>
  <p     class="tarjeta__precio">$299</p>
  <button class="tarjeta__boton tarjeta__boton--comprar">
    Agregar al carrito
  </button>
</div>`

const bemCss = `.tarjeta { border: 1px solid #ddd; border-radius: 8px; }
.tarjeta--destacada { border-color: gold; box-shadow: 0 4px 12px rgba(0,0,0,.2); }

.tarjeta__imagen { width: 100%; }
.tarjeta__titulo { font-size: 1.2rem; font-weight: bold; }
.tarjeta__precio { color: #555; }

.tarjeta__boton { padding: 8px 16px; cursor: pointer; }
.tarjeta__boton--comprar { background: #22c55e; color: white; }`

const badHtml = `<!-- ID para estilos, nombre sin sentido -->
<div id="caja1" style="color: red;">
  Error al guardar
</div>`

const goodHtml = `<!-- Clase descriptiva, sin estilos inline -->
<div class="mensaje-error">
  Error al guardar
</div>`

const badCss = `.btn{background:green;color:white;padding:8px 16px;border:none;font-size:14px;cursor:pointer;border-radius:4px}`

const goodCss = `.btn {
  /* Posición y caja */
  display: inline-flex;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;

  /* Tipografía */
  font-size: 14px;
  color: white;

  /* Visual */
  background: green;
  cursor: pointer;
}`

export function ConvencionesNomenclaturaLesson() {
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
            Módulo 2 · Arquitectura Frontend Limpia
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Convenciones de nomenclatura en HTML y CSS
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 6 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="¿Por qué importan los nombres?">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cuando escribes HTML y CSS, los nombres que eliges para tus clases e IDs son tan
              importantes como el código en sí. Un nombre malo como <code className="text-[#C3E41D]">.div1</code> o{' '}
              <code className="text-[#C3E41D]">.rojo</code> no dice nada sobre lo que hace ese elemento.
              Un nombre claro como <code className="text-[#C3E41D]">.tarjeta-producto</code> o{' '}
              <code className="text-[#C3E41D]">.btn-primario</code> se explica solo.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Seguir convenciones de nomenclatura te ayuda a mantener el CSS ordenado, a evitar
              conflictos entre estilos y a que cualquier persona (incluyendo tú mismo en el futuro)
              pueda entender el código sin tener que leerlo todo.
            </p>
            <Callout type="tip">
              Nombra las cosas por lo que <strong className="text-foreground">son</strong>, no por cómo se ven.
              <code className="text-[#C3E41D]"> .texto-rojo</code> es frágil: si cambias el color a azul,
              el nombre ya no tiene sentido. <code className="text-[#C3E41D]">.mensaje-error</code> siempre
              tendrá sentido sin importar el color.
            </Callout>
          </Section>

          <Section title="Reglas básicas de nomenclatura">
            <div className="flex flex-col gap-4 mb-6">
              {[
                { rule: 'Usa kebab-case', desc: 'Separa las palabras con guión medio. Es el estándar en HTML y CSS.', example: '.menu-principal, .tarjeta-usuario' },
                { rule: 'Nombres en minúsculas', desc: 'Evita mayúsculas en clases e IDs. HTML no distingue mayúsculas en atributos, pero CSS sí.', example: '.nav-bar  ✓   .NavBar  ✗' },
                { rule: 'Nombres descriptivos', desc: 'El nombre debe decir qué representa el elemento, no cómo se ve o dónde está.', example: '.lista-productos  ✓   .div-izquierda  ✗' },
                { rule: 'Sin espacios ni caracteres especiales', desc: 'Solo letras, números y guiones. Nada de acentos ni caracteres raros.', example: '.seccion-inicio  ✓   .sección-1  ✗' },
              ].map(({ rule, desc, example }) => (
                <div key={rule} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                  <p className="text-foreground font-semibold text-sm mb-1">{rule}</p>
                  <p className="text-muted-foreground text-sm mb-2">{desc}</p>
                  <code className="text-[#C3E41D] text-xs font-mono">{example}</code>
                </div>
              ))}
            </div>
          </Section>

          <Section title="IDs vs Clases">
            <p className="text-muted-foreground leading-relaxed mb-4">
              En HTML tienes dos formas de identificar elementos: el atributo <code className="text-[#C3E41D]">id</code> y
              el atributo <code className="text-[#C3E41D]">class</code>. Tienen propósitos distintos y es importante
              no confundirlos.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-foreground font-bold text-sm mb-2">id=""</p>
                <ul className="text-muted-foreground text-sm space-y-1.5">
                  <li>• Único por página (no repetir)</li>
                  <li>• Para anclas de navegación</li>
                  <li>• Para formularios (<code className="text-foreground/80">label for</code>)</li>
                  <li>• Evitar usarlo para estilos CSS</li>
                </ul>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-foreground font-bold text-sm mb-2">class=""</p>
                <ul className="text-muted-foreground text-sm space-y-1.5">
                  <li>• Se puede repetir en varios elementos</li>
                  <li>• Para aplicar estilos CSS</li>
                  <li>• Un elemento puede tener varias clases</li>
                  <li>• Es la forma correcta de estilizar</li>
                </ul>
              </div>
            </div>

            <Compare badCode={badHtml} goodCode={goodHtml} language="html" />
          </Section>

          <Section title="Metodología BEM">
            <p className="text-muted-foreground leading-relaxed mb-4">
              BEM (Block, Element, Modifier) es una convención muy usada para nombrar clases en CSS.
              Te da un sistema claro para saber qué representa cada clase con solo leer su nombre.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { term: 'Block', symbol: '.bloque', color: 'text-sky-400', desc: 'El componente principal. Es independiente y tiene sentido por sí solo.', ex: '.tarjeta, .menu, .formulario' },
                { term: 'Element', symbol: '.bloque__elemento', color: 'text-purple-400', desc: 'Una parte del bloque. No tiene sentido sin su bloque padre.', ex: '.tarjeta__titulo, .menu__item' },
                { term: 'Modifier', symbol: '.bloque--modificador', color: 'text-[#C3E41D]', desc: 'Una variación del bloque o elemento. Cambia su apariencia o estado.', ex: '.tarjeta--destacada, .btn--grande' },
              ].map(({ term, symbol, color, desc, ex }) => (
                <div key={term} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className={`font-bold text-sm mb-1 ${color}`}>{term}</p>
                  <code className="text-xs text-muted-foreground font-mono block mb-2">{symbol}</code>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-2">{desc}</p>
                  <code className="text-xs text-muted-foreground font-mono">{ex}</code>
                </div>
              ))}
            </div>

            <CodeSnippet label="index.html" language="html" code={bemHtml} />
            <CodeSnippet label="components.css" language="css" code={bemCss} />

            <Callout type="tip">
              No tienes que usar BEM en todos tus proyectos, pero sí en los que tengan varias páginas
              o muchos componentes reutilizables. Para proyectos pequeños, con tener nombres claros
              y consistentes es suficiente.
            </Callout>
          </Section>

          <Section title="Convenciones en CSS">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Además de los nombres de las clases, hay otras convenciones importantes dentro de los
              archivos CSS que hacen el código más fácil de leer.
            </p>
            <Compare badCode={badCss} goodCode={goodCss} language="css" />
            <Callout type="warning">
              Evita usar <code className="text-yellow-300">!important</code> para forzar estilos. Si lo necesitas
              con frecuencia, es una señal de que tus clases no están bien organizadas y hay conflictos
              de especificidad.
            </Callout>
          </Section>

          <Section title="Resumen">
            <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed list-none">
              {[
                'Usa kebab-case para nombres de clases e IDs (palabras separadas con guión medio).',
                'Nombra por lo que el elemento representa, no por cómo se ve.',
                'Reserva los IDs para anclas y formularios; usa clases para los estilos.',
                'BEM te da un sistema claro: bloque, bloque__elemento, bloque--modificador.',
                'Escribe CSS legible: una propiedad por línea, propiedades agrupadas por categoría.',
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
            onClick={() => navigate('/blog/arquitectura-frontend-limpia/estructura-carpetas')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/arquitectura-frontend-limpia/modularizacion-js')}
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
