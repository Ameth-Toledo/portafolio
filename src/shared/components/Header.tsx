import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useLenisInstance } from '@/core/context/LenisContext'

const navItems = [
  { label: 'Inicio',          href: '#inicio'          },
  { label: 'Proyectos',       href: '#proyectos'       },
  { label: 'Sobre Mí',        href: '#sobre-mi'        },
  { label: 'Blog',            href: '#blog'            },
  { label: 'Certificaciones', href: '#certificaciones' },
  { label: 'Contacto',        href: '#contacto'        },
]

function Header() {
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const lenis = useLenisInstance()

  const handleNav = (href: string) => {
    setIsMobileMenuOpen(false)
    if (location.pathname === '/') {
      const el = document.querySelector(href)
      if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 })
    } else {
      navigate('/', { state: { scrollTo: href } })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div
        className="w-full max-w-5xl rounded-2xl border border-white/10 bg-background/50 backdrop-blur-md shadow-lg px-4 py-3 flex items-center justify-between gap-4"
        style={{ WebkitBackdropFilter: 'blur(12px)' }}
      >
        {/* Logo */}
        <button onClick={() => handleNav('#inicio')} className="flex items-center gap-2 shrink-0">
          <img src="/assets/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
          <span className="font-bold text-lg text-foreground tracking-tight">Ameth Toledo</span>
        </button>

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
          {navItems.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => handleNav(href)}
              className="hover:text-foreground px-3 py-1.5 transition-colors rounded-lg"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            <Sun  className="h-4 w-4 text-foreground dark:hidden" />
            <Moon className="h-4 w-4 text-foreground hidden dark:block" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen
              ? <X    className="h-5 w-5 text-foreground" />
              : <Menu className="h-5 w-5 text-foreground" />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[calc(100%+8px)] left-4 right-4 rounded-2xl border border-white/10 bg-background/70 backdrop-blur-md shadow-xl p-4">
          <nav className="flex flex-col gap-1 text-muted-foreground font-medium">
            {navItems.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => handleNav(href)}
                className="hover:text-foreground px-3 py-2.5 text-sm transition-colors rounded-xl text-left"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
