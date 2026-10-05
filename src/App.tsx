import { MotionConfig } from 'motion/react'
import { LangueProvider } from './i18n'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import MusicPlayer from './components/MusicPlayer'

export default function App() {
  return (
    <LangueProvider>
      <MotionConfig reducedMotion="user">
        <div className="grain" aria-hidden="true" />
        <Cursor />
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Projects />
          <Experience />
          <Skills />
          <Contact />
        </main>
        <MusicPlayer />
      </MotionConfig>
    </LangueProvider>
  )
}