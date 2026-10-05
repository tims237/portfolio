import { useTextes } from '../i18n'

const textes = {
  fr: {
    titre: 'À propos',
    paragraphes: [
      "Je suis en troisième année de Bachelor Informatique, spécialité Data & IA, à l'ECE Paris, et je compte poursuivre en cycle ingénieur. Mon objectif à terme : devenir ingénieur en intelligence artificielle.",
      "Avant la data, il y a eu le terrain : la vente, puis le support informatique et l'administration réseau. Ces expériences m'ont appris à être fiable, à écouter les utilisateurs et à résoudre des problèmes concrets.",
      "Ce qui me plaît aujourd'hui, c'est le chemin complet de la donnée : la collecter, la nettoyer, en tirer un modèle, puis la rendre lisible dans un tableau de bord. Mon stage chez Skills4Mind sur Swim AI m'a confirmé que c'est là que je veux construire.",
    ],
    infos: [
      { cle: 'Je recherche', valeur: 'Une alternance Data Analyst ou Data Engineer' },
      { cle: 'Où', valeur: 'Île-de-France ou Lyon' },
      { cle: 'Langues', valeur: 'Français (natif), anglais (intermédiaire)' },
      { cle: 'Prochaine étape', valeur: 'Cycle ingénieur, puis ingénieur IA' },
    ],
  },
  en: {
    titre: 'About',
    paragraphes: [
      "I'm a third-year Computer Science student specialising in Data & AI at ECE Paris, and I plan to continue into the engineering degree programme. My long-term goal: to become an AI engineer.",
      'Before data, I learned on the ground: retail, then IT support and network administration. Those jobs taught me to be reliable, to listen to users and to solve real problems.',
      'What I enjoy today is the whole journey of data: collecting it, cleaning it, building a model from it, then making it readable in a dashboard. My internship at Skills4Mind on Swim AI confirmed that this is where I want to build.',
    ],
    infos: [
      { cle: 'Looking for', valeur: 'A Data Analyst or Data Engineer apprenticeship' },
      { cle: 'Where', valeur: 'Paris area or Lyon' },
      { cle: 'Languages', valeur: 'French (native), English (intermediate)' },
      { cle: 'Next step', valeur: 'Engineering degree, then AI engineer' },
    ],
  },
}

export default function About() {
  const t = useTextes(textes)
  return (
    <section id="a-propos" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-5xl font-bold tracking-tight md:text-7xl">{t.titre}</h2>

      <div className="mt-14 grid gap-12 border-t border-rule pt-10 md:grid-cols-[1.5fr_1fr] md:gap-16">
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed">
          {t.paragraphes.map((p, i) => (
            <p key={i} className={i === 0 ? 'text-xl md:text-2xl md:leading-snug' : 'text-muted'}>
              {p}
            </p>
          ))}
        </div>

        <dl className="self-start border-t border-rule md:border-t-0">
          {t.infos.map((info) => (
            <div key={info.cle} className="border-b border-rule py-4 first:pt-4 md:first:pt-0">
              <dt className="text-sm text-muted">{info.cle}</dt>
              <dd className="mt-1 font-medium">{info.valeur}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}