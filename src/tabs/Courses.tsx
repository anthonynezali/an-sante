// ═══════════════════════════════════════════════════════════
// COURSES — Onglet Liste de courses
// ═══════════════════════════════════════════════════════════

import { Recipe, WeekMeals } from '../lib/types'

interface CoursesProps {
  weekMeals: WeekMeals
  recipes: Recipe[]
}

export default function Courses({ weekMeals, recipes }: CoursesProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-accent">Courses</h2>
      <p className="text-white/50 text-sm mt-1">Courses en construction…</p>
    </div>
  )
}