const groups = [
  { name: 'Data & IA', items: ['Python', 'SQL', 'Random Forest', 'XGBoost', 'LSTM', 'PyTorch', 'OpenCV'] },
  { name: 'Data Engineering & DevOps', items: ['Docker', 'ELK', 'TimescaleDB', 'GitHub Actions', 'GitLab'] },
  { name: 'Visualisation & BI', items: ['Power BI', 'Kibana', 'Grafana'] },
  { name: 'Web & automatisation', items: ['JavaScript', 'React', 'TypeScript', 'APIs', 'n8n', 'Prompt engineering'] },
]

export default function Skills() {
  return (
    <section id="competences" className="py-24 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-12">Compétences</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {groups.map((g) => (
          <div key={g.name} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold mb-4">{g.name}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((it) => (
                <span key={it} className="text-sm px-3 py-1 rounded-full bg-slate-800 text-blue-300">
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-slate-400">
        Certifications : AWS Academy Cloud Foundations · Prompt Engineering, IA générative
      </p>
    </section>
  )
}