// ═══════════════════════════════════════════════════════════
// TRAINING — Onglet Sport de AN.Santé
// Design glassmorphism
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react'
import { Check, ChevronDown, ChevronUp, Footprints, PersonStanding, TrendingUp, Lock, Moon } from 'lucide-react'

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

function getTrainingSchedule() {
  const today = new Date()
  const dow = today.getDay()
  const mon = new Date(today)
  mon.setDate(today.getDate() - ((dow + 6) % 7))
  const types = ["A","B","R","A","B","OFF","OFF"]
  const labels = ["Circuit A — Push","Circuit B — Pull","Récup active","Circuit A — Push","Circuit B — Pull","Repos complet","Repos complet"]
  const circuits = [CIRCUIT_A,CIRCUIT_B,MERCREDI_EX,CIRCUIT_A,CIRCUIT_B,[],[]]
  const colors = ["#22c55e","#3b82f6","#f59e0b","#22c55e","#3b82f6","#525252","#525252"]
  const S = ["LUN","MAR","MER","JEU","VEN","SAM","DIM"]
  const M = ["JAN","FÉV","MAR","AVR","MAI","JUN","JUL","AOÛ","SEP","OCT","NOV","DÉC"]
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon); d.setDate(mon.getDate() + i)
    return {
      idx: i, dateNum: d.getDate(), month: M[d.getMonth()], day: S[i],
      type: types[i], label: labels[i], circuit: circuits[i], color: colors[i],
      duration: i < 5 ? (i === 2 ? "~45 min" : "~50 min") : "",
      isToday: d.toDateString() === today.toDateString(),
    }
  })
}

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
    <button onClick={toggle} className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold font-mono transition-all active:scale-95"
      style={{
        background: done ? 'rgba(34,197,94,0.15)' : running ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${done ? 'rgba(34,197,94,0.3)' : running ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)'}`,
        color: running || done ? '#22c55e' : 'rgba(255,255,255,0.5)',
      }}>
      {done ? '✓ Terminé' : running ? `⏱ ${Math.floor(left/60)}:${(left%60).toString().padStart(2,'0')}` : '▶  Repos 90s'}
    </button>
  )
}

