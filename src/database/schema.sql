-- PRAGMA WAL
PRAGMA journal_mode=WAL;

-- Core
CREATE TABLE IF NOT EXISTS sports (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_key TEXT NOT NULL,
  icon TEXT,
  status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS competitions (
  id INTEGER PRIMARY KEY,
  sport_id INTEGER NOT NULL,
  external_provider TEXT,
  external_id TEXT,
  slug TEXT UNIQUE NOT NULL,
  name_key TEXT NOT NULL,
  country_id INTEGER,
  active BOOLEAN DEFAULT 1,
  FOREIGN KEY (sport_id) REFERENCES sports(id)
);

CREATE TABLE IF NOT EXISTS seasons (
  id INTEGER PRIMARY KEY,
  competition_id INTEGER NOT NULL,
  external_id TEXT,
  name TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT 0,
  FOREIGN KEY (competition_id) REFERENCES competitions(id)
);

CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  country_id INTEGER,
  capacity INTEGER
);

CREATE TABLE IF NOT EXISTS countries (
  id INTEGER PRIMARY KEY,
  code TEXT UNIQUE,
  name TEXT NOT NULL
);

-- Participants
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY,
  sport_id INTEGER NOT NULL,
  external_id TEXT,
  slug TEXT NOT NULL,
  logo_url TEXT,
  country_id INTEGER,
  active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_id) REFERENCES sports(id),
  UNIQUE(sport_id, slug)
);

CREATE TABLE IF NOT EXISTS team_translations (
  id INTEGER PRIMARY KEY,
  team_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (team_id) REFERENCES teams(id),
  UNIQUE(team_id, language)
);

CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY,
  sport_id INTEGER NOT NULL,
  external_id TEXT,
  slug TEXT NOT NULL,
  image_url TEXT,
  country_id INTEGER,
  position TEXT,
  active BOOLEAN DEFAULT 1,
  FOREIGN KEY (sport_id) REFERENCES sports(id)
);

CREATE TABLE IF NOT EXISTS drivers (
  id INTEGER PRIMARY KEY,
  external_id TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  country_id INTEGER,
  active BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS coaches (
  id INTEGER PRIMARY KEY,
  external_id TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  country_id INTEGER
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY,
  sport_id INTEGER NOT NULL,
  competition_id INTEGER,
  season_id INTEGER,
  external_id TEXT,
  event_type TEXT,
  start_time DATETIME,
  status TEXT DEFAULT 'scheduled',
  venue_id INTEGER,
  round INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_id) REFERENCES sports(id),
  FOREIGN KEY (competition_id) REFERENCES competitions(id),
  FOREIGN KEY (season_id) REFERENCES seasons(id),
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);

CREATE TABLE IF NOT EXISTS event_participants (
  id INTEGER PRIMARY KEY,
  event_id INTEGER NOT NULL,
  participant_type TEXT,
  participant_id INTEGER,
  role TEXT,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS event_scores (
  event_id INTEGER NOT NULL,
  participant_id INTEGER NOT NULL,
  score INTEGER,
  period INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id),
  PRIMARY KEY (event_id, participant_id, period)
);

