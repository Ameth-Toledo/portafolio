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

/* ── Ejemplos de código ── */

const scriptsBad = `<!-- Se bloquea el HTML hasta que carga el script -->
<head>
  <script src="scripts/main.js"></script>
</head>
<body>
  <h1>Mi página</h1>
</body>`

const scriptsGood = `<!-- defer: carga en paralelo, ejecuta al final -->
<head>
  <link rel="stylesheet" href="css/main.css" />
</head>
<body>
  <h1>Mi página</h1>
  <script src="scripts/main.js" defer></script>
</body>`

const imgBad = `<!-- Sin dimensiones ni lazy loading -->
<img src="assets/images/hero.png" alt="Hero" />`

const imgGood = `<!-- Con dimensiones, lazy loading y formato moderno -->
<picture>
  <source srcset="assets/images/hero.webp" type="image/webp" />
  <img
    src="assets/images/hero.jpg"
    alt="Hero"
    width="1200"
    height="600"
    loading="lazy"
  />
</picture>`

const cssBad = `/* main.css — todo junto sin organizar */
.header { background: #000; color: #fff; padding: 20px; display: flex; align-items: center; justify-content: space-between; }
.nav { display: flex; gap: 16px; list-style: none; }
.nav a { color: #fff; text-decoration: none; font-size: 14px; }
/* ... 400 líneas más ... */`

const cssGood = `/* main.css — solo importa los demás */
@import './variables.css';
@import './components.css';

/* variables.css */
:root {
  --color-bg: #000;
  --color-text: #fff;
  --spacing-md: 20px;
}

/* components.css */
.header {
  background: var(--color-bg);
  color: var(--color-text);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
}`

const fontOptimized = `<!-- Solo cargar los pesos que realmente usas -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
  rel="stylesheet"
/>`

export function OptimizacionAssetsLesson() {
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
            Módulo 4 · Arquitectura Frontend Limpia
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Optimización de assets y rendimiento
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 6 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto">

          <Section title="¿Por qué optimizar?">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Un sitio web lento pierde usuarios. Estudios muestran que si una página tarda más de
              3 segundos en cargar, más del 50% de las personas la abandona. Y no hace falta un
              proyecto enorme para que esto pase: una imagen sin comprimir o un script mal colocado
              pueden hacer que tu página se sienta pesada.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              La buena noticia es que hay optimizaciones muy simples que hacen una diferencia enorme
              y no requieren ninguna herramienta especial, solo buenas prácticas desde el principio.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                { metric: 'Imágenes', pct: '~60%', desc: 'del peso total de una página en promedio', color: 'text-sky-400' },
                { metric: 'Scripts bloqueantes', pct: '+2s', desc: 'de retraso si el JS está mal colocado', color: 'text-red-400' },
                { metric: 'CSS no usado', pct: '~70%', desc: 'del CSS escrito nunca se aplica en muchos proyectos', color: 'text-yellow-400' },
              ].map(({ metric, pct, desc, color }) => (
                <div key={metric} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className={`text-2xl font-black mb-1 ${color}`}>{pct}</p>
                  <p className="text-foreground font-semibold text-sm mb-1">{metric}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Scripts: defer y async">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Por defecto, cuando el navegador encuentra un tag <code className="text-[#C3E41D]">&lt;script&gt;</code> en
              el HTML, detiene todo y espera a que el archivo JS se descargue y ejecute antes de continuar.
              Esto retrasa la carga visible de la página.
            </p>
            <Compare badCode={scriptsBad} goodCode={scriptsGood} language="html" />
            <div className="flex flex-col gap-3 mt-4">
              {[
                { attr: 'defer', color: 'text-[#C3E41D]', desc: 'Descarga el JS en paralelo mientras lee el HTML. Lo ejecuta cuando el HTML termina de parsear. Ideal para la mayoría de scripts.' },
                { attr: 'async', color: 'text-sky-400', desc: 'Descarga y ejecuta en cuanto está listo, sin esperar al HTML. Útil solo para scripts independientes como analytics.' },
              ].map(({ attr, color, desc }) => (
                <div key={attr} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                  <code className={`text-sm font-bold shrink-0 ${color}`}>{attr}</code>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Imágenes: el mayor culpable">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Las imágenes son casi siempre el recurso más pesado de una página. Tres cambios simples
              pueden reducir drásticamente el tiempo de carga:
            </p>
            <div className="flex flex-col gap-3 mb-6">
              {[
                { title: 'Usa WebP en lugar de PNG o JPG', desc: 'WebP ofrece la misma calidad visual con un tamaño hasta 30% menor. Todos los navegadores modernos lo soportan.' },
                { title: 'Agrega width y height', desc: 'Declarar las dimensiones evita el "layout shift": el salto visual que ocurre cuando la imagen carga y empuja el contenido.' },
                { title: 'Usa loading="lazy"', desc: 'Las imágenes fuera de pantalla no se descargan hasta que el usuario llega a ellas. No lo uses en la imagen principal (hero).' },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                  <p className="text-foreground font-semibold text-sm mb-1">{title}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <Compare badCode={imgBad} goodCode={imgGood} language="html" />
            <Callout type="tip">
              Para convertir imágenes a WebP sin instalar nada puedes usar{' '}
              <strong className="text-foreground">Squoosh</strong> (squoosh.app) directamente en el
              navegador. Es gratis y muy fácil de usar.
            </Callout>
          </Section>

          <Section title="CSS: variables y archivos separados">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Tener todo el CSS en un solo archivo gigante hace difícil encontrar y cambiar estilos.
              Separarlo en archivos con propósito claro y usar variables CSS elimina la repetición
              y hace los cambios globales mucho más fáciles.
            </p>
            <Compare badCode={cssBad} goodCode={cssGood} language="css" />
            <Callout type="warning">
              El <code className="text-yellow-300">@import</code> de CSS hace peticiones adicionales al
              servidor. En producción lo ideal es combinar los archivos en uno solo. Herramientas
              como Vite o Parcel hacen esto automáticamente cuando compilas el proyecto.
            </Callout>
          </Section>

          <Section title="Fuentes: cargar solo lo necesario">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cargar una fuente de Google Fonts con todos sus pesos puede agregar cientos de
              kilobytes innecesarios. Especifica solo los pesos que realmente usas en tu diseño.
            </p>
            <CodeSnippet label="index.html" language="html" code={fontOptimized} />
            <Callout type="tip">
              El atributo <code className="text-[#C3E41D]">display=swap</code> hace que el texto sea
              visible de inmediato con una fuente del sistema mientras carga la fuente personalizada,
              en lugar de mostrar una pantalla en blanco.
            </Callout>
          </Section>

          <Section title="Resumen">
            <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed list-none">
              {[
                'Coloca los scripts al final del body o usa el atributo defer para no bloquear el HTML.',
                'Convierte tus imágenes a WebP, declara width y height, y usa loading="lazy".',
                'Organiza el CSS con variables y archivos separados por responsabilidad.',
                'Carga solo los pesos de fuente que realmente necesitas.',
                'En producción, combina y minifica tus archivos CSS y JS para reducir el número de peticiones.',
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
            onClick={() => navigate('/blog/arquitectura-frontend-limpia/modularizacion-js')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulo anterior
          </button>

          <button
            onClick={() => navigate('/blog/arquitectura-frontend-limpia')}
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
