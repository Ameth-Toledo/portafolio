import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Cloud, Server, Layers, Clock } from 'lucide-react'
import { blogPosts, type ModuleIcon } from '@/core/data/blog-posts'

function ModuleIconEl({ icon }: { icon: ModuleIcon }) {
  const imgClass = 'w-8 h-8 object-contain'
  const wrapClass = 'w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0'

  const imgIcons: Partial<Record<ModuleIcon, string>> = {
    react:      '/assets/icons/react.svg',
    angular:    '/assets/icons/angular.svg',
    github:     '/assets/icons/github.svg',
    nodejs:     '/assets/icons/nodejs.svg',
    typescript: '/assets/icons/typescript.svg',
    java:       '/assets/icons/java.svg',
    env:        '/assets/icons/env.svg',
    gradle:     '/assets/icons/gradle.svg',
    pm2:        '/assets/icons/pm2.svg',
    mysql:      '/assets/icons/mysql.svg',
  }

  if (imgIcons[icon]) {
    return (
      <div className={wrapClass}>
        <img src={imgIcons[icon]} alt={icon} className={imgClass} />
      </div>
    )
  }

  const lucideIcons: Partial<Record<ModuleIcon, React.ReactNode>> = {
    aws:     <Cloud     className="w-5 h-5 text-[#FF9900]" />,
    nginx:   <Server    className="w-5 h-5 text-[#009639]" />,
    generic: <Layers    className="w-5 h-5 text-muted-foreground" />,
  }

  return <div className={wrapClass}>{lucideIcons[icon]}</div>
}

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const post = blogPosts.find(p => p.id === id)

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-foreground">
        <p className="text-xl font-semibold">Post no encontrado</p>
        <button onClick={() => navigate('/', { state: { scrollTo: '#blog' } })} className="text-sm text-muted-foreground hover:text-foreground underline">
          Volver al blog
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <div className="bg-background text-foreground px-6 pt-28 pb-12 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto flex gap-16 items-center">

          {/* Content */}
          <div className="flex-1">
            <button
              onClick={() => navigate('/', { state: { scrollTo: '#blog' } })}
              className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>

            <p className="font-mono text-xs tracking-widest text-[#C3E41D] uppercase mb-3">
              {post.category}
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6 font-poppins">
              {post.title}
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
              {post.description}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime} min de lectura
              </span>
              <span className="text-border">·</span>
              {post.tags.map(tag => (
                <span key={tag} className="border border-border text-muted-foreground text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Logo derecha */}
          <div className="hidden lg:flex shrink-0 items-center justify-center">
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="w-80 h-auto object-contain opacity-90 drop-shadow-2xl"
            />
          </div>

        </div>
      </div>

      {/* Modules */}
      <div className="px-6 sm:px-12 lg:px-24 py-14">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-black tracking-tight mb-8 text-foreground font-poppins">Módulos 💡🚀</h2>

        <div className="flex flex-col gap-3">
          {post.modules.map((mod, i) => (
            <div key={i} className="flex items-center gap-4 bg-secondary/50 border border-border text-foreground rounded-2xl px-5 py-4">
              <ModuleIconEl icon={mod.icon} />
              <span className="flex-1 text-sm font-medium font-poppins">{mod.title}</span>
              {mod.link ? (
                <button
                  onClick={() => mod.link!.startsWith('/') ? navigate(mod.link!) : window.open(mod.link, '_blank')}
                  className="shrink-0 flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> Seguir
                </button>
              ) : (
                <span className="shrink-0 flex items-center gap-2 bg-[#22c55e] text-white text-xs font-bold px-4 py-2 rounded-xl">
                  <ArrowRight className="w-3.5 h-3.5" /> Seguir
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>

    </div>
  )
}
