import { useState } from 'react'
import { motion } from 'motion/react'
import { useLangue, useTextes } from '../i18n'
import { Reveal, SectionTitre } from './Section'

// Version simplifiée, à base de règles, des calculs de Swim AI.
// Le vrai projet utilise un Random Forest entraîné sur les données des nageurs.

type Scenario = { charges: number[]; rpe: number; hrv: number; sommeil: number }
type CleScenario = 'normal' | 'pic' | 'reprise'

const SCENARIOS: Record<CleScenario, Scenario> = {
  normal: { charges: [2400, 2500, 2450, 2600], rpe: 5, hrv: 68, sommeil: 8 },
  pic: { charges: [2200, 2300, 2250, 4200], rpe: 8, hrv: 48, sommeil: 6 },
  reprise: { charges: [600, 800, 1000, 2600], rpe: 5, hrv: 62, sommeil: 8 },
}

const HRV_REFERENCE = 65
const CHARGE_MAX = 5000

const borner = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function calculer(s: Scenario) {
  const aigue = s.charges[3]
  const chronique = s.charges.reduce((a, b) => a + b, 0) / 4
  // ACWR : charge de la semaine ÷ charge moyenne des 4 dernières semaines
  const acwr = chronique > 0 ? aigue / chronique : 0
  // Score de fatigue : effort perçu × 10, ajusté selon la variabilité cardiaque
  const fatigue = Math.round(borner(s.rpe * 10 + (HRV_REFERENCE - s.hrv) * 0.6, 0, 100))

  let risque = 0
  if (acwr > 1.3) risque += Math.min(45, ((acwr - 1.3) / 0.4) * 45)
  else if (acwr < 0.8) risque += Math.min(20, ((0.8 - acwr) / 0.4) * 20)
  risque += fatigue * 0.35
  if (s.sommeil < 8) risque += (8 - s.sommeil) * 6
  risque = Math.round(borner(risque, 0, 100))

  const niveau = risque < 35 ? 'faible' : risque < 65 ? 'modere' : 'eleve'
  const zone = acwr < 0.8 ? 'sous' : acwr <= 1.3 ? 'optimale' : acwr <= 1.5 ? 'vigilance' : 'danger'
  return { chronique, acwr, fatigue, risque, niveau, zone } as const
}

const textes = {
  fr: {
    label: 'Démo',
    avant: 'Essaie ',
    accent: 'le',
    apres: ' modèle',
    intro:
      "Une version simplifiée des calculs de Swim AI. Modifie les quatre dernières semaines d'entraînement d'un nageur et observe le risque de surentraînement évoluer.",
    scenarios: { normal: 'Semaine normale', pic: 'Pic de charge', reprise: 'Reprise rapide' } as Record<CleScenario, string>,
    semaines: ['Semaine −3', 'Semaine −2', 'Semaine −1', 'Cette semaine'],
    unite: 'UA',
    rpe: 'Effort perçu (RPE)',
    hrv: 'Variabilité cardiaque (HRV)',
    sommeil: 'Sommeil moyen',
    heures: 'h',
    moyenne: 'Moyenne 4 semaines',
    acwr: 'Ratio ACWR',
    fatigue: 'Score de fatigue',
    risque: 'Risque',
    niveaux: { faible: 'Faible', modere: 'Modéré', eleve: 'Élevé' },
    zones: {
      sous: "Charge inférieure à l'habitude : le nageur risque de se désentraîner.",
      optimale: 'Charge dans la zone optimale, entre 0,8 et 1,3.',
      vigilance: 'Charge en hausse rapide : à surveiller de près.',
      danger: 'Pic de charge : au-delà de 1,5, le risque de blessure augmente fortement.',
    },
    conseils: {
      faible: 'Conseil : continuer le plan prévu.',
      modere: 'Conseil : alléger la prochaine séance et surveiller la récupération.',
      eleve: 'Conseil : prévoir une séance de récupération et réduire le volume.',
    },
    note: 'Calcul simplifié à base de règles. Le vrai projet utilise un Random Forest entraîné sur les données des nageurs.',
    zoneOptimale: 'zone optimale',
    app: "Ouvrir l'application Swim AI ↗",
  },
  en: {
    label: 'Demo',
    avant: 'Try ',
    accent: 'the',
    apres: ' model',
    intro:
      "A simplified version of Swim AI's calculations. Change a swimmer's last four weeks of training and watch the overtraining risk evolve.",
    scenarios: { normal: 'Normal week', pic: 'Load spike', reprise: 'Fast comeback' } as Record<CleScenario, string>,
    semaines: ['Week −3', 'Week −2', 'Week −1', 'This week'],
    unite: 'AU',
    rpe: 'Perceived effort (RPE)',
    hrv: 'Heart rate variability (HRV)',
    sommeil: 'Average sleep',
    heures: 'h',
    moyenne: '4-week average',
    acwr: 'ACWR ratio',
    fatigue: 'Fatigue score',
    risque: 'Risk',
    niveaux: { faible: 'Low', modere: 'Moderate', eleve: 'High' },
    zones: {
      sous: 'Load below usual: the swimmer may lose fitness.',
      optimale: 'Load in the optimal zone, between 0.8 and 1.3.',
      vigilance: 'Load rising fast: keep a close eye on it.',
      danger: 'Load spike: above 1.5, injury risk rises sharply.',
    },
    conseils: {
      faible: 'Advice: keep to the planned schedule.',
      modere: 'Advice: lighten the next session and monitor recovery.',
      eleve: 'Advice: schedule a recovery session and reduce volume.',
    },
    note: 'Simplified rule-based calculation. The real project uses a Random Forest trained on swimmer data.',
    zoneOptimale: 'optimal zone',
    app: 'Open the Swim AI app ↗',
  },
}

