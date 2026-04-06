// ═══════════════════════════════════════════════════════════
// APP — Composant racine de AN.Santé
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { TabId, Recipe, WeekMeals } from './lib/types'
import NavBar from './components/NavBar'
import Dashboard from './tabs/Dashboard'
import Training from './tabs/Training'
import Nutrition from './tabs/Nutrition'
import Courses from './tabs/Courses'
import Espace from './tabs/Espace'

const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 'pdj-classique',
    name: 'Fromage blanc + Whey classique',
    ingredients: [
      { ingId: 'fromage-blanc', qty: 250, unit: 'g' },
      { ingId: 'whey', qty: 30, unit: 'g' },
      { ingId: 'chia', qty: 15, unit: 'g' },
      { ingId: 'cacao', qty: 10, unit: 'g' },
    ],
    cal: 345, prot: 49, carb: 20, lip: 8,
    slot: 'pdj',
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [recipes, setRecipes] = useState<Recipe[]>(DEFAULT_RECIPES)
  const [weekMeals, setWeekMeals] = useState<WeekMeals>({})
  const [programStart, setProgramStart] = useState('2026-04-06')

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':  return <Dashboard programStart={programStart} />
      case 'training':   return <Training />
      case 'nutrition':  return (
        <Nutrition
          recipes={recipes}
          setRecipes={setRecipes}
          weekMeals={weekMeals}
          setWeekMeals={setWeekMeals}
        />
      )
      case 'courses':    return <Courses weekMeals={weekMeals} recipes={recipes} />
      case 'espace':     return (
        <Espace
          recipes={recipes}
          setRecipes={setRecipes}
          programStart={programStart}
          setProgramStart={setProgramStart}
        />
      )
    }
  }

  return (
    <div className="min-h-screen text-white font-outfit pb-16">
      {renderTab()}
      <NavBar active={activeTab} onChange={setActiveTab} />
    </div>
  )
}