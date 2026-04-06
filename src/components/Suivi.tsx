// ═══════════════════════════════════════════════════════════
// SUIVI — Graphiques de progression
// Poids, tour de taille, séances, calories
// Données fictives en attendant Supabase
// ═══════════════════════════════════════════════════════════

import { Weight, Ruler, Dumbbell, Flame } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// ── Données fictives (remplacées par Supabase plus tard) ──
const POIDS_DATA = [
  { date: 'S1', value: 89.3 },
  { date: 'S2', value: 88.1 },
  { date: 'S3', value: 87.2 },
  { date: 'S4', value: 86.5 },
  { date: 'S5', value: 85.8 },
  { date: 'S6', value: 85.0 },
]

const TAILLE_DATA = [
  { date: 'S1', value: 99 },
  { date: 'S2', value: 98 },
  { date: 'S3', value: 97 },
  { date: 'S4', value: 96 },
  { date: 'S5', value: 95 },
  { date: 'S6', value: 94 },
]

const SEANCES_DATA = [
  { date: 'S1', value: 4 },
  { date: 'S2', value: 5 },
  { date: 'S3', value: 3 },
  { date: 'S4', value: 5 },
  { date: 'S5', value: 4 },
  { date: 'S6', value: 5 },
]

const CALORIES_DATA = [
  { date: 'L', value: 1950 },
  { date: 'M', value: 2100 },
  { date: 'M', value: 1980 },
  { date: 'J', value: 2000 },
  { date: 'V', value: 1870 },
  { date: 'S', value: 2200 },
  { date: 'D', value: 1900 },
]

// ── Tooltip personnalisé ──
const CustomTooltip = ({ active, payload, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2">
        <p className="font-mono text-sm text-white font-bold">
          {payload[0].value} {unit}
        </p>
      </div>
    )
  }
  return null
}

// ── Composant graphique réutilisable ──
function StatChart({ title, icon, data, color, unit, target }: {
  title: string
  icon: React.ReactNode
  data: { date: string; value: number }[]
  color: string
  unit: string
  target?: number
}) {
  const last = data[data.length - 1]?.value
  const first = data[0]?.value
  const diff = last - first

  return (
    <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color }}>{icon}</span>
          <p className="text-sm font-semibold text-white">{title}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-bold text-white">{last} {unit}</p>
          {diff !== 0 && (
            <p className="font-mono text-xs" style={{ color: diff < 0 ? '#22c55e' : '#ef4444' }}>
              {diff > 0 ? '+' : ''}{diff.toFixed(1)} {unit}
            </p>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>

      {target && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/30">Objectif</span>
          <span className="font-mono text-white/50">{target} {unit}</span>
        </div>
      )}
    </div>
  )
}

// ── Composant séances ──
function SeancesChart() {
  return (
    <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell size={16} className="text-accent" />
          <p className="text-sm font-semibold text-white">Séances / semaine</p>
        </div>
        <p className="font-mono text-lg font-bold text-white">
          {SEANCES_DATA[SEANCES_DATA.length - 1].value}<span className="text-white/30 text-sm">/5</span>
        </p>
      </div>
      <div className="flex gap-2 items-end h-16">
        {SEANCES_DATA.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-md transition-all"
              style={{
                height: `${(d.value / 5) * 48}px`,
                background: d.value === 5 ? '#22c55e' : d.value >= 4 ? '#22c55e80' : 'rgba(255,255,255,0.1)',
              }}
            />
            <span className="text-[9px] text-white/30">{d.date}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/20 text-center">Données fictives — Supabase à venir</p>
    </div>
  )
}

// ── Composant calories ──
function CaloriesChart() {
  const target = 2000
  return (
    <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-orange-400" />
          <p className="text-sm font-semibold text-white">Calories cette semaine</p>
        </div>
        <p className="font-mono text-xs text-white/40">obj {target} kcal</p>
      </div>
      <div className="flex gap-1 items-end h-16">
        {CALORIES_DATA.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-md"
              style={{
                height: `${Math.min((d.value / 2400) * 48, 48)}px`,
                background: d.value <= target ? '#22c55e80' : '#ef444480',
              }}
            />
            <span className="text-[9px] text-white/30">{d.date}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-white/30">Dans le budget</span>
        <span className="font-mono text-accent">
          {CALORIES_DATA.filter(d => d.value <= target).length}/7 jours
        </span>
      </div>
    </div>
  )
}

export default function Suivi() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-white/30 text-center">Données d'exemple — connecte Supabase pour voir tes vraies données</p>
      
      <StatChart
        title="Poids"
        icon={<Weight size={16} />}
        data={POIDS_DATA}
        color="#22c55e"
        unit="kg"
        target={83}
      />

      <StatChart
        title="Tour de taille"
        icon={<Ruler size={16} />}
        data={TAILLE_DATA}
        color="#3b82f6"
        unit="cm"
        target={93}
      />

      <SeancesChart />
      <CaloriesChart />
    </div>
  )
}