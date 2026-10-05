import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Langue = 'fr' | 'en'

type Contexte = { langue: Langue; setLangue: (l: Langue) => void }

const LangueContexte = createContext<Contexte>({ langue: 'fr', setLangue: () => {} })

function langueInitiale(): Langue {
  try {
    const choix = localStorage.getItem('langue')
    if (choix === 'fr' || choix === 'en') return choix
  } catch {
    // Stockage indisponible : on se base sur la langue du navigateur
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export function LangueProvider({ children }: { children: ReactNode }) {
  const [langue, setLangue] = useState<Langue>(langueInitiale)

  useEffect(() => {
    document.documentElement.lang = langue
    try {
      localStorage.setItem('langue', langue)
    } catch {
      // Le choix reste valable pour cette visite
    }
  }, [langue])

  return <LangueContexte.Provider value={{ langue, setLangue }}>{children}</LangueContexte.Provider>
}

export function useLangue() {
  return useContext(LangueContexte)
}

// Renvoie la version des textes qui correspond à la langue choisie
export function useTextes<T>(textes: Record<Langue, T>): T {
  return textes[useLangue().langue]
}