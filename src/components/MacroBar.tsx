// ═══════════════════════════════════════════════════════════
// MACROBAR — Barre de progression pour les macros
// Utilisée dans le dashboard et l'onglet nutrition
// ═══════════════════════════════════════════════════════════

interface MacroBarProps {
    label: string     // ex: "Protéines"
    current: number   // quantité consommée
    target: number    // objectif du jour
    color: string     // couleur de la barre
    unit?: string     // unité (défaut "g")
  }
  
  export default function MacroBar({
    label,
    current,
    target,
    color,
    unit = 'g',
  }: MacroBarProps) {
    const percent = Math.min(100, Math.round((current / target) * 100))
  
    return (
      <div className="flex flex-col gap-1">
        {/* Ligne label + chiffres */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/60">{label}</span>
          <span className="font-mono text-xs text-white/80">
            {current}{unit} <span className="text-white/30">/ {target}{unit}</span>
          </span>
        </div>
  
        {/* Barre de progression */}
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, backgroundColor: color }}
          />
        </div>
      </div>
    )
  }