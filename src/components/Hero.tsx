import { motion } from 'motion/react'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold"
      >
        Levis Noubissie
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-4 text-lg md:text-xl text-slate-400 max-w-xl"
      >
        Étudiant Data & IA à l'ECE Paris, à la recherche d'une alternance Data Analyst
      </motion.p>
      <div className="mt-8 flex gap-4">
        <a href="#projets" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition">
          Voir mes projets
        </a>
        <a href="#contact" className="px-6 py-3 rounded-lg border border-slate-600 hover:border-slate-400 transition">
          Me contacter
        </a>
      </div>
    </section>
  )
}