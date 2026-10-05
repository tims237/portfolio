import { useEffect, useRef, useState } from 'react'
import { useTextes } from '../i18n'
import { Reveal } from './Section'

const EMAIL = 'thymnoubissie@gmail.com'

const textes = {
  fr: {
    label: 'Contact',
    avant: 'On travaille ',
    contour: 'ensemble',
    apres: ' ?',
    intro: "Je recherche une alternance Data Analyst ou Data Engineer en Île-de-France ou à Lyon. Une offre, un projet ou une simple question : je réponds vite.",
    copier: "Cliquer pour copier l'adresse",
    copie: 'Adresse copiée !',
    ecrire: 'Ou écrire directement',
    haut: 'Retour en haut',
    credits: 'React · Three.js · Web Audio',
  },
  en: {
    label: 'Contact',
    avant: 'Shall we work ',
    contour: 'together',
    apres: '?',
    intro: 'I am looking for a Data Analyst or Data Engineer apprenticeship in the Paris area or Lyon. An opening, a project or just a question: I reply quickly.',
    copier: 'Click to copy the address',
    copie: 'Address copied!',
    ecrire: 'Or write directly',
    haut: 'Back to top',
    credits: 'React · Three.js · Web Audio',
  },
}

const liens = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/elvisnoubissie' },
  { label: 'GitHub', href: 'https://github.com/tims237' },
]

export default function Contact() {
  const t = useTextes(textes)
  const [copie, setCopie] = useState(false)
  const minuteur = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(minuteur.current), [])

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      // Navigateur sans accès au presse-papiers : on passe par une zone de texte temporaire
      const zone = document.createElement('textarea')
      zone.value = EMAIL
      document.body.appendChild(zone)
      zone.select()
      document.execCommand('copy')
      zone.remove()
    }
    setCopie(true)
    window.clearTimeout(minuteur.current)
    minuteur.current = window.setTimeout(() => setCopie(false), 2200)
  }

  return (
    <section id="contact" className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-chlore uppercase">06 / {t.label}</p>
          <h2 className="mt-6 font-display text-[clamp(3rem,10vw,8.5rem)] leading-[0.92] font-bold tracking-[-0.03em]">
            {t.avant}
            <span className="texte-contour italic">{t.contour}</span>
            {t.apres}
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{t.intro}</p>
        </Reveal>

        <Reveal delai={0.1} className="mt-12">
          <button
            type="button"
            onClick={copier}
            className="group inline-flex max-w-full items-center gap-4 rounded-full border border-rule px-6 py-4 transition-colors hover:border-chlore md:px-8 md:py-5"
          >
            <span className="truncate font-display text-xl font-semibold tracking-tight md:text-3xl">{EMAIL}</span>
            <span className="shrink-0 text-muted transition-colors group-hover:text-chlore" aria-hidden="true">
              {copie ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                  <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
                  <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
                </svg>
              )}
            </span>
          </button>
          <p className="mt-4 pl-6 text-xs font-semibold tracking-[0.18em] uppercase md:pl-8" aria-live="polite">
            <span className={copie ? 'text-chlore' : 'text-muted'}>{copie ? t.copie : t.copier}</span>
          </p>
        </Reveal>

        <Reveal delai={0.2}>
          <ul className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm font-semibold tracking-[0.16em] uppercase">
            {liens.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-chlore">
                  {l.label} ↗
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${EMAIL}`} className="text-muted transition-colors hover:text-chlore">
                {t.ecrire} ↗
              </a>
            </li>
          </ul>
        </Reveal>
      </div>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs font-semibold tracking-[0.16em] text-muted uppercase">
          <span>© 2026 Elvis Noubissie</span>
          <span>{t.credits}</span>
          <a href="#haut" className="transition-colors hover:text-paper">
            {t.haut} ↑
          </a>
        </div>
      </footer>
    </section>
  )
}