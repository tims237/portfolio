const projets = [
  {
    nom: 'Swim AI',
    contexte: 'Stage chez Skills4Mind, 2026',
    resume: 'Plateforme de suivi et de prédiction de performance pour les clubs de natation.',
    detail:
      "En charge du back-end dans une équipe de 4 : API REST FastAPI de 27 routes avec authentification JWT et trois rôles, calcul de la charge d'entraînement (ACWR), score de fatigue et score de risque de surentraînement par Random Forest.",
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'scikit-learn', 'React', 'Docker', 'Grafana'],
    lien: 'https://github.com/tims237/swim-ai',
  },
  {
    nom: 'C4ED',
    contexte: 'Application web, 2025',
    resume: 'Application bancaire simulée avec espaces client et administrateur.',
    detail:
      'Dépôts, retraits, virements entre utilisateurs, plafonds de dépenses et validation des opérations. Sécurité au cœur du projet : requêtes préparées, mots de passe hachés, jetons CSRF et réinitialisation par jeton à durée limitée.',
    stack: ['PHP', 'MySQL', 'PDO', 'HTML', 'CSS'],
    lien: 'https://github.com/tims237/c4ed',
  },
  {
    nom: 'Plateforme de logs ELK',
    contexte: 'Projet technique',
    resume: 'Supervision en temps réel des logs de plusieurs services applicatifs.',
    detail:
      'Plateforme conteneurisée qui ingère et traite des logs JSON issus de plusieurs services simulés, avec des dashboards Kibana pour analyser et superviser les événements système.',
    stack: ['Docker', 'Elasticsearch', 'Logstash', 'Kibana'],
    lien: '',
  },
]

export default function Projects() {
  return (
    <section id="projets" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
        Projets
        <sup className="ml-2 text-lg font-medium text-chlore md:text-2xl">{projets.length}</sup>
      </h2>

      <ul className="mt-14 border-t border-rule">
        {projets.map((p) => (
          <li
            key={p.nom}
            className="group grid gap-6 border-b border-rule py-10 md:grid-cols-[1fr_1.4fr] md:gap-12"
          >
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
              {p.lien && (
                <a
                  href={p.lien}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block border-b border-chlore pb-0.5 font-medium text-chlore transition-colors hover:border-paper hover:text-paper"
                >
                  Voir le code source
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}