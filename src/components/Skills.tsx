import { useTextes } from '../i18n'

const textes = {
  fr: {
    titre: 'Compétences',
    certifs: 'Certifications : AWS Academy Cloud Foundations, Prompt Engineering et IA générative.',
    groupes: [
      { nom: 'Data & IA', items: ['Python', 'SQL', 'scikit-learn', 'Random Forest', 'PyTorch', 'OpenCV'] },
      { nom: 'Back-end & bases de données', items: ['FastAPI', 'PostgreSQL', 'MySQL', 'SQLAlchemy', 'PHP', 'API REST'] },
      { nom: 'DevOps & supervision', items: ['Docker', 'Elasticsearch', 'Logstash', 'Kibana', 'Grafana', 'Git, GitLab'] },
      { nom: 'Visualisation & web', items: ['Power BI', 'React', 'TypeScript', 'Tailwind CSS', 'n8n'] },
    ],
  },
  en: {
    titre: 'Skills',
    certifs: 'Certifications: AWS Academy Cloud Foundations, Prompt Engineering and Generative AI.',
    groupes: [
      { nom: 'Data & AI', items: ['Python', 'SQL', 'scikit-learn', 'Random Forest', 'PyTorch', 'OpenCV'] },
      { nom: 'Back-end & databases', items: ['FastAPI', 'PostgreSQL', 'MySQL', 'SQLAlchemy', 'PHP', 'REST APIs'] },
      { nom: 'DevOps & monitoring', items: ['Docker', 'Elasticsearch', 'Logstash', 'Kibana', 'Grafana', 'Git, GitLab'] },
      { nom: 'Visualisation & web', items: ['Power BI', 'React', 'TypeScript', 'Tailwind CSS', 'n8n'] },
    ],
  },
}

export default function Skills() {
  const t = useTextes(textes)
  return (
    <section id="competences" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-5xl font-bold tracking-tight md:text-7xl">{t.titre}</h2>

      <div className="mt-14 grid gap-x-10 gap-y-12 border-t border-rule pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {t.groupes.map((g) => (
          <div key={g.nom}>
            <h3 className="font-display text-xl font-semibold text-chlore">{g.nom}</h3>
            <ul className="mt-4 space-y-2 text-lg">
              {g.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-14 max-w-2xl text-muted">{t.certifs}</p>
    </section>
  )
}