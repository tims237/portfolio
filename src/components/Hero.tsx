import { motion } from 'motion/react'

const lignes = ['Elvis', 'Noubissie']

export default function Hero() {
  return (
    <section id="haut" className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28">
      <p className="text-muted">Étudiant Data & IA à l'ECE Paris</p>

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
        <p className="max-w-xl text-lg leading-relaxed md:text-xl">
          Je construis des pipelines de données, des modèles de machine learning et les tableaux de
          bord qui les rendent lisibles.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#projets"
            className="rounded-full bg-chlore px-6 py-3 font-medium text-ink transition-colors hover:bg-paper"
          >
            Voir mes projets
          </a>
          <a
            href="#contact"
            className="rounded-full border border-rule px-6 py-3 font-medium transition-colors hover:border-paper"
          >
            Me contacter
          </a>
        </div>
      </motion.div>

      <p className="mt-12 flex items-start gap-3 text-sm text-muted">
        <span className="relative mt-1.5 flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chlore opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-chlore" />
        </span>
        Disponible pour une alternance Data Analyst ou Data Engineer, en Île-de-France ou à Lyon
      </p>
    </section>
  )
}