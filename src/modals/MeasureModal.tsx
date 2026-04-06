// ═══════════════════════════════════════════════════════════
// MEASUREMODAL — Modal de saisie des mesures du lundi
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { X } from 'lucide-react'

interface MeasureModalProps {
  onClose: () => void
  onSave: (data: { waist: number; hips: number; chest: number }) => void
}

export default function MeasureModal({ onClose, onSave }: MeasureModalProps) {
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')
  const [chest, setChest] = useState('')

  const handleSave = () => {
    const data = {
      waist: parseFloat(waist),
      hips: parseFloat(hips),
      chest: parseFloat(chest),
    }
    if (!isNaN(data.waist) && !isNaN(data.hips) && !isNaN(data.chest)) {
      onSave(data)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-end justify-center">
      <div className="bg-[#1a1a1a] w-full max-w-[430px] rounded-t-3xl p-6 space-y-5 overflow-y-auto max-h-[90vh]">

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Mesures du lundi</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Champs de saisie */}
        {[
          { label: 'Tour de taille (cm)', value: waist, set: setWaist },
          { label: 'Tour de hanches (cm)', value: hips, set: setHips },
          { label: 'Tour de poitrine (cm)', value: chest, set: setChest },
        ].map((field) => (
          <div key={field.label} className="space-y-2">
            <label className="text-xs text-white/40 uppercase tracking-widest">
              {field.label}
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="ex: 95.0"
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-xl focus:outline-none focus:border-accent"
            />
          </div>
        ))}

        {/* Bouton sauvegarder */}
        <button
          onClick={handleSave}
          className="w-full bg-accent text-black font-semibold rounded-xl py-3 active:scale-95 transition-transform"
        >
          Enregistrer
        </button>

      </div>
    </div>
  )
}