// ═══════════════════════════════════════════════════════════
// APP — Composant racine de AN.Santé
// Gère l'onglet actif et affiche le bon contenu
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { TabId } from './lib/types'
import NavBar from './components/NavBar'
import Dashboard from './tabs/Dashboard'
import Training from './tabs/Training'
import Nutrition from './tabs/Nutrition'
import Courses from './tabs/Courses'
import Espace from './tabs/Espace'

export default function App() {
  // Onglet affiché par défaut au lancement
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')

  // Affiche le bon onglet selon la sélection
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':  return <Dashboard />
      case 'training':   return <Training />
      case 'nutrition':  return <Nutrition />
      case 'courses':    return <Courses />
      case 'espace':     return <Espace />
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-outfit pb-16">
      {/* Contenu de l'onglet actif */}
      {renderTab()}

      {/* Barre de navigation fixe en bas */}
      <NavBar active={activeTab} onChange={setActiveTab} />
    </div>
  )
}