import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lightbulb, AlertTriangle } from 'lucide-react'
import { Tree, Folder, File, type TreeViewElement } from '@/components/magicui/file-tree'

const fileTree: TreeViewElement[] = [
  {
    id: 'mi-proyecto',
    name: 'mi-proyecto/',
    children: [
      {
        id: 'assets',
        name: 'assets/',
        children: [
          { id: 'images', name: 'images/', children: [] },
          { id: 'fonts', name: 'fonts/', children: [] },
          { id: 'icons', name: 'icons/', children: [] },
        ],
      },
      {
        id: 'css',
        name: 'css/',
        children: [
          { id: 'main-css', name: 'main.css' },
          { id: 'components-css', name: 'components.css' },
          { id: 'variables-css', name: 'variables.css' },
        ],
      },
      {
        id: 'scripts',
        name: 'scripts/',
        children: [
          { id: 'main-js', name: 'main.js' },
          { id: 'api-js', name: 'api.js' },
          { id: 'helpers-js', name: 'helpers.js' },
        ],
      },
      {
        id: 'pages',
        name: 'pages/',
        children: [
          { id: 'about-html', name: 'about.html' },
          { id: 'contact-html', name: 'contact.html' },
        ],
      },
      { id: 'index-html', name: 'index.html' },
    ],
  },
]

