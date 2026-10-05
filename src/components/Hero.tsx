import { motion } from 'motion/react'
import HeroCanvas from './HeroCanvas.tsx'
import { useTextes } from '../i18n'

const lignes = ['Elvis', 'Noubissie']

const textes = {
  fr: {
    statut: "Étudiant Data & IA à l'ECE Paris",
    pitch:
      'Je construis des pipelines de données, des modèles de machine learning et les tableaux de bord qui les rendent lisibles.',
    projets: 'Voir mes projets',
    contact: 'Me contacter',
    dispo: 'Disponible pour une alternance Data Analyst ou Data Engineer, en Île-de-France ou à Lyon',
  },
  en: {
    statut: 'Data & AI student at ECE Paris',
    pitch: 'I build data pipelines, machine learning models and the dashboards that make them readable.',
    projets: 'See my projects',
    contact: 'Get in touch',
    dispo: 'Open to a Data Analyst or Data Engineer apprenticeship (work-study), in the Paris area or Lyon',
  },
}

export default function Hero() {
  const t = useTextes(textes)
  return (
    <section id="haut" className="relative overflow-hidden">
      <HeroCanvas />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-ink"
      />
      <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-24 md:pt-44">
        <p className="text-muted">{t.statut}</p>

        <h1 className="mt-6 font-display text-[clamp(3.6rem,14vw,11.5rem)] font-bold leading-[0.88] tracking-[-0.04em]">
          {lignes.map((mot, i) => (
            <span key={mot} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {mot}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end"
        >
          <p className="max-w-xl text-lg leading-relaxed md:text-xl">{t.pitch}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#projets"
              className="rounded-full bg-chlore px-6 py-3 font-medium text-ink transition-colors hover:bg-paper"
            >
              {t.projets}
            </a>
            <a
              href="#contact"
              className="rounded-full border border-rule px-6 py-3 font-medium transition-colors hover:border-paper"
            >
              {t.contact}
            </a>
          </div>
        </motion.div>

        <p className="mt-12 flex items-start gap-3 text-sm text-muted">
          <span className="relative mt-1.5 flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chlore opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-chlore" />
          </span>
          {t.dispo}
        </p>
      </div>
    </section>
  )
}