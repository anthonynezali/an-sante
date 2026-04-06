// ═══════════════════════════════════════════════════════════
// RECIPECREATORMODAL — Créer ou modifier une recette
// Ingrédients depuis la base + macros saisies manuellement
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { INGREDIENTS_DB, UNITS } from '../lib/constants'
import { Recipe } from '../lib/types'


interface RecipeCreatorModalProps {
  onClose: () => void
  onSave: (recipe: Recipe) => void
  editRecipe?: Recipe | null
  slot?: string
}

interface IngItem { ingId: string; qty: number; unit: string }

// Catégories affichées dans le picker
const CATEGORIES_PICKER = [
    { id: 'prot', label: 'Protéines', color: '#ef4444' },
    { id: 'fec', label: 'Féculents', color: '#f59e0b' },
    { id: 'leg', label: 'Légumes & fruits', color: '#22c55e' },
    { id: 'frais', label: 'Produits frais', color: '#3b82f6' },
    { id: 'epic', label: 'Épicerie', color: '#a855f7' },
    { id: 'supp', label: 'Suppléments', color: '#6b7280' },
  ]
  
  // Composant section catégorie pliable
  function CategorySection({ cat, ings, alreadyAdded, onSelect }: {
    cat: { id: string; label: string; color: string }
    ings: typeof INGREDIENTS_DB
    alreadyAdded: string[]
    onSelect: (id: string) => void
  }) {
    const [open, setOpen] = useState(false)
    return (
      <div className="rounded-xl overflow-hidden border border-white/8">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/5"
        >
          <span className="text-sm font-semibold" style={{ color: cat.color }}>{cat.label}</span>
          <span className="text-white/30 text-xs">{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <div className="divide-y divide-white/5">
            {ings.map(ing => (
              <button
                key={ing.id}
                onClick={() => onSelect(ing.id)}
                disabled={alreadyAdded.includes(ing.id)}
                className="w-full text-left px-4 py-3 transition-all"
                style={{ opacity: alreadyAdded.includes(ing.id) ? 0.3 : 1 }}
              >
                <span className="text-sm text-white">{ing.name}</span>
                <span className="text-xs text-white/30 font-mono ml-2">{ing.dQty}{ing.dUnit}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

export default function RecipeCreatorModal({ onClose, onSave, editRecipe, slot }: RecipeCreatorModalProps) {
  const [name, setName] = useState(editRecipe?.name || '')
  const [ings, setIngs] = useState<IngItem[]>(editRecipe?.ingredients || [])
  const [cal, setCal] = useState(editRecipe?.cal?.toString() || '')
  const [prot, setProt] = useState(editRecipe?.prot?.toString() || '')
  const [carb, setCarb] = useState(editRecipe?.carb?.toString() || '')
  const [lip, setLip] = useState(editRecipe?.lip?.toString() || '')
  const [showPicker, setShowPicker] = useState(false)
  const [pickerSearch, setPickerSearch] = useState('')

  const filteredIngs = INGREDIENTS_DB.filter(i =>
    i.name.toLowerCase().includes(pickerSearch.toLowerCase())
  )

  const addIng = (id: string) => {
    if (ings.find(i => i.ingId === id)) return
    const ing = INGREDIENTS_DB.find(i => i.id === id)!
    setIngs(p => [...p, { ingId: id, qty: ing.dQty, unit: ing.dUnit }])
    setShowPicker(false)
    setPickerSearch('')
  }

  const updateIng = (idx: number, field: 'qty' | 'unit', value: string | number) => {
    const updated = [...ings]
    updated[idx] = { ...updated[idx], [field]: field === 'qty' ? +value : value }
    setIngs(updated)
  }

  const canSave = name.trim().length > 0 && ings.length > 0

  const handleSave = () => {
    if (!canSave) return
    onSave({
      id: editRecipe?.id || `r-${Date.now()}`,
      name: name.trim(),
      ingredients: ings,
      cal: +cal || 0,
      prot: +prot || 0,
      carb: +carb || 0,
      lip: +lip || 0,
      slot: slot as Recipe['slot'],
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-end justify-center">
      <div className="w-full max-w-[430px] rounded-t-3xl p-6 overflow-y-auto max-h-[90vh] space-y-5" style={{ background: '#0d1f35', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {editRecipe ? 'Modifier la recette' : 'Nouvelle recette'}
          </h2>
          <button onClick={onClose} className="text-white/40"><X size={20} /></button>
        </div>

        {/* Nom */}
        <div className="space-y-2">
          <p className="text-xs text-white/40 uppercase tracking-widest">Nom de la recette</p>
          <input
            type="text"
            placeholder="ex: Fromage blanc chia cacao"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
          />
        </div>

        {/* Ingrédients */}
        <div className="space-y-2">
          <p className="text-xs text-white/40 uppercase tracking-widest">Ingrédients</p>
          {ings.map((ing, i) => {
            const base = INGREDIENTS_DB.find(x => x.id === ing.ingId)
            return (
              <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
                <span className="flex-1 text-sm text-white">{base?.name}</span>
                <input
                  type="number"
                  value={ing.qty}
                  onChange={e => updateIng(i, 'qty', e.target.value)}
                  className="w-16 bg-white/10 rounded-lg px-2 py-1 text-sm font-mono text-white text-right border-0 outline-none"
                />
                <select
                  value={ing.unit}
                  onChange={e => updateIng(i, 'unit', e.target.value)}
                  className="bg-white/10 rounded-lg px-2 py-1 text-xs text-white border-0 outline-none"
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <button onClick={() => setIngs(ings.filter((_, j) => j !== i))}>
                  <Trash2 size={14} className="text-white/30" />
                </button>
              </div>
            )
          })}
          <button
            onClick={() => setShowPicker(true)}
            className="w-full py-2.5 rounded-xl text-sm border border-dashed border-white/15 text-white/40"
          >
            + Ajouter un ingrédient
          </button>
        </div>

        {/* Macros manuelles */}
        <div className="space-y-2">
          <p className="text-xs text-white/40 uppercase tracking-widest">Macros totales (manuel)</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Calories', value: cal, set: setCal, placeholder: '345' },
              { label: 'Protéines (g)', value: prot, set: setProt, placeholder: '49' },
              { label: 'Glucides (g)', value: carb, set: setCarb, placeholder: '20' },
              { label: 'Lipides (g)', value: lip, set: setLip, placeholder: '8' },
            ].map(f => (
              <div key={f.label} className="space-y-1">
                <p className="text-xs text-white/30">{f.label}</p>
                <input
                  type="number"
                  placeholder={f.placeholder}
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-accent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: canSave ? '#22c55e' : 'rgba(255,255,255,0.08)',
            color: canSave ? '#000' : 'rgba(255,255,255,0.3)',
          }}
        >
          Sauvegarder la recette
        </button>

        {/* Picker ingrédients */}
        {showPicker && (
          <div className="fixed inset-0 bg-black/80 z-[110] flex items-end justify-center">
            <div className="w-full max-w-[430px] rounded-t-3xl p-6 overflow-y-auto max-h-[70vh] space-y-3" style={{ background: '#0a1628' }}>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white text-sm">Choisir un ingrédient</p>
                <button onClick={() => { setShowPicker(false); setPickerSearch('') }}>
                  <X size={18} className="text-white/40" />
                </button>
              </div>

              {/* Recherche */}
              <input
                type="text"
                placeholder="Rechercher..."
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none"
              />

              {/* Si recherche active : liste plate */}
              {pickerSearch.trim().length > 0 ? (
                filteredIngs.map(ing => (
                  <button
                    key={ing.id}
                    onClick={() => addIng(ing.id)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-white/8 bg-white/4"
                  >
                    <span className="text-sm text-white">{ing.name}</span>
                    <span className="text-xs text-white/30 font-mono ml-2">{ing.dQty}{ing.dUnit}</span>
                  </button>
                ))
              ) : (
                /* Si pas de recherche : catégories pliables */
                CATEGORIES_PICKER.map(cat => (
                  <CategorySection
                    key={cat.id}
                    cat={cat}
                    ings={INGREDIENTS_DB.filter(i => i.cat === cat.id)}
                    alreadyAdded={ings.map(i => i.ingId)}
                    onSelect={addIng}
                  />
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}