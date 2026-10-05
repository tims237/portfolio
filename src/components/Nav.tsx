const liens = [
  { href: '#projets', label: 'Projets' },
  { href: '#parcours', label: 'Parcours' },
  { href: '#competences', label: 'Compétences' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-ink/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#haut" className="font-display text-lg font-semibold tracking-tight">
          elvis<span className="text-chlore">.</span>
        </a>
        <ul className="flex gap-6 text-sm text-muted">
          {liens.map((l) => (
            <li key={l.href} className={l.href === '#contact' ? '' : 'hidden sm:block'}>
              <a href={l.href} className="transition-colors hover:text-paper">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}