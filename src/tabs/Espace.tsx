// ═══════════════════════════════════════════════════════════
// ESPACE — Onglet Mon Espace de AN.Santé
// Page principale avec sous-pages : suivi, recettes,
// ingrédients, roadmap, garde-fou, faire le bon choix
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import {
  ChevronRight, ChevronLeft, Shield, TrendingUp,
  UtensilsCrossed, Leaf, Map, Heart, Plus, Trash2, Pencil
} from 'lucide-react'
import { PHASES, INGREDIENTS_DB, CATEGORIES } from '../lib/constants'
import { Recipe, Ingredient } from '../lib/types'
import { getCurrentPhase, weeksSince } from '../lib/utils'
import RecipeCreatorModal from '../modals/RecipeCreatorModal'
import Suivi from '../components/Suivi'

// ── Props du composant ──
interface EspaceProps {
  recipes: Recipe[]
  saveRecipe: (recipe: Recipe) => void
  deleteRecipe: (id: string) => void
  programStart: string
  setProgramStart: (d: string) => void
  customIngs: Ingredient[]
  saveCustomIngredient: (ing: Ingredient) => void
  deleteCustomIngredient: (id: string) => void
}

// ── Règles par défaut du garde-fou ──
const DEFAULT_RULES = [
  { id: '1', text: "Je ne saute jamais le petit-déjeuner.", cat: 'alim' },
  { id: '2', text: "Les collations Whey sont non négociables.", cat: 'alim' },
  { id: '3', text: "Un écart = 1 repas, pas 1 journée.", cat: 'alim' },
  { id: '4', text: "Pas d'alcool pendant la phase 1.", cat: 'interdit' },
  { id: '5', text: "Pas de grignotage hors des 5 slots.", cat: 'interdit' },
  { id: '6', text: "Jamais de compensation : on ne saute pas le repas suivant.", cat: 'interdit' },
  { id: '7', text: "Minimum 4 séances par semaine.", cat: 'sport' },
  { id: '8', text: "Les étirements font partie de la séance.", cat: 'sport' },
]

// ── Catégories de règles ──
const RULE_CATS = [
  { id: 'alim', label: 'Alimentation', color: '#22c55e' },
  { id: 'interdit', label: 'Mes interdits', color: '#ef4444' },
  { id: 'sport', label: 'Sport', color: '#3b82f6' },
]

// ── Type des sous-pages disponibles ──
type SubPage = 'suivi' | 'recettes' | 'ingredients' | 'roadmap' | 'gardefou' | 'choix' | null

