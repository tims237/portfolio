import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useTextes } from '../i18n'
import { SectionTitre } from './Section'

const textes = {
  fr: {
    label: 'Méthode',
    avant: 'De la donnée ',
    accent: 'à',
    apres: ' la décision',
    etapes: [
      {
        titre: 'Comprendre le besoin',
        texte: "Quelle décision la donnée doit-elle éclairer ? Je pars toujours de la question métier, pas de l'outil.",
        exemple: 'Swim AI : anticiper le surentraînement des nageurs',
      },
      {
        titre: 'Collecter et nettoyer',
        texte: 'Récupérer les sources, traiter les valeurs manquantes et les doublons, garder une trace de chaque transformation.',
        exemple: 'Trois sources réunies : entraînement, biométrie et compétition',
      },
      {
        titre: 'Explorer et modéliser',
        texte: "Analyse exploratoire et indicateurs d'abord, puis un modèle seulement s'il apporte plus qu'une bonne règle simple.",
        exemple: 'Charge ACWR, score de fatigue, Random Forest',
      },
      {
        titre: 'Rendre lisible',
        texte: 'Un tableau de bord clair, quelques chiffres qui comptent vraiment, et une explication que tout le monde comprend.',
        exemple: "Vue d'équipe pour l'entraîneur, alertes en tête de liste",
      },
      {
        titre: 'Déployer et suivre',
        texte: 'Un pipeline automatisé, conteneurisé et surveillé, pour savoir quand les données ou le modèle commencent à dériver.',
        exemple: 'API FastAPI, Docker et monitoring Grafana',
      },
    ],
  },
  en: {
    label: 'Method',
    avant: 'From data ',
    accent: 'to',
    apres: ' decisions',
    etapes: [
      {
        titre: 'Understand the need',
        texte: 'Which decision should the data support? I always start from the business question, not from the tool.',
        exemple: 'Swim AI: anticipating overtraining in swimmers',
      },
      {
        titre: 'Collect and clean',
        texte: 'Gather the sources, handle missing values and duplicates, and keep track of every transformation.',
        exemple: 'Three sources combined: training, biometrics and competition',
      },
      {
        titre: 'Explore and model',
        texte: 'Exploratory analysis and metrics first, then a model only if it beats a good simple rule.',
        exemple: 'ACWR load, fatigue score, Random Forest',
      },
      {
        titre: 'Make it readable',
        texte: 'A clear dashboard, a few numbers that really matter, and an explanation everyone can follow.',
        exemple: 'Team view for the coach, with alerts at the top',
      },
      {
        titre: 'Deploy and monitor',
        texte: 'An automated, containerised and monitored pipeline, to know when the data or the model starts to drift.',
        exemple: 'FastAPI, Docker and Grafana monitoring',
      },
    ],
  },
}

export default function Methode() {
  const t = useTextes(textes)
  const liste = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: liste, offset: ['start 0.75', 'end 0.55'] })
  const [allumees, setAllumees] = useState(0)
  const nombre = t.etapes.length

  // Une étape s'allume dès que la ligne de progression l'atteint
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const compte = t.etapes.filter((_, i) => v >= i / (nombre - 1) - 0.02).length
    setAllumees(v <= 0 ? 0 : compte)
  })

  return (
    <section id="methode" className="mx-auto max-w-6xl px-6 py-24">
      <SectionTitre index="04" label={t.label} avant={t.avant} accent={t.accent} apres={t.apres} />

      <ol ref={liste} className="relative mt-16 space-y-14 pl-12 md:pl-16">
        {/* Ligne de fond et ligne de progression */}
        <span aria-hidden="true" className="absolute top-3 bottom-3 left-[11px] w-px bg-rule md:left-[15px]" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: scrollYProgress }}
          className="absolute top-3 bottom-3 left-[11px] w-px origin-top bg-chlore md:left-[15px]"
        />

        {t.etapes.map((etape, i) => {
          const allumee = i < allumees
          return (
            <motion.li
              key={etape.titre}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid gap-3 md:grid-cols-[1fr_1.3fr] md:gap-12"
            >
              <span
                aria-hidden="true"
                className={`absolute top-1 -left-12 flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-500 md:-left-16 md:h-8 md:w-8 ${
                  allumee ? 'border-chlore bg-chlore text-ink' : 'border-rule bg-ink text-muted'
                }`}
              >
                <span className="text-[10px] font-semibold md:text-xs">{i + 1}</span>
              </span>
              <h3
                className={`font-display text-2xl font-semibold tracking-tight transition-colors duration-500 md:text-4xl ${
                  allumee ? '' : 'text-muted'
                }`}
              >
                {etape.titre}
              </h3>
              <div className="max-w-xl">
                <p className="leading-relaxed text-muted">{etape.texte}</p>
                <p className="mt-3 text-sm font-medium text-chlore">{etape.exemple}</p>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}