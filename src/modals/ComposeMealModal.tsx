// ═══════════════════════════════════════════════════════════
// COMPOSEMEALMODAL — Composer un repas rapide
// Protéine + Féculents + Légumes + Suppléments
// Calcul macros automatique selon les quantités
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { INGREDIENTS_DB, UNITS } from '../lib/constants'
import { ComposedMeal } from '../lib/types'

interface ComposeMealModalProps {
  onClose: () => void
  onSave: (meal: ComposedMeal) => void
  editMeal?: ComposedMeal | null
}

const prots = INGREDIENTS_DB.filter(i => i.cat === 'prot')
const fecs  = INGREDIENTS_DB.filter(i => i.cat === 'fec')
const legs  = INGREDIENTS_DB.filter(i => i.cat === 'leg')

interface IngItem { id: string; qty: number; unit: string }

function getItem(id: string): IngItem {
  const ing = INGREDIENTS_DB.find(i => i.id === id)
  return { id, qty: ing?.dQty || 100, unit: ing?.dUnit || 'g' }
}

export default function ComposeMealModal({ onClose, onSave, editMeal }: ComposeMealModalProps) {
  const [prot, setProt] = useState<IngItem | null>(
    editMeal?.prot ? getItem(editMeal.prot) : null
  )
  const [fecList, setFecList] = useState<IngItem[]>(
    editMeal?.fec.map(getItem) || []
  )
  const [legList, setLegList] = useState<IngItem[]>(
    editMeal?.leg.map(getItem) || []
  )
  const [suppList, setSuppList] = useState<IngItem[]>(
    editMeal?.supplements.map(getItem) || []
  )
  const [picker, setPicker] = useState<'prot' | 'fec' | 'leg' | 'supp' | null>(null)

  const calcMacros = (item: IngItem) => {
    const ing = INGREDIENTS_DB.find(i => i.id === item.id)
    if (!ing) return { cal: 0, prot: 0, carb: 0, lip: 0 }
    const ratio = ing.dQty > 0 ? item.qty / ing.dQty : 0
    return {
      cal:  Math.round(ing.cal  * ratio),
      prot: Math.round(ing.prot * ratio),
      carb: Math.round(ing.carb * ratio),
      lip:  Math.round(ing.lip  * ratio),
    }
  }

  const totalMacros = () => {
    const items = [...(prot ? [prot] : []), ...fecList, ...legList, ...suppList]
    return items.reduce(
      (acc, item) => {
        const m = calcMacros(item)
        return { cal: acc.cal + m.cal, prot: acc.prot + m.prot, carb: acc.carb + m.carb, lip: acc.lip + m.lip }
      },
      { cal: 0, prot: 0, carb: 0, lip: 0 }
    )
  }

  const addFec  = (id: string) => { setFecList(p => [...p, getItem(id)]); setPicker(null) }
  const addLeg  = (id: string) => { setLegList(p => [...p, getItem(id)]); setPicker(null) }
  const addSupp = (id: string) => { setSuppList(p => [...p, getItem(id)]); setPicker(null) }
  const setProt_ = (id: string) => { setProt(getItem(id)); setPicker(null) }

  const updateQty = (list: IngItem[], setList: (l: IngItem[]) => void, idx: number, qty: number) => {
    const updated = [...list]; updated[idx] = { ...updated[idx], qty }; setList(updated)
  }

  const macros = totalMacros()
  const canSave = prot !== null

  const handleSave = () => {
    if (!prot) return
    const m = totalMacros()
    onSave({
      type: 'composed',
      prot: prot.id,
      fec: fecList.map(f => f.id),
      leg: legList.map(l => l.id),
      supplements: suppList.map(s => s.id),
      cal: m.cal,
      prot_g: m.prot,
      carb: m.carb,
      lip: m.lip,
      inCourses: true,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-end justify-center">
      <div className="w-full max-w-[430px] rounded-t-3xl p-6 overflow-y-auto max-h-[90vh] space-y-5" style={{ background: '#0d1f35', border: '1px solid rgba(255,255,255,0.1)' }}>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {editMeal ? 'Modifier le repas' : 'Composer mon repas'}
          </h2>
          <button onClick={onClose} className="text-white/40"><X size={20} /></button>
        </div>

        {/* ── PROTÉINE ── */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#ef4444' }}>Protéine</p>
          <p className="text-xs text-white/30 -mt-1">Poids cru — ajuste selon la cuisson</p>
          {prot ? (
            <div className="flex items-center gap-2 rounded-xl p-3 border" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}>
              <span className="flex-1 text-sm text-white">{INGREDIENTS_DB.find(i => i.id === prot.id)?.name}</span>
              <input type="number" value={prot.qty} onChange={e => setProt({ ...prot, qty: +e.target.value })} className="w-16 bg-white/10 rounded-lg px-2 py-1 text-sm font-mono text-white text-right border-0 outline-none" />
              <select value={prot.unit} onChange={e => setProt({ ...prot, unit: e.target.value })} className="bg-white/10 rounded-lg px-2 py-1 text-xs text-white border-0 outline-none">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <button onClick={() => setProt(null)}><Trash2 size={14} className="text-white/30" /></button>
            </div>
          ) : (
            <button onClick={() => setPicker('prot')} className="w-full py-2.5 rounded-xl text-sm border border-dashed text-white/40" style={{ borderColor: 'rgba(239,68,68,0.25)' }}>
              + Choisir une protéine
            </button>
          )}
        </div>

        {/* ── FÉCULENTS ── */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Féculents</p>
          <p className="text-xs text-white/30 -mt-1">Poids cru — ajuste selon la cuisson</p>
          {fecList.map((f, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl p-3 border" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)' }}>
              <span className="flex-1 text-sm text-white">{INGREDIENTS_DB.find(ing => ing.id === f.id)?.name}</span>
              <input type="number" value={f.qty} onChange={e => updateQty(fecList, setFecList, i, +e.target.value)} className="w-16 bg-white/10 rounded-lg px-2 py-1 text-sm font-mono text-white text-right border-0 outline-none" />
              <select value={f.unit} onChange={e => { const u = [...fecList]; u[i] = { ...u[i], unit: e.target.value }; setFecList(u) }} className="bg-white/10 rounded-lg px-2 py-1 text-xs text-white border-0 outline-none">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <button onClick={() => setFecList(fecList.filter((_, j) => j !== i))}><Trash2 size={14} className="text-white/30" /></button>
            </div>
          ))}
          <button onClick={() => setPicker('fec')} className="w-full py-2 rounded-xl text-sm border border-dashed text-white/40" style={{ borderColor: 'rgba(245,158,11,0.25)' }}>
            + Ajouter un féculent
          </button>
        </div>

        {/* ── LÉGUMES ── */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#22c55e' }}>Légumes</p>
          <p className="text-xs text-white/30 -mt-1">Poids cru — ajuste selon la cuisson</p>
          {legList.map((l, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl p-3 border" style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)' }}>
              <span className="flex-1 text-sm text-white">{INGREDIENTS_DB.find(ing => ing.id === l.id)?.name}</span>
              <input type="number" value={l.qty} onChange={e => updateQty(legList, setLegList, i, +e.target.value)} className="w-16 bg-white/10 rounded-lg px-2 py-1 text-sm font-mono text-white text-right border-0 outline-none" />
              <select value={l.unit} onChange={e => { const u = [...legList]; u[i] = { ...u[i], unit: e.target.value }; setLegList(u) }} className="bg-white/10 rounded-lg px-2 py-1 text-xs text-white border-0 outline-none">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <button onClick={() => setLegList(legList.filter((_, j) => j !== i))}><Trash2 size={14} className="text-white/30" /></button>
            </div>
          ))}
          <button onClick={() => setPicker('leg')} className="w-full py-2 rounded-xl text-sm border border-dashed text-white/40" style={{ borderColor: 'rgba(34,197,94,0.25)' }}>
            + Ajouter un légume
          </button>
        </div>

        {/* ── SUPPLÉMENTS ── */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Suppléments</p>
          {suppList.map((s, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl p-3 border border-white/8" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <span className="flex-1 text-sm text-white">{INGREDIENTS_DB.find(ing => ing.id === s.id)?.name}</span>
              <input type="number" value={s.qty} onChange={e => updateQty(suppList, setSuppList, i, +e.target.value)} className="w-16 bg-white/10 rounded-lg px-2 py-1 text-sm font-mono text-white text-right border-0 outline-none" />
              <select value={s.unit} onChange={e => { const u = [...suppList]; u[i] = { ...u[i], unit: e.target.value }; setSuppList(u) }} className="bg-white/10 rounded-lg px-2 py-1 text-xs text-white border-0 outline-none">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <button onClick={() => setSuppList(suppList.filter((_, j) => j !== i))}><Trash2 size={14} className="text-white/30" /></button>
            </div>
          ))}
          <button onClick={() => setPicker('supp')} className="w-full py-2 rounded-xl text-sm border border-dashed text-white/40" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
            + Ajouter un supplément
          </button>
        </div>

        {/* ── MACROS ── */}
        <div className="rounded-xl p-3 font-mono text-sm text-white/50" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {macros.cal} cal · {macros.prot}g P · {macros.carb}g G · {macros.lip}g L
        </div>

        {/* ── SAUVEGARDER ── */}
        <button onClick={handleSave} disabled={!canSave} className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
          style={{ background: canSave ? '#22c55e' : 'rgba(255,255,255,0.08)', color: canSave ? '#000' : 'rgba(255,255,255,0.3)' }}>
          {editMeal ? 'Enregistrer les modifications' : 'Ajouter ce repas'}
        </button>

        {/* ── PICKER ── */}
        {picker && (
          <div className="fixed inset-0 bg-black/80 z-[110] flex items-end justify-center">
            <div className="w-full max-w-[430px] rounded-t-3xl p-6 overflow-y-auto max-h-[60vh]" style={{ background: '#0a1628' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-white text-sm">
                  {picker === 'prot' ? 'Choisir une protéine' : picker === 'fec' ? 'Choisir un féculent' : picker === 'supp' ? 'Choisir un supplément' : 'Choisir un légume'}
                </p>
                <button onClick={() => setPicker(null)}><X size={18} className="text-white/40" /></button>
              </div>
              {(picker === 'prot' ? prots : picker === 'fec' ? fecs : picker === 'supp' ? INGREDIENTS_DB.filter(i => i.cat === 'supp') : legs).map(ing => (
                <button key={ing.id}
                  onClick={() => picker === 'prot' ? setProt_(ing.id) : picker === 'fec' ? addFec(ing.id) : picker === 'supp' ? addSupp(ing.id) : addLeg(ing.id)}
                  className="w-full text-left px-4 py-3 rounded-xl mb-2 border border-white/8 bg-white/4"
                >
                  <span className="text-sm text-white">{ing.name}</span>
                  <span className="text-xs text-white/30 font-mono ml-2">{ing.dQty}{ing.dUnit}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}