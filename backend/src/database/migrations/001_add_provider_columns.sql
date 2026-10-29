-- Add provider columns for multi-provider support
ALTER TABLE teams ADD COLUMN provider TEXT DEFAULT 'api-football';
ALTER TABLE players ADD COLUMN provider TEXT DEFAULT 'api-football';
ALTER TABLE events ADD COLUMN provider TEXT DEFAULT 'api-football';

-- Create unique constraints for (provider, external_id)
-- Note: SQLite doesn't support dropping constraints, so these are added as indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_teams_provider_external_id
  ON teams(provider, external_id) WHERE external_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_players_provider_external_id
  ON players(provider, external_id) WHERE external_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_events_provider_external_id
  ON events(provider, external_id) WHERE external_id IS NOT NULL;

-- Add new tables for enhanced features
CREATE TABLE IF NOT EXISTS event_incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    team_id INTEGER,
    player_id INTEGER,
    assist_player_id INTEGER,
    type TEXT NOT NULL,
    detail TEXT,
    comments TEXT,
    elapsed INTEGER,
    extra INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, type, player_id, elapsed, extra),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (assist_player_id) REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS event_player_statistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    position TEXT,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    yellow_cards INTEGER DEFAULT 0,
    red_cards INTEGER DEFAULT 0,
    minutes_played INTEGER DEFAULT 0,
    shots_on_target INTEGER DEFAULT 0,
    pass_accuracy REAL DEFAULT 0,
    rating REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, player_id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS injuries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    event_id INTEGER,
    type TEXT,
    reason TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS sync_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT,
    status TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    response_time_ms INTEGER,
    error_code TEXT,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_aliases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    alias TEXT NOT NULL,
    language TEXT,
    UNIQUE(team_id, alias),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS player_aliases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    alias TEXT NOT NULL,
    language TEXT,
    UNIQUE(player_id, alias),
    FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS live_news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER,
    team_id INTEGER,
    player_id INTEGER,
    competition_id INTEGER,
    source TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL UNIQUE,
    image_url TEXT,
    published_at DATETIME,
    discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    relevance_score REAL DEFAULT 0,
    language TEXT DEFAULT 'en',
    is_live_related INTEGER DEFAULT 0,
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (competition_id) REFERENCES competitions(id)
);
