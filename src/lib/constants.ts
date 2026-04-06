// ═══════════════════════════════════════════════════════════
// PHASES DU PROGRAMME
// ═══════════════════════════════════════════════════════════

export const PHASES = [
    { id: 1, name: "LE ROBOT", weeks: 6, color: "#22c55e", weightGoal: 83, waistGoal: 93 },
    { id: 2, name: "L'APPRENTI", weeks: 4, color: "#3b82f6", weightGoal: 80, waistGoal: 89 },
    { id: 3, name: "LE PILOTE", weeks: 6, color: "#a855f7", weightGoal: 78, waistGoal: 86 },
  ]
  
  // ═══════════════════════════════════════════════════════════
  // JALONS SEMAINE PAR SEMAINE
  // ═══════════════════════════════════════════════════════════
  
  export const MILESTONES = [
    { week: 1, title: "Installer le cadre", desc: "Le poids peut bouger de 1-2 kg (eau). Focus sur tenir les règles, pas la balance." },
    { week: 2, title: "Premier vrai résultat", desc: "−2 à 3 kg. Le corps commence à répondre." },
    { week: 3, title: "Différence visible", desc: "−3 à 4 kg. Tu commences à le voir dans le miroir." },
    { week: 4, title: "Le cap mental", desc: "−4 à 5 kg. Le plus dur est passé. L'habitude est en place." },
    { week: 5, title: "Accélération", desc: "−5 à 6 kg. Résultats cumulés visibles." },
    { week: 6, title: "Objectif Phase 1 atteint", desc: "−6 à 7 kg. Photo bilan. Passage en Phase 2." },
  ]
  
  // ═══════════════════════════════════════════════════════════
  // DONNÉES DE DÉPART & OBJECTIFS
  // ═══════════════════════════════════════════════════════════
  
  export const START = { weight: 89.3, waist: 99, hips: 102, chest: 107 }
  export const TARGETS = { cal: 2000, prot: 170, carb: 200, lip: 55 }
  
  // ═══════════════════════════════════════════════════════════
  // UNITÉS & CATÉGORIES
  // ═══════════════════════════════════════════════════════════
  
  export const UNITS = ["g", "ml", "cl", "càs", "càc", "pièce", "tranche"]
  
  export const CATEGORIES = [
    { id: "prot", label: "Protéines", color: "#ef4444" },
    { id: "fec", label: "Féculents", color: "#f59e0b" },
    { id: "leg", label: "Légumes & fruits", color: "#22c55e" },
    { id: "frais", label: "Produits frais", color: "#3b82f6" },
    { id: "epic", label: "Épicerie", color: "#a855f7" },
    { id: "supp", label: "Suppléments", color: "#6b7280" },
  ]
  
  // ═══════════════════════════════════════════════════════════
  // BASE D'INGRÉDIENTS
  // ═══════════════════════════════════════════════════════════
  
  export const INGREDIENTS_DB = [
    { id: "poulet", name: "Poulet grillé", cat: "prot", dQty: 200, dUnit: "g", cal: 220, prot: 42, carb: 0, lip: 5 },
    { id: "steak", name: "Steak haché 5%", cat: "prot", dQty: 200, dUnit: "g", cal: 230, prot: 40, carb: 0, lip: 8 },
    { id: "cabillaud", name: "Cabillaud", cat: "prot", dQty: 200, dUnit: "g", cal: 160, prot: 36, carb: 0, lip: 1 },
    { id: "dinde", name: "Escalope de dinde", cat: "prot", dQty: 200, dUnit: "g", cal: 200, prot: 44, carb: 0, lip: 2 },
    { id: "oeufs", name: "Œufs", cat: "prot", dQty: 4, dUnit: "pièce", cal: 280, prot: 26, carb: 2, lip: 20 },
    { id: "pates", name: "Pâtes complètes", cat: "fec", dQty: 60, dUnit: "g", cal: 210, prot: 7, carb: 42, lip: 1 },
    { id: "semoule", name: "Semoule", cat: "fec", dQty: 60, dUnit: "g", cal: 200, prot: 6, carb: 41, lip: 1 },
    { id: "patdouce", name: "Patate douce", cat: "fec", dQty: 130, dUnit: "g", cal: 115, prot: 2, carb: 27, lip: 0 },
    { id: "pain", name: "Pain complet", cat: "fec", dQty: 1, dUnit: "tranche", cal: 80, prot: 3, carb: 15, lip: 1 },
    { id: "riz", name: "Riz complet", cat: "fec", dQty: 60, dUnit: "g", cal: 215, prot: 5, carb: 46, lip: 1 },
    { id: "flocons", name: "Flocons d'avoine", cat: "fec", dQty: 50, dUnit: "g", cal: 190, prot: 6, carb: 34, lip: 3 },
    { id: "haricots", name: "Haricots verts", cat: "leg", dQty: 200, dUnit: "g", cal: 60, prot: 4, carb: 8, lip: 0 },
    { id: "brocoli", name: "Brocoli", cat: "leg", dQty: 200, dUnit: "g", cal: 70, prot: 6, carb: 8, lip: 1 },
    { id: "courgettes", name: "Courgettes", cat: "leg", dQty: 200, dUnit: "g", cal: 40, prot: 3, carb: 4, lip: 1 },
    { id: "champignons", name: "Champignons", cat: "leg", dQty: 200, dUnit: "g", cal: 45, prot: 6, carb: 4, lip: 1 },
    { id: "petitspois", name: "Petits pois", cat: "leg", dQty: 200, dUnit: "g", cal: 150, prot: 10, carb: 22, lip: 1 },
    { id: "salade", name: "Salade + tomates", cat: "leg", dQty: 200, dUnit: "g", cal: 40, prot: 2, carb: 6, lip: 0 },
    { id: "banane", name: "Banane", cat: "leg", dQty: 1, dUnit: "pièce", cal: 90, prot: 1, carb: 23, lip: 0 },
    { id: "myrtilles", name: "Myrtilles", cat: "leg", dQty: 100, dUnit: "g", cal: 57, prot: 1, carb: 14, lip: 0 },
    { id: "fb0", name: "Fromage blanc 0%", cat: "frais", dQty: 200, dUnit: "g", cal: 80, prot: 14, carb: 6, lip: 0 },
    { id: "ps0", name: "Petits suisses 0%", cat: "frais", dQty: 2, dUnit: "pièce", cal: 70, prot: 8, carb: 6, lip: 0 },
    { id: "yaourt", name: "Yaourt grec 0%", cat: "frais", dQty: 150, dUnit: "g", cal: 90, prot: 15, carb: 6, lip: 0 },
    { id: "laitamande", name: "Lait d'amande", cat: "frais", dQty: 200, dUnit: "ml", cal: 30, prot: 1, carb: 1, lip: 3 },
    { id: "whey", name: "Whey", cat: "epic", dQty: 30, dUnit: "g", cal: 115, prot: 24, carb: 3, lip: 1 },
    { id: "chia", name: "Chia", cat: "epic", dQty: 15, dUnit: "g", cal: 72, prot: 2, carb: 4, lip: 5 },
    { id: "cacao", name: "Cacao", cat: "epic", dQty: 10, dUnit: "g", cal: 22, prot: 2, carb: 2, lip: 1 },
    { id: "amandes", name: "Amandes", cat: "epic", dQty: 30, dUnit: "g", cal: 175, prot: 6, carb: 3, lip: 15 },
    { id: "huile", name: "Huile d'olive", cat: "epic", dQty: 10, dUnit: "ml", cal: 90, prot: 0, carb: 0, lip: 10 },
    { id: "miel", name: "Miel", cat: "epic", dQty: 10, dUnit: "g", cal: 30, prot: 0, carb: 8, lip: 0 },
    { id: "cannelle", name: "Cannelle", cat: "epic", dQty: 2, dUnit: "g", cal: 5, prot: 0, carb: 1, lip: 0 },
    { id: "huile-olive", name: "Huile d'olive", cat: "supp", dQty: 10, dUnit: "ml", cal: 90, prot: 0, carb: 0, lip: 10 },
    { id: "olives-vertes", name: "Olives vertes", cat: "supp", dQty: 30, dUnit: "g", cal: 35, prot: 0, carb: 1, lip: 3 },
    { id: "olives-noires", name: "Olives noires", cat: "supp", dQty: 30, dUnit: "g", cal: 45, prot: 0, carb: 1, lip: 4 },
    { id: "sel", name: "Sel", cat: "supp", dQty: 2, dUnit: "g", cal: 0, prot: 0, carb: 0, lip: 0 },
    { id: "poivre", name: "Poivre", cat: "supp", dQty: 2, dUnit: "g", cal: 5, prot: 0, carb: 1, lip: 0 },
    { id: "paprika", name: "Paprika", cat: "supp", dQty: 3, dUnit: "g", cal: 8, prot: 0, carb: 1, lip: 0 },
    { id: "curcuma", name: "Curcuma", cat: "supp", dQty: 3, dUnit: "g", cal: 8, prot: 0, carb: 1, lip: 0 },
    { id: "ail", name: "Ail", cat: "supp", dQty: 5, dUnit: "g", cal: 7, prot: 0, carb: 2, lip: 0 },
    { id: "moutarde", name: "Moutarde", cat: "supp", dQty: 10, dUnit: "g", cal: 10, prot: 1, carb: 1, lip: 0 },
    { id: "citron", name: "Citron (jus)", cat: "supp", dQty: 15, dUnit: "ml", cal: 4, prot: 0, carb: 1, lip: 0 },
    { id: "vinaigre", name: "Vinaigre balsamique", cat: "supp", dQty: 10, dUnit: "ml", cal: 18, prot: 0, carb: 4, lip: 0 },
    { id: "herbes", name: "Herbes de Provence", cat: "supp", dQty: 2, dUnit: "g", cal: 5, prot: 0, carb: 1, lip: 0 },
  ]