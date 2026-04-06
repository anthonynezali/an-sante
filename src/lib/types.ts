// ═══════════════════════════════════════════════════════════
// TYPES — Structure de toutes les données de l'app AN.Santé
// ═══════════════════════════════════════════════════════════

// Un ingrédient de la base de données
export interface Ingredient {
    id: string
    name: string
    cat: string       // catégorie : prot, fec, leg, frais, epic
    dQty: number      // quantité par défaut
    dUnit: string     // unité par défaut
    cal: number
    prot: number
    carb: number
    lip: number
  }
  
  // Un ingrédient dans une recette (avec quantité personnalisée)
  export interface RecipeIngredient {
    ingredientId: string
    qty: number
    unit: string
  }
  
  // Une recette sauvegardée
  export interface Recipe {
    id: string
    name: string
    ingredients: RecipeIngredient[]
    cal: number
    prot: number
    carb: number
    lip: number
  }
  
  // Un repas dans un slot de la journée
  export interface Meal {
    id: string
    date: string      // format YYYY-MM-DD
    slot: 'pdj' | 'collation1' | 'midi' | 'collation2' | 'soir'
    recipe?: Recipe
    checked: boolean  // consommé ou non
    inCourses: boolean // inclus dans la liste de courses
  }
  
  // Un check-in quotidien (pesée + mesures)
  export interface Checkin {
    id: string
    date: string
    weight?: number
    waist?: number
    hips?: number
    chest?: number
  }
  
  // Un log de séance de sport
  export interface TrainingLog {
    id: string
    date: string
    completed: boolean
    notes?: string
  }
  
  // L'onglet actif dans la navbar
  export type TabId = 'dashboard' | 'training' | 'nutrition' | 'courses' | 'espace'