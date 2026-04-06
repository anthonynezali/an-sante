// ═══════════════════════════════════════════════════════════
// NUTRITION — Onglet alimentation de AN.Santé
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check, Bell, Pencil, Trash2, ShoppingCart } from 'lucide-react'
import { TARGETS, INGREDIENTS_DB } from '../lib/constants'
import { getWeekDays } from '../lib/utils'
import { Recipe, WeekMeals, RecipeMeal } from '../lib/types'
import MealPickerModal from '../modals/MealPickerModal'
import ComposeMealModal from '../modals/ComposeMealModal'
import RecipeCreatorModal from '../modals/RecipeCreatorModal'

const FIXED_COLLATIONS = [
  { time: "10:00", name: "Collation", detail: "Whey 30g", cal: 120, prot: 24, carb: 3, lip: 1 },
  { time: "16:00", name: "Collation", detail: "Whey 30g", cal: 120, prot: 24, carb: 3, lip: 1 },
]

const SLOTS = [
  { key: "pdj",  time: "05:45", name: "Petit-déj",  fixed: false },
  { key: "col1", time: "10:00", name: "Collation",   fixed: true,  ...FIXED_COLLATIONS[0] },
  { key: "midi", time: "12:30", name: "Déjeuner",    fixed: false },
  { key: "col2", time: "16:00", name: "Collation",   fixed: true,  ...FIXED_COLLATIONS[1] },
  { key: "soir", time: "19:30", name: "Dîner",       fixed: false },
]

function getIng(id: string) { return INGREDIENTS_DB.find(x => x.id === id) }

function getMealMacros(meal: WeekMeals[string], recipes: Recipe[]) {
  if (meal.type === 'composed') {
    const p = getIng(meal.prot)
    const fecs = meal.fec.map(id => getIng(id))
    const legs = meal.leg.map(id => getIng(id))
    const all = [p, ...fecs, ...legs].filter(Boolean)
    return {
      cal:  all.reduce((s, i) => s + (i?.cal  || 0), 0),
      prot: all.reduce((s, i) => s + (i?.prot || 0), 0),
      carb: all.reduce((s, i) => s + (i?.carb || 0), 0),
      lip:  all.reduce((s, i) => s + (i?.lip  || 0), 0),
    }
  }
  const r = recipes.find(r => r.id === meal.recipeId)
  return r ? { cal: r.cal, prot: r.prot, carb: r.carb, lip: r.lip } : { cal: 0, prot: 0, carb: 0, lip: 0 }
}

function MacroBar3({ label, target, planned, consumed, color, unit = 'g' }: {
  label: string; target: number; planned: number; consumed: number; color: string; unit?: string
}) {
  const pP = target > 0 ? Math.min(planned / target, 1) : 0
  const pC = target > 0 ? Math.min(consumed / target, 1) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium" style={{ color }}>{label}</span>
        <span className="font-mono text-white/40">
          {consumed} <span className="text-white/20">/ {planned} obj {target}{unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div className="absolute h-full rounded-full" style={{ width: `${pP * 100}%`, backgroundColor: `${color}30` }} />
        <div className="absolute h-full rounded-full transition-all duration-500" style={{ width: `${pC * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

interface NutritionProps {
  recipes: Recipe[]
  setRecipes: (r: Recipe[]) => void
  weekMeals: WeekMeals
  setWeekMeals: (fn: (prev: WeekMeals) => WeekMeals) => void
}

export default function Nutrition({ recipes, weekMeals, setWeekMeals }: NutritionProps) {
  const [weekOff, setWeekOff] = useState(0)
  const days = getWeekDays(weekOff)
  const todayIdx = days.findIndex(d => d.isToday)
  const [selIdx, setSelIdx] = useState(todayIdx >= 0 ? todayIdx : 0)
  const [checkedMeals, setCheckedMeals] = useState<Record<string, boolean>>({})
  const [delTarget, setDelTarget] = useState<{ dk: string; slot: string } | null>(null)
  const [pickerSlot, setPickerSlot] = useState<string | null>(null)
  const [composeSlot, setComposeSlot] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<{ dk: string; slot: string } | null>(null)

  const sel = days[selIdx] || days[0]
  const dk = sel.dateStr

  const getMeal = (d: string, s: string) => weekMeals[`${d}-${s}`] || null
  const clearMeal = (d: string, s: string) => setWeekMeals(p => { const n = { ...p }; delete n[`${d}-${s}`]; return n })
  const toggleCheck = (k: string) => setCheckedMeals(p => ({ ...p, [k]: !p[k] }))
  const toggleCourses = (d: string, s: string) => setWeekMeals(p => {
    const k = `${d}-${s}`; const m = p[k]; if (!m) return p
    return { ...p, [k]: { ...m, inCourses: !m.inCourses } }
  })

  const planned = { cal: 0, prot: 0, carb: 0, lip: 0 }
  const consumed = { cal: 0, prot: 0, carb: 0, lip: 0 }
  SLOTS.forEach(slot => {
    const ck = `${dk}-${slot.key}`
    const isChecked = !!checkedMeals[ck]
    if (slot.fixed) {
      const s = slot as typeof FIXED_COLLATIONS[0] & { key: string; name: string; fixed: boolean }
      planned.cal += s.cal; planned.prot += s.prot; planned.carb += s.carb; planned.lip += s.lip
      if (isChecked) { consumed.cal += s.cal; consumed.prot += s.prot; consumed.carb += s.carb; consumed.lip += s.lip }
    } else {
      const meal = getMeal(dk, slot.key)
      if (meal) {
        const m = getMealMacros(meal, recipes)
        planned.cal += m.cal; planned.prot += m.prot; planned.carb += m.carb; planned.lip += m.lip
        if (isChecked) { consumed.cal += m.cal; consumed.prot += m.prot; consumed.carb += m.carb; consumed.lip += m.lip }
      }
    }
  })

  const weekLabel = weekOff === 0 ? "Cette semaine" : weekOff === 1 ? "Semaine prochaine" : weekOff === -1 ? "Semaine dernière" : `${weekOff > 0 ? "+" : ""}${weekOff} sem.`

  return (
    <div className="p-4 pb-24 space-y-4">

      {/* ── NAVIGATION SEMAINE ── */}
      <div className="flex items-center gap-2 pt-2">
        <button onClick={() => { setWeekOff(w => w - 1); setSelIdx(0) }} className="bg-white/5 border border-white/10 rounded-xl p-2">
          <ChevronLeft size={18} className="text-white/60" />
        </button>
        <p className="flex-1 text-center text-sm font-semibold text-white/70">{weekLabel}</p>
        <button onClick={() => { setWeekOff(w => w + 1); setSelIdx(0) }} className="bg-white/5 border border-white/10 rounded-xl p-2">
          <ChevronRight size={18} className="text-white/60" />
        </button>
      </div>

      {/* ── BANDE DES JOURS ── */}
      <div className="flex gap-1">
        {days.map((d, i) => {
          const s = i === selIdx
          const hasMeal = getMeal(d.dateStr, 'midi') || getMeal(d.dateStr, 'soir') || getMeal(d.dateStr, 'pdj')
          return (
            <button key={d.dateStr} onClick={() => setSelIdx(i)}
              className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl border-2 transition-colors"
              style={{
                background: s ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                borderColor: s ? '#22c55e' : d.isToday ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)',
                opacity: d.isPast && !d.isToday ? 0.5 : 1,
              }}
            >
              <span className="text-[10px] font-semibold" style={{ color: s ? '#22c55e' : 'rgba(255,255,255,0.4)' }}>{d.day}</span>
              <span className="font-mono text-base font-bold" style={{ color: s ? '#22c55e' : 'rgba(255,255,255,0.7)' }}>{d.dateNum}</span>
              <span className="text-[8px] text-white/30">{d.month}</span>
              {hasMeal && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </button>
          )
        })}
      </div>

      {/* ── MACROS DU JOUR ── */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-bold text-white">Macros du jour</p>
          <span className="font-mono text-xs" style={{ color: planned.cal > 0 ? (planned.cal <= TARGETS.cal ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.3)' }}>
            {planned.cal > 0 ? `${planned.cal} cal` : '—'}
          </span>
        </div>
        <MacroBar3 label="Calories" target={TARGETS.cal} planned={planned.cal} consumed={consumed.cal} color="#22c55e" unit="" />
        <MacroBar3 label="Protéines" target={TARGETS.prot} planned={planned.prot} consumed={consumed.prot} color="#3b82f6" />
        <MacroBar3 label="Glucides" target={TARGETS.carb} planned={planned.carb} consumed={consumed.carb} color="#f59e0b" />
        <MacroBar3 label="Lipides" target={TARGETS.lip} planned={planned.lip} consumed={consumed.lip} color="#a855f7" />
      </div>

      {/* ── SLOTS REPAS ── */}
      {SLOTS.map(slot => {
        const ck = `${dk}-${slot.key}`
        const done = !!checkedMeals[ck]
        const meal = !slot.fixed ? getMeal(dk, slot.key) : null
        const macros = meal ? getMealMacros(meal, recipes) : null

        return (
          <div key={slot.key} className="rounded-2xl p-4 transition-all"
            style={{
              background: done ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${done ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.08)'}`,
              opacity: done ? 0.7 : 1,
            }}
          >
            <div className="flex items-start gap-3">
              <div onClick={() => toggleCheck(ck)}
                className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 border-2 cursor-pointer transition-all"
                style={{ background: done ? '#22c55e' : 'transparent', borderColor: done ? '#22c55e' : 'rgba(150,150,150,0.5)' }}
              >
                {done && <Check size={12} className="text-black" strokeWidth={3} />}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className={`font-bold text-sm ${done ? 'line-through text-white/40' : 'text-white'}`}>{slot.name}</span>
                  <span className="font-mono text-xs text-white/30">{slot.time}</span>
                </div>

                {/* Collation fixe */}
                {slot.fixed && (
                  <>
                    <p className="text-sm text-white/50 mt-1">{(slot as any).detail}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Bell size={11} className="text-yellow-400" />
                      <span className="text-xs text-yellow-400 font-semibold">Alarme</span>
                    </div>
                  </>
                )}

                {/* Repas renseigné */}
                {!slot.fixed && meal && (
                  <>
                    {meal.type === 'recipe' && (
                      <p className="text-sm text-accent font-semibold mt-1">
                        {recipes.find(r => r.id === meal.recipeId)?.name || '—'}
                      </p>
                    )}
                    {meal.type === 'composed' && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {meal.prot && <span className="text-xs px-2 py-0.5 rounded-md font-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{getIng(meal.prot)?.name}</span>}
                        {meal.fec.map(id => <span key={id} className="text-xs px-2 py-0.5 rounded-md font-semibold" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{getIng(id)?.name}</span>)}
                        {meal.leg.map(id => <span key={id} className="text-xs px-2 py-0.5 rounded-md font-semibold" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>{getIng(id)?.name}</span>)}
                      </div>
                    )}
                    {macros && <p className="font-mono text-xs text-white/30 mt-2">{macros.cal} cal · {macros.prot}g P · {macros.carb}g G · {macros.lip}g L</p>}
                    <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setEditTarget({ dk, slot: slot.key })}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}
                    >
                      <Pencil size={11} /> Modifier
                    </button>
                      <button onClick={() => setDelTarget({ dk, slot: slot.key })}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}
                      >
                        <Trash2 size={11} /> Supprimer
                      </button>
                    </div>
                    <div onClick={() => toggleCourses(dk, slot.key)} className="flex items-center gap-2 mt-2 cursor-pointer">
                      <div className="w-4 h-4 rounded flex items-center justify-center border"
                        style={{ background: meal.inCourses ? '#22c55e' : 'transparent', borderColor: meal.inCourses ? '#22c55e' : 'rgba(150,150,150,0.4)' }}
                      >
                        {meal.inCourses && <Check size={9} className="text-black" strokeWidth={3} />}
                      </div>
                      <span className="text-xs text-white/40 flex items-center gap-1">
                        <ShoppingCart size={11} /> Inclure dans les courses
                      </span>
                    </div>
                  </>
                )}

                {/* Slot vide */}
                {!slot.fixed && !meal && (
                  <div className="flex gap-2 mt-2">
                    {slot.key === 'pdj' ? (
                      <button
                        onClick={() => setPickerSlot(slot.key)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-accent border border-accent/20"
                        style={{ background: 'rgba(34,197,94,0.08)' }}
                      >
                        + Mon petit-déj
                      </button>
                    ) : (
                      <button
                        onClick={() => setComposeSlot(slot.key)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/50 border border-white/10"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                      >
                        + Composer mon repas
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* ── RAPPEL ALARMES ── */}
      <div className="rounded-xl p-3 flex items-center justify-center gap-2" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}>
        <Bell size={14} className="text-yellow-400" />
        <span className="text-xs text-yellow-400 font-semibold">Alarmes collations : 10h00 et 16h00</span>
      </div>

      {/* ── CONFIRMATION SUPPRESSION ── */}
      {delTarget && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-5">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-[340px] border border-white/10 space-y-4">
            <p className="font-bold text-white">Supprimer ce repas ?</p>
            <p className="text-sm text-white/50">Il sera retiré de ta journée et de la liste de courses.</p>
            <div className="flex gap-2">
              <button onClick={() => setDelTarget(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold">Annuler</button>
              <button onClick={() => { clearMeal(delTarget.dk, delTarget.slot); setDelTarget(null) }} className="flex-1 py-3 rounded-xl text-red-400 text-sm font-semibold" style={{ background: 'rgba(239,68,68,0.12)' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {pickerSlot && (
        <MealPickerModal
          slot={pickerSlot}
          recipes={recipes}
          onClose={() => setPickerSlot(null)}
          onSelect={(recipe) => {
            const meal: RecipeMeal = { type: 'recipe', recipeId: recipe.id, inCourses: true }
            setWeekMeals(p => ({ ...p, [`${dk}-${pickerSlot}`]: meal }))
            setPickerSlot(null)
          }}
          onSaveRecipe={(recipe) => {
            setRecipes(prev => [...prev, recipe])
          }}
        />
      )}
      {composeSlot && (
        <ComposeMealModal
          onClose={() => setComposeSlot(null)}
          onSave={(meal) => {
            setWeekMeals(p => ({ ...p, [`${dk}-${composeSlot}`]: meal }))
            setComposeSlot(null)
          }}
        />
      )}
      {/* ── MODIFIER UN REPAS ── */}
{editTarget && (() => {
  const meal = getMeal(editTarget.dk, editTarget.slot)
  if (!meal) return null
  
  if (meal.type === 'recipe') {
    const recipe = recipes.find(r => r.id === meal.recipeId)
    return (
      <RecipeCreatorModal
        slot={editTarget.slot}
        editRecipe={recipe}
        onClose={() => setEditTarget(null)}
        onSave={(updated) => {
          setRecipes(prev => prev.map(r => r.id === updated.id ? updated : r))
          setEditTarget(null)
        }}
      />
    )
  }

  if (meal.type === 'composed') {
    return (
      <ComposeMealModal
        editMeal={meal}
        onClose={() => setEditTarget(null)}
        onSave={(updated) => {
          setWeekMeals(p => ({ ...p, [`${editTarget.dk}-${editTarget.slot}`]: updated }))
          setEditTarget(null)
        }}
      />
    )
  }
})()}  
    </div>
  )
}