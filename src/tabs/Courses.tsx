// ═══════════════════════════════════════════════════════════
// COURSES — Onglet liste de courses de AN.Santé
// Design glassmorphism
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { Check, ShoppingCart, PackageCheck } from 'lucide-react'
import { INGREDIENTS_DB, CATEGORIES } from '../lib/constants'
import { Recipe, WeekMeals } from '../lib/types'

interface CoursesProps {
  weekMeals: WeekMeals
  recipes: Recipe[]
}

function getMealIngredients(meal: WeekMeals[string], recipes: Recipe[]) {
  if (meal.type === 'recipe') {
    const recipe = recipes.find(r => r.id === meal.recipeId)
    if (!recipe) return []
    return recipe.ingredients.map(ri => ({ ingId: ri.ingId, qty: ri.qty, unit: ri.unit }))
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

  // Agrégation des ingrédients
  const agg: Record<string, { ingId: string; totalQty: number; unit: string; cat: string; name: string }> = {}
  Object.entries(weekMeals).forEach(([key, meal]) => {
    if (!meal || !meal.inCourses) return
    const dateStr = key.split('-').slice(0, 3).join('-')
    if (dateStr < todayStr) return
    const ings = getMealIngredients(meal, recipes)
    ings.forEach(ing => {
      const k = `${ing.ingId}-${ing.unit}`
      const base = INGREDIENTS_DB.find(i => i.id === ing.ingId)
      if (!agg[k]) agg[k] = { ingId: ing.ingId, totalQty: 0, unit: ing.unit, cat: base?.cat || 'epic', name: base?.name || ing.ingId }
      agg[k].totalQty += ing.qty
    })
  })

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = Object.values(agg).filter(item => item.cat === cat.id)
    return acc
  }, {} as Record<string, typeof agg[string][]>)

  const hasItems = Object.values(grouped).some(arr => arr.length > 0)
  const totalItems = Object.values(agg).length
  const checkedCount = Object.values(checked).filter(Boolean).length

  return (
    <div className="px-5 pt-6 pb-28 space-y-4">

      {/* ── EN-TÊTE ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Ma liste de</p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Courses</h1>
        </div>
        {totalItems > 0 && (
          <div className="text-right">
            <p className="font-mono text-2xl font-extrabold text-accent">{checkedCount}</p>
            <p className="text-xs text-white/40">/ {totalItems} articles</p>
          </div>
        )}
      </div>

      {/* ── LISTE VIDE ── */}
      {!hasItems && (
        <div className="rounded-2xl p-8 text-center space-y-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <ShoppingCart size={36} className="text-white/20 mx-auto" />
          <p className="text-sm text-white/40 leading-relaxed">
            Compose tes repas dans <span className="text-white/70 font-semibold">Nutrition</span> pour générer ta liste.
          </p>
        </div>
      )}

      {/* ── CATÉGORIES ── */}
      {CATEGORIES.map(cat => {
        const items = grouped[cat.id]
        if (!items || items.length === 0) return null
        return (
          <div key={cat.id} className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: cat.color }}>
              {cat.label}
            </p>
            {items.map(item => {
              const ck = `${item.ingId}-${item.unit}`
              const isChecked = !!checked[ck]
              return (
                <div key={ck}
                  onClick={() => setChecked(p => ({ ...p, [ck]: !p[ck] }))}
                  className="flex items-center gap-3 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98]"
                  style={{
                    background: isChecked ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isChecked ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.08)'}`,
                    opacity: isChecked ? 0.55 : 1,
                  }}>
                  <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-all"
                    style={{
                      background: isChecked ? '#22c55e' : 'transparent',
                      borderColor: isChecked ? '#22c55e' : 'rgba(150,150,150,0.4)',
                    }}>
                    {isChecked && <Check size={13} className="text-black" strokeWidth={3} />}
                  </div>
                  <span className={`flex-1 text-base font-medium ${isChecked ? 'line-through text-white/30' : 'text-white'}`}>
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

      {/* ── TOUJOURS VÉRIFIER ── */}
      <div className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <PackageCheck size={16} className="text-white/40" />
          <p className="text-xs text-white/40 uppercase tracking-widest">À toujours vérifier</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg border-2 border-white/20 flex-shrink-0" />
          <span className="text-base text-white/60">Whey protéine — 1 pot d'avance</span>
        </div>
      </div>

    </div>
  )
}