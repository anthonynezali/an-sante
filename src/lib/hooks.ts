// ═══════════════════════════════════════════════════════════
// HOOKS — Fonctions de lecture/écriture Supabase
// Un hook par table, réutilisable dans tous les composants
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { Recipe, Ingredient } from './types'

// ── Pesées et mesures ──
export function useCheckins() {
  const [checkins, setCheckins] = useState<any[]>([])

  useEffect(() => {
    if (!supabase) return
    supabase.from('checkins').select('*').order('date', { ascending: false })
      .then(({ data }) => { if (data) setCheckins(data) })
  }, [])

  const saveCheckin = async (data: { date: string; weight?: number; waist?: number; hips?: number; chest?: number }) => {
    if (!supabase) return
    const { error } = await supabase.from('checkins').upsert(data, { onConflict: 'date' })
    if (!error) {
      setCheckins(prev => {
        const existing = prev.findIndex(c => c.date === data.date)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = { ...updated[existing], ...data }
          return updated
        }
        return [data, ...prev]
      })
    }
  }

  const latestCheckin = checkins[0] || null

  return { checkins, saveCheckin, latestCheckin }
}

// ── Recettes ──
export function useRecipes(defaultRecipes: Recipe[]) {
  const [recipes, setRecipes] = useState<Recipe[]>(defaultRecipes)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.from('recipes').select('*').order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setRecipes(data as Recipe[])
        setLoaded(true)
      })
  }, [])

  const saveRecipe = async (recipe: Recipe) => {
    if (!supabase) return
    await supabase.from('recipes').upsert(recipe, { onConflict: 'id' })
    setRecipes(prev => {
      const exists = prev.findIndex(r => r.id === recipe.id)
      if (exists >= 0) { const u = [...prev]; u[exists] = recipe; return u }
      return [...prev, recipe]
    })
  }

  const deleteRecipe = async (id: string) => {
    if (!supabase) return
    await supabase.from('recipes').delete().eq('id', id)
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  return { recipes, setRecipes, saveRecipe, deleteRecipe, loaded }
}

// ── Repas ──
export function useMeals() {
  const [weekMeals, setWeekMeals] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!supabase) return
    const today = new Date()
    const monthAgo = new Date(today)
    monthAgo.setDate(today.getDate() - 30)
    supabase.from('meals').select('*')
      .gte('date', monthAgo.toISOString().slice(0, 10))
      .then(({ data }) => {
        if (data) {
          const meals: Record<string, any> = {}
          data.forEach(m => { meals[`${m.date}-${m.slot}`] = m.meal_data })
          setWeekMeals(meals)
        }
      })
  }, [])

  const saveMeal = async (date: string, slot: string, meal: any) => {
    if (!supabase) return
    await supabase.from('meals').upsert(
      { date, slot, meal_data: meal, in_courses: meal.inCourses },
      { onConflict: 'date,slot' }
    )
    setWeekMeals(p => ({ ...p, [`${date}-${slot}`]: meal }))
  }

  const deleteMeal = async (date: string, slot: string) => {
    if (!supabase) return
    await supabase.from('meals').delete().eq('date', date).eq('slot', slot)
    setWeekMeals(p => { const n = { ...p }; delete n[`${date}-${slot}`]; return n })
  }

  return { weekMeals, setWeekMeals, saveMeal, deleteMeal }
}

// ── Paramètres utilisateur (date de début, règles...) ──
export function useSettings() {
  const [programStart, setProgramStartState] = useState('2026-04-06')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.from('user_settings').select('*')
      .then(({ data }) => {
        if (data) {
          data.forEach(row => {
            if (row.key === 'program_start') setProgramStartState(row.value as string)
          })
        }
        setLoaded(true)
      })
  }, [])

  const setProgramStart = async (date: string) => {
    if (!supabase) return
    await supabase.from('user_settings').upsert(
      { key: 'program_start', value: date },
      { onConflict: 'key' }
    )
    setProgramStartState(date)
  }

  return { programStart, setProgramStart, loaded }
}

// ── Logs séances ──
export function useTrainingLogs() {
  const [completedDays, setCompletedDays] = useState<string[]>([])

  useEffect(() => {
    if (!supabase) return
    supabase.from('training_logs').select('date').eq('completed', true)
      .then(({ data }) => {
        if (data) setCompletedDays(data.map(d => d.date))
      })
  }, [])

  const toggleTraining = async (date: string) => {
    if (!supabase) return
    const isDone = completedDays.includes(date)
    if (isDone) {
      await supabase.from('training_logs').delete().eq('date', date)
      setCompletedDays(prev => prev.filter(d => d !== date))
    } else {
      await supabase.from('training_logs').upsert({ date, completed: true }, { onConflict: 'date' })
      setCompletedDays(prev => [...prev, date])
    }
  }

  return { completedDays, toggleTraining }
}

// ── Ingrédients personnalisés ──
export function useCustomIngredients() {
  const [customIngs, setCustomIngs] = useState<Ingredient[]>([])

  useEffect(() => {
    console.log('[useCustomIngredients] mount — supabase:', !!supabase)
    if (!supabase) return
    supabase.from('custom_ingredients').select('*').order('created_at', { ascending: true })
      .then(({ data, error }) => {
        console.log('[useCustomIngredients] load result', { data, error })
        if (error) console.error('[useCustomIngredients] load error:', error)
        if (data) setCustomIngs(data as Ingredient[])
      })
  }, [])

  const saveCustomIngredient = async (ing: Ingredient) => {
    console.log('[saveCustomIngredient] called with', ing)
    if (!supabase) {
      console.warn('[saveCustomIngredient] no supabase client')
      return
    }
    const { error } = await supabase.from('custom_ingredients').upsert(ing, { onConflict: 'id' })
    if (error) {
      console.error('[saveCustomIngredient] upsert error:', error)
      return
    }
    console.log('[saveCustomIngredient] upsert OK')
    setCustomIngs(prev => {
      const exists = prev.findIndex(i => i.id === ing.id)
      if (exists >= 0) { const u = [...prev]; u[exists] = ing; return u }
      return [...prev, ing]
    })
  }

  const deleteCustomIngredient = async (id: string) => {
    if (!supabase) return
    const { error } = await supabase.from('custom_ingredients').delete().eq('id', id)
    if (error) console.error('[deleteCustomIngredient] error:', error)
    setCustomIngs(prev => prev.filter(i => i.id !== id))
  }

  return { customIngs, saveCustomIngredient, deleteCustomIngredient }
}