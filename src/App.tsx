import { motion } from 'motion/react'

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold"
      >
        Elvis Noubissie
      </motion.h1>
    </main>
  )
}