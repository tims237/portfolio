import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTextes } from '../i18n'

type Morceau = {
  titre: string
  artiste: string
  fichier: string
  couverture?: string
  credit?: string
  // Texte synchronisé au format LRC : une ligne par phrase, précédée de son minutage.
  // Exemple : "[00:12.50] Première phrase\n[00:17.00] Deuxième phrase"
  paroles?: string
}

// 1. Mets tes fichiers audio (mp3) dans le dossier public/musique/
// 2. Ajoute une ligne par morceau ci-dessous.
// Le lecteur reste caché tant que la liste est vide.
const MORCEAUX: Morceau[] = [
  // { titre: 'Nom du morceau', artiste: "Nom de l'artiste", fichier: '/musique/mon-morceau.mp3', couverture: '/musique/pochette.jpg', credit: 'Pixabay',
  //   paroles: `[00:04.00] Première phrase qui s'écrit
  // [00:09.50] Deuxième phrase` },
]

const textes = {
  fr: {
    playlist: 'Ma playlist',
    lire: 'Lecture',
    pause: 'Pause',
    precedent: 'Morceau précédent',
    suivant: 'Morceau suivant',
    afficher: 'Afficher le lecteur',
    reduire: 'Réduire le lecteur',
    volume: 'Volume',
    position: 'Position dans le morceau',
    liste: 'Liste de lecture',
    source: 'Source',
    pleinEcran: 'Afficher le texte en plein écran',
    masquerBulle: 'Masquer la bulle de texte',
    fermer: 'Fermer (Échap)',
    instrumental: 'Instrumental',
    texte: 'Texte',
    sansTexte: 'Pas de texte pour ce morceau',
    couper: 'Couper le son',
    remettre: 'Remettre le son',
  },
  en: {
    playlist: 'My playlist',
    lire: 'Play',
    pause: 'Pause',
    precedent: 'Previous track',
    suivant: 'Next track',
    afficher: 'Show player',
    reduire: 'Collapse player',
    volume: 'Volume',
    position: 'Track position',
    liste: 'Playlist',
    source: 'Source',
    pleinEcran: 'Show text full screen',
    masquerBulle: 'Hide text bubble',
    fermer: 'Close (Esc)',
    instrumental: 'Instrumental',
    texte: 'Text',
    sansTexte: 'No text for this track',
    couper: 'Mute',
    remettre: 'Unmute',
  },
}

type Ligne = { t: number; texte: string }

function lireParoles(lrc?: string): Ligne[] {
  if (!lrc) return []
  const lignes: Ligne[] = []
  for (const brut of lrc.split('\n')) {
    const minutages = [...brut.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)]
    const texte = brut.replace(/\[[^\]]*\]/g, '').trim()
    for (const m of minutages) lignes.push({ t: Number(m[1]) * 60 + Number(m[2]), texte })
  }
  return lignes.sort((a, b) => a.t - b.t)
}

function formater(secondes: number) {
  if (!Number.isFinite(secondes) || secondes < 0) return '0:00'
  const m = Math.floor(secondes / 60)
  const s = Math.floor(secondes % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const mouvementReduit = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Une ligne qui s'écrit lettre par lettre, à un rythme calé sur sa durée
function TexteQuiSecrit({ texte, duree }: { texte: string; duree: number }) {
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    if (mouvementReduit()) {
      setVisible(texte.length)
      return
    }
    const pas = Math.max(18, Math.min(70, (duree * 1000 * 0.55) / Math.max(1, texte.length)))
    const id = window.setInterval(() => {
      setVisible((v) => {
        if (v >= texte.length) {
          window.clearInterval(id)
          return v
        }
        return v + 1
      })
    }, pas)
    return () => window.clearInterval(id)
  }, [texte, duree])
  return (
    <>
      <span aria-hidden="true">
        {texte.slice(0, visible)}
        <span className={`ml-0.5 inline-block w-[2px] bg-chlore align-middle ${visible < texte.length ? 'h-[1em]' : 'h-0'}`} />
      </span>
      <span className="sr-only">{texte}</span>
    </>
  )
}

// Texte qui se remplit de couleur de gauche à droite, comme au karaoké
function remplissage(progression: number): React.CSSProperties {
  const p = Math.max(0, Math.min(100, progression))
  return {
    backgroundImage: `linear-gradient(90deg, var(--color-paper) ${p}%, color-mix(in srgb, var(--color-paper) 32%, transparent) ${p}%)`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  }
}

