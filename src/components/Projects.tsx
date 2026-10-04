import { motion } from 'motion/react'

const projects = [
  {
    title: 'Swim AI : suivi et prédiction de performance en natation',
    description:
      "Plateforme web pour clubs de natation, développée chez Skills4Mind en équipe de 4. En charge du back-end : API REST FastAPI de 27 endpoints avec authentification JWT et rôles (nageur, entraîneur, admin), calcul d'indicateurs (charge ACWR, score de fatigue, progression) et score de risque de surentraînement par Random Forest.",
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'scikit-learn', 'React', 'Docker', 'Grafana'],
    link: 'https://github.com/tims237/swim-ai',
  },
  {
    title: 'Plateforme de test IA avec stack ELK',
    description:
      "Plateforme conteneurisée qui ingère et traite des logs JSON issus de plusieurs services simulés, avec des dashboards Kibana en temps réel pour superviser les événements système.",
    tags: ['Docker', 'Elasticsearch', 'Logstash', 'Kibana'],
    link: '',
  },
      {
    title: 'C4ED : application bancaire simulée',
    description:
      "Application web de gestion de comptes avec espaces client et administrateur : dépôts, retraits, virements entre utilisateurs, plafonds de dépenses et validation des opérations. Sécurité au cœur du projet : requêtes préparées, mots de passe hachés, jetons CSRF et réinitialisation de mot de passe par jeton à durée limitée.",
    tags: ['PHP', 'MySQL', 'PDO', 'Sécurité web'],
    link: 'https://github.com/tims237/c4ed',
  },
]

export default function Projects() {
  return (
    <section id="projets" className="py-24 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-12">Projets</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col"
          >
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="mt-3 text-slate-400 flex-1">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="text-sm px-3 py-1 rounded-full bg-slate-800 text-blue-300">
                  {t}
                </span>
              ))}
            </div>
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                className="mt-6 inline-block text-blue-400 hover:text-blue-300 font-medium"
              >
                Voir le code →
              </a>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  )
}