function Callout({ type, children }: { type: 'tip' | 'warning'; children: React.ReactNode }) {
  const isTip = type === 'tip'
  return (
    <div className={`flex gap-3 rounded-xl border p-4 my-6 ${
      isTip
        ? 'border-[#C3E41D]/30 bg-[#C3E41D]/5 text-[#C3E41D]'
        : 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400'
    }`}>
      {isTip
        ? <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
        : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
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

export function EstructuraCarpetasLesson() {
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
            Módulo 1 · Arquitectura Frontend Limpia
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
            Estructura de carpetas y separación de responsabilidades
          </h1>
          <p className="mt-4 text-muted-foreground text-sm">Lectura de 5 min</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-5xl mx-auto prose-invert">

          <Section title="¿Por qué importa la estructura de carpetas?">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cuando iniciamos un nuevo proyecto es importante usar una buena arquitectura de carpetas.
              Al principio puede parecer que no importa dónde guardas cada archivo, pero conforme el
              proyecto crece te darás cuenta de que encontrar el archivo correcto se vuelve cada vez
              más difícil si no hay un orden claro.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Una buena estructura te ayuda a saber exactamente dónde vive cada cosa: los estilos en
              un lugar, los scripts en otro, las imágenes en otro. Esto también facilita que otra
              persona pueda entrar a tu proyecto y entenderlo rápidamente sin que se lo tengas que
              explicar todo.
            </p>
            <Callout type="tip">
              Una regla simple: si tienes que pensar más de 5 segundos en dónde guardar un archivo
              nuevo, tu estructura de carpetas probablemente necesita mejorar.
            </Callout>
          </Section>

          <Section title="Estructura recomendada para HTML, CSS y JS">
            <p className="text-muted-foreground leading-relaxed mb-6">
              Esta es una organización limpia y práctica para proyectos con HTML, CSS y JavaScript puro,
              sin ningún framework. Cada carpeta tiene una responsabilidad clara:
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <Tree
                className="text-foreground text-sm"
                initialExpendedItems={['mi-proyecto', 'assets', 'css', 'scripts', 'pages']}
                elements={fileTree}
              >
                <Folder element="mi-proyecto/" value="mi-proyecto">
                  <Folder element="assets/" value="assets">
                    <Folder element="images/" value="images" />
                    <Folder element="fonts/" value="fonts" />
                    <Folder element="icons/" value="icons" />
                  </Folder>
                  <Folder element="css/" value="css">
                    <File value="main-css">main.css</File>
                    <File value="components-css">components.css</File>
                    <File value="variables-css">variables.css</File>
                  </Folder>
                  <Folder element="scripts/" value="scripts">
                    <File value="main-js">main.js</File>
                    <File value="api-js">api.js</File>
                    <File value="helpers-js">helpers.js</File>
                  </Folder>
                  <Folder element="pages/" value="pages">
                    <File value="about-html">about.html</File>
                    <File value="contact-html">contact.html</File>
                  </Folder>
                  <File value="index-html">index.html</File>
                </Folder>
              </Tree>
            </div>

            <Callout type="warning">
              No pongas todos los archivos en la raíz del proyecto. Tener <code className="text-[#C3E41D]">index.html</code>,{' '}
              <code className="text-[#C3E41D]">styles.css</code> y <code className="text-[#C3E41D]">script.js</code> juntos
              está bien para un ejercicio de una clase, pero en un proyecto real se vuelve un caos muy rápido.
            </Callout>
          </Section>

          <Section title="¿Qué va en cada carpeta?">
            <div className="flex flex-col gap-5">
              {[
                {
                  folder: 'assets/',
                  color: 'text-sky-400',
                  desc: 'Todos los recursos estáticos del proyecto: imágenes, íconos, fuentes tipográficas. Sepáralos en subcarpetas para mantener el orden.',
                },
                {
                  folder: 'css/',
                  color: 'text-pink-400',
                  desc: 'Los estilos separados en archivos con propósito específico. main.css importa a los demás, variables.css define colores y tamaños globales, components.css agrupa los estilos de cada componente visual (botones, tarjetas, navbar, etc.).',
                },
                {
                  folder: 'scripts/',
                  color: 'text-yellow-400',
                  desc: 'Los archivos JavaScript del proyecto. main.js es el punto de entrada, api.js maneja las peticiones a servicios externos, y helpers.js contiene funciones pequeñas y reutilizables que no encajan en otro lado.',
                },
                {
                  folder: 'pages/',
                  color: 'text-green-400',
                  desc: 'Los archivos HTML de páginas secundarias como "Acerca de" o "Contacto". El archivo index.html vive en la raíz porque es el punto de entrada principal del sitio.',
                },
              ].map(({ folder, color, desc }) => (
                <div key={folder} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                  <code className={`text-sm font-bold shrink-0 ${color}`}>{folder}</code>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Separación de responsabilidades">
            <p className="text-muted-foreground leading-relaxed mb-4">
              La "separación de responsabilidades" es un principio muy simple: cada archivo debe hacer
              una sola cosa y hacerla bien. El HTML define la estructura, el CSS controla el estilo y
              el JS maneja el comportamiento. Mezclarlos en el mismo archivo genera código difícil de
              leer y de mantener.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Un ejemplo claro: si quieres cambiar el color de un botón, deberías ir solo al archivo
              de CSS. Si tienes estilos mezclados entre el HTML y el CSS, tendrás que buscar en dos
              lugares distintos para hacer un solo cambio.
            </p>
            <Callout type="tip">
              Evita usar el atributo <code className="text-[#C3E41D]">style=""</code> directamente en el HTML y evita
              poner etiquetas <code className="text-[#C3E41D]">&lt;style&gt;</code> o <code className="text-[#C3E41D]">&lt;script&gt;</code> dentro
              de los archivos HTML cuando ya tienes archivos externos dedicados para eso.
            </Callout>
          </Section>

          <Section title="Resumen">
            <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed list-none">
              {[
                'Organiza tu proyecto desde el inicio, no esperes a que crezca para ordenarlo.',
                'Usa carpetas con nombres claros: css/, scripts/, assets/, pages/.',
                'Cada archivo debe tener un propósito específico.',
                'Mantén el HTML, CSS y JS en archivos separados.',
                'Una estructura limpia hace tu proyecto más fácil de entender y de mantener.',
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
            onClick={() => navigate('/blog/arquitectura-frontend-limpia')}
            className="flex items-center gap-2 border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground text-sm font-medium px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Módulos
          </button>

          <button
            onClick={() => navigate('/blog/arquitectura-frontend-limpia/convenciones-nomenclatura')}
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
