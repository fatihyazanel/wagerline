'use client'

import { useState } from 'react'
import LivePage from './pages/LivePage'
import SportsPage from './pages/SportsPage'
import LeaguesPage from './pages/LeaguesPage'
import PredictionsPage from './pages/PredictionsPage'
import StatsPage from './pages/StatsPage'
import NewsPage from './pages/NewsPage'
import RewardsPage from './pages/RewardsPage'
import AdminPage from './pages/AdminPage'

interface DashboardProps {
  activePage: string
}

export default function Dashboard({ activePage }: DashboardProps) {
  return (
    <div className="pt-14 pb-8 px-6 max-w-7xl mx-auto">
      {activePage === 'live' && <LivePage />}
      {activePage === 'sports' && <SportsPage />}
      {activePage === 'leagues' && <LeaguesPage />}
      {activePage === 'predictions' && <PredictionsPage />}
      {activePage === 'stats' && <StatsPage />}
      {activePage === 'news' && <NewsPage />}
      {activePage === 'rewards' && <RewardsPage />}
      {activePage === 'admin' && <AdminPage />}
    </div>
  )
}
