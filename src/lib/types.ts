// ═══════════════════════════════════════════════════════════
// TYPES — Structure de toutes les données de l'app AN.Santé
// ═══════════════════════════════════════════════════════════

// L'onglet actif dans la navbar
export type TabId = 'dashboard' | 'training' | 'nutrition' | 'courses' | 'espace'

// Un ingrédient de la base de données
export interface Ingredient {
  id: string
  name: string
  cat: string
  dQty: number
  dUnit: string
  cal: number
  prot: number
  carb: number
  lip: number
}

// Une recette sauvegardée et réutilisable
export interface Recipe {
  id: string
  name: string
  ingredients: { ingId: string; qty: number; unit: string }[]
  cal: number
  prot: number
  carb: number
  lip: number
  slot?: 'pdj' | 'midi' | 'soir'
}

// Un repas composé (protéine + féculents + légumes + suppléments)
export interface ComposedMeal {
  type: 'composed'
  prot: string
  fec: string[]
  leg: string[]
  frais?: string[]
  epic?: string[]
  supplements: string[]
  cal: number
  prot_g: number
  carb: number
  lip: number
  inCourses: boolean
}

// Un repas depuis une recette sauvegardée
export interface RecipeMeal {
  type: 'recipe'
  recipeId: string
  cal?: number
  prot?: number
  carb?: number
  lip?: number
  inCourses: boolean
}

// Union des deux types de repas
export type Meal = ComposedMeal | RecipeMeal

// Tous les repas indexés par "YYYY-MM-DD-slot"
export type WeekMeals = Record<string, Meal>

// Un check-in quotidien
export interface Checkin {
  id: string
  date: string
  weight?: number
  waist?: number
  hips?: number
  chest?: number
}