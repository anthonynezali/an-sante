// ═══════════════════════════════════════════════════════════
// MEALPICKERMODAL — Sélection d'un repas pour un slot donné
// 3 chemins : recette existante, créer une recette, composer libre
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { X, Plus, ChefHat, BookOpen } from 'lucide-react'
import { Recipe } from '../lib/types'
import RecipeCreatorModal from './RecipeCreatorModal'

interface MealPickerModalProps {
  slot: string
  recipes: Recipe[]
  onClose: () => void
  onSelect: (recipe: Recipe) => void
  onSaveRecipe: (recipe: Recipe) => void
  onCompose: () => void
}

export default function MealPickerModal({
  slot,
  recipes,
  onClose,
  onSelect,
  onSaveRecipe,
  onCompose,
}: MealPickerModalProps) {
  const [showCreator, setShowCreator] = useState(false)

  // pdj : strict pdj. midi/soir : interchangeables. Recettes sans slot : visibles partout.
  const filtered = recipes.filter(r => {
    if (!r.slot) return true
    if (slot === 'pdj') return r.slot === 'pdj'
    return r.slot === 'midi' || r.slot === 'soir'
  })

  const slotLabel: Record<string, string> = {
    pdj: 'Petit-déj',
    midi: 'Déjeuner',
    soir: 'Dîner',
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-end justify-center">
      <div className="w-full max-w-[430px] rounded-t-3xl p-6 space-y-4 overflow-y-auto max-h-[85vh]" style={{ background: '#0d1f35', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {slotLabel[slot] || 'Repas'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* ── MES RECETTES ── */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-white/40" />
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Mes recettes</p>
          </div>

          {filtered.length === 0 && (
            <p className="text-sm text-white/30 text-center py-3">
              Aucune recette sauvegardée pour ce repas.
            </p>
          )}

          {filtered.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => { onSelect(recipe); onClose() }}
              className="w-full text-left rounded-2xl p-4 border border-white/8 bg-white/4 transition-all active:scale-[0.98]"
            >
              <p className="font-semibold text-white text-sm">{recipe.name}</p>
              <p className="font-mono text-xs text-white/35 mt-1">
                {recipe.cal} cal · {recipe.prot}g P · {recipe.carb}g G · {recipe.lip}g L
              </p>
            </button>
          ))}
        </div>

        {/* ── ACTIONS ── */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => setShowCreator(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-accent active:scale-[0.98] transition-all"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <Plus size={16} />
            Créer une recette
          </button>

          <button
            onClick={() => { onCompose(); onClose() }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white/60 active:scale-[0.98] transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ChefHat size={16} />
            Composer librement
          </button>
        </div>

        {/* Modal création recette */}
        {showCreator && (
          <RecipeCreatorModal
            slot={slot}
            onClose={() => setShowCreator(false)}
            onSave={(recipe) => {
              onSaveRecipe(recipe)
              setShowCreator(false)
            }}
          />
        )}

      </div>
    </div>
  )
}
