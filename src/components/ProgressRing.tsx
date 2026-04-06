// ═══════════════════════════════════════════════════════════
// PROGRESSRING — Anneau de progression circulaire
// Utilisé dans le dashboard pour poids et tour de taille
// ═══════════════════════════════════════════════════════════

interface ProgressRingProps {
    percent: number   // 0 à 100
    color: string     // couleur de l'anneau
    size?: number     // taille en px (défaut 80)
    label: string     // texte au centre
    sublabel?: string // texte secondaire sous le label
  }
  
  export default function ProgressRing({
    percent,
    color,
    size = 80,
    label,
    sublabel,
  }: ProgressRingProps) {
    const radius = (size - 10) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percent / 100) * circumference
  
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            {/* Anneau de fond */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={5}
            />
            {/* Anneau de progression */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={5}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          {/* Texte au centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-sm font-semibold text-white">{label}</span>
            {sublabel && <span className="text-[9px] text-white/50">{sublabel}</span>}
          </div>
        </div>
      </div>
    )
  }