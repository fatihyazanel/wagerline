import { getDb } from '../../database/init'

const db = getDb()

interface NewsArticle {
  id?: number
  title: string
  content: string
  source: string
  url: string
  publishedAt?: string
  teamId?: number
  playerId?: number
  fixtureId?: number
  competitionId?: number
  relevanceScore: number
  language: string
}

class NewsEngine {
  async scoreRelevance(article: NewsArticle): Promise<number> {
    let score = 0

    // Base score for source reliability
    const sourceScores: { [key: string]: number } = {
      'bbc': 30,
      'reuters': 30,
      'bloomberg': 25,
      'espn': 25,
      'google-news': 20,
      'club-official': 35,
      'default': 10,
    }

    const sourceScore = sourceScores[article.source.toLowerCase()] || sourceScores['default']
    score += sourceScore

    // Exact team match +25
    if (article.teamId) {
      score += 25
    }

    // Exact player match +30
    if (article.playerId) {
      score += 30
    }

    // Exact fixture match +40
    if (article.fixtureId) {
      score += 40
    }

    // Competition match +10
    if (article.competitionId) {
      score += 10
    }

    // Recency bonus
    if (article.publishedAt) {
      const published = new Date(article.publishedAt).getTime()
      const now = Date.now()
      const minutesOld = (now - published) / (1000 * 60)

      if (minutesOld < 15) {
        score += 20 // Very fresh
      } else if (minutesOld < 60) {
        score += 10 // Fresh
      } else if (minutesOld < 1440) {
        score += 5 // Recent (within a day)
      }
    }

    // Title keyword boost
    const titleLower = article.title.toLowerCase()
    if (titleLower.includes('goal') || titleLower.includes('score')) {
      score += 10
    }
    if (titleLower.includes('injury')) {
      score += 8
    }
    if (titleLower.includes('transfer')) {
      score += 5
    }
    if (titleLower.includes('win') || titleLower.includes('championship')) {
      score += 3
    }

    return Math.min(score, 100) // Cap at 100
  }

  getRelevanceLevel(score: number): string {
    if (score >= 70) return 'high'
    if (score >= 40) return 'medium'
    return 'low'
  }

  async linkToEntities(article: NewsArticle): Promise<void> {
    // Match article to teams, players, fixtures
    await this.matchTeams(article)
    await this.matchPlayers(article)
    await this.matchFixtures(article)
  }

  private async matchTeams(article: NewsArticle): Promise<void> {
    const teamNames = await new Promise<any[]>((resolve) => {
      db.all('SELECT id, slug FROM teams LIMIT 30', [], (err, rows) => resolve(rows || []))
    })

    const contentLower = `${article.title} ${article.content}`.toLowerCase()

    for (const team of teamNames) {
      if (contentLower.includes(team.slug.replace(/-/g, ' '))) {
        article.teamId = team.id
        break
      }
    }
  }

  private async matchPlayers(article: NewsArticle): Promise<void> {
    const playerNames = await new Promise<any[]>((resolve) => {
      db.all(
        `SELECT DISTINCT p.id, pt.name FROM players p
         LEFT JOIN player_translations pt ON p.id = pt.player_id
         WHERE pt.language = 'en' LIMIT 100`,
        [],
        (err, rows) => resolve(rows || [])
      )
    })

    const contentLower = `${article.title} ${article.content}`.toLowerCase()

    for (const player of playerNames) {
      if (contentLower.includes(player.name.toLowerCase())) {
        article.playerId = player.id
        break
      }
    }
  }

  private async matchFixtures(article: NewsArticle): Promise<void> {
    const fixtures = await new Promise<any[]>((resolve) => {
      db.all(
        `SELECT id FROM events WHERE status IN ('LIVE', 'HT', 'FT') LIMIT 20`,
        [],
        (err, rows) => resolve(rows || [])
      )
    })

    // Very simple: if article is recent and has a score pattern, might be about latest fixture
    if (fixtures.length > 0 && article.title.toLowerCase().includes('-')) {
      article.fixtureId = fixtures[0].id
    }
  }

  async insertNews(articles: NewsArticle[]): Promise<number> {
    let inserted = 0

    for (const article of articles) {
      try {
        // Score relevance
        article.relevanceScore = await this.scoreRelevance(article)

        // Link to entities
        await this.linkToEntities(article)

        // Insert
        await new Promise<void>((resolve) => {
          db.run(
            `INSERT OR IGNORE INTO news (
              sport_id, title, content, source, news_type,
              team_id, player_id, event_id, competition_id,
              relevance_score, language, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              1, // sport_id (football)
              article.title.slice(0, 200),
              article.content.slice(0, 500),
              article.source,
              this.getRelevanceLevel(article.relevanceScore),
              article.teamId || null,
              article.playerId || null,
              article.fixtureId || null,
              article.competitionId || null,
              article.relevanceScore,
              article.language || 'en',
              article.publishedAt || new Date().toISOString(),
            ],
            () => {
              inserted++
              resolve()
            }
          )
        })
      } catch (error) {
        console.warn('Error inserting news article:', error)
      }
    }

    return inserted
  }

  async getTopNews(limit: number = 10): Promise<any[]> {
    return new Promise((resolve) => {
      db.all(
        `SELECT * FROM news ORDER BY relevance_score DESC, published_at DESC LIMIT ?`,
        [limit],
        (err, rows) => resolve(rows || [])
      )
    })
  }

  async getNewsByTeam(teamId: number, limit: number = 5): Promise<any[]> {
    return new Promise((resolve) => {
      db.all(
        `SELECT * FROM news WHERE team_id = ? ORDER BY relevance_score DESC LIMIT ?`,
        [teamId, limit],
        (err, rows) => resolve(rows || [])
      )
    })
  }

  async getNewsByPlayer(playerId: number, limit: number = 5): Promise<any[]> {
    return new Promise((resolve) => {
      db.all(
        `SELECT * FROM news WHERE player_id = ? ORDER BY relevance_score DESC LIMIT ?`,
        [playerId, limit],
        (err, rows) => resolve(rows || [])
      )
    })
  }

  async getNewsByFixture(fixtureId: number, limit: number = 5): Promise<any[]> {
    return new Promise((resolve) => {
      db.all(
        `SELECT * FROM news WHERE event_id = ? ORDER BY relevance_score DESC LIMIT ?`,
        [fixtureId, limit],
        (err, rows) => resolve(rows || [])
      )
    })
  }
}

export const newsEngine = new NewsEngine()
