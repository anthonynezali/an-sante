// ═══════════════════════════════════════════════════════════
// MACROBAR — Barre de progression des macros
// Design glassmorphism avec dégradé
// ═══════════════════════════════════════════════════════════

interface MacroBarProps {
  label: string
  current: number
  target: number
  color: string
  unit?: string
}

export default function MacroBar({ label, current, target, color, unit = 'g' }: MacroBarProps) {
  const percent = Math.min(100, Math.round((current / target) * 100))

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold" style={{ color }}>{label}</span>
        <span className="font-mono text-sm text-white/40">
          {current}{unit} <span className="text-white/20">/ {target}{unit}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}