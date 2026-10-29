interface LiveMatch {
  fixtureId: number
  status: string
  minute: number
  homeTeamName: string
  awayTeamName: string
  homeScore: number
  awayScore: number
  lastUpdated: string
  incidents: any[]
}

class ChangeDetector {
  detectChanges(previous: LiveMatch, current: LiveMatch): string[] {
    const changes: string[] = []

    // Check score
    if (previous.homeScore !== current.homeScore || previous.awayScore !== current.awayScore) {
      changes.push(`score: ${previous.homeScore}-${previous.awayScore} → ${current.homeScore}-${current.awayScore}`)

      // Detect goals
      if (current.homeScore > previous.homeScore) {
        const goalCount = current.homeScore - previous.homeScore
        changes.push(`🎯 Home goal${goalCount > 1 ? 's' : ''}!`)
      }
      if (current.awayScore > previous.awayScore) {
        const goalCount = current.awayScore - previous.awayScore
        changes.push(`⚽ Away goal${goalCount > 1 ? 's' : ''}!`)
      }
    }

    // Check status
    if (previous.status !== current.status) {
      changes.push(`status: ${previous.status} → ${current.status}`)

      if (current.status === 'HT') {
        changes.push('⏸️  Halftime')
      } else if (current.status === 'FT') {
        changes.push('🏁 Full time')
      }
    }

    // Check minute
    if (previous.minute !== current.minute && current.status === 'LIVE') {
      const minuteDiff = current.minute - previous.minute
      if (minuteDiff > 0) {
        changes.push(`⏱️  ${current.minute}'`)
      }
    }

    // Check incidents
    const prevIncidentCount = previous.incidents?.length || 0
    const currIncidentCount = current.incidents?.length || 0

    if (currIncidentCount > prevIncidentCount) {
      const newIncidents = current.incidents.slice(0, currIncidentCount - prevIncidentCount)

      for (const incident of newIncidents) {
        if (incident.type === 'GOAL') {
          changes.push(`💙 Goal - ${incident.detail || 'unknown'}`)
        } else if (incident.type === 'YELLOW_CARD') {
          changes.push(`🟨 Yellow card`)
        } else if (incident.type === 'RED_CARD') {
          changes.push(`🔴 Red card`)
        } else if (incident.type === 'SUBSTITUTION') {
          changes.push(`🔄 Substitution`)
        } else if (incident.type === 'VAR') {
          changes.push(`📺 VAR review`)
        }
      }
    }

    return changes
  }

  hasSignificantChange(previous: LiveMatch, current: LiveMatch): boolean {
    const changes = this.detectChanges(previous, current)
    // Significant if score changed, status changed, or incident occurred
    return changes.some((c) => c.includes('score:') || c.includes('status:') || c.includes('Goal') || c.includes('card'))
  }
}

export const changeDetector = new ChangeDetector()
