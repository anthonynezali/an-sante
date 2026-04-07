// ═══════════════════════════════════════════════════════════
// APP — Composant racine de AN.Santé
// Gère le state global branché sur Supabase
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { TabId, Recipe } from './lib/types'
import { useRecipes, useMeals, useSettings, useCustomIngredients } from './lib/hooks'
import NavBar from './components/NavBar'
import Dashboard from './tabs/Dashboard'
import Training from './tabs/Training'
import Nutrition from './tabs/Nutrition'
import Courses from './tabs/Courses'
import Espace from './tabs/Espace'

// Recette par défaut fournie au démarrage
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

  // ── Données persistées via Supabase ──
  const { recipes, saveRecipe, deleteRecipe } = useRecipes(DEFAULT_RECIPES)
  const { weekMeals, saveMeal, deleteMeal } = useMeals()
  const { programStart, setProgramStart } = useSettings()
  const { customIngs, saveCustomIngredient, deleteCustomIngredient } = useCustomIngredients()
  console.log('[App] customIngs:', customIngs)

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard programStart={programStart} />
      case 'training':
        return <Training />
      case 'nutrition':
        return (
          <Nutrition
            recipes={recipes}
            weekMeals={weekMeals}
            saveMeal={saveMeal}
            deleteMeal={deleteMeal}
            saveRecipe={saveRecipe}
            customIngs={customIngs}
          />
        )
      case 'courses':
        return <Courses weekMeals={weekMeals} recipes={recipes} />
      case 'espace':
        return (
          <Espace
            recipes={recipes}
            saveRecipe={saveRecipe}
            deleteRecipe={deleteRecipe}
            programStart={programStart}
            setProgramStart={setProgramStart}
            customIngs={customIngs}
            saveCustomIngredient={saveCustomIngredient}
            deleteCustomIngredient={deleteCustomIngredient}
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