const glass = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.09)',
}

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
    <div className="px-5 pt-6 pb-28 space-y-4">

      {/* ── COMPTEUR SÉANCES ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Cette semaine</p>
          <p className="text-2xl font-extrabold text-white mt-1">
            <span className="text-accent font-mono">{completedDays.length}</span>
            <span className="text-white/30 text-lg font-normal"> / 5 séances</span>
          </p>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full transition-all"
              style={{ background: i < completedDays.length ? '#22c55e' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
      </div>

      {/* ── BANDE DES JOURS ── */}
      <div className="flex gap-1.5">
        {days.map((d, i) => {
          const s = i === selIdx
          const done = completedDays.includes(i)
          return (
            <button key={i}
              onClick={() => { setSelIdx(i); setRound(1); setShowStr(false) }}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-2xl border-2 transition-all active:scale-95"
              style={{
                background: s ? `${d.color}18` : 'rgba(255,255,255,0.04)',
                borderColor: s ? d.color : d.isToday ? `${d.color}40` : 'rgba(255,255,255,0.08)',
              }}
            >
              <span className="text-[10px] font-bold" style={{ color: s ? d.color : 'rgba(255,255,255,0.35)' }}>{d.day}</span>
              <span className="font-mono text-base font-extrabold" style={{ color: s ? d.color : 'rgba(255,255,255,0.7)' }}>{d.dateNum}</span>
              <span className="text-[8px] text-white/25">{d.month}</span>
              {done && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </button>
          )
        })}
      </div>

      {/* ── CARTE SÉANCE ── */}
      <div className="rounded-2xl p-4 flex justify-between items-center"
        style={{ background: `${sel.color}10`, border: `1px solid ${sel.color}22` }}>
        <div>
          <p className="text-lg font-extrabold text-white">{sel.label}</p>
          {sel.duration && <p className="text-sm text-white/45 mt-0.5">{sel.duration}</p>}
        </div>
        {sel.isToday && !isRest && (
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl text-black" style={{ background: sel.color }}>
            Aujourd'hui
          </span>
        )}
      </div>

      {/* ── REPOS COMPLET ── */}
      {isRest && (
        <div className="text-center py-10 space-y-3" style={glass}>
          <div className="rounded-2xl p-6">
            <Moon size={48} strokeWidth={1.2} className="text-purple-400 mx-auto mb-3" />
            <p className="text-xl font-bold text-white">Repos complet</p>
            <p className="text-sm text-white/45 mt-2">La récupération fait partie du programme.</p>
          </div>
        </div>
      )}

      {/* ── INDICATEURS DE TOURS ── */}
      {isCircuit && (
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex-1 py-3 rounded-xl text-center text-sm font-bold font-mono transition-all"
              style={{
                background: i + 1 === round ? sel.color : i + 1 < round ? `${sel.color}15` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i + 1 === round ? sel.color : i + 1 < round ? `${sel.color}25` : 'rgba(255,255,255,0.08)'}`,
                color: i + 1 === round ? '#000' : 'rgba(255,255,255,0.4)',
                opacity: i + 1 <= round ? 1 : 0.4,
              }}>
              {i + 1 < round ? <Check size={14} className="mx-auto" /> : i + 1 === round ? `Tour ${i + 1}` : <Lock size={12} className="mx-auto" />}
            </div>
          ))}
        </div>
      )}

      {/* ── EXERCICES ── */}
      {isActive && sel.circuit.map((ex, i) => {
        const done = isExChecked(i)
        return (
          <div key={`${selIdx}-${round}-${i}`} onClick={() => toggleEx(i)}
            className="rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98]"
            style={{
              background: done ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${done ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.08)'}`,
              opacity: done ? 0.65 : 1,
            }}>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 border-2 transition-all"
                style={{
                  background: done ? '#22c55e' : 'transparent',
                  borderColor: done ? '#22c55e' : 'rgba(150,150,150,0.4)',
                }}>
                {done && <Check size={13} className="text-black" strokeWidth={3} />}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-base ${done ? 'line-through text-white/35' : 'text-white'}`}>{ex.name}</p>
                <div className="flex gap-3 mt-1">
                  <span className="font-mono text-sm font-semibold" style={{ color: sel.color }}>{ex.reps}</span>
                  <span className="text-sm text-white/35">{ex.weight}</span>
                </div>
                <p className="text-xs text-white/25 mt-1">{ex.note}</p>
              </div>
            </div>
          </div>
        )
      })}

      {/* ── TIMER + TOUR SUIVANT ── */}
      {isCircuit && (
        <div className="space-y-2">
          <Timer />
          {allChecked && round < 4 && (
            <button onClick={() => setRound(r => r + 1)}
              className="w-full py-4 rounded-2xl font-bold text-base text-black active:scale-95 transition-transform"
              style={{ background: sel.color }}>
              Tour suivant →
            </button>
          )}
          {allChecked && round === 4 && (
            <div className="flex items-center justify-center gap-2">
              <Check size={16} className="text-accent" />
              <p className="text-center font-bold py-2" style={{ color: sel.color }}>4 tours terminés !</p>
            </div>
          )}
        </div>
      )}

      {/* ── INCLINE WALK ── */}
      {isCircuit && (
        <div onClick={() => setWalkDone(p => ({ ...p, [selIdx]: !p[selIdx] }))}
          className="rounded-2xl p-4 cursor-pointer flex items-center gap-3 transition-all active:scale-[0.98]"
          style={{
            background: walkDone[selIdx] ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${walkDone[selIdx] ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.08)'}`,
            opacity: walkDone[selIdx] ? 0.65 : 1,
          }}>
          <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-all"
            style={{
              background: walkDone[selIdx] ? '#22c55e' : 'transparent',
              borderColor: walkDone[selIdx] ? '#22c55e' : 'rgba(150,150,150,0.4)',
            }}>
            {walkDone[selIdx] && <Check size={13} className="text-black" strokeWidth={3} />}
          </div>
          <div className="flex items-center gap-2">
            <Footprints size={16} className="text-accent" />
            <div>
              <p className="font-bold text-base text-white">Incline Walk</p>
              <p className="text-xs text-white/40 mt-0.5">15 min — Pente 10-12% — 5.5 km/h</p>
            </div>
          </div>
        </div>
      )}

      {/* ── ÉTIREMENTS ── */}
      {isCircuit && (
        <div className="rounded-2xl overflow-hidden transition-all"
          style={{
            background: stretchDone[selIdx] ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${stretchDone[selIdx] ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.08)'}`,
          }}>
          <div className="p-4 flex items-center gap-3">
            <div onClick={() => setStretchDone(p => ({ ...p, [selIdx]: !p[selIdx] }))}
              className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center border-2 cursor-pointer transition-all"
              style={{
                background: stretchDone[selIdx] ? '#22c55e' : 'transparent',
                borderColor: stretchDone[selIdx] ? '#22c55e' : 'rgba(150,150,150,0.4)',
              }}>
              {stretchDone[selIdx] && <Check size={13} className="text-black" strokeWidth={3} />}
            </div>
            <div className="flex items-center gap-2 flex-1 cursor-pointer"
              onClick={() => setStretchDone(p => ({ ...p, [selIdx]: !p[selIdx] }))}>
              <PersonStanding size={16} className="text-accent" />
              <p className="font-bold text-base text-white">Étirements — 6 min</p>
            </div>
            <button onClick={() => setShowStr(s => !s)} className="text-white/35 p-1">
              {showStr ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          {showStr && (
            <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2">
              {ETIREMENTS.map((e, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-sm text-white/55">{e.name}</span>
                  <span className="text-sm font-mono font-semibold" style={{ color: sel.color }}>{e.duration}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── VALIDER LA SÉANCE ── */}
      {isActive && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              if (isDone) setCompletedDays(completedDays.filter(d => d !== selIdx))
              else setCompletedDays([...completedDays, selIdx])
            }}
            className="px-8 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
            style={{
              background: isDone ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
              border: `1px solid ${isDone ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
              color: isDone ? '#ef4444' : '#22c55e',
            }}>
            {isDone ? '✕ Annuler la séance' : '✓ Valider la séance'}
          </button>
        </div>
      )}

      {/* ── RÈGLE DE PROGRESSION ── */}
      {isActive && (
        <div className="rounded-2xl p-4" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-accent" />
            <p className="text-sm font-semibold text-accent">Règle de progression</p>
          </div>
          <p className="text-sm text-white/45 leading-relaxed">
            Monte le poids quand tu fais 4 tours de 15 reps proprement, 2 séances de suite.
          </p>
        </div>
      )}

    </div>
  )
}