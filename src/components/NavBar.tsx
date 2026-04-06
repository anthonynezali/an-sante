// ═══════════════════════════════════════════════════════════
// NAVBAR — Barre de navigation fixe en bas de l'écran
// ═══════════════════════════════════════════════════════════

import { Home, Dumbbell, UtensilsCrossed, ShoppingCart, User } from 'lucide-react'
import { TabId } from '../lib/types'

interface NavBarProps {
  active: TabId
  onChange: (tab: TabId) => void
}

// Définition des 5 onglets
const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Accueil', icon: <Home size={22} strokeWidth={1.8} /> },
  { id: 'training', label: 'Training', icon: <Dumbbell size={22} strokeWidth={1.8} /> },
  { id: 'nutrition', label: 'Nutrition', icon: <UtensilsCrossed size={22} strokeWidth={1.8} /> },
  { id: 'courses', label: 'Courses', icon: <ShoppingCart size={22} strokeWidth={1.8} /> },
  { id: 'espace', label: 'Mon espace', icon: <User size={22} strokeWidth={1.8} /> },
]

export default function NavBar({ active, onChange }: NavBarProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#111] border-t border-white/10 flex justify-around items-center h-16 z-50">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
            active === tab.id ? 'text-accent' : 'text-white/40'
          }`}
        >
          {tab.icon}
          <span className="text-[10px]">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}