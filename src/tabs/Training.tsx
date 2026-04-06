// ═══════════════════════════════════════════════════════════
// TRAINING — Onglet Sport de AN.Santé
// Logique : 1 tour à la fois, débloqué quand tous les exos
// du tour précédent sont cochés. Timer 90s entre les tours.
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react'
import { Check, ChevronDown, ChevronUp, Moon, PersonStanding, Footprints, TrendingUp, Lock } from 'lucide-react'

// ── Exercices ──
const CIRCUIT_A = [
  { name: "Squat goblet", reps: "15", weight: "Haltère lourd", note: "Haltère contre le torse, descente cuisses parallèles" },
  { name: "Développé couché haltères", reps: "15", weight: "Haltères lourds", note: "Contrôle la descente 2 sec, pas de rebond" },
  { name: "Fentes sur place", reps: "12/jambe", weight: "Haltères moyens", note: "Genou frôle le sol, buste droit" },
  { name: "Développé épaules assis", reps: "15", weight: "Haltères moyens", note: "Assis sur le banc, pas de cambrure" },
  { name: "Pompes (ou floor press)", reps: "15", weight: "Poids de corps", note: "Si trop facile : floor press haltères" },
  { name: "Gainage planche", reps: "45 sec", weight: "—", note: "Corps aligné, pas de creux dans le dos" },
]

const CIRCUIT_B = [
  { name: "Soulevé de terre roumain", reps: "15", weight: "Haltères lourds", note: "Dos droit, étirement ischio, descente lente" },
  { name: "Rowing penché", reps: "15", weight: "Haltères lourds", note: "Penché à 45°, tire vers les hanches" },
  { name: "Pull-over sur banc", reps: "15", weight: "1 haltère lourd", note: "Allongé, bras tendus, étirement du dos" },
  { name: "Pont fessier", reps: "15", weight: "Haltère sur hanches", note: "Contraction 2 sec en haut" },
  { name: "Curl biceps", reps: "15", weight: "Haltères moyens", note: "Pas de balancement, contrôle" },
  { name: "Gainage latéral", reps: "30s/côté", weight: "—", note: "Corps aligné, coude sous l'épaule" },
]

const MERCREDI_EX = [
  { name: "Incline walk", reps: "25 min", weight: "Pente 10-12%", note: "Vitesse 5.5-6 km/h" },
  { name: "Gainage planche", reps: "3×45 sec", weight: "—", note: "Corps aligné" },
  { name: "Crunch", reps: "3×20", weight: "—", note: "Contrôle" },
  { name: "Rotation russe", reps: "3×20", weight: "Sans poids", note: "Contrôle du mouvement" },
  { name: "Bandes élastiques épaules", reps: "3×15", weight: "Élastique", note: "Rotations externes" },
  { name: "Étirements", reps: "10-15 min", weight: "—", note: "Routine complète" },
]

const ETIREMENTS = [
  { name: "Quadriceps debout", duration: "30s/jambe" },
  { name: "Ischio-jambiers (pied sur banc)", duration: "30s/jambe" },
  { name: "Fléchisseurs de hanche", duration: "30s/côté" },
  { name: "Pectoraux (bras contre montant)", duration: "30s/côté" },
  { name: "Mollets (pied contre mur)", duration: "30s/jambe" },
  { name: "Épaules (bras en travers)", duration: "30s/côté" },
]

// ── Planning de la semaine ──
function getTrainingSchedule() {
  const today = new Date()
  const dow = today.getDay()
  const mon = new Date(today)
  mon.setDate(today.getDate() - ((dow + 6) % 7))
  const types = ["A", "B", "R", "A", "B", "OFF", "OFF"]
  const labels = ["Circuit A — Push", "Circuit B — Pull", "Récup active", "Circuit A — Push", "Circuit B — Pull", "Repos complet", "Repos complet"]
  const circuits = [CIRCUIT_A, CIRCUIT_B, MERCREDI_EX, CIRCUIT_A, CIRCUIT_B, [], []]
  const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#22c55e", "#3b82f6", "#525252", "#525252"]
  const S = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"]
  const M = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUN", "JUL", "AOÛ", "SEP", "OCT", "NOV", "DÉC"]
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon)
    d.setDate(mon.getDate() + i)
    return {
      idx: i, dateNum: d.getDate(), month: M[d.getMonth()], day: S[i],
      type: types[i], label: labels[i], circuit: circuits[i], color: colors[i],
      duration: i < 5 ? (i === 2 ? "~45 min" : "~50 min") : "",
      isToday: d.toDateString() === today.toDateString(),
    }
  })
}

