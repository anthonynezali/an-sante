// ═══════════════════════════════════════════════════════════
// SUPABASE — Connexion à la base de données
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'

// Ces variables viennent du fichier .env (jamais dans le code)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables Supabase manquantes dans le fichier .env')
}

// Client Supabase — c'est lui qu'on importe partout pour lire/écrire en base
export const supabase = createClient(supabaseUrl, supabaseKey)