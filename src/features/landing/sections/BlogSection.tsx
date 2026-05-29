import TeamShowcase, { type TeamMember } from '@/components/ui/team-showcase'

import { blogPosts } from '@/core/data/blog-posts'

const posts: TeamMember[] = blogPosts.map((p, i) => ({
  id: String(i + 1),
  name: p.title,
  role: `${p.category}  •  ${p.tags[0].replace('#', '')}  •  ${p.readTime} MIN`,
  image: p.image,
  link: `/blog/${p.id}`,
}))

export function BlogSection() {
  return (
    <div className="w-full h-full bg-background flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14 overflow-hidden">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <p className="mb-1 font-mono text-xs tracking-widest text-[#C3E41D] uppercase">./blog</p>
          <h2 className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl md:text-5xl mb-4">Blog</h2>
          <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
            En mi blog comparto ideas, aprendizajes y consejos sobre desarrollo frontend y fullstack.
            Desde trucos de diseño y mejores prácticas de interfaz hasta experiencias personales
            resolviendo problemas reales. Todo con un enfoque práctico, claro y directo.
          </p>
        </div>

        <TeamShowcase members={posts} />
      </div>
    </div>
  )
}
