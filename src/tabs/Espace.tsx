// ═══════════════════════════════════════════════════════════
// ESPACE — Onglet Mon Espace
// ═══════════════════════════════════════════════════════════

import { Recipe } from '../lib/types'

interface EspaceProps {
  recipes: Recipe[]
  setRecipes: (r: Recipe[]) => void
}

export default function Espace({ recipes }: EspaceProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-accent">Mon Espace</h2>
      <p className="text-white/50 text-sm mt-1">Espace en construction…</p>
    </div>
  )
}