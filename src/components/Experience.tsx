import { motion } from 'motion/react'

const experiences = [
  {
    role: 'AI, Data & Software Development Intern',
    company: 'Skills4Mind',
    date: 'Avril – juillet 2026',
      points: [
      'Développement du back-end de Swim AI, application de prédiction de performance en natation',
      'Pipeline data, modèles ML/DL (Random Forest, XGBoost, LSTM), TimescaleDB et Grafana',
      'Industrialisation avec Docker, CI/CD GitHub Actions et respect du RGPD',
    ],
  },
  {
    role: 'Support IT',
    company: 'Heliaq',
    date: 'Août 2025',
    points: [
      'Configuration d’équipements réseau Sophos, Cisco et Aruba',
      'Gestion des flux via pare-feu et virtualisation d’architectures réseau',
    ],
  },
  {
    role: 'Administrateur réseau et systèmes junior',
    company: 'TYLIA',
    date: 'Juillet 2025',
    points: [
      'Maintenance de plus de 200 équipements informatiques sur deux sites',
      'Suivi du parc sous Excel et support utilisateurs Microsoft 365',
    ],
  },
]

const education = [
  { school: 'ECE Paris', diploma: 'Bachelor Informatique, Data & IA', date: '2025 – 2027' },
  { school: 'Institut Universitaire de la Côte', diploma: 'Prépa ingénieur, informatique', date: '2022 – 2023' },
]

export default function Experience() {
  return (
    <section id="parcours" className="py-24 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-12">Parcours</h2>
      <div className="space-y-8 border-l border-slate-800 pl-6">
        {experiences.map((e) => (
          <motion.div
            key={e.company}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm text-blue-300">{e.date}</p>
            <h3 className="text-xl font-semibold">
              {e.role} · <span className="text-slate-400">{e.company}</span>
            </h3>
            <ul className="mt-2 list-disc list-inside text-slate-400 space-y-1">
              {e.points.map((pt) => <li key={pt}>{pt}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>
      <h3 className="text-2xl font-bold mt-16 mb-6">Formation</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {education.map((ed) => (
          <div key={ed.school} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-blue-300">{ed.date}</p>
            <h4 className="text-lg font-semibold">{ed.school}</h4>
            <p className="text-slate-400">{ed.diploma}</p>
          </div>
        ))}
      </div>
    </section>
  )
}