// ═══════════════════════════════════════════════════════════
// WEIGHINMODAL — Modal de saisie du poids quotidien
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { X } from 'lucide-react'

interface WeighInModalProps {
  onClose: () => void
  onSave: (weight: number) => void
}

export default function WeighInModal({ onClose, onSave }: WeighInModalProps) {
  const [value, setValue] = useState('')

  const handleSave = () => {
    const weight = parseFloat(value)
    if (!isNaN(weight) && weight > 0) {
      onSave(weight)
      onClose()
    }
  }

  return (
    // Fond semi-transparent qui couvre tout l'écran
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-end justify-center">
      <div className="w-full max-w-[430px] rounded-t-3xl p-6 space-y-5" style={{ background: '#0d1f35', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Pesée du jour</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Saisie du poids */}
        <div className="space-y-2">
          <label className="text-xs text-white/40 uppercase tracking-widest">
            Poids (kg)
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="ex: 88.5"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-xl focus:outline-none focus:border-accent"
          />
        </div>

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