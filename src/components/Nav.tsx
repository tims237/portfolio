import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const liens = [
  { href: '#projets', label: 'Projets' },
  { href: '#parcours', label: 'Parcours' },
  { href: '#competences', label: 'Compétences' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [defile, setDefile] = useState(false)
  const [ouvert, setOuvert] = useState(false)

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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,padding] duration-300 ${
          plein ? 'border-rule bg-ink/80 py-3 backdrop-blur' : 'border-transparent py-5'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <a
            href="#haut"
            onClick={() => setOuvert(false)}
            className="font-display text-lg font-semibold tracking-tight"
          >
            elvis<span className="text-chlore">.</span>
          </a>

          <ul className="hidden gap-8 text-sm text-muted md:flex">
            {liens.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-paper">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="relative h-10 w-10 md:hidden"
            aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            onClick={() => setOuvert((o) => !o)}
          >
            <span
              className={`absolute left-2 right-2 h-px bg-paper transition-all duration-300 ${
                ouvert ? 'top-1/2 rotate-45' : 'top-[15px]'
              }`}
            />
            <span
              className={`absolute left-2 right-2 h-px bg-paper transition-all duration-300 ${
                ouvert ? 'top-1/2 -rotate-45' : 'top-[24px]'
              }`}
            />
          </button>
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
              {liens.map((l, i) => (
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