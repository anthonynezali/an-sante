// ═══════════════════════════════════════════════════════════
// SUPABASE — Client de connexion à la base de données
// Les clés viennent du fichier .env (jamais dans le code)
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null