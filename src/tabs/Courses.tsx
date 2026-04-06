// ═══════════════════════════════════════════════════════════
// COURSES — Onglet Liste de courses
// Agrège tous les ingrédients des repas planifiés
// à partir d'aujourd'hui, groupés par catégorie
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { Check, ShoppingCart } from 'lucide-react'
import { INGREDIENTS_DB, CATEGORIES } from '../lib/constants'
import { Recipe, WeekMeals } from '../lib/types'

interface CoursesProps {
  weekMeals: WeekMeals
  recipes: Recipe[]
}

// Récupère les ingrédients d'un repas
function getMealIngredients(meal: WeekMeals[string], recipes: Recipe[]) {
  if (meal.type === 'recipe') {
    const recipe = recipes.find(r => r.id === meal.recipeId)
    if (!recipe) return []
    return recipe.ingredients.map(ri => ({
      ingId: ri.ingId,
      qty: ri.qty,
      unit: ri.unit,
    }))
  }
  if (meal.type === 'composed') {
    const ids = [meal.prot, ...meal.fec, ...meal.leg, ...meal.supplements]
    return ids.filter(Boolean).map(id => {
      const ing = INGREDIENTS_DB.find(i => i.id === id)
      return ing ? { ingId: id, qty: ing.dQty, unit: ing.dUnit } : null
    }).filter(Boolean) as { ingId: string; qty: number; unit: string }[]
  }
  return []
}

export default function Courses({ weekMeals, recipes }: CoursesProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const todayStr = new Date().toISOString().slice(0, 10)

  // Agrégation des ingrédients à partir d'aujourd'hui
  const agg: Record<string, { ingId: string; totalQty: number; unit: string; cat: string; name: string }> = {}

  Object.entries(weekMeals).forEach(([key, meal]) => {
    if (!meal || !meal.inCourses) return
    const dateStr = key.split('-').slice(0, 3).join('-')
    if (dateStr < todayStr) return

    const ings = getMealIngredients(meal, recipes)
    ings.forEach(ing => {
      const k = `${ing.ingId}-${ing.unit}`
      const base = INGREDIENTS_DB.find(i => i.id === ing.ingId)
      if (!agg[k]) {
        agg[k] = {
          ingId: ing.ingId,
          totalQty: 0,
          unit: ing.unit,
          cat: base?.cat || 'epic',
          name: base?.name || ing.ingId,
        }
      }
      agg[k].totalQty += ing.qty
    })
  })

  // Grouper par catégorie
  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = Object.values(agg).filter(item => item.cat === cat.id)
    return acc
  }, {} as Record<string, typeof agg[string][]>)

  const hasItems = Object.values(grouped).some(arr => arr.length > 0)
  const totalItems = Object.values(agg).length
  const checkedCount = Object.values(checked).filter(Boolean).length

  return (
    <div className="p-4 pb-24 space-y-4">

      {/* ── EN-TÊTE ── */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Liste de</p>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
        </div>
        {totalItems > 0 && (
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-accent">{checkedCount}</p>
            <p className="text-xs text-white/40">/ {totalItems} articles</p>
          </div>
        )}
      </div>

      {/* ── LISTE VIDE ── */}
      {!hasItems && (
        <div className="bg-white/5 rounded-2xl p-6 text-center space-y-2">
          <ShoppingCart size={32} className="text-white/20 mx-auto" />
          <p className="text-sm text-white/40">
            Compose tes repas dans l'onglet <span className="text-white/70 font-semibold">Nutrition</span> pour générer ta liste.
          </p>
        </div>
      )}

      {/* ── CATÉGORIES ── */}
      {CATEGORIES.map(cat => {
        const items = grouped[cat.id]
        if (!items || items.length === 0) return null
        return (
          <div key={cat.id} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: cat.color }}>
              {cat.label}
            </p>
            {items.map(item => {
              const isChecked = !!checked[item.ingId]
              return (
                <div
                  key={item.ingId}
                  onClick={() => setChecked(p => ({ ...p, [item.ingId]: !p[item.ingId] }))}
                  className="flex items-center gap-3 rounded-2xl p-4 cursor-pointer transition-all"
                  style={{
                    background: isChecked ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isChecked ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.08)'}`,
                    opacity: isChecked ? 0.6 : 1,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-all"
                    style={{
                      background: isChecked ? '#22c55e' : 'transparent',
                      borderColor: isChecked ? '#22c55e' : 'rgba(150,150,150,0.5)',
                    }}
                  >
                    {isChecked && <Check size={12} className="text-black" strokeWidth={3} />}
                  </div>
                  <span className={`flex-1 text-sm font-medium ${isChecked ? 'line-through text-white/30' : 'text-white'}`}>
                    {item.name}
                  </span>
                  <span className="font-mono text-sm text-white/40">
                    {item.totalQty} {item.unit}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}

      {/* ── WHEY À VÉRIFIER ── */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/8">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-3">À toujours vérifier</p>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg border-2 border-white/20 flex-shrink-0" />
          <span className="text-sm text-white">Whey protéine — 1 pot d'avance</span>
        </div>
      </div>

    </div>
  )
}