-- Statistics
CREATE TABLE IF NOT EXISTS event_statistics (
  id INTEGER PRIMARY KEY,
  event_id INTEGER NOT NULL,
  participant_id INTEGER,
  metric TEXT,
  value TEXT,
  period INTEGER,
  source TEXT,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS team_statistics (
  id INTEGER PRIMARY KEY,
  team_id INTEGER NOT NULL,
  season_id INTEGER,
  metric TEXT,
  value REAL,
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (season_id) REFERENCES seasons(id)
);

CREATE TABLE IF NOT EXISTS player_statistics (
  id INTEGER PRIMARY KEY,
  player_id INTEGER NOT NULL,
  event_id INTEGER,
  season_id INTEGER,
  metric TEXT,
  value REAL,
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (season_id) REFERENCES seasons(id)
);

CREATE TABLE IF NOT EXISTS driver_statistics (
  id INTEGER PRIMARY KEY,
  driver_id INTEGER NOT NULL,
  season_id INTEGER,
  metric TEXT,
  value REAL,
  FOREIGN KEY (driver_id) REFERENCES drivers(id),
  FOREIGN KEY (season_id) REFERENCES seasons(id)
);

-- Standings
CREATE TABLE IF NOT EXISTS standings (
  id INTEGER PRIMARY KEY,
  competition_id INTEGER NOT NULL,
  season_id INTEGER,
  stage TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (competition_id) REFERENCES competitions(id),
  FOREIGN KEY (season_id) REFERENCES seasons(id)
);

CREATE TABLE IF NOT EXISTS standing_entries (
  id INTEGER PRIMARY KEY,
  standing_id INTEGER NOT NULL,
  team_id INTEGER,
  position INTEGER,
  played INTEGER,
  won INTEGER,
  drawn INTEGER,
  lost INTEGER,
  goals_for INTEGER,
  goals_against INTEGER,
  points INTEGER,
  FOREIGN KEY (standing_id) REFERENCES standings(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY,
  event_id INTEGER NOT NULL,
  model_version TEXT,
  home_probability REAL,
  draw_probability REAL,
  away_probability REAL,
  confidence REAL,
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS prediction_factors (
  id INTEGER PRIMARY KEY,
  prediction_id INTEGER NOT NULL,
  factor TEXT,
  value REAL,
  impact REAL,
  FOREIGN KEY (prediction_id) REFERENCES predictions(id)
);

CREATE TABLE IF NOT EXISTS prediction_results (
  id INTEGER PRIMARY KEY,
  prediction_id INTEGER NOT NULL,
  actual_result TEXT,
  correct BOOLEAN,
  accuracy_score REAL,
  FOREIGN KEY (prediction_id) REFERENCES predictions(id)
);

-- News
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY,
  external_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  source TEXT,
  sport_id INTEGER,
  competition_id INTEGER,
  team_id INTEGER,
  player_id INTEGER,
  event_id INTEGER,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_id) REFERENCES sports(id),
  FOREIGN KEY (competition_id) REFERENCES competitions(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS news_sources (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  url TEXT,
  enabled BOOLEAN DEFAULT 1
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en',
  timezone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id INTEGER PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,
  language TEXT DEFAULT 'en',
  favorite_sport INTEGER,
  favorite_team INTEGER,
  notifications_enabled BOOLEAN DEFAULT 1,
  theme TEXT DEFAULT 'light',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (favorite_sport) REFERENCES sports(id),
  FOREIGN KEY (favorite_team) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS user_predictions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  prediction TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  result TEXT,
  xp_awarded INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS user_activity (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  activity_type TEXT,
  related_entity TEXT,
  related_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Gamification
CREATE TABLE IF NOT EXISTS user_xp (
  id INTEGER PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,
  total_xp INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS levels (
  id INTEGER PRIMARY KEY,
  level INTEGER UNIQUE NOT NULL,
  min_xp INTEGER,
  max_xp INTEGER,
  name TEXT
);

CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT
);

CREATE TABLE IF NOT EXISTS user_badges (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  badge_id INTEGER NOT NULL,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (badge_id) REFERENCES badges(id),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS challenges (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER,
  requirement TEXT,
  duration TEXT
);

CREATE TABLE IF NOT EXISTS rewards (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  reward_type TEXT,
  value TEXT,
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_rewards (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  reward_id INTEGER NOT NULL,
  claimed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reward_id) REFERENCES rewards(id)
);

CREATE TABLE IF NOT EXISTS streaks (
  id INTEGER PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- System
CREATE TABLE IF NOT EXISTS data_sources (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  type TEXT,
  base_url TEXT,
  enabled BOOLEAN DEFAULT 1,
  priority INTEGER,
  rate_limit INTEGER,
  last_sync DATETIME,
  status TEXT
);

CREATE TABLE IF NOT EXISTS api_requests (
  id INTEGER PRIMARY KEY,
  provider TEXT,
  endpoint TEXT,
  request_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  response_time INTEGER,
  status_code INTEGER,
  success BOOLEAN,
  error TEXT,
  cache_hit BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sync_jobs (
  id INTEGER PRIMARY KEY,
  job_type TEXT,
  provider TEXT,
  sport TEXT,
  competition TEXT,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  finished_at DATETIME,
  status TEXT DEFAULT 'pending',
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  errors TEXT
);

CREATE TABLE IF NOT EXISTS sync_logs (
  id INTEGER PRIMARY KEY,
  sync_job_id INTEGER,
  log_level TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sync_job_id) REFERENCES sync_jobs(id)
);

CREATE TABLE IF NOT EXISTS system_settings (
  id INTEGER PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- External Entity Mapping
CREATE TABLE IF NOT EXISTS external_entity_mapping (
  id INTEGER PRIMARY KEY,
  internal_id INTEGER NOT NULL,
  provider TEXT NOT NULL,
  external_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, external_id, entity_type)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_competition_id ON events(competition_id);
CREATE INDEX IF NOT EXISTS idx_events_sport_id ON events(sport_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_statistics_event_id ON event_statistics(event_id);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_sport_id ON news(sport_id);
CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);
CREATE INDEX IF NOT EXISTS idx_players_slug ON players(slug);
CREATE INDEX IF NOT EXISTS idx_competitions_slug ON competitions(slug);
CREATE INDEX IF NOT EXISTS idx_user_predictions_user_id ON user_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_status ON sync_jobs(status);
