// ═══════════════════════════════════════════════════════════
// SUPABASE — Connexion à la base de données
// Désactivé jusqu'à la configuration du .env
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Export null si pas encore configuré — on activera avec Supabase
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null