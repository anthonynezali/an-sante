// ═══════════════════════════════════════════════════════════
// UTILS — Fonctions utilitaires partagées dans toute l'app
// ═══════════════════════════════════════════════════════════

// Formate une date en YYYY-MM-DD (format utilisé en base de données)
export const toDateString = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }
  
  // Retourne la date d'aujourd'hui en YYYY-MM-DD
  export const today = (): string => {
    return toDateString(new Date())
  }
  
  // Calcule le numéro de semaine depuis une date de départ
  export const weeksSince = (startDate: string): number => {
    const start = new Date(startDate)
    const now = new Date()
    const diff = now.getTime() - start.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1
  }
  
  // Calcule les jours restants jusqu'à une date cible
  export const daysUntil = (targetDate: string): number => {
    const target = new Date(targetDate)
    const now = new Date()
    const diff = target.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }
  
  // Additionne les macros d'une liste de repas
  export const sumMacros = (meals: { cal: number; prot: number; carb: number; lip: number }[]) => {
    return meals.reduce(
      (acc, m) => ({
        cal: acc.cal + m.cal,
        prot: acc.prot + m.prot,
        carb: acc.carb + m.carb,
        lip: acc.lip + m.lip,
      }),
      { cal: 0, prot: 0, carb: 0, lip: 0 }
    )
  }
  
  // Calcule le pourcentage de progression entre départ et objectif
  export const progressPercent = (start: number, current: number, goal: number): number => {
    if (start === goal) return 100
    const progress = ((start - current) / (start - goal)) * 100
    return Math.min(100, Math.max(0, Math.round(progress)))
  }