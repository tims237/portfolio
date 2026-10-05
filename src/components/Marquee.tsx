import { useTextes } from '../i18n'

const stack = [
  'Python', 'SQL', 'FastAPI', 'PostgreSQL', 'MySQL', 'scikit-learn', 'PyTorch', 'Docker',
  'Elasticsearch', 'Kibana', 'Grafana', 'Power BI', 'React', 'TypeScript', 'PHP',
]

export default function Marquee() {
  const titre = useTextes({ fr: 'Technologies utilisées', en: 'Technologies I use' })
  const suite = [...stack, ...stack]
  return (
    <div className="overflow-hidden border-y border-rule py-5">
      <p className="sr-only">
        {titre} : {stack.join(', ')}
      </p>
      <div
        aria-hidden="true"
        className="defile flex w-max whitespace-nowrap font-display text-2xl font-semibold text-muted md:text-3xl"
      >
        {suite.map((t, i) => (
          <span key={i} className="flex items-center gap-10 pr-10">
            {t}
            <span className="text-chlore">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}