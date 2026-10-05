import { useTextes } from '../i18n'

const textes = {
  fr: {
    titre: 'Parcours',
    titreFormation: 'Formation',
    experiences: [
      {
        periode: 'Avril – juillet 2026',
        poste: 'Stagiaire AI, Data & Software Development',
        entreprise: 'Skills4Mind',
        points: [
          'Back-end de Swim AI : API, base de données, authentification et indicateurs de performance',
          'Modèle Random Forest de risque de surentraînement et dashboards Grafana',
          'Environnement Docker et prise en compte du RGPD',
        ],
      },
      {
        periode: 'Août 2025',
        poste: 'Support IT',
        entreprise: 'Heliaq',
        points: [
          'Configuration d’équipements réseau Sophos, Cisco et Aruba',
          'Gestion des flux via pare-feu et virtualisation d’architectures réseau',
        ],
      },
      {
        periode: 'Juillet 2025',
        poste: 'Administrateur réseau et systèmes junior',
        entreprise: 'TYLIA',
        points: [
          'Maintenance de plus de 200 équipements informatiques sur deux sites',
          'Suivi du parc sous Excel et support utilisateurs Microsoft 365',
        ],
      },
    ],
    formations: [
      { periode: '2025 – 2027', diplome: 'Bachelor Informatique, Data & IA', ecole: 'ECE Paris' },
      { periode: '2022 – 2023', diplome: 'Première année de cycle ingénieur', ecole: 'Institut Universitaire de la Côte' },
    ],
  },
  en: {
    titre: 'Experience',
    titreFormation: 'Education',
    experiences: [
      {
        periode: 'April – July 2026',
        poste: 'AI, Data & Software Development Intern',
        entreprise: 'Skills4Mind',
        points: [
          'Back-end of Swim AI: API, database, authentication and performance metrics',
          'Random Forest overtraining-risk model and Grafana dashboards',
          'Docker environment and GDPR compliance',
        ],
      },
      {
        periode: 'August 2025',
        poste: 'IT Support',
        entreprise: 'Heliaq',
        points: [
          'Configuration of Sophos, Cisco and Aruba network equipment',
          'Firewall traffic management and network architecture virtualisation',
        ],
      },
      {
        periode: 'July 2025',
        poste: 'Junior Network & Systems Administrator',
        entreprise: 'TYLIA',
        points: [
          'Maintenance of 200+ IT devices across two sites',
          'Asset tracking in Excel and Microsoft 365 user support',
        ],
      },
    ],
    formations: [
      { periode: '2025 – 2027', diplome: "Bachelor's in Computer Science, Data & AI", ecole: 'ECE Paris' },
      { periode: '2022 – 2023', diplome: 'First year of engineering school', ecole: 'Institut Universitaire de la Côte' },
    ],
  },
}

export default function Experience() {
  const t = useTextes(textes)
  return (
    <section id="parcours" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-5xl font-bold tracking-tight md:text-7xl">{t.titre}</h2>

      <ol className="mt-14 border-t border-rule">
        {t.experiences.map((e) => (
          <li key={e.entreprise} className="grid gap-3 border-b border-rule py-8 md:grid-cols-[14rem_1fr] md:gap-12">
            <p className="text-muted">{e.periode}</p>
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                {e.poste}, <span className="text-chlore">{e.entreprise}</span>
              </h3>
              <ul className="mt-3 space-y-1.5 leading-relaxed text-muted">
                {e.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <h3 className="mt-20 font-display text-3xl font-bold tracking-tight">{t.titreFormation}</h3>
      <ol className="mt-8 border-t border-rule">
        {t.formations.map((f) => (
          <li key={f.ecole} className="grid gap-3 border-b border-rule py-6 md:grid-cols-[14rem_1fr] md:gap-12">
            <p className="text-muted">{f.periode}</p>
            <p className="text-lg">
              {f.diplome}, <span className="text-muted">{f.ecole}</span>
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}