const couleursRisque = {
  faible: 'bg-emerald-400',
  modere: 'bg-amber-400',
  eleve: 'bg-red-400',
}

function Reglage({
  label,
  valeur,
  affichage,
  min,
  max,
  pas,
  onChange,
}: {
  label: string
  valeur: number
  affichage: string
  min: number
  max: number
  pas: number
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4 text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold tabular-nums">{affichage}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={pas}
        value={valeur}
        onChange={(e) => onChange(Number(e.target.value))}
        className="curseur mt-2 w-full"
        style={{ '--fill': `${((valeur - min) / (max - min)) * 100}%` } as React.CSSProperties}
      />
    </label>
  )
}

export default function SwimDemo() {
  const t = useTextes(textes)
  const { langue } = useLangue()
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS.normal)
  const [actif, setActif] = useState<CleScenario | null>('normal')
  const r = calculer(scenario)
  const nombre = (v: number, decimales = 0) =>
    v.toLocaleString(langue === 'fr' ? 'fr-FR' : 'en-GB', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })

  const modifier = (changement: Partial<Scenario>) => {
    setScenario((s) => ({ ...s, ...changement }))
    setActif(null)
  }
  const modifierCharge = (i: number, v: number) => {
    const charges = [...scenario.charges]
    charges[i] = v
    modifier({ charges })
  }

  // Graphique : barres des 4 semaines et ligne de la moyenne
  const largeur = 320
  const hauteur = 170
  const base = 140
  const echelle = (v: number) => (v / CHARGE_MAX) * 120
  const yMoyenne = base - echelle(r.chronique)

  return (
    <section id="demo" className="mx-auto max-w-6xl px-6 py-24">
      <SectionTitre index="03" label={t.label} avant={t.avant} accent={t.accent} apres={t.apres} />
      <Reveal>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{t.intro}</p>
      </Reveal>

      <Reveal className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Réglages */}
        <div className="rounded-2xl border border-rule p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SCENARIOS) as CleScenario[]).map((cle) => (
              <button
                key={cle}
                type="button"
                onClick={() => {
                  setScenario(SCENARIOS[cle])
                  setActif(cle)
                }}
                aria-pressed={actif === cle}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  actif === cle ? 'border-chlore bg-chlore text-ink' : 'border-rule hover:border-chlore'
                }`}
              >
                {t.scenarios[cle]}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-5">
            {scenario.charges.map((c, i) => (
              <Reglage
                key={i}
                label={t.semaines[i]}
                valeur={c}
                affichage={`${nombre(c)} ${t.unite}`}
                min={0}
                max={CHARGE_MAX}
                pas={50}
                onChange={(v) => modifierCharge(i, v)}
              />
            ))}
          </div>

          <div className="mt-8 space-y-5 border-t border-rule pt-8">
            <Reglage label={t.rpe} valeur={scenario.rpe} affichage={`${scenario.rpe} / 10`} min={1} max={10} pas={1} onChange={(v) => modifier({ rpe: v })} />
            <Reglage label={t.hrv} valeur={scenario.hrv} affichage={`${scenario.hrv} ms`} min={20} max={120} pas={1} onChange={(v) => modifier({ hrv: v })} />
            <Reglage
              label={t.sommeil}
              valeur={scenario.sommeil}
              affichage={`${nombre(scenario.sommeil, 1)} ${t.heures}`}
              min={4}
              max={10}
              pas={0.5}
              onChange={(v) => modifier({ sommeil: v })}
            />
          </div>
        </div>

        {/* Résultats */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-rule p-6">
            <svg viewBox={`0 0 ${largeur} ${hauteur}`} className="w-full" role="img" aria-label={t.semaines.map((s, i) => `${s} : ${scenario.charges[i]} ${t.unite}`).join(', ')}>
              {scenario.charges.map((c, i) => {
                const h = echelle(c)
                const x = 22 + i * 75
                return (
                  <g key={i}>
                    <motion.rect
                      x={x}
                      width={50}
                      rx={6}
                      initial={false}
                      animate={{ y: base - h, height: Math.max(h, 2) }}
                      transition={{ type: 'spring', stiffness: 160, damping: 22 }}
                      className={i === 3 ? 'fill-chlore' : 'fill-rule'}
                    />
                    <text x={x + 25} y={base + 18} textAnchor="middle" className="fill-muted text-[10px]">
                      {t.semaines[i]}
                    </text>
                  </g>
                )
              })}
              <motion.line
                x1={10}
                x2={largeur - 10}
                initial={false}
                animate={{ y1: yMoyenne, y2: yMoyenne }}
                transition={{ type: 'spring', stiffness: 160, damping: 22 }}
                strokeDasharray="5 5"
                strokeWidth={1.5}
                className="stroke-paper"
              />
              <motion.text
                x={12}
                textAnchor="start"
                initial={false}
                animate={{ y: yMoyenne - 6 }}
                className="fill-paper text-[10px]"
              >
                {t.moyenne}
              </motion.text>
            </svg>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-rule p-5">
              <p className="text-sm text-muted">{t.acwr}</p>
              <p className="mt-1 font-display text-4xl font-bold tabular-nums">{nombre(r.acwr, 2)}</p>
            </div>
            <div className="rounded-2xl border border-rule p-5">
              <p className="text-sm text-muted">{t.fatigue}</p>
              <p className="mt-1 font-display text-4xl font-bold tabular-nums">
                {r.fatigue}
                <span className="text-lg text-muted">/100</span>
              </p>
            </div>
            <div className={`rounded-2xl p-5 text-[#05111c] transition-colors duration-500 ${couleursRisque[r.niveau]}`}>
              <p className="text-sm font-medium opacity-80">{t.risque}</p>
              <p className="mt-1 font-display text-4xl font-bold">{t.niveaux[r.niveau]}</p>
            </div>
          </div>

          {/* Jauge ACWR de 0 à 2 */}
          <div className="rounded-2xl border border-rule p-6">
            <div className="relative h-3 rounded-full bg-rule">
              <span className="absolute inset-y-0 rounded-full bg-chlore/50" style={{ left: '40%', width: '25%' }} />
              <span className="absolute inset-y-0 right-0 rounded-r-full bg-red-400/60" style={{ left: '75%' }} />
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ left: `${(Math.min(r.acwr, 2) / 2) * 100}%` }}
                transition={{ type: 'spring', stiffness: 160, damping: 22 }}
                className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink bg-paper shadow"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted tabular-nums">
              <span>0</span>
              <span>
                {t.zoneOptimale} {nombre(0.8, 1)} – {nombre(1.3, 1)}
              </span>
              <span>2</span>
            </div>
            <p className="mt-5 font-medium" aria-live="polite">
              {t.zones[r.zone]}
            </p>
            <p className="mt-1 text-muted">{t.conseils[r.niveau]}</p>
          </div>

          <p className="text-sm text-muted">{t.note}</p>
          <a
            href="https://swim-ai-three.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="self-start border-b border-chlore pb-0.5 font-medium text-chlore transition-colors hover:border-paper hover:text-paper"
          >
            {t.app}
          </a>
        </div>
      </Reveal>
    </section>
  )
}