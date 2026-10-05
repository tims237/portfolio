import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const souris = window.matchMedia('(pointer: fine)').matches
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!souris || reduit) return

    document.body.classList.add('has-cursor')
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0

    const montrer = (visible: boolean) => {
      dot.current?.classList.toggle('is-visible', visible)
      ring.current?.classList.toggle('is-visible', visible)
    }
    const bouger = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      montrer(true)
    }
    const survol = (e: PointerEvent) => {
      const cible = (e.target as Element).closest('a, button')
      ring.current?.classList.toggle('is-hover', Boolean(cible))
    }
    const sortir = () => montrer(false)

    const boucle = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(boucle)
    }
    raf = requestAnimationFrame(boucle)

    window.addEventListener('pointermove', bouger)
    window.addEventListener('pointerover', survol)
    document.documentElement.addEventListener('pointerleave', sortir)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', bouger)
      window.removeEventListener('pointerover', survol)
      document.documentElement.removeEventListener('pointerleave', sortir)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}