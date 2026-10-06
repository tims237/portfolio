import { useEffect, useRef, useState } from 'react'
import { lireNiveaux, lireSpectre } from '../audio'

type Textes = {
  donnees: string
  basses: string
  mediums: string
  aigus: string
  tempo: string
  analyse: string
  methode: string
}

// Panneau d'analyse du son : spectre et niveaux en temps réel, tempo calculé sur le fichier
export default function DonneesMorceau({ actif, tempo, t }: { actif: boolean; tempo?: number | null; t: Textes }) {
  const toile = useRef<HTMLCanvasElement>(null)
  const [niveaux, setNiveaux] = useState({ basses: 0, mediums: 0, aigus: 0 })

  useEffect(() => {
    const canvas = toile.current
    if (!canvas || !actif) return
    const g = canvas.getContext('2d')
    if (!g) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    g.setTransform(dpr, 0, 0, dpr, 0, 0)

    let dernierAffichage = 0
    let raf = 0

    const boucle = (maintenant: number) => {
      raf = requestAnimationFrame(boucle)
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--chlore').trim() || '#7fd1c7'

      const spectre = lireSpectre(48)
      g.clearRect(0, 0, w, h)
      g.fillStyle = accent
      const largeur = w / spectre.length
      spectre.forEach((v, i) => {
        const hauteur = Math.max(2, v * h)
        g.globalAlpha = 0.45 + v * 0.55
        g.fillRect(i * largeur + 1, h - hauteur, Math.max(1, largeur - 2), hauteur)
      })
      g.globalAlpha = 1

      const n = lireNiveaux()

      // Affichage rafraîchi 4 fois par seconde pour rester lisible
      if (maintenant - dernierAffichage > 250) {
        dernierAffichage = maintenant
        setNiveaux(n)
      }
    }
    raf = requestAnimationFrame(boucle)
    return () => cancelAnimationFrame(raf)
  }, [actif])

  const bandes = [
    { nom: t.basses, valeur: niveaux.basses, plage: '20–250 Hz' },
    { nom: t.mediums, valeur: niveaux.mediums, plage: '250 Hz–2 kHz' },
    { nom: t.aigus, valeur: niveaux.aigus, plage: '2–8 kHz' },
  ]

  return (
    <div className="rounded-2xl border border-rule bg-ink/70 p-5 backdrop-blur">
      <p className="text-xs font-semibold tracking-[0.2em] text-chlore uppercase">{t.donnees}</p>

      <canvas ref={toile} aria-hidden="true" className="mt-4 block h-20 w-full" />

      <div className="mt-5 space-y-3">
        {bandes.map((b) => (
          <div key={b.nom}>
            <div className="flex justify-between text-xs">
              <span>
                {b.nom} <span className="text-muted">{b.plage}</span>
              </span>
              <span className="text-muted tabular-nums">{Math.round(b.valeur * 100)} %</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-rule">
              <div
                className="h-full rounded-full bg-chlore transition-[width] duration-200"
                style={{ width: `${Math.round(b.valeur * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-rule pt-4">
        <div>
          <p className="text-xs text-muted">{t.tempo}</p>
          <p className="font-display text-4xl font-bold tabular-nums" aria-live="off">
            {tempo ? Math.round(tempo) : '—'} <span className="text-base font-medium text-muted">BPM</span>
          </p>
        </div>
        {!tempo && <span className="text-xs text-muted">{t.analyse}</span>}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t.methode}</p>
    </div>
  )
}