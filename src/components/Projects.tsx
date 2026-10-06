import { motion } from 'motion/react'
import { useTextes } from '../i18n'
import { SectionTitre } from './Section'

const demos = {
  swim: 'https://swim-ai-three.vercel.app',
}

const liens = {
  swim: 'https://github.com/tims237/swim-ai',
  c4ed: 'https://github.com/tims237/c4ed',
  elk: '',
}

const textes = {
  fr: {
    label: 'Projets',
    avant: 'Ce que ',
    accent: "j'ai",
    apres: ' construit',
    code: 'Voir le code source',
    demo: "Voir l'application",
    essayer: 'Essayer le calcul ↓',
    projets: [
      {
        nom: 'Swim AI',
        contexte: 'Stage chez Skills4Mind, 2026',
        resume: 'Plateforme de suivi et de prédiction de performance pour les clubs de natation.',
        detail:
          "En charge du back-end dans une équipe de 4 : API REST FastAPI de 27 routes avec authentification JWT et trois rôles, calcul de la charge d'entraînement (ACWR), score de fatigue et score de risque de surentraînement par Random Forest.",
        stack: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'scikit-learn', 'React', 'Docker', 'Grafana'],
        lien: liens.swim,
        demo: demos.swim,
      },
      {
        nom: 'C4ED',
        contexte: 'Application web, 2025',
        resume: 'Application bancaire simulée avec espaces client et administrateur.',
        detail:
          'Dépôts, retraits, virements entre utilisateurs, plafonds de dépenses et validation des opérations. Sécurité au cœur du projet : requêtes préparées, mots de passe hachés, jetons CSRF et réinitialisation par jeton à durée limitée.',
        stack: ['PHP', 'MySQL', 'PDO', 'HTML', 'CSS'],
        lien: liens.c4ed,
        demo: '',
      },
      {
        nom: 'Plateforme de logs ELK',
        contexte: 'Projet technique',
        resume: 'Supervision en temps réel des logs de plusieurs services applicatifs.',
        detail:
          'Plateforme conteneurisée qui ingère et traite des logs JSON issus de plusieurs services simulés, avec des dashboards Kibana pour analyser et superviser les événements système.',
        stack: ['Docker', 'Elasticsearch', 'Logstash', 'Kibana'],
        lien: liens.elk,
        demo: '',
      },
    ],
  },
  en: {
    label: 'Projects',
    avant: 'What ',
    accent: "I've",
    apres: ' built',
    code: 'View source code',
    demo: 'Open the app',
    essayer: 'Try the calculation ↓',
    projets: [
      {
        nom: 'Swim AI',
        contexte: 'Internship at Skills4Mind, 2026',
        resume: 'Performance tracking and prediction platform for swimming clubs.',
        detail:
          'Back-end owner in a team of 4: FastAPI REST API with 27 routes, JWT authentication and three roles, training load (ACWR), fatigue score and an overtraining risk score built with a Random Forest.',
        stack: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'scikit-learn', 'React', 'Docker', 'Grafana'],
        lien: liens.swim,
        demo: demos.swim,
      },
      {
        nom: 'C4ED',
        contexte: 'Web application, 2025',
        resume: 'Simulated banking application with customer and admin areas.',
        detail:
          'Deposits, withdrawals, transfers between users, spending limits and transaction approval. Security first: prepared statements, hashed passwords, CSRF tokens and time-limited password reset tokens.',
        stack: ['PHP', 'MySQL', 'PDO', 'HTML', 'CSS'],
        lien: liens.c4ed,
        demo: '',
      },
      {
        nom: 'ELK log platform',
        contexte: 'Technical project',
        resume: 'Real-time monitoring of logs from several application services.',
        detail:
          'Containerised platform that ingests and processes JSON logs from several simulated services, with Kibana dashboards to analyse and monitor system events.',
        stack: ['Docker', 'Elasticsearch', 'Logstash', 'Kibana'],
        lien: liens.elk,
        demo: '',
      },
    ],
  },
}

export default function Projects() {
  const t = useTextes(textes)
  return (
    <section id="projets" className="mx-auto max-w-6xl px-6 py-24">
      <SectionTitre
        index="02"
        label={t.label}
        avant={t.avant}
        accent={t.accent}
        apres={t.apres}
        extra={<sup className="ml-2 font-sans text-lg font-medium text-chlore md:text-2xl">{t.projets.length}</sup>}
      />

      <ul className="mt-14 border-t border-rule">
        {t.projets.map((p) => (
          <motion.li
            key={p.nom}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group grid gap-6 border-b border-rule py-10 md:grid-cols-[1fr_1.4fr] md:gap-12">
            <div>
              <h3 className="font-display text-3xl font-semibold tracking-tight transition-colors group-hover:text-chlore md:text-5xl">
                {p.nom}
              </h3>
              <p className="mt-2 text-muted">{p.contexte}</p>
            </div>
            <div className="max-w-2xl">
              <p className="text-lg">{p.resume}</p>
              <p className="mt-3 leading-relaxed text-muted">{p.detail}</p>
              <p className="mt-5 text-sm text-paper/80">{p.stack.join(', ')}</p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="border-b border-chlore pb-0.5 font-medium text-chlore transition-colors hover:border-paper hover:text-paper"
                  >
                    {t.demo} ↗
                  </a>
                )}
                {p.lien && (
                  <a
                    href={p.lien}
                    target="_blank"
                    rel="noreferrer"
                    className="border-b border-rule pb-0.5 font-medium transition-colors hover:border-chlore hover:text-chlore"
                  >
                    {t.code}
                  </a>
                )}
                {p.demo && (
                  <a href="#demo" className="border-b border-rule pb-0.5 font-medium transition-colors hover:border-chlore hover:text-chlore">
                    {t.essayer}
                  </a>
                )}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}