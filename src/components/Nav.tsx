import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLangue, useTextes } from '../i18n'

const textes = {
  fr: {
    liens: [
      { href: '#projets', label: 'Projets' },
      { href: '#parcours', label: 'Parcours' },
      { href: '#competences', label: 'Compétences' },
      { href: '#contact', label: 'Contact' },
    ],
    versClair: 'Passer au thème bleu ciel',
    versSombre: 'Passer au thème bleu marin',
    versAutreLangue: 'Switch to English',
    ouvrir: 'Ouvrir le menu',
    fermer: 'Fermer le menu',
  },
  en: {
    liens: [
      { href: '#projets', label: 'Projects' },
      { href: '#parcours', label: 'Experience' },
      { href: '#competences', label: 'Skills' },
      { href: '#contact', label: 'Contact' },
    ],
    versClair: 'Switch to sky blue theme',
    versSombre: 'Switch to navy theme',
    versAutreLangue: 'Passer en français',
    ouvrir: 'Open menu',
    fermer: 'Close menu',
  },
}

type Theme = 'sombre' | 'clair'

function themeInitial(): Theme {
  try {
    return localStorage.getItem('theme') === 'clair' ? 'clair' : 'sombre'
  } catch {
    return 'sombre'
  }
}

export default function Nav() {
  const t = useTextes(textes)
  const { langue, setLangue } = useLangue()
  const [defile, setDefile] = useState(false)
  const [ouvert, setOuvert] = useState(false)
  const [theme, setTheme] = useState<Theme>(themeInitial)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // Stockage indisponible : le thème reste valable pour cette visite
    }
  }, [theme])

  useEffect(() => {
    const surScroll = () => setDefile(window.scrollY > 24)
    surScroll()
    window.addEventListener('scroll', surScroll, { passive: true })
    return () => window.removeEventListener('scroll', surScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = ouvert ? 'hidden' : ''
    const echap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuvert(false)
    }
    window.addEventListener('keydown', echap)
    return () => window.removeEventListener('keydown', echap)
  }, [ouvert])

  const plein = defile || ouvert
  const bouton =
    'flex h-10 items-center justify-center rounded-full border border-rule text-paper transition-colors hover:border-chlore hover:text-chlore'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,padding] duration-300 ${
          plein ? 'border-rule bg-ink/80 py-3 backdrop-blur' : 'border-transparent py-5'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <a href="#haut" onClick={() => setOuvert(false)} className="font-display text-lg font-semibold tracking-tight">
            elvis<span className="text-chlore">.</span>
          </a>

          <div className="flex items-center gap-2 md:gap-6">
            <ul className="mr-2 hidden gap-8 text-sm text-muted md:flex">
              {t.liens.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-paper">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setLangue(langue === 'fr' ? 'en' : 'fr')}
              aria-label={t.versAutreLangue}
              title={t.versAutreLangue}
              className={`${bouton} gap-1 px-3 text-xs font-semibold tracking-wide`}
            >
              <span className={langue === 'fr' ? 'text-chlore' : 'text-muted'}>FR</span>
              <span className="text-muted">/</span>
              <span className={langue === 'en' ? 'text-chlore' : 'text-muted'}>EN</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme((th) => (th === 'sombre' ? 'clair' : 'sombre'))}
              aria-label={theme === 'sombre' ? t.versClair : t.versSombre}
              title={theme === 'sombre' ? t.versClair : t.versSombre}
              className={`${bouton} w-10`}
            >
              {theme === 'sombre' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.5" />
                  <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="relative h-10 w-10 md:hidden"
              aria-label={ouvert ? t.fermer : t.ouvrir}
              aria-expanded={ouvert}
              aria-controls="menu-mobile"
              onClick={() => setOuvert((o) => !o)}
            >
              <span className={`absolute left-2 right-2 h-px bg-paper transition-all duration-300 ${ouvert ? 'top-1/2 rotate-45' : 'top-[15px]'}`} />
              <span className={`absolute left-2 right-2 h-px bg-paper transition-all duration-300 ${ouvert ? 'top-1/2 -rotate-45' : 'top-[24px]'}`} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {ouvert && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink px-6 md:hidden"
          >
            <ul className="space-y-4">
              {t.liens.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOuvert(false)}
                    className="font-display text-5xl font-bold tracking-tight transition-colors hover:text-chlore"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href="mailto:thymnoubissie@gmail.com" className="mt-12 text-muted">
              thymnoubissie@gmail.com
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}