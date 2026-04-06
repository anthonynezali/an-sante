// ═══════════════════════════════════════════════════════════
// NAVBAR — Barre de navigation glass en bas de l'écran
// ═══════════════════════════════════════════════════════════

import { Home, Dumbbell, UtensilsCrossed, ShoppingCart, User } from 'lucide-react'
import { TabId } from '../lib/types'

interface NavBarProps {
  active: TabId
  onChange: (tab: TabId) => void
}

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Accueil', icon: <Home size={22} strokeWidth={1.8} /> },
  { id: 'training', label: 'Training', icon: <Dumbbell size={22} strokeWidth={1.8} /> },
  { id: 'nutrition', label: 'Nutrition', icon: <UtensilsCrossed size={22} strokeWidth={1.8} /> },
  { id: 'courses', label: 'Courses', icon: <ShoppingCart size={22} strokeWidth={1.8} /> },
  { id: 'espace', label: 'Espace', icon: <User size={22} strokeWidth={1.8} /> },
]

export default function NavBar({ active, onChange }: NavBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex justify-around items-center h-20 z-50 px-2"
      style={{
        background: 'rgba(6,13,31,0.85)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all active:scale-90"
            style={{
              color: isActive ? '#22c55e' : 'rgba(255,255,255,0.35)',
              background: isActive ? 'rgba(34,197,94,0.1)' : 'transparent',
            }}
          >
            {tab.icon}
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}