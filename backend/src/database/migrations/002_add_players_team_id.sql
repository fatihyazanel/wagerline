-- Canonical current-team relation for roster queries.
-- Historical/seasonal membership remains in player_team_assignments.
ALTER TABLE players
ADD COLUMN team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);

UPDATE players
SET team_id = (
  SELECT pta.team_id
  FROM player_team_assignments pta
  JOIN teams valid_team ON valid_team.id = pta.team_id
  WHERE pta.player_id = players.id
  ORDER BY COALESCE(pta.is_active, 1) DESC, pta.season_id DESC, pta.id DESC
  LIMIT 1
)
WHERE team_id IS NULL
  AND EXISTS (
    SELECT 1 FROM player_team_assignments pta
    JOIN teams valid_team ON valid_team.id = pta.team_id
    WHERE pta.player_id = players.id
  );
