// ═══════════════════════════════════════════════════════════
// DASHBOARD — Onglet Accueil de AN.Santé
// Design glassmorphism — fond bleu nuit + blobs lumineux
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { Scale, Ruler } from 'lucide-react'
import { PHASES, MILESTONES, TARGETS } from '../lib/constants'
import { progressPercent, weeksSince, getCurrentPhase } from '../lib/utils'
import ProgressRing from '../components/ProgressRing'
import MacroBar from '../components/MacroBar'
import WeighInModal from '../modals/WeighInModal'
import MeasureModal from '../modals/MeasureModal'

interface DashboardProps {
  programStart: string
}

export default function Dashboard({ programStart }: DashboardProps) {
  const [showWeighIn, setShowWeighIn] = useState(false)
  const [showMeasure, setShowMeasure] = useState(false)
  const [current, setCurrent] = useState({ weight: 89.3, waist: 99 })

  const phaseIdx = getCurrentPhase(programStart)
  const phase = PHASES[phaseIdx]
  const weekNum = weeksSince(programStart)
  const milestone = MILESTONES[Math.min(weekNum - 1, MILESTONES.length - 1)]
  const weightPercent = progressPercent(89.3, current.weight, phase.weightGoal)
  const waistPercent = progressPercent(99, current.waist, phase.waistGoal)
  const daysLeft = Math.max(0, 42 - (weekNum - 1) * 7)

  return (
    <div className="px-5 pt-6 pb-28 space-y-4">

      {/* ── EN-TÊTE ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[2px]" style={{ color: phase.color }}>
            Phase {phase.id} · Semaine {weekNum}
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            {phase.name}
          </h1>
        </div>
        <div
          className="rounded-2xl px-4 py-2 text-center"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <p className="font-mono text-2xl font-extrabold leading-none" style={{ color: phase.color }}>{daysLeft}</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">jours</p>
        </div>
      </div>

      {/* ── ANNEAUX DE PROGRESSION ── */}
      <div
        className="rounded-2xl p-5 flex justify-around items-center"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)',
        }}
      >
        <div className="text-center">
          <ProgressRing
            percent={weightPercent}
            color={phase.color}
            size={100}
            label={`${current.weight}`}
            sublabel="kg"
          />
          <p className="text-xs text-white/40 mt-2">Poids</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: phase.color }}>obj. {phase.weightGoal} kg</p>
        </div>

        <div className="w-px h-16 bg-white/8" />

        <div className="text-center">
          <ProgressRing
            percent={waistPercent}
            color="#3b82f6"
            size={100}
            label={`${current.waist}`}
            sublabel="cm"
          />
          <p className="text-xs text-white/40 mt-2">Tour de taille</p>
          <p className="text-xs font-semibold text-blue-400 mt-0.5">obj. {phase.waistGoal} cm</p>
        </div>
      </div>

      {/* ── MACROS DU JOUR ── */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)',
        }}
      >
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-white">Budget du jour</p>
          <span
            className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg"
            style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}
          >
            0 / {TARGETS.cal} kcal
          </span>
        </div>
        <MacroBar label="Calories" current={0} target={TARGETS.cal} color="#22c55e" unit=" kcal" />
        <MacroBar label="Protéines" current={0} target={TARGETS.prot} color="#ef4444" />
        <MacroBar label="Glucides" current={0} target={TARGETS.carb} color="#f59e0b" />
        <MacroBar label="Lipides" current={0} target={TARGETS.lip} color="#a855f7" />
      </div>

      {/* ── JALON DE LA SEMAINE ── */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: `${phase.color}0d`,
          border: `1px solid ${phase.color}25`,
          borderLeft: `3px solid ${phase.color}`,
        }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: phase.color }}>
          Semaine {weekNum} — {milestone?.title}
        </p>
        <p className="text-sm text-white/60 leading-relaxed">{milestone?.desc}</p>
      </div>

      {/* ── BOUTONS ACTIONS ── */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowWeighIn(true)}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold active:scale-95 transition-transform"
          style={{
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.25)',
            color: '#22c55e',
          }}
        >
          <Scale size={17} strokeWidth={1.8} />
          Pesée du jour
        </button>
        <button
          onClick={() => setShowMeasure(true)}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold active:scale-95 transition-transform"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          <Ruler size={17} strokeWidth={1.8} />
          Mesures lundi
        </button>
      </div>

      {/* ── MODALS ── */}
      {showWeighIn && (
        <WeighInModal
          onClose={() => setShowWeighIn(false)}
          onSave={(weight) => setCurrent(prev => ({ ...prev, weight }))}
        />
      )}
      {showMeasure && (
        <MeasureModal
          onClose={() => setShowMeasure(false)}
          onSave={(data) => setCurrent(prev => ({ ...prev, waist: data.waist }))}
        />
      )}

    </div>
  )
}