function Barres({ actif, taille = 'h-3.5' }: { actif: boolean; taille?: string }) {
  return (
    <span className={`flex ${taille} items-end gap-[3px]`} aria-hidden="true">
      {[0.6, 1, 0.45].map((h, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full bg-current ${actif ? 'barre' : ''}`}
          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

const IconeLecture = ({ taille = 18 }: { taille?: number }) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </svg>
)
const IconePause = ({ taille = 18 }: { taille?: number }) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
)
const IconePrecedent = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="5" y="5" width="2.5" height="14" rx="1" />
    <path d="M19 6.2v11.6a1 1 0 0 1-1.55.83L9.6 13.66a1 1 0 0 1 0-1.66l7.85-5.63A1 1 0 0 1 19 6.2Z" />
  </svg>
)
const IconeSuivant = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="16.5" y="5" width="2.5" height="14" rx="1" />
    <path d="M5 6.2v11.6a1 1 0 0 0 1.55.83l7.85-4.97a1 1 0 0 0 0-1.66L6.55 6.37A1 1 0 0 0 5 6.2Z" />
  </svg>
)
const IconeVolume = ({ muet }: { muet: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 9.5h3l4.5-4v13l-4.5-4H4z" />
    {muet ? <path d="M16 9.5l5 5M21 9.5l-5 5" /> : <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />}
  </svg>
)

// Curseur dont la partie remplie est colorée
function Curseur({
  valeur,
  max,
  pas,
  onChange,
  label,
  classe = '',
}: {
  valeur: number
  max: number
  pas: number
  onChange: (v: number) => void
  label: string
  classe?: string
}) {
  const remplissageCurseur = max > 0 ? (valeur / max) * 100 : 0
  return (
    <input
      type="range"
      min={0}
      max={max}
      step={pas}
      value={valeur}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={label}
      className={`curseur ${classe}`}
      style={{ '--fill': `${remplissageCurseur}%` } as React.CSSProperties}
    />
  )
}

function Volume({
  volume,
  muet,
  setVolume,
  setMuet,
  textes: tv,
  classe = 'w-20',
}: {
  volume: number
  muet: boolean
  setVolume: (v: number) => void
  setMuet: (m: boolean) => void
  textes: { volume: string; couper: string; remettre: string }
  classe?: string
}) {
  const coupe = muet || volume === 0
  return (
    <div className="flex items-center gap-2 text-muted">
      <button
        type="button"
        onClick={() => {
          if (coupe && volume === 0) setVolume(0.6)
          setMuet(!coupe)
        }}
        aria-pressed={coupe}
        aria-label={coupe ? tv.remettre : tv.couper}
        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:text-chlore"
      >
        <IconeVolume muet={coupe} />
      </button>
      <Curseur
        valeur={coupe ? 0 : volume}
        max={1}
        pas={0.01}
        label={tv.volume}
        onChange={(v) => {
          setVolume(v)
          if (v > 0 && muet) setMuet(false)
        }}
        classe={classe}
      />
    </div>
  )
}

// Forme d'onde du morceau, colorée jusqu'à la position actuelle, et cliquable pour avancer
function FormeOnde({
  pics,
  position,
  duree,
  onChercher,
  label,
  classe,
}: {
  pics?: number[]
  position: number
  duree: number
  onChercher: (s: number) => void
  label: string
  classe: string
}) {
  const toile = useRef<HTMLCanvasElement>(null)
  const progressionOnde = duree ? position / duree : 0

  useEffect(() => {
    const canvas = toile.current
    if (!canvas) return
    const g = canvas.getContext('2d')
    if (!g) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, w, h)
    const styles = getComputedStyle(document.documentElement)
    const accent = styles.getPropertyValue('--chlore').trim() || '#7fd1c7'
    const eteint = styles.getPropertyValue('--rule').trim() || '#22324a'
    const barres = pics ?? Array.from({ length: 80 }, () => 0.18)
    const largeur = w / barres.length
    const limite = progressionOnde * w
    barres.forEach((p, i) => {
      const x = i * largeur
      const hauteur = Math.max(2, p * h * 0.9)
      g.fillStyle = x < limite ? accent : eteint
      g.fillRect(x + 0.5, (h - hauteur) / 2, Math.max(1, largeur - 1.5), hauteur)
    })
  }, [pics, progressionOnde])

  return (
    <div className={`relative ${classe}`}>
      <canvas ref={toile} aria-hidden="true" className="block h-full w-full" />
      <input
        type="range"
        min={0}
        max={duree || 0}
        step={0.1}
        value={position}
        onChange={(e) => onChercher(Number(e.target.value))}
        aria-label={label}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  )
}
const IconeMicro = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
  </svg>
)
const IconeCroix = ({ taille = 14 }: { taille?: number }) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

function Pochette({ morceau, enLecture, classe }: { morceau: Morceau; enLecture: boolean; classe: string }) {
  if (morceau.couverture) return <img src={morceau.couverture} alt="" className={`${classe} object-cover`} />
  return (
    <div className={`${classe} flex items-center justify-center bg-linear-to-br from-chlore to-rule text-ink`}>
      <Barres actif={enLecture} taille="h-5" />
    </div>
  )
}

export default function MusicPlayer() {
  const t = useTextes(textes)
  const audio = useRef<HTMLAudioElement>(null)
  const doitJouer = useRef(false)
  const [index, setIndex] = useState(0)
  const [enLecture, setEnLecture] = useState(false)
  const [ouvert, setOuvert] = useState(false)
  const [immersif, setImmersif] = useState(false)
  const [bulle, setBulle] = useState(true)
  const [position, setPosition] = useState(0)
  const [duree, setDuree] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [muet, setMuet] = useState(false)
  const [durees, setDurees] = useState<Record<number, number>>({})
  const [formesOnde, setFormesOnde] = useState<Record<number, number[]>>({})
  const toile = useRef<HTMLCanvasElement>(null)
  const contexteAudio = useRef<AudioContext | null>(null)
  const analyseur = useRef<AnalyserNode | null>(null)
  const dureesChargees = useRef(false)
  const boutonFermer = useRef<HTMLButtonElement>(null)
  const ouvreur = useRef<HTMLElement | null>(null)
  const refsLignes = useRef<(HTMLButtonElement | null)[]>([])

  const total = MORCEAUX.length
  const morceau = MORCEAUX[index]
  const lignes = useMemo(() => lireParoles(morceau?.paroles), [morceau])

  // Ligne en cours : la dernière dont le minutage est passé
  let ligneIndex = -1
  for (let i = 0; i < lignes.length; i++) {
    if (lignes[i].t <= position) ligneIndex = i
    else break
  }
  const ligne = ligneIndex >= 0 ? lignes[ligneIndex] : null
  const finLigne = ligne ? (lignes[ligneIndex + 1]?.t ?? ligne.t + 4) : 0
  const dureeLigne = ligne ? finLigne - ligne.t : 0
  const progressionLigne = ligne ? ((position - ligne.t) / Math.max(0.1, dureeLigne * 0.85)) * 100 : 0
  const afficherBulle = bulle && !ouvert && !immersif && (enLecture || position > 0) && Boolean(ligne?.texte)
  const progression = duree ? (position / duree) * 100 : 0
  const textesVolume = { volume: t.volume, couper: t.couper, remettre: t.remettre }

  const preparerAnalyse = () => {
    const a = audio.current
    if (!a) return
    if (contexteAudio.current) {
      void contexteAudio.current.resume()
      return
    }
    try {
      const contexte = new AudioContext()
      const source = contexte.createMediaElementSource(a)
      const an = contexte.createAnalyser()
      an.fftSize = 64
      an.smoothingTimeConstant = 0.75
      source.connect(an)
      an.connect(contexte.destination)
      contexteAudio.current = contexte
      analyseur.current = an
    } catch {
      // Sans Web Audio, la musique fonctionne quand même : seul le visualiseur reste immobile
    }
  }

  const jouer = () => {
    const a = audio.current
    if (!a) return
    preparerAnalyse()
    doitJouer.current = true
    a.play().catch(() => setEnLecture(false))
  }
  const mettrePause = () => {
    doitJouer.current = false
    audio.current?.pause()
  }
  const basculerLecture = () => (enLecture ? mettrePause() : jouer())
  const suivant = () => {
    doitJouer.current = true
    setBulle(true)
    setIndex((i) => (i + 1) % total)
  }
  const precedent = () => {
    const a = audio.current
    if (a && a.currentTime > 3) {
      a.currentTime = 0
      return
    }
    doitJouer.current = true
    setBulle(true)
    setIndex((i) => (i - 1 + total) % total)
  }
  const choisir = (i: number) => {
    if (i === index) return basculerLecture()
    doitJouer.current = true
    setBulle(true)
    setIndex(i)
  }
  const allerA = (secondes: number) => {
    if (audio.current) audio.current.currentTime = secondes
    setPosition(secondes)
  }
  const ouvrirImmersif = () => {
    ouvreur.current = document.activeElement as HTMLElement | null
    setImmersif(true)
  }
  const fermerImmersif = () => {
    setImmersif(false)
    ouvreur.current?.focus()
  }

  // Changement de morceau : on repart du début et on lance la lecture si besoin
  useEffect(() => {
    setPosition(0)
    setDuree(0)
    if (doitJouer.current) audio.current?.play().catch(() => setEnLecture(false))
  }, [index])

  useEffect(() => {
    if (!audio.current) return
    audio.current.volume = volume
    audio.current.muted = muet
  }, [volume, muet])

  // Position mise à jour à chaque image pendant la lecture, pour un remplissage fluide
  useEffect(() => {
    if (!enLecture) return
    let raf = 0
    const tic = () => {
      if (audio.current) setPosition(audio.current.currentTime)
      raf = requestAnimationFrame(tic)
    }
    raf = requestAnimationFrame(tic)
    return () => cancelAnimationFrame(raf)
  }, [enLecture])

  // Visualiseur du dock : des barres qui suivent les fréquences du morceau
  useEffect(() => {
    const canvas = toile.current
    if (!canvas) return
    const g = canvas.getContext('2d')
    if (!g) return
    const reduit = mouvementReduit()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    const nombre = 24
    const donnees = new Uint8Array(analyseur.current?.frequencyBinCount ?? 32)
    let raf = 0
    const dessiner = () => {
      g.clearRect(0, 0, w, h)
      g.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--chlore').trim() || '#7fd1c7'
      const actif = enLecture && analyseur.current && !reduit
      if (actif) analyseur.current!.getByteFrequencyData(donnees)
      const largeur = w / nombre
      for (let i = 0; i < nombre; i++) {
        const v = actif ? donnees[Math.floor((i * donnees.length * 0.55) / nombre)] / 255 : enLecture ? 0.35 : 0
        const hauteur = Math.max(2, v * h)
        g.fillRect(i * largeur + 1, h - hauteur, Math.max(1, largeur - 2), hauteur)
      }
      if (actif) raf = requestAnimationFrame(dessiner)
    }
    dessiner()
    return () => cancelAnimationFrame(raf)
  }, [enLecture, index])

  // Durée de chaque morceau, chargée à la première ouverture du panneau
  useEffect(() => {
    if (!ouvert || dureesChargees.current) return
    dureesChargees.current = true
    MORCEAUX.forEach((m, i) => {
      const a = new Audio()
      a.preload = 'metadata'
      a.onloadedmetadata = () => setDurees((d) => ({ ...d, [i]: a.duration }))
      a.src = m.fichier
    })
  }, [ouvert])

  // Forme d'onde du morceau, calculée à l'ouverture du panneau ou du plein écran
  useEffect(() => {
    if (!(ouvert || immersif) || !morceau || formesOnde[index]) return
    let annule = false
    const calculer = async () => {
      try {
        const reponse = await fetch(morceau.fichier)
        const tampon = await reponse.arrayBuffer()
        const decode = await new OfflineAudioContext(1, 1, 44100).decodeAudioData(tampon)
        const donnees = decode.getChannelData(0)
        const nombre = 140
        const bloc = Math.floor(donnees.length / nombre)
        const pics: number[] = []
        for (let i = 0; i < nombre; i++) {
          let max = 0
          for (let j = 0; j < bloc; j += 32) max = Math.max(max, Math.abs(donnees[i * bloc + j]))
          pics.push(max)
        }
        const plusHaut = Math.max(...pics) || 1
        if (!annule) setFormesOnde((f) => ({ ...f, [index]: pics.map((p) => p / plusHaut) }))
      } catch {
        // Pas de forme d'onde : la barre de progression reste simple
      }
    }
    void calculer()
    return () => {
      annule = true
    }
  }, [ouvert, immersif, index, morceau, formesOnde])

  // Plein écran : Échap pour fermer, page figée, focus sur le bouton de fermeture
  useEffect(() => {
    if (!immersif) return
    boutonFermer.current?.focus()
    document.body.style.overflow = 'hidden'
    const echap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fermerImmersif()
    }
    window.addEventListener('keydown', echap)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', echap)
    }
  }, [immersif])

  // La ligne en cours reste centrée dans le plein écran
  useEffect(() => {
    if (!immersif || ligneIndex < 0) return
    refsLignes.current[ligneIndex]?.scrollIntoView({ block: 'center', behavior: mouvementReduit() ? 'auto' : 'smooth' })
  }, [immersif, ligneIndex])

  // Contrôles depuis le clavier multimédia, l'écran de verrouillage ou le casque
  useEffect(() => {
    if (!morceau || !('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: morceau.titre,
      artist: morceau.artiste,
      artwork: morceau.couverture ? [{ src: morceau.couverture }] : [],
    })
    navigator.mediaSession.setActionHandler('play', jouer)
    navigator.mediaSession.setActionHandler('pause', mettrePause)
    navigator.mediaSession.setActionHandler('nexttrack', suivant)
    navigator.mediaSession.setActionHandler('previoustrack', precedent)
  })

  if (total === 0 || !morceau) return null

  const boutonRond = 'flex items-center justify-center rounded-full transition-colors'
  const lignePrecedente = ligneIndex > 0 ? lignes[ligneIndex - 1] : null
  const ligneSuivante = lignes[ligneIndex + 1] ?? null

  return (
    <>
      <div className="fixed bottom-4 left-4 z-60 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3 sm:bottom-6 sm:left-6">
        <audio
          ref={audio}
          src={morceau.fichier}
          preload="metadata"
          onPlay={() => setEnLecture(true)}
          onPause={() => setEnLecture(false)}
          onTimeUpdate={(e) => {
            if (!enLecture) setPosition(e.currentTarget.currentTime)
          }}
          onLoadedMetadata={(e) => setDuree(e.currentTarget.duration)}
          onEnded={suivant}
        />

        {/* Panneau déplié */}
        <AnimatePresence>
          {ouvert && (
            <motion.div
              id="lecteur-panneau"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-rule bg-ink/95 p-5 shadow-2xl backdrop-blur"
            >
              <div className="mx-auto -mt-2 mb-3 h-1 w-10 rounded-full bg-rule" aria-hidden="true" />
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-24 shrink-0" aria-hidden="true">
                  <span
                    className={`absolute top-1 left-2 h-14 w-14 transition-transform duration-700 ease-out ${
                      enLecture ? 'translate-x-8' : ''
                    }`}
                  >
                    <span className={`disque block h-full w-full rounded-full shadow-md ${enLecture ? 'disque-tourne' : ''}`} />
                  </span>
                  <Pochette morceau={morceau} enLecture={enLecture} classe="absolute top-0 left-0 h-16 w-16 rounded-xl shadow-lg" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-2xl font-bold tracking-tight">{morceau.titre}</p>
                  <p className="truncate text-xs font-semibold tracking-[0.18em] text-muted uppercase">{morceau.artiste}</p>
                </div>
              </div>

              {lignes.length === 0 && <p className="mt-4 text-sm text-muted">{t.sansTexte}</p>}
              {lignes.length > 0 && (
                <button
                  type="button"
                  onClick={ouvrirImmersif}
                  aria-label={t.pleinEcran}
                  className="mt-4 block w-full rounded-xl px-1 py-2 text-left transition-colors hover:bg-rule/30"
                >
                  <span className="block truncate text-sm text-muted">{lignePrecedente?.texte || '\u00a0'}</span>
                  <span className="block truncate font-display text-lg font-semibold" style={remplissage(progressionLigne)}>
                    {ligne?.texte || '♪'}
                  </span>
                  <span className="block truncate text-sm text-muted">{ligneSuivante?.texte || '\u00a0'}</span>
                  <span className="mt-1 block text-right text-xs font-semibold tracking-[0.14em] text-chlore uppercase">
                    {t.texte} ↗
                  </span>
                </button>
              )}

              <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <span className="text-xs text-muted tabular-nums">{formater(position)}</span>
                <FormeOnde
                  pics={formesOnde[index]}
                  position={position}
                  duree={duree}
                  onChercher={allerA}
                  label={t.position}
                  classe="h-10"
                />
                <span className="text-xs text-muted tabular-nums">{formater(duree)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={precedent} aria-label={t.precedent} className={`${boutonRond} h-10 w-10 hover:text-chlore`}>
                    <IconePrecedent />
                  </button>
                  <button
                    type="button"
                    onClick={basculerLecture}
                    aria-label={enLecture ? t.pause : t.lire}
                    className={`${boutonRond} h-12 w-12 bg-chlore text-ink hover:bg-paper`}
                  >
                    {enLecture ? <IconePause /> : <IconeLecture />}
                  </button>
                  <button type="button" onClick={suivant} aria-label={t.suivant} className={`${boutonRond} h-10 w-10 hover:text-chlore`}>
                    <IconeSuivant />
                  </button>
                </div>
                <Volume volume={volume} muet={muet} setVolume={setVolume} setMuet={setMuet} textes={textesVolume} />
              </div>

              <ol aria-label={t.liste} className="mt-4 max-h-52 overflow-y-auto border-t border-rule pt-2">
                {MORCEAUX.map((m, i) => {
                  const actif = i === index
                  return (
                    <li key={m.fichier}>
                      <button
                        type="button"
                        onClick={() => choisir(i)}
                        aria-current={actif ? 'true' : undefined}
                        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-rule/40 ${actif ? 'text-chlore' : ''}`}
                      >
                        <span className="flex w-5 justify-center text-xs text-muted tabular-nums">
                          {actif && enLecture ? (
                            <span className="text-chlore">
                              <Barres actif />
                            </span>
                          ) : (
                            String(i + 1).padStart(2, '0')
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{m.titre}</span>
                          <span className="block truncate text-sm text-muted">{m.artiste}</span>
                        </span>
                        <span className="text-xs text-muted tabular-nums">{durees[i] ? formater(durees[i]) : ''}</span>
                      </button>
                    </li>
                  )
                })}
              </ol>

              {morceau.credit && (
                <p className="mt-3 text-xs text-muted">
                  {t.source} : {morceau.credit}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulle de texte au-dessus du dock */}
        <AnimatePresence mode="wait">
          {afficherBulle && ligne && (
            <motion.div
              key={`${index}-${ligneIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 rounded-2xl border border-rule bg-ink/90 px-4 py-3 shadow-lg backdrop-blur"
            >
              <button
                type="button"
                onClick={ouvrirImmersif}
                aria-label={t.pleinEcran}
                className="min-w-0 flex-1 text-left font-display text-lg leading-snug font-semibold"
              >
                <TexteQuiSecrit texte={ligne.texte} duree={dureeLigne} />
              </button>
              <button
                type="button"
                onClick={() => setBulle(false)}
                aria-label={t.masquerBulle}
                className="mt-1 shrink-0 text-muted transition-colors hover:text-chlore"
              >
                <IconeCroix />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dock compact */}
        <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-rule bg-ink/90 p-2 pr-3 shadow-lg backdrop-blur">
          <button
            type="button"
            onClick={basculerLecture}
            aria-label={enLecture ? t.pause : t.lire}
            className={`${boutonRond} h-12 w-12 shrink-0 bg-chlore text-ink shadow-md hover:bg-paper`}
          >
            {enLecture ? <IconePause /> : <IconeLecture />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold tracking-[0.14em] uppercase">
              {enLecture || position > 0 ? `${morceau.artiste} — ${morceau.titre}` : t.playlist}
            </p>
            <canvas ref={toile} aria-hidden="true" className="mt-1.5 block h-4 w-full" />
          </div>
          {lignes.length > 0 && (
            <button
              type="button"
              onClick={ouvrirImmersif}
              aria-label={t.pleinEcran}
              title={t.pleinEcran}
              className={`${boutonRond} h-9 w-9 shrink-0 text-muted hover:text-chlore`}
            >
              <IconeMicro />
            </button>
          )}
          <button
            type="button"
            onClick={() => setOuvert((o) => !o)}
            aria-expanded={ouvert}
            aria-controls="lecteur-panneau"
            aria-label={ouvert ? t.reduire : t.afficher}
            className={`${boutonRond} h-9 w-9 shrink-0 text-muted hover:text-chlore`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={`transition-transform duration-300 ${ouvert ? 'rotate-180' : ''}`}
            >
              <path d="m6 15 6-6 6 6" />
            </svg>
          </button>
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[2px] bg-chlore"
            style={{ width: `${progression}%` }}
          />
        </div>
      </div>

      {/* Texte en plein écran */}
      <AnimatePresence>
        {immersif && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${t.texte} : ${morceau.titre}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-70 flex flex-col overflow-hidden bg-ink"
          >
            {/* Fond flouté tiré de la pochette */}
            {morceau.couverture && (
              <img
                src={morceau.couverture}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-35 blur-3xl"
              />
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-br from-chlore/25 via-ink/70 to-ink"
            />

            <header className="relative flex items-center justify-between gap-4 px-6 pt-6 md:px-12">
              <div className="flex min-w-0 items-center gap-4">
                <Pochette morceau={morceau} enLecture={enLecture} classe="h-14 w-14 shrink-0 rounded-xl" />
                <div className="min-w-0">
                  <p className="truncate font-display text-xl font-bold">{morceau.titre}</p>
                  <p className="truncate text-xs font-semibold tracking-[0.18em] text-muted uppercase">{morceau.artiste}</p>
                </div>
              </div>
              <button
                ref={boutonFermer}
                type="button"
                onClick={fermerImmersif}
                aria-label={t.fermer}
                className={`${boutonRond} h-11 w-11 shrink-0 border border-rule hover:border-chlore hover:text-chlore`}
              >
                <IconeCroix taille={18} />
              </button>
            </header>

            <div className="relative flex-1 overflow-y-auto px-6 md:px-12" tabIndex={0}>
              <div className="mx-auto flex max-w-4xl flex-col gap-5 py-[35vh]">
                {lignes.length === 0 && (
                  <p className="font-display text-4xl font-bold text-muted md:text-6xl">{t.instrumental}</p>
                )}
                {lignes.map((l, i) => {
                  const actuelle = i === ligneIndex
                  const passee = i < ligneIndex
                  return (
                    <button
                      key={`${l.t}-${i}`}
                      ref={(el) => {
                        refsLignes.current[i] = el
                      }}
                      type="button"
                      onClick={() => allerA(l.t)}
                      className={`text-left font-display font-bold tracking-tight transition-[opacity,transform] duration-500 ${
                        actuelle
                          ? 'text-4xl opacity-100 md:text-6xl'
                          : `text-3xl md:text-5xl ${passee ? 'opacity-30' : 'opacity-45'} hover:opacity-80`
                      }`}
                      style={actuelle ? remplissage(progressionLigne) : undefined}
                    >
                      {l.texte || '♪'}
                    </button>
                  )
                })}
              </div>
            </div>

            <footer className="relative px-6 pb-8 md:px-12">
              <div className="mx-auto max-w-4xl">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                  <span className="text-xs text-muted tabular-nums">{formater(position)}</span>
                  <FormeOnde
                    pics={formesOnde[index]}
                    position={position}
                    duree={duree}
                    onChercher={allerA}
                    label={t.position}
                    classe="h-14"
                  />
                  <span className="text-xs text-muted tabular-nums">{formater(duree)}</span>
                </div>
                <div className="relative mt-4 flex items-center justify-center gap-4">
                  <button type="button" onClick={precedent} aria-label={t.precedent} className={`${boutonRond} h-12 w-12 hover:text-chlore`}>
                    <IconePrecedent />
                  </button>
                  <button
                    type="button"
                    onClick={basculerLecture}
                    aria-label={enLecture ? t.pause : t.lire}
                    className={`${boutonRond} h-16 w-16 bg-chlore text-ink hover:bg-paper`}
                  >
                    {enLecture ? <IconePause taille={22} /> : <IconeLecture taille={22} />}
                  </button>
                  <button type="button" onClick={suivant} aria-label={t.suivant} className={`${boutonRond} h-12 w-12 hover:text-chlore`}>
                    <IconeSuivant />
                  </button>
                  <div className="absolute right-0 hidden sm:block">
                    <Volume volume={volume} muet={muet} setVolume={setVolume} setMuet={setMuet} textes={textesVolume} classe="w-28" />
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}