// ═══════════════════════════════════════════════════════════
// DASHBOARD — Onglet Accueil de AN.Santé
// ═══════════════════════════════════════════════════════════

import { PHASES, MILESTONES } from '../lib/constants'
import { progressPercent, weeksSince } from '../lib/utils'
import ProgressRing from '../components/ProgressRing'
import MacroBar from '../components/MacroBar'
import { Scale, Ruler } from 'lucide-react'

// Date de début du programme (à mettre à jour quand tu démarres)
const PROGRAM_START = '2026-04-06'

// Données actuelles (en attendant Supabase, on met les valeurs de départ)
const current = { weight: 89.3, waist: 99 }

export default function Dashboard() {
  const phase = PHASES[0]
  const weekNum = weeksSince(PROGRAM_START)
  const milestone = MILESTONES[Math.min(weekNum - 1, MILESTONES.length - 1)]

  // Calcul des progressions
  const weightPercent = progressPercent(89.3, current.weight, phase.weightGoal)
  const waistPercent = progressPercent(99, current.waist, phase.waistGoal)

  // Nombre de jours restants dans la phase (6 semaines = 42 jours)
  const daysLeft = Math.max(0, 42 - (weekNum - 1) * 7)

  return (
    <div className="p-4 pb-24 space-y-6">

      {/* ── EN-TÊTE : Phase + décompte ── */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Phase 1</p>
          <h1 className="text-2xl font-bold" style={{ color: phase.color }}>
            {phase.name}
          </h1>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold text-white">{daysLeft}</p>
          <p className="text-xs text-white/40">jours restants</p>
        </div>
      </div>

      {/* ── ANNEAUX DE PROGRESSION ── */}
      <div className="flex justify-around">
        <ProgressRing
          percent={weightPercent}
          color={phase.color}
          size={110}
          label={`${current.weight} kg`}
          sublabel={`obj. ${phase.weightGoal} kg`}
        />
        <ProgressRing
          percent={waistPercent}
          color="#3b82f6"
          size={110}
          label={`${current.waist} cm`}
          sublabel={`obj. ${phase.waistGoal} cm`}
        />
      </div>

      {/* ── MACROS DU JOUR ── */}
      <div className="bg-white/5 rounded-2xl p-4 space-y-3">
        <p className="text-xs text-white/40 uppercase tracking-widest">Budget du jour</p>
        <MacroBar label="Calories" current={0} target={2000} color="#22c55e" unit=" kcal" />
        <MacroBar label="Protéines" current={0} target={170} color="#ef4444" />
        <MacroBar label="Glucides" current={0} target={200} color="#f59e0b" />
        <MacroBar label="Lipides" current={0} target={55} color="#3b82f6" />
      </div>

      {/* ── JALON DE LA SEMAINE ── */}
      <div className="bg-white/5 rounded-2xl p-4 border-l-2" style={{ borderColor: phase.color }}>
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
          Semaine {weekNum} — {milestone?.title}
        </p>
        <p className="text-sm text-white/70">{milestone?.desc}</p>
      </div>

    {/* ── BOUTONS ACTIONS ── */}
    <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 bg-accent/10 border border-accent/30 text-accent rounded-2xl py-3 text-sm font-medium active:scale-95 transition-transform">
          <Scale size={16} strokeWidth={1.8} />
          Pesée du jour
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/60 rounded-2xl py-3 text-sm font-medium active:scale-95 transition-transform">
          <Ruler size={16} strokeWidth={1.8} />
          Mesures lundi
        </button>
      </div>
    </div>
  )
}