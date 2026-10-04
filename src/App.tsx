import Hero from './components/Hero'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Skills from './components/Skills.tsx'
import Contact from './components/Contact.tsx'

export default function App() {
  return (
    <main className="bg-slate-950 text-white">
      <Hero />
      <Projects />
      <Experience />
      <Skills />
      <Contact />
    </main>
  )
}