-- Add team_id and stats columns to standings table
ALTER TABLE standings ADD COLUMN team_id INTEGER REFERENCES teams(id);
ALTER TABLE standings ADD COLUMN position INTEGER;
ALTER TABLE standings ADD COLUMN played INTEGER DEFAULT 0;
ALTER TABLE standings ADD COLUMN wins INTEGER DEFAULT 0;
ALTER TABLE standings ADD COLUMN draws INTEGER DEFAULT 0;
ALTER TABLE standings ADD COLUMN losses INTEGER DEFAULT 0;
ALTER TABLE standings ADD COLUMN goals_for INTEGER DEFAULT 0;
ALTER TABLE standings ADD COLUMN goals_against INTEGER DEFAULT 0;

-- Create index for faster queries
CREATE INDEX idx_standings_team_competition ON standings(team_id, competition_id);
