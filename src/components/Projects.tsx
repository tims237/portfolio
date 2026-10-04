import { motion } from 'motion/react'

const projects = [
  {
    title: 'Plateforme de test IA avec stack ELK',
    description:
      "Plateforme conteneurisée qui ingère et traite des logs JSON issus de plusieurs services simulés, avec des dashboards Kibana en temps réel pour superviser les événements système.",
    tags: ['Docker', 'Elasticsearch', 'Logstash', 'Kibana'],
  },
  {
    title: 'Swim AI : prédiction de performance sportive',
    description:
      "Projet académique en équipe : nettoyage, exploration et modélisation de jeux de données multivariables pour prédire les performances de nageurs.",
    tags: ['Python', 'Machine Learning', 'Data cleaning'],
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
            className="rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="mt-3 text-slate-400">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="text-sm px-3 py-1 rounded-full bg-slate-800 text-blue-300">
                  {t}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}