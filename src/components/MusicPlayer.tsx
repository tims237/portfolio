import { useState } from 'react'
import { motion } from 'motion/react'
import { useTextes } from '../i18n'

// Colle ici le lien de ta playlist, copié depuis Spotify (Partager > Copier le lien)
// ou depuis SoundCloud (l'adresse complète de la page, en soundcloud.com/...).
const PLAYLIST = ''

function lienIntegre(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.endsWith('spotify.com')) {
      const [, type, id] = u.pathname.match(/\/(playlist|album|track|artist)\/([A-Za-z0-9]+)/) ?? []
      return type && id ? `https://open.spotify.com/embed/${type}/${id}?theme=0` : null
    }
    if (u.hostname.endsWith('soundcloud.com')) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%230a7ea4&auto_play=false&visual=false&show_comments=false&show_reposts=false`
    }
  } catch {
    return null
  }
  return null
}

export default function MusicPlayer() {
  const t = useTextes({
    fr: { ouvrir: 'Ma playlist', masquer: 'Masquer le lecteur', titre: 'Ma playlist' },
    en: { ouvrir: 'My playlist', masquer: 'Hide player', titre: 'My playlist' },
  })
  const [ouvert, setOuvert] = useState(false)
  // Le lecteur n'est chargé qu'au premier clic : rien n'est téléchargé avant
  const [charge, setCharge] = useState(false)
  const src = lienIntegre(PLAYLIST)
  if (!src) return null
  const spotify = src.includes('spotify')

  const basculer = () => {
    setCharge(true)
    setOuvert((o) => !o)
  }

  return (
    <div className="fixed bottom-4 left-4 z-60 flex flex-col items-start gap-3 sm:bottom-6 sm:left-6">
      {charge && (
        <motion.div
          id="lecteur-musique"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={ouvert ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={`w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-rule bg-ink shadow-2xl ${
            ouvert ? '' : 'pointer-events-none invisible'
          }`}
        >
          <iframe
            title={t.titre}
            src={src}
            width="100%"
            height={spotify ? 352 : 300}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="block border-0"
          />
        </motion.div>
      )}

      <button
        type="button"
        onClick={basculer}
        aria-expanded={ouvert}
        aria-controls="lecteur-musique"
        className="flex items-center gap-2.5 rounded-full border border-rule bg-ink/85 px-4 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:border-chlore hover:text-chlore"
      >
        <span className="flex h-3.5 items-end gap-[3px]" aria-hidden="true">
          {[0.6, 1, 0.45].map((hauteur, i) => (
            <span
              key={i}
              className={`w-[3px] rounded-full bg-chlore ${charge ? 'barre' : ''}`}
              style={{ height: `${hauteur * 100}%`, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
        {ouvert ? t.masquer : t.ouvrir}
      </button>
    </div>
  )
}