// ═══════════════════════════════════════════════════════════
// MEALPICKERMODAL — Fenêtre de sélection du petit-déj
// Liste les recettes sauvegardées + bouton créer
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { Recipe } from '../lib/types'
import RecipeCreatorModal from './RecipeCreatorModal'

interface MealPickerModalProps {
  slot: string
  recipes: Recipe[]
  onClose: () => void
  onSelect: (recipe: Recipe) => void
  onSaveRecipe: (recipe: Recipe) => void
}

export default function MealPickerModal({
  slot,
  recipes,
  onClose,
  onSelect,
  onSaveRecipe,
}: MealPickerModalProps) {
  const [showCreator, setShowCreator] = useState(false)

  const filtered = recipes.filter(r => !r.slot || r.slot === slot)

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

        {/* Liste des recettes */}
        {filtered.length === 0 && (
          <p className="text-sm text-white/40 text-center py-4">
            Aucune recette sauvegardée. Crées-en une !
          </p>
        )}

        {filtered.map(recipe => (
          <button
            key={recipe.id}
            onClick={() => { onSelect(recipe); onClose() }}
            className="w-full text-left rounded-2xl p-4 border border-white/8 bg-white/4 transition-all"
          >
            <p className="font-semibold text-white text-sm">{recipe.name}</p>
            <p className="font-mono text-xs text-white/35 mt-1">
              {recipe.cal} cal · {recipe.prot}g P · {recipe.carb}g G · {recipe.lip}g L
            </p>
          </button>
        ))}

        {/* Bouton créer une recette */}
        <button
          onClick={() => setShowCreator(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 text-white/40 text-sm"
        >
          <Plus size={16} />
          Créer une recette
        </button>

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