-- Add home_team_id and away_team_id to events table
ALTER TABLE events ADD COLUMN home_team_id INTEGER REFERENCES teams(id);
ALTER TABLE events ADD COLUMN away_team_id INTEGER REFERENCES teams(id);