// ── Timer 90 secondes ──
function Timer() {
  const [running, setRunning] = useState(false)
  const [left, setLeft] = useState(90)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running && left > 0) {
      ref.current = setInterval(() => setLeft(p => {
        if (p <= 1) { setRunning(false); return 0 }
        return p - 1
      }), 1000)
    }
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [running, left])

  const toggle = () => {
    if (running) { setRunning(false); setLeft(90) }
    else { setLeft(90); setRunning(true) }
  }

  const done = !running && left === 0

  return (
    <button
      onClick={toggle}
      className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold font-mono transition-colors ${
        done ? 'bg-accent/15 border border-accent/30 text-accent'
        : running ? 'bg-accent/10 border border-accent/20 text-accent'
        : 'bg-white/5 border border-white/10 text-white/60'
      }`}
    >
      {done ? '✓ Terminé'
        : running ? `⏱ ${Math.floor(left / 60)}:${(left % 60).toString().padStart(2, '0')}`
        : '▶ Repos 90s'}
    </button>
  )
}

// ── Composant principal ──
export default function Training() {
  const days = getTrainingSchedule()
  const todayIdx = days.findIndex(d => d.isToday)
  const [selIdx, setSelIdx] = useState(todayIdx >= 0 ? todayIdx : 0)
  const [round, setRound] = useState(1)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [walkDone, setWalkDone] = useState<Record<number, boolean>>({})
  const [stretchDone, setStretchDone] = useState<Record<number, boolean>>({})
  const [showStr, setShowStr] = useState(false)
  const [completedDays, setCompletedDays] = useState<number[]>([])

  const sel = days[selIdx]
  const isCircuit = sel.type === 'A' || sel.type === 'B'
  const isRest = sel.type === 'OFF'
  const isActive = !isRest
  const isDone = completedDays.includes(selIdx)

  const toggleEx = (i: number) => {
    const key = `${selIdx}-${round}-${i}`
    setChecked(p => ({ ...p, [key]: !p[key] }))
  }
  const isExChecked = (i: number) => !!checked[`${selIdx}-${round}-${i}`]
  const allChecked = sel.circuit.length > 0 && sel.circuit.every((_, i) => isExChecked(i))

  return (
    <div className="p-4 pb-24 space-y-4">

      {/* ── COMPTEUR SÉANCES ── */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-sm text-white/50">Cette semaine</p>
          <p className="text-xl font-bold">
            <span className="text-accent font-mono">{completedDays.length}</span>
            <span className="text-white/40 font-normal text-base">/5 séances</span>
          </p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i < completedDays.length ? 'bg-accent' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      {/* ── BANDE DES JOURS ── */}
      <div className="flex gap-1">
        {days.map((d, i) => {
          const s = i === selIdx
          const done = completedDays.includes(i)
          return (
            <button
              key={i}
              onClick={() => { setSelIdx(i); setRound(1); setShowStr(false) }}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl border-2 transition-colors"
              style={{
                background: s ? `${d.color}18` : 'rgba(255,255,255,0.04)',
                borderColor: s ? d.color : d.isToday ? `${d.color}40` : 'rgba(255,255,255,0.08)',
              }}
            >
              <span className="text-[10px] font-semibold" style={{ color: s ? d.color : 'rgba(255,255,255,0.4)' }}>{d.day}</span>
              <span className="font-mono text-base font-bold" style={{ color: s ? d.color : 'rgba(255,255,255,0.7)' }}>{d.dateNum}</span>
              <span className="text-[8px] text-white/30">{d.month}</span>
              {done && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </button>
          )
        })}
      </div>

      {/* ── CARTE SÉANCE ── */}
      <div
        className="rounded-2xl p-4 flex justify-between items-center"
        style={{ background: `${sel.color}10`, border: `1px solid ${sel.color}22` }}
      >
        <div>
          <p className="text-lg font-bold text-white">{sel.label}</p>
          {sel.duration && <p className="text-sm text-white/50 mt-0.5">{sel.duration}</p>}
        </div>
        {sel.isToday && !isRest && (
          <span className="text-xs font-bold px-3 py-1 rounded-md text-black" style={{ background: sel.color }}>
            Aujourd'hui
          </span>
        )}
      </div>

      {/* ── REPOS COMPLET ── */}
      {isRest && (
        <div className="text-center py-8 space-y-3">
          <Moon size={48} strokeWidth={1.2} className="text-purple-400 mx-auto" />
          <p className="text-lg font-bold text-white">Repos complet</p>
          <p className="text-sm text-white/50">La récupération fait partie du programme.</p>
        </div>
      )}

      {/* ── INDICATEURS DE TOURS (circuits A/B seulement) ── */}
      {isCircuit && (
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="flex-1 py-2.5 rounded-xl text-center text-sm font-bold font-mono transition-all"
              style={{
                background: i + 1 === round ? '#22c55e' : i + 1 < round ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i + 1 === round ? '#22c55e' : i + 1 < round ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.08)'}`,
                color: i + 1 === round ? '#000' : 'rgba(255,255,255,0.5)',
                opacity: i + 1 <= round ? 1 : 0.4,
              }}
            >
              {i + 1 < round ? '✓' : i + 1 === round ? `Tour ${i + 1}` : <Lock size={12} className="mx-auto" />}
            </div>
          ))}
        </div>
      )}

      {/* ── LISTE D'EXERCICES ── */}
      {isActive && sel.circuit.map((ex, i) => {
        const done = isExChecked(i)
        return (
          <div
            key={`${selIdx}-${round}-${i}`}
            onClick={() => toggleEx(i)}
            className={`rounded-2xl p-4 cursor-pointer transition-all ${done ? 'opacity-60' : 'opacity-100'}`}
            style={{
              background: done ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${done ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <div
                className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 border-2 transition-all"
                style={{
                  background: done ? '#22c55e' : 'transparent',
                  borderColor: done ? '#22c55e' : 'rgba(150,150,150,0.5)',
                }}
              >
                {done && <Check size={12} className="text-black" strokeWidth={3} />}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${done ? 'text-white/40 line-through' : 'text-white'}`}>{ex.name}</p>
                <div className="flex gap-3 mt-1">
                  <span className="font-mono text-sm font-semibold" style={{ color: sel.color }}>{ex.reps}</span>
                  <span className="text-sm text-white/40">{ex.weight}</span>
                </div>
                <p className="text-xs text-white/30 mt-1">{ex.note}</p>
              </div>
            </div>
          </div>
        )
      })}

      {/* ── TIMER + TOUR SUIVANT (circuits seulement) ── */}
      {isCircuit && (
        <div className="space-y-2">
          <Timer />
          {allChecked && round < 4 && (
            <button
              onClick={() => setRound(r => r + 1)}
              className="w-full py-4 bg-accent text-black font-bold text-base rounded-xl active:scale-95 transition-transform"
            >
              Tour suivant →
            </button>
          )}
          {allChecked && round === 4 && (
            <p className="text-center text-accent font-bold py-2">✓ 4 tours terminés !</p>
          )}
        </div>
      )}

      {/* ── INCLINE WALK (circuits seulement) ── */}
      {isCircuit && (
        <div
          onClick={() => setWalkDone(p => ({ ...p, [selIdx]: !p[selIdx] }))}
          className={`rounded-2xl p-4 cursor-pointer flex items-center gap-3 transition-all ${walkDone[selIdx] ? 'opacity-60' : 'opacity-100'}`}
          style={{
            background: walkDone[selIdx] ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${walkDone[selIdx] ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          <div
            className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-all"
            style={{
              background: walkDone[selIdx] ? '#22c55e' : 'transparent',
              borderColor: walkDone[selIdx] ? '#22c55e' : 'rgba(150,150,150,0.5)',
            }}
          >
            {walkDone[selIdx] && <Check size={12} className="text-black" strokeWidth={3} />}
          </div>
          <div>
            <p className="font-bold text-sm text-white"><span className="font-bold text-sm text-white flex items-center gap-2"><Footprints size={16} className="text-accent" /> Incline Walk</span></p>
            <p className="text-xs text-white/50 mt-0.5">15 min — Pente 10-12% — 5.5 km/h</p>
          </div>
        </div>
      )}

      {/* ── ÉTIREMENTS (circuits seulement) ── */}
      {isCircuit && (
        <div
          className="rounded-2xl overflow-hidden transition-all"
          style={{
            background: stretchDone[selIdx] ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${stretchDone[selIdx] ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          <div className="p-4 flex items-center gap-3">
            <div
              onClick={() => setStretchDone(p => ({ ...p, [selIdx]: !p[selIdx] }))}
              className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center border-2 cursor-pointer transition-all"
              style={{
                background: stretchDone[selIdx] ? '#22c55e' : 'transparent',
                borderColor: stretchDone[selIdx] ? '#22c55e' : 'rgba(150,150,150,0.5)',
              }}
            >
              {stretchDone[selIdx] && <Check size={12} className="text-black" strokeWidth={3} />}
            </div>
            <span
              onClick={() => setStretchDone(p => ({ ...p, [selIdx]: !p[selIdx] }))}
              className="font-bold text-sm text-white flex-1 cursor-pointer"
            >
              <span className="font-bold text-sm text-white flex items-center gap-2"><PersonStanding size={20} className="text-accent" /> Étirements — 6 min</span>
            </span>
            <button onClick={() => setShowStr(s => !s)} className="text-white/40 p-1">
              {showStr ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          {showStr && (
            <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2">
              {ETIREMENTS.map((e, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-sm text-white/60">{e.name}</span>
                  <span className="text-sm text-accent font-mono font-semibold">{e.duration}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── VALIDER LA SÉANCE ── */}
      {isActive && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (isDone) setCompletedDays(completedDays.filter(d => d !== selIdx))
              else setCompletedDays([...completedDays, selIdx])
            }}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isDone
                ? 'bg-red-500/8 border border-red-500/20 text-red-400'
                : 'bg-accent/8 border border-accent/20 text-accent'
            }`}
          >
            {isDone ? '✕ Annuler la séance' : '✓ Valider la séance'}
          </button>
        </div>
      )}

      {/* ── RÈGLE DE PROGRESSION ── */}
      {isActive && (
        <div className="bg-accent/6 border border-accent/15 rounded-2xl p-4">
          <p className="text-sm text-accent font-semibold mb-1"><span className="flex items-center gap-2 text-sm text-accent font-semibold mb-1"><TrendingUp size={16} /> Règle de progression</span></p>
          <p className="text-sm text-white/50 leading-relaxed">
            Monte le poids quand tu fais 4 tours de 15 reps proprement, 2 séances de suite.
          </p>
        </div>
      )}

    </div>
  )
}