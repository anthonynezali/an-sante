// ═══════════════════════════════════════════════════════════
// ESPACE — Onglet Mon Espace de AN.Santé
// Roadmap, suivi, recettes, ingrédients, mental
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Trash2, Plus } from 'lucide-react'
import { PHASES, INGREDIENTS_DB, CATEGORIES } from '../lib/constants'
import { Recipe } from '../lib/types'
import RecipeCreatorModal from '../modals/RecipeCreatorModal'
import { weeksSince } from '../lib/utils'

interface EspaceProps {
  recipes: Recipe[]
  setRecipes: (r: Recipe[]) => void
  programStart: string
  setProgramStart: (d: string) => void
}

// ── Système craving ──
const CRAVING_OPTIONS = [
  { emoji: '🥛', name: 'Fromage blanc 0%', sub: '+ cacao non sucré', color: '#22c55e' },
  { emoji: '🍌', name: 'Banane', sub: '+ 10 amandes', color: '#3b82f6' },
  { emoji: '🥤', name: 'Whey shake', sub: '', color: '#a855f7' },
  { emoji: '🥚', name: '2 œufs durs', sub: '', color: '#f59e0b' },
]

// ── Règles anti foutu pour foutu ──
const RULES = [
  "Un écart = 1 repas, pas 1 journée.",
  "Le prochain repas repart à zéro.",
  "Pas de compensation : on ne saute pas le repas suivant.",
  "Un craving = on choisit dans la liste, on ne résiste pas.",
]

export default function Espace({ recipes, setRecipes, programStart, setProgramStart }: EspaceProps) {
  const [activeSection, setActiveSection] = useState<string | null>('roadmap')
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null)
  const [showCreator, setShowCreator] = useState(false)
  const [delRecipe, setDelRecipe] = useState<Recipe | null>(null)
  const [editStart, setEditStart] = useState(false)
  const [tempStart, setTempStart] = useState(programStart)

  // ── Ingrédients custom (ceux ajoutés par l'utilisateur) ──
  const [customIngs, setCustomIngs] = useState<typeof INGREDIENTS_DB>([])
  const [showIngForm, setShowIngForm] = useState(false)
  const [newIng, setNewIng] = useState({ name: '', cat: 'prot', dQty: 100, dUnit: 'g', cal: 0, prot: 0, carb: 0, lip: 0 })

  const toggle = (section: string) => setActiveSection(p => p === section ? null : section)

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="rounded-2xl overflow-hidden border border-white/8">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between px-4 py-4 bg-white/5"
      >
        <span className="font-semibold text-white text-sm">{title}</span>
        {activeSection === id ? <ChevronUp size={18} className="text-white/40" /> : <ChevronDown size={18} className="text-white/40" />}
      </button>
      {activeSection === id && (
        <div className="p-4 space-y-3 bg-white/2">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className="p-4 pb-24 space-y-3">

      {/* ── EN-TÊTE ── */}
      <div className="pt-2 pb-2">
        <p className="text-xs text-white/40 uppercase tracking-widest">Mon</p>
        <h1 className="text-2xl font-bold text-white">Espace</h1>
      </div>

      {/* ── DATE DE DÉBUT ── */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest">Début du programme</p>
            <p className="font-mono text-lg font-bold text-accent mt-1">{programStart}</p>
          </div>
          <button
            onClick={() => setEditStart(e => !e)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/10 text-white/50"
          >
            <Pencil size={13} />
          </button>
        </div>
        {editStart && (
          <div className="mt-3 space-y-2">
            <input
              type="date"
              value={tempStart}
              onChange={e => setTempStart(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setProgramStart(tempStart); setEditStart(false) }}
                className="flex-1 py-2 rounded-xl bg-accent text-black text-sm font-semibold"
              >
                Confirmer
              </button>
              <button
                onClick={() => { setTempStart(programStart); setEditStart(false) }}
                className="flex-1 py-2 rounded-xl border border-white/10 text-white/50 text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── ROADMAP ── */}
      <Section id="roadmap" title="📍 Roadmap du programme">
        <div className="space-y-3">
          {PHASES.map((phase, i) => (
            <div
              key={phase.id}
              className="rounded-xl p-4"
              style={{
                background: i === 0 ? `${phase.color}12` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${i === 0 ? phase.color + '30' : 'rgba(255,255,255,0.06)'}`,
                opacity: i === 0 ? 1 : 0.5,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: phase.color }}>
                  Phase {phase.id}
                </span>
                <span className="text-xs text-white/30 font-mono">
                {(() => {
                const start = new Date(programStart)
                const dayStarts = [0, 42, 70]
                const dayEnds = [41, 69, 111]
                const s = new Date(start)
                s.setDate(s.getDate() + dayStarts[i])
                const e = new Date(start)
                e.setDate(e.getDate() + dayEnds[i])
                const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                return `${fmt(s)} → ${fmt(e)}`
              })()}
                </span>
              </div>
              <p className="font-bold text-white">{phase.name}</p>
              <p className="text-xs text-white/40 mt-1">
                {phase.weeks} semaines · Objectif : {phase.weightGoal} kg · {phase.waistGoal} cm
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── MON SUIVI ── */}
      <Section id="suivi" title="📈 Mon suivi">
        <div className="text-center py-6 space-y-2">
          <p className="text-white/40 text-sm">Le suivi sera disponible après connexion à Supabase.</p>
          <p className="text-white/20 text-xs">Poids · Tour de taille · Séances · Calories</p>
        </div>
      </Section>

      {/* ── MES RECETTES ── */}
      <Section id="recettes" title="🍽 Mes recettes">
        {recipes.length === 0 && (
          <p className="text-sm text-white/40 text-center py-2">Aucune recette sauvegardée.</p>
        )}
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-white/5 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-white text-sm">{recipe.name}</p>
                <p className="font-mono text-xs text-white/30 mt-1">
                  {recipe.cal} cal · {recipe.prot}g P · {recipe.carb}g G · {recipe.lip}g L
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditRecipe(recipe); setShowCreator(true) }}
                  className="p-1.5 rounded-lg"
                  style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDelRecipe(recipe)}
                  className="p-1.5 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => { setEditRecipe(null); setShowCreator(true) }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/15 text-white/40 text-sm"
        >
          <Plus size={16} /> Créer une recette
        </button>
      </Section>

      {/* ── MES INGRÉDIENTS ── */}
      <Section id="ingredients" title="🥗 Mes ingrédients">
        <p className="text-xs text-white/40">Ingrédients de base</p>
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="space-y-1">
            <p className="text-xs font-semibold" style={{ color: cat.color }}>{cat.label}</p>
            {INGREDIENTS_DB.filter(i => i.cat === cat.id).map(ing => (
              <div key={ing.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/3">
                <span className="text-sm text-white/70">{ing.name}</span>
                <span className="text-xs text-white/30 font-mono">{ing.cal} cal / {ing.dQty}{ing.dUnit}</span>
              </div>
            ))}
          </div>
        ))}

        {/* Ingrédients custom */}
        {customIngs.length > 0 && (
          <div className="space-y-1 mt-2">
            <p className="text-xs text-white/40">Mes ingrédients personnalisés</p>
            {customIngs.map((ing, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-accent/5 border border-accent/15">
                <span className="text-sm text-white/70">{ing.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30 font-mono">{ing.cal} cal</span>
                  <button onClick={() => setCustomIngs(customIngs.filter((_, j) => j !== i))}>
                    <Trash2 size={12} className="text-red-400/60" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire ajout ingrédient */}
        {showIngForm ? (
          <div className="space-y-3 bg-white/5 rounded-xl p-4 mt-2">
            <p className="text-sm font-semibold text-white">Nouvel ingrédient</p>
            <input
              type="text" placeholder="Nom" value={newIng.name}
              onChange={e => setNewIng(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
            />
            <select
              value={newIng.cat}
              onChange={e => setNewIng(p => ({ ...p, cat: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
            >
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Qté défaut', key: 'dQty', ph: '100' },
                { label: 'Calories', key: 'cal', ph: '150' },
                { label: 'Protéines (g)', key: 'prot', ph: '20' },
                { label: 'Glucides (g)', key: 'carb', ph: '10' },
                { label: 'Lipides (g)', key: 'lip', ph: '5' },
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <p className="text-xs text-white/30">{f.label}</p>
                  <input
                    type="number" placeholder={f.ph}
                    value={(newIng as any)[f.key] || ''}
                    onChange={e => setNewIng(p => ({ ...p, [f.key]: +e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none font-mono"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!newIng.name.trim()) return
                  setCustomIngs(p => [...p, { ...newIng, id: `custom-${Date.now()}`, dUnit: 'g' }])
                  setNewIng({ name: '', cat: 'prot', dQty: 100, dUnit: 'g', cal: 0, prot: 0, carb: 0, lip: 0 })
                  setShowIngForm(false)
                }}
                className="flex-1 py-2 rounded-xl bg-accent text-black text-sm font-semibold"
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowIngForm(false)}
                className="flex-1 py-2 rounded-xl border border-white/10 text-white/50 text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowIngForm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/15 text-white/40 text-sm mt-2"
          >
            <Plus size={16} /> Ajouter un ingrédient
          </button>
        )}
      </Section>

      {/* ── ANTI FOUTU POUR FOUTU ── */}
      <Section id="mental" title="🧠 Anti foutu pour foutu">
        <div className="space-y-2">
          {RULES.map((rule, i) => (
            <div key={i} className="flex gap-3 bg-red-500/8 border border-red-500/15 rounded-xl p-3">
              <span className="text-red-400 font-bold text-sm">{i + 1}.</span>
              <span className="text-sm text-white/70">{rule}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CRAVING ── */}
      <Section id="craving" title="🍫 J'ai une envie">
        <p className="text-xs text-white/40">Tu ne résistes pas — tu choisis.</p>
        <div className="grid grid-cols-2 gap-3">
          {CRAVING_OPTIONS.map((o, i) => (
            <div
              key={i}
              className="rounded-xl p-4 text-center"
              style={{ background: `${o.color}0d`, border: `1px solid ${o.color}20` }}
            >
              <div className="text-2xl mb-2">{o.emoji}</div>
              <p className="text-sm font-semibold text-white">{o.name}</p>
              {o.sub && <p className="text-xs text-white/40 mt-1">{o.sub}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* ── MODALS ── */}
      {showCreator && (
        <RecipeCreatorModal
          editRecipe={editRecipe}
          onClose={() => { setShowCreator(false); setEditRecipe(null) }}
          onSave={(recipe) => {
            if (editRecipe) {
              setRecipes(recipes.map(r => r.id === recipe.id ? recipe : r))
            } else {
              setRecipes([...recipes, recipe])
            }
            setShowCreator(false)
            setEditRecipe(null)
          }}
        />
      )}

      {delRecipe && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-5">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-[340px] border border-white/10 space-y-4">
            <p className="font-bold text-white">Supprimer cette recette ?</p>
            <p className="text-sm text-white/50">"{delRecipe.name}" sera définitivement supprimée.</p>
            <div className="flex gap-2">
              <button onClick={() => setDelRecipe(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold">Annuler</button>
              <button
                onClick={() => { setRecipes(recipes.filter(r => r.id !== delRecipe.id)); setDelRecipe(null) }}
                className="flex-1 py-3 rounded-xl text-red-400 text-sm font-semibold"
                style={{ background: 'rgba(239,68,68,0.12)' }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}