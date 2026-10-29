'use client'

import { useApi } from '@/context/ApiContext'
import { useCallback, useState, useEffect } from 'react'

export interface Team {
  id: number
  slug: string
  logo_url: string
  name: string
  country?: string
}

export interface Match {
  id: number
  start_time: string
  status: 'scheduled' | 'live' | 'finished'
  home_team_id: number
  away_team_id: number
  home_team_name: string
  away_team_name: string
  home_team_slug: string
  away_team_slug: string
  home_logo: string
  away_logo: string
  home_score: number
  away_score: number
  round: string
}

export interface Competition {
  id: number
  slug: string
  name_key: string
  standings: Standing[]
}

export interface Standing {
  position: number
  team_slug: string
  played: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
}

export const useMatches = (status: 'scheduled' | 'finished' = 'scheduled', limit: number = 20) => {
  const api = useApi()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const response = await api.get('/events', { status, limit, lang: 'en' })
        setMatches(response.data || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch matches')
        setMatches([])
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [status, limit, api])

  return { matches, loading, error }
}

export const useTeams = (sport: string = 'football') => {
  const api = useApi()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const response = await api.get('/teams', { sport, lang: 'en' })
        setTeams(response.data || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch teams')
        setTeams([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [sport, api])

  return { teams, loading, error }
}

export const useCompetitions = (sport: string = 'football') => {
  const api = useApi()
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true)
        const response = await api.get('/competitions', { sport, lang: 'en' })
        setCompetitions(response.data || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch competitions')
        setCompetitions([])
      } finally {
        setLoading(false)
      }
    }

    fetchCompetitions()
  }, [sport, api])

  return { competitions, loading, error }
}

export const useCompetitionStandings = (competitionSlug: string) => {
  const api = useApi()
  const [standings, setStandings] = useState<Competition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!competitionSlug) {
      setLoading(false)
      return
    }

    const fetchStandings = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/competitions/${competitionSlug}`, { lang: 'en' })
        setStandings(response.data || null)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch standings')
        setStandings(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStandings()
  }, [competitionSlug, api])

  return { standings, loading, error }
}