// ── Composant catégorie d'ingrédients pliable/dépliable ──
function CategorySection({ cat, ings, onDelete, onEdit, isCustom }: {
  cat: { id: string; label: string; color: string }
  ings: Ingredient[]
  onDelete?: (id: string) => void
  onEdit?: (ing: Ingredient) => void
  isCustom?: (id: string) => boolean
}) {
  const [open, setOpen] = useState(false)
  if (ings.length === 0) return null
  return (
    <div className="rounded-2xl overflow-hidden border border-white/8">
      {/* En-tête cliquable */}
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3 bg-white/5">
        <span className="text-sm font-semibold" style={{ color: cat.color }}>{cat.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 font-mono">{ings.length}</span>
          <ChevronRight size={16} className="text-white/30" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }} />
        </div>
      </button>
      {/* Liste des ingrédients */}
      {open && (
        <div className="divide-y divide-white/5">
          {ings.map(ing => (
            <div key={ing.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-sm text-white/70">{ing.name}</p>
                <p className="text-xs text-white/30 font-mono mt-0.5">
                  {ing.cal} cal · {ing.prot}g P · {ing.carb}g G · {ing.lip}g L / {ing.dQty}{ing.dUnit}
                </p>
              </div>
              {/* Bouton modifier (ingrédients personnalisés uniquement) */}
              {onEdit && (!isCustom || isCustom(ing.id)) && (
                <button onClick={() => onEdit(ing)} className="p-1.5 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                  <Pencil size={12} />
                </button>
              )}
              {/* Bouton supprimer avec confirmation */}
              {onDelete && (
                <button
                  onClick={() => { if (window.confirm(`Supprimer "${ing.name}" ?`)) onDelete(ing.id) }}
                  className="p-1.5 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Composant principal ──
export default function Espace({ recipes, saveRecipe, deleteRecipe, programStart, setProgramStart, customIngs, saveCustomIngredient, deleteCustomIngredient }: EspaceProps) {

  // ── State navigation ──
  const [subPage, setSubPage] = useState<SubPage>(null)

  // ── State garde-fou ──
  const [rules, setRules] = useState(DEFAULT_RULES)
  const [newRule, setNewRule] = useState('')
  const [newRuleCat, setNewRuleCat] = useState('alim')
  const [showRuleForm, setShowRuleForm] = useState(false)

  // ── State recettes ──
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null)
  const [showCreator, setShowCreator] = useState(false)
  const [delRecipe, setDelRecipe] = useState<Recipe | null>(null)

  // ── State ingrédients ──
  const [showIngForm, setShowIngForm] = useState(false)
  const [newIng, setNewIng] = useState({ name: '', cat: 'prot', dQty: 100, dUnit: 'g', cal: 0, prot: 0, carb: 0, lip: 0 })
  const [editIngId, setEditIngId] = useState<string | null>(null)
  const [deletedBaseIngs, setDeletedBaseIngs] = useState<string[]>([])

  // ── State roadmap ──
  const [editStart, setEditStart] = useState(false)
  const [tempStart, setTempStart] = useState(programStart)

  // ── Calculs phase et progression ──
  const phaseIdx = getCurrentPhase(programStart)
  const phase = PHASES[phaseIdx]
  const weekNum = weeksSince(programStart)
  const daysLeft = Math.max(0, (phaseIdx === 0 ? 42 : phaseIdx === 1 ? 28 : 42) - (weekNum - 1) * 7)
  const totalDays = phaseIdx === 0 ? 42 : phaseIdx === 1 ? 28 : 42
  const progressPct = Math.round(((totalDays - daysLeft) / totalDays) * 100)

  // ═══════════════════════════════════════════════════════════
  // SOUS-PAGES
  // ═══════════════════════════════════════════════════════════
  if (subPage) {
    return (
      <div className="p-4 pb-24">

        {/* Bouton retour */}
        <button onClick={() => setSubPage(null)} className="flex items-center gap-2 text-white/50 text-sm mb-6 pt-2">
          <ChevronLeft size={18} /> Mon Espace
        </button>

        {/* ── SUIVI ── */}
        {subPage === 'suivi' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Mon suivi</h2>
            <Suivi />
          </div>
        )}

        {/* ── RECETTES ── */}
        {subPage === 'recettes' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Mes recettes</h2>
            {recipes.length === 0 && (
              <p className="text-sm text-white/40 text-center py-4">Aucune recette sauvegardée.</p>
            )}
            {recipes.map(recipe => (
              <div key={recipe.id} className="bg-white/5 rounded-2xl p-4 border border-white/8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white text-sm">{recipe.name}</p>
                    <p className="font-mono text-xs text-white/30 mt-1">
                      {recipe.cal} cal · {recipe.prot}g P · {recipe.carb}g G · {recipe.lip}g L
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditRecipe(recipe); setShowCreator(true) }} className="p-1.5 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDelRecipe(recipe)} className="p-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => { setEditRecipe(null); setShowCreator(true) }} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 text-white/40 text-sm">
              <Plus size={16} /> Créer une recette
            </button>
          </div>
        )}

        {/* ── INGRÉDIENTS ── */}
        {subPage === 'ingredients' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Mes ingrédients</h2>

            {/* Toutes les catégories — base + personnalisés fusionnés */}
            {CATEGORIES.map(cat => {
              const baseIngs = INGREDIENTS_DB.filter(i => i.cat === cat.id && !deletedBaseIngs.includes(i.id))
              const customCatIngs = customIngs.filter(i => i.cat === cat.id)
              const catIngs = [...baseIngs, ...customCatIngs]
              return (
                <CategorySection
                  key={cat.id}
                  cat={cat}
                  ings={catIngs}
                  isCustom={(id) => customIngs.some(c => c.id === id)}
                  onDelete={(id) => {
                    if (customIngs.some(c => c.id === id)) deleteCustomIngredient(id)
                    else setDeletedBaseIngs(p => [...p, id])
                  }}
                  onEdit={(ing) => {
                    setNewIng({ name: ing.name, cat: ing.cat, dQty: ing.dQty, dUnit: ing.dUnit, cal: ing.cal, prot: ing.prot, carb: ing.carb, lip: ing.lip })
                    setEditIngId(ing.id)
                    setShowIngForm(true)
                  }}
                />
              )
            })}

            {/* Formulaire ajout ingrédient */}
            {showIngForm ? (
              <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/8">
                <p className="text-sm font-semibold text-white">Nouvel ingrédient</p>
                <input type="text" placeholder="Nom" value={newIng.name}
                  onChange={e => setNewIng(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
                <select value={newIng.cat} onChange={e => setNewIng(p => ({ ...p, cat: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
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
                      <input type="number" placeholder={f.ph} value={(newIng as any)[f.key] || ''}
                        onChange={e => setNewIng(p => ({ ...p, [f.key]: +e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none font-mono" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    if (!newIng.name.trim()) return
                    saveCustomIngredient({ ...newIng, id: editIngId ?? `custom-${Date.now()}` })
                    setNewIng({ name: '', cat: 'prot', dQty: 100, dUnit: 'g', cal: 0, prot: 0, carb: 0, lip: 0 })
                    setEditIngId(null)
                    setShowIngForm(false)
                  }} className="flex-1 py-2 rounded-xl bg-accent text-black text-sm font-semibold">Ajouter</button>
                  <button onClick={() => setShowIngForm(false)} className="flex-1 py-2 rounded-xl border border-white/10 text-white/50 text-sm">Annuler</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowIngForm(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 text-white/40 text-sm">
                <Plus size={16} /> Ajouter un ingrédient
              </button>
            )}
          </div>
        )}

        {/* ── ROADMAP ── */}
        {subPage === 'roadmap' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Roadmap</h2>

            {/* Date de début modifiable */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest">Début du programme</p>
                  <p className="font-mono text-lg font-bold text-accent mt-1">{programStart}</p>
                </div>
                <button onClick={() => setEditStart(e => !e)} className="p-2 rounded-xl border border-white/10 text-white/40">
                  <Pencil size={14} />
                </button>
              </div>
              {editStart && (
                <div className="mt-3 space-y-2">
                  <input type="date" value={tempStart} onChange={e => setTempStart(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-accent" />
                  <div className="flex gap-2">
                    <button onClick={() => { setProgramStart(tempStart); setEditStart(false) }} className="flex-1 py-2 rounded-xl bg-accent text-black text-sm font-semibold">Confirmer</button>
                    <button onClick={() => { setTempStart(programStart); setEditStart(false) }} className="flex-1 py-2 rounded-xl border border-white/10 text-white/50 text-sm">Annuler</button>
                  </div>
                </div>
              )}
            </div>

            {/* Les 3 phases avec dates calculées */}
            {PHASES.map((ph, i) => {
              const dayStarts = [0, 42, 70]
              const dayEnds = [41, 69, 111]
              const s = new Date(programStart); s.setDate(s.getDate() + dayStarts[i])
              const e = new Date(programStart); e.setDate(e.getDate() + dayEnds[i])
              const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
              return (
                <div key={ph.id} className="rounded-2xl p-4 border" style={{
                  background: i === phaseIdx ? `${ph.color}12` : 'rgba(255,255,255,0.03)',
                  borderColor: i === phaseIdx ? `${ph.color}30` : 'rgba(255,255,255,0.06)',
                  opacity: i === phaseIdx ? 1 : 0.5,
                }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ph.color }}>Phase {ph.id}</span>
                    <span className="text-xs text-white/30 font-mono">{fmt(s)} → {fmt(e)}</span>
                  </div>
                  <p className="font-bold text-white">{ph.name}</p>
                  <p className="text-xs text-white/40 mt-1">{ph.weeks} semaines · Objectif : {ph.weightGoal} kg · {ph.waistGoal} cm</p>
                </div>
              )
            })}
          </div>
        )}

        {/* ── GARDE-FOU ── */}
        {subPage === 'gardefou' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Mon garde-fou</h2>
            <p className="text-sm text-white/40">Tes règles. Ton programme.</p>

            {/* Règles groupées par catégorie */}
            {RULE_CATS.map(cat => {
              const catRules = rules.filter(r => r.cat === cat.id)
              if (catRules.length === 0) return null
              return (
                <div key={cat.id} className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: cat.color }}>{cat.label}</p>
                  {catRules.map(rule => (
                    <div key={rule.id} className="flex items-center gap-3 rounded-xl px-4 py-3 border"
                      style={{ background: `${cat.color}08`, borderColor: `${cat.color}18` }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      <p className="flex-1 text-sm text-white/80">{rule.text}</p>
                      <button onClick={() => setRules(rules.filter(r => r.id !== rule.id))}>
                        <Trash2 size={13} className="text-white/20" />
                      </button>
                    </div>
                  ))}
                </div>
              )
            })}

            {/* Formulaire ajout règle */}
            {showRuleForm ? (
              <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/8">
                <textarea placeholder="Ma règle..." value={newRule} onChange={e => setNewRule(e.target.value)}
                  rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none resize-none" />
                <select value={newRuleCat} onChange={e => setNewRuleCat(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
                  {RULE_CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <div className="flex gap-2">
                  <button onClick={() => {
                    if (!newRule.trim()) return
                    setRules(p => [...p, { id: `r-${Date.now()}`, text: newRule.trim(), cat: newRuleCat }])
                    setNewRule('')
                    setShowRuleForm(false)
                  }} className="flex-1 py-2 rounded-xl bg-accent text-black text-sm font-semibold">Ajouter</button>
                  <button onClick={() => setShowRuleForm(false)} className="flex-1 py-2 rounded-xl border border-white/10 text-white/50 text-sm">Annuler</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowRuleForm(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 text-white/40 text-sm">
                <Plus size={16} /> Ajouter une règle
              </button>
            )}
          </div>
        )}

        {/* ── FAIRE LE BON CHOIX ── */}
        {subPage === 'choix' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Faire le bon choix</h2>
            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/8">
              <Heart size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">À venir — stratégies pour faire le bon choix au bon moment.</p>
            </div>
          </div>
        )}

        {/* ── MODALS (recettes) ── */}
        {showCreator && (
          <RecipeCreatorModal
            editRecipe={editRecipe}
            onClose={() => { setShowCreator(false); setEditRecipe(null) }}
            onSave={(recipe) => {
              saveRecipe(recipe)
              setShowCreator(false)
              setEditRecipe(null)
            }}
          />
        )}

        {/* Confirmation suppression recette */}
        {delRecipe && (
          <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-5">
            <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-[340px] border border-white/10 space-y-4">
              <p className="font-bold text-white">Supprimer cette recette ?</p>
              <p className="text-sm text-white/50">"{delRecipe.name}" sera définitivement supprimée.</p>
              <div className="flex gap-2">
                <button onClick={() => setDelRecipe(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold">Annuler</button>
                <button onClick={() => { deleteRecipe(delRecipe.id); setDelRecipe(null) }}
                  className="flex-1 py-3 rounded-xl text-red-400 text-sm font-semibold" style={{ background: 'rgba(239,68,68,0.12)' }}>Supprimer</button>
              </div>
            </div>
          </div>
        )}

      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE PRINCIPALE
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="p-4 pb-24 space-y-4">

      {/* ── EN-TÊTE ── */}
      <div className="pt-2">
        <p className="text-xs text-white/40 uppercase tracking-widest">AN.Santé</p>
        <h1 className="text-2xl font-bold text-white">Mon Espace</h1>
      </div>

      {/* ── CARD PROGRAMME — phase active + anneau progression ── */}
      <div className="rounded-2xl p-4 flex items-center justify-between"
        style={{ background: `${phase.color}0d`, border: `1px solid ${phase.color}25` }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: phase.color }}>
            Phase {phase.id} — {phase.name}
          </p>
          <p className="text-2xl font-bold text-white font-mono mt-1">
            J{daysLeft} <span className="text-sm text-white/35 font-normal">restants</span>
          </p>
          <p className="text-xs text-white/35 mt-1">
            Début : {new Date(programStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        {/* Anneau SVG de progression */}
        <div className="relative w-16 h-16">
          <svg width="64" height="64" className="-rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
            <circle cx="32" cy="32" r="26" fill="none" stroke={phase.color} strokeWidth="4"
              strokeDasharray={2 * Math.PI * 26}
              strokeDashoffset={2 * Math.PI * 26 * (1 - progressPct / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-sm font-bold text-white">{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* ── GRILLE 2×2 — accès aux sous-pages ── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'suivi', label: 'Mon suivi', sub: 'Poids · taille · séances', color: '#3b82f6', icon: <TrendingUp size={16} /> },
          { id: 'recettes', label: 'Mes recettes', sub: `${recipes.length} recette${recipes.length > 1 ? 's' : ''}`, color: '#f59e0b', icon: <UtensilsCrossed size={16} /> },
          { id: 'ingredients', label: 'Ingrédients', sub: 'Base + personnalisés', color: '#a855f7', icon: <Leaf size={16} /> },
          { id: 'roadmap', label: 'Roadmap', sub: '3 phases · 16 semaines', color: 'rgba(255,255,255,0.5)', icon: <Map size={16} /> },
        ].map(item => (
          <button key={item.id} onClick={() => setSubPage(item.id as SubPage)}
            className="text-left rounded-2xl p-4 border transition-all active:scale-95"
            style={{ background: `${item.color}0d`, borderColor: `${item.color}25` }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${item.color}18`, color: item.color }}>
              {item.icon}
            </div>
            <p className="font-semibold text-white text-sm">{item.label}</p>
            <p className="text-xs text-white/35 mt-0.5">{item.sub}</p>
            <ChevronRight size={14} className="text-white/20 mt-2" />
          </button>
        ))}
      </div>

      {/* ── GARDE-FOU ── */}
      <button onClick={() => setSubPage('gardefou')}
        className="w-full text-left rounded-2xl p-4 border flex items-center gap-4 active:scale-95 transition-all"
        style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.15)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(239,68,68,0.12)' }}>
          <Shield size={18} className="text-red-400" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">Mon garde-fou</p>
          <p className="text-xs text-white/35 mt-0.5">{rules.length} règles actives</p>
        </div>
        <ChevronRight size={16} className="text-white/20" />
      </button>

      {/* ── FAIRE LE BON CHOIX (à venir) ── */}
      <button onClick={() => setSubPage('choix')}
        className="w-full text-left rounded-2xl p-4 border flex items-center gap-4 active:scale-95 transition-all"
        style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/8">
          <Heart size={18} className="text-white/50" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">Faire le bon choix</p>
          <p className="text-xs text-white/35 mt-0.5">À venir</p>
        </div>
        <ChevronRight size={16} className="text-white/20" />
      </button>

    </div>
  )
}