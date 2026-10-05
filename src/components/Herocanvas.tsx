import { useEffect, useRef } from 'react'

// Surface d'eau faite de points de données, qui ondule doucement.
export default function Herocanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let t = 0
    let raf = 0
    let visible = true
    let souris = 0
    let sourisLisse = 0
    let dernier = performance.now()

    const dessiner = () => {
      ctx.clearRect(0, 0, w, h)
      const focale = h * 0.6
      const horizon = h * 0.52
      const centre = w / 2 + sourisLisse * 40
      const rangees = 46

      for (let zi = rangees; zi >= 0; zi--) {
        const z = 1.8 + zi * 0.26
        const fondu = 1 - zi / rangees
        for (let xi = -130; xi <= 130; xi++) {
          const x = xi * 0.15
          const hauteur =
            0.32 * Math.sin(x * 0.55 + t * 1.1 + zi * 0.35) + 0.22 * Math.cos(z * 0.8 - t * 0.9)
          const px = centre + (x / z) * focale
          if (px < -10 || px > w + 10) continue
          const py = horizon + ((1.5 - hauteur) / z) * focale
          if (py > h + 10) continue
          const taille = Math.max(1, 5 / z)
          const crete = (hauteur + 0.54) / 1.08
          ctx.globalAlpha = fondu * (0.22 + 0.7 * crete)
          ctx.fillStyle = crete > 0.82 ? '#ece6d8' : '#7fd1c7'
          ctx.fillRect(px - taille / 2, py - taille / 2, taille, taille)
        }
      }
      ctx.globalAlpha = 1
    }

    const redimensionner = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduit) dessiner()
    }

    const boucle = (maintenant: number) => {
      t += Math.min(maintenant - dernier, 50) / 1000
      dernier = maintenant
      sourisLisse += (souris - sourisLisse) * 0.05
      if (visible) dessiner()
      raf = requestAnimationFrame(boucle)
    }

    const bouger = (e: PointerEvent) => {
      souris = e.clientX / window.innerWidth - 0.5
    }

    const observateur = new IntersectionObserver(([entree]) => {
      visible = entree.isIntersecting
    })

    redimensionner()
    observateur.observe(canvas)
    window.addEventListener('resize', redimensionner)
    window.addEventListener('pointermove', bouger)
    if (reduit) dessiner()
    else raf = requestAnimationFrame(boucle)

    return () => {
      cancelAnimationFrame(raf)
      observateur.disconnect()
      window.removeEventListener('resize', redimensionner)
      window.removeEventListener('pointermove', bouger)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />
}