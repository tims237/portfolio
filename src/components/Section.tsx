import type { ReactNode } from 'react'
import { motion } from 'motion/react'

// Bloc qui glisse et apparaît quand on arrive dessus en scrollant
export function Reveal({ children, delai = 0, className }: { children: ReactNode; delai?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: delai, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// En-tête de section : index numéroté, puis grand titre avec un mot en italique
export function SectionTitre({
  index,
  label,
  avant,
  accent,
  apres = '',
  extra,
}: {
  index: string
  label: string
  avant: string
  accent: string
  apres?: string
  extra?: ReactNode
}) {
  return (
    <Reveal>
      <p className="text-xs font-semibold tracking-[0.22em] text-chlore uppercase">
        {index} / {label}
      </p>
      <h2 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">
        {avant}
        <em className="font-serif font-normal tracking-normal text-chlore italic">{accent}</em>
        {apres}
        {extra}
      </h2>
    </Reveal>
  )
}