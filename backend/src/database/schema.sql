CREATE TABLE IF NOT EXISTS sports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_key TEXT NOT NULL,
  icon TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sport_id INTEGER NOT NULL,
  external_provider TEXT,
  external_id TEXT,
  slug TEXT UNIQUE NOT NULL,
  name_key TEXT NOT NULL,
  country_id INTEGER,
  active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_id) REFERENCES sports(id)
);

CREATE TABLE IF NOT EXISTS seasons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  competition_id INTEGER NOT NULL,
  external_id TEXT,
  name TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (competition_id) REFERENCES competitions(id)
);

CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sport_id INTEGER NOT NULL,
  external_id TEXT,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  country_id INTEGER,
  active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_id) REFERENCES sports(id)
);

CREATE TABLE IF NOT EXISTS team_logo_sources (
  team_id INTEGER PRIMARY KEY REFERENCES teams(id),
  source_url TEXT NOT NULL,
  local_url TEXT NOT NULL,
  fetched_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_translations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, language),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sport_id INTEGER NOT NULL,
  external_id TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  country_id INTEGER,
  position TEXT,
  active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, team_id INTEGER REFERENCES teams(id),
  FOREIGN KEY (sport_id) REFERENCES sports(id)
);

CREATE TABLE IF NOT EXISTS player_translations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, language),
  FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sport_id INTEGER NOT NULL,
  competition_id INTEGER NOT NULL,
  season_id INTEGER,
  external_id TEXT UNIQUE,
  event_type TEXT,
  start_time TIMESTAMP,
  status TEXT DEFAULT 'scheduled',
  venue_id INTEGER,
  round INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, home_team_id INTEGER REFERENCES teams(id), away_team_id INTEGER REFERENCES teams(id),
  FOREIGN KEY (sport_id) REFERENCES sports(id),
  FOREIGN KEY (competition_id) REFERENCES competitions(id),
  FOREIGN KEY (season_id) REFERENCES seasons(id)
);

CREATE TABLE IF NOT EXISTS event_participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  participant_type TEXT,
  participant_id INTEGER,
  role TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS event_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  participant_id INTEGER NOT NULL,
  score INTEGER,
  period INTEGER,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (participant_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS event_statistics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  participant_id INTEGER,
  metric TEXT,
  value TEXT,
  period INTEGER,
  source TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS standings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  competition_id INTEGER NOT NULL,
  season_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, team_id INTEGER REFERENCES teams(id), position INTEGER, played INTEGER DEFAULT 0, wins INTEGER DEFAULT 0, draws INTEGER DEFAULT 0, losses INTEGER DEFAULT 0, goals_for INTEGER DEFAULT 0, goals_against INTEGER DEFAULT 0,
  FOREIGN KEY (competition_id) REFERENCES competitions(id),
  FOREIGN KEY (season_id) REFERENCES seasons(id)
);

CREATE TABLE IF NOT EXISTS standing_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  standing_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  position INTEGER,
  played INTEGER,
  won INTEGER,
  drawn INTEGER,
  lost INTEGER,
  points INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (standing_id) REFERENCES standings(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  sport_id INTEGER,
  competition_id INTEGER,
  team_id INTEGER,
  published_at TIMESTAMP,
  source TEXT,
  external_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_id) REFERENCES sports(id),
  FOREIGN KEY (competition_id) REFERENCES competitions(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS news_image_sources (
  news_id INTEGER PRIMARY KEY REFERENCES news(id),
  source_url TEXT,
  local_url TEXT,
  fetched_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  model_version TEXT,
  home_probability REAL,
  draw_probability REAL,
  away_probability REAL,
  confidence REAL,
  generated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS prediction_factors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prediction_id INTEGER NOT NULL,
  factor TEXT,
  value REAL,
  impact REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (prediction_id) REFERENCES predictions(id)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  language TEXT DEFAULT 'en',
  favorite_sport INTEGER,
  favorite_team INTEGER,
  notifications_enabled BOOLEAN DEFAULT 1,
  theme TEXT DEFAULT 'dark',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (favorite_sport) REFERENCES sports(id),
  FOREIGN KEY (favorite_team) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level_number INTEGER UNIQUE NOT NULL,
  name TEXT,
  min_xp INTEGER,
  max_xp INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_xp (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  current_xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  level_id INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (level_id) REFERENCES levels(id)
);

CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_key TEXT NOT NULL,
  description_key TEXT,
  icon TEXT,
  requirement_type TEXT,
  requirement_value INTEGER,
  points_reward INTEGER,
  xp_reward INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  badge_id INTEGER NOT NULL,
  unlocked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (badge_id) REFERENCES badges(id)
);

CREATE TABLE IF NOT EXISTS data_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  type TEXT,
  base_url TEXT,
  enabled BOOLEAN DEFAULT 1,
  priority INTEGER,
  rate_limit INTEGER,
  last_sync TIMESTAMP,
  status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT,
  endpoint TEXT,
  request_time TIMESTAMP,
  response_time INTEGER,
  status_code INTEGER,
  success BOOLEAN,
  error TEXT,
  cache_hit BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sync_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_type TEXT,
  provider TEXT,
  sport TEXT,
  competition TEXT,
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  status TEXT,
  records_processed INTEGER,
  records_created INTEGER,
  records_updated INTEGER,
  errors TEXT
);

CREATE TABLE IF NOT EXISTS countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE,
  flag_emoji TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT,
  name TEXT NOT NULL,
  city TEXT,
  country_id INTEGER,
  capacity INTEGER,
  latitude REAL,
  longitude REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(id)
);

CREATE TABLE IF NOT EXISTS referees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  country_id INTEGER,
  license_level TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(id)
);

CREATE TABLE IF NOT EXISTS event_lineups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  formation TEXT,
  lineup_json TEXT,
  lineup_type TEXT DEFAULT 'starting_xi',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS player_team_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  season_id INTEGER,
  shirt_number INTEGER,
  position TEXT,
  started_at DATE,
  ended_at DATE,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, team_id, season_id),
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (season_id) REFERENCES seasons(id)
);

CREATE TABLE IF NOT EXISTS event_attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  attendance INTEGER,
  venue_capacity INTEGER,
  occupancy_percentage REAL,
  recorded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS team_extended_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL UNIQUE,
  external_id TEXT,
  founded_year INTEGER,
  badge_url TEXT,
  stadium_name TEXT,
  stadium_capacity INTEGER,
  stadium_city TEXT,
  stadium_country_id INTEGER,
  official_website TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (stadium_country_id) REFERENCES countries(id)
);

CREATE TABLE IF NOT EXISTS player_extended_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL UNIQUE,
  external_id TEXT,
  height INTEGER,
  weight INTEGER,
  date_of_birth DATE,
  nationality TEXT,
  nationality_code TEXT,
  cutout_image_url TEXT,
  preferred_foot TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS match_head_to_head (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_a_id INTEGER NOT NULL,
  team_b_id INTEGER NOT NULL,
  total_meetings INTEGER,
  team_a_wins INTEGER,
  team_b_wins INTEGER,
  draws INTEGER,
  last_meeting_event_id INTEGER,
  last_meeting_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_a_id, team_b_id),
  FOREIGN KEY (team_a_id) REFERENCES teams(id),
  FOREIGN KEY (team_b_id) REFERENCES teams(id),
  FOREIGN KEY (last_meeting_event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS team_season_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL,
  season_id INTEGER NOT NULL,
  competition_id INTEGER,
  position INTEGER,
  matches_played INTEGER,
  wins INTEGER,
  draws INTEGER,
  losses INTEGER,
  goals_for INTEGER,
  goals_against INTEGER,
  goal_difference INTEGER,
  points INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, season_id, competition_id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (season_id) REFERENCES seasons(id),
  FOREIGN KEY (competition_id) REFERENCES competitions(id)
);

CREATE TABLE IF NOT EXISTS player_season_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  season_id INTEGER NOT NULL,
  competition_id INTEGER,
  appearances INTEGER,
  goals INTEGER,
  assists INTEGER,
  yellow_cards INTEGER,
  red_cards INTEGER,
  minutes_played INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, team_id, season_id, competition_id),
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (season_id) REFERENCES seasons(id),
  FOREIGN KEY (competition_id) REFERENCES competitions(id)
);

CREATE TABLE IF NOT EXISTS betting_odds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL UNIQUE,
  bookmaker TEXT NOT NULL,
  home_odds REAL,
  draw_odds REAL,
  away_odds REAL,
  timestamp TIMESTAMP,
  source TEXT DEFAULT 'api-football',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS betting_odds_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  betting_odds_id INTEGER NOT NULL,
  old_home_odds REAL,
  new_home_odds REAL,
  old_draw_odds REAL,
  new_draw_odds REAL,
  old_away_odds REAL,
  new_away_odds REAL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (betting_odds_id) REFERENCES betting_odds(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS injury_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  team_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'reported', -- reported, confirmed, recovered
  severity TEXT, -- minor, moderate, serious, critical
  expected_return DATE,
  source TEXT,
  source_url TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS injury_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  injury_report_id INTEGER NOT NULL,
  old_status TEXT,
  new_status TEXT,
  old_severity TEXT,
  new_severity TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  note TEXT,
  FOREIGN KEY (injury_report_id) REFERENCES injury_reports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transfer_news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  from_team_id INTEGER,
  to_team_id INTEGER,
  transfer_date DATE,
  transfer_type TEXT, -- loan, permanent, free, exchange
  fee_amount INTEGER,
  fee_currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'rumor', -- rumor, confirmed, completed
  source TEXT,
  source_url TEXT,
  announced_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (from_team_id) REFERENCES teams(id) ON DELETE SET NULL,
  FOREIGN KEY (to_team_id) REFERENCES teams(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS transfer_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transfer_id INTEGER NOT NULL,
  old_status TEXT,
  new_status TEXT,
  old_fee REAL,
  new_fee REAL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  note TEXT,
  FOREIGN KEY (transfer_id) REFERENCES transfer_news(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS live_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER UNIQUE NOT NULL,
  status TEXT, -- live, half-time, finished, postponed
  elapsed INTEGER, -- minutes played
  current_home_score INTEGER,
  current_away_score INTEGER,
  home_possession INTEGER,
  away_possession INTEGER,
  home_shots INTEGER,
  away_shots INTEGER,
  home_shots_on_target INTEGER,
  away_shots_on_target INTEGER,
  home_fouls INTEGER,
  away_fouls INTEGER,
  home_yellow_cards INTEGER,
  away_yellow_cards INTEGER,
  home_red_cards INTEGER,
  away_red_cards INTEGER,
  home_corners INTEGER,
  away_corners INTEGER,
  referee TEXT,
  attendance INTEGER,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS match_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  minute INTEGER,
  second INTEGER,
  team_id INTEGER,
  player_id INTEGER,
  assist_player_id INTEGER,
  event_type TEXT, -- goal, yellow_card, red_card, substitution, own_goal, penalty
  description TEXT,
  video_url TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE SET NULL,
  FOREIGN KEY (assist_player_id) REFERENCES players(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

CREATE INDEX IF NOT EXISTS idx_events_competition ON events(competition_id);

CREATE INDEX IF NOT EXISTS idx_events_sport ON events(sport_id);

CREATE INDEX IF NOT EXISTS idx_event_participants_event ON event_participants(event_id);

CREATE INDEX IF NOT EXISTS idx_event_statistics_event ON event_statistics(event_id);

CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at);

CREATE INDEX IF NOT EXISTS idx_news_sport ON news(sport_id);

CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);

CREATE INDEX IF NOT EXISTS idx_players_slug ON players(slug);

CREATE INDEX IF NOT EXISTS idx_competitions_slug ON competitions(slug);

CREATE INDEX IF NOT EXISTS idx_user_xp_user ON user_xp(user_id);

CREATE INDEX IF NOT EXISTS idx_standings_team_competition ON standings(team_id, competition_id);

CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);

CREATE INDEX IF NOT EXISTS idx_venues_country ON venues(country_id);

CREATE INDEX IF NOT EXISTS idx_event_lineups_event ON event_lineups(event_id);

CREATE INDEX IF NOT EXISTS idx_event_lineups_team ON event_lineups(team_id);

CREATE INDEX IF NOT EXISTS idx_player_team_assignments_player ON player_team_assignments(player_id);

CREATE INDEX IF NOT EXISTS idx_player_team_assignments_team ON player_team_assignments(team_id);

CREATE INDEX IF NOT EXISTS idx_player_team_assignments_season ON player_team_assignments(season_id);

CREATE INDEX IF NOT EXISTS idx_team_extended_info_external_id ON team_extended_info(external_id);

CREATE INDEX IF NOT EXISTS idx_player_extended_info_external_id ON player_extended_info(external_id);

CREATE INDEX IF NOT EXISTS idx_match_head_to_head_teams ON match_head_to_head(team_a_id, team_b_id);

CREATE INDEX IF NOT EXISTS idx_team_season_stats_team_season ON team_season_stats(team_id, season_id);

CREATE INDEX IF NOT EXISTS idx_player_season_stats_player_season ON player_season_stats(player_id, season_id);

CREATE INDEX IF NOT EXISTS idx_event_attendance_event ON event_attendance(event_id);

CREATE INDEX IF NOT EXISTS idx_betting_odds_event ON betting_odds(event_id);

CREATE INDEX IF NOT EXISTS idx_betting_odds_created ON betting_odds(created_at);

CREATE INDEX IF NOT EXISTS idx_betting_history_odds ON betting_odds_history(betting_odds_id);

CREATE INDEX IF NOT EXISTS idx_injury_player ON injury_reports(player_id);

CREATE INDEX IF NOT EXISTS idx_injury_team ON injury_reports(team_id);

CREATE INDEX IF NOT EXISTS idx_injury_status ON injury_reports(status);

CREATE INDEX IF NOT EXISTS idx_injury_created ON injury_reports(created_at);

CREATE INDEX IF NOT EXISTS idx_injury_history_report ON injury_history(injury_report_id);

CREATE INDEX IF NOT EXISTS idx_transfer_player ON transfer_news(player_id);

CREATE INDEX IF NOT EXISTS idx_transfer_from_team ON transfer_news(from_team_id);

CREATE INDEX IF NOT EXISTS idx_transfer_to_team ON transfer_news(to_team_id);

CREATE INDEX IF NOT EXISTS idx_transfer_status ON transfer_news(status);

CREATE INDEX IF NOT EXISTS idx_transfer_history_news ON transfer_history(transfer_id);

CREATE INDEX IF NOT EXISTS idx_live_events_status ON live_events(status);

CREATE INDEX IF NOT EXISTS idx_live_events_updated ON live_events(last_update);

CREATE INDEX IF NOT EXISTS idx_match_events_event ON match_events(event_id);

CREATE INDEX IF NOT EXISTS idx_match_events_player ON match_events(player_id);

CREATE INDEX IF NOT EXISTS idx_match_events_type ON match_events(event_type);

CREATE INDEX IF NOT EXISTS idx_match_events_time ON match_events(minute);

CREATE INDEX IF NOT EXISTS idx_lineups_event ON event_lineups(event_id);

CREATE INDEX IF NOT EXISTS idx_lineups_team ON event_lineups(team_id);

CREATE INDEX IF NOT EXISTS idx_attendance_event ON event_attendance(event_id);

CREATE INDEX IF NOT EXISTS idx_pta_player ON player_team_assignments(player_id);

CREATE INDEX IF NOT EXISTS idx_pta_team ON player_team_assignments(team_id);

CREATE INDEX IF NOT EXISTS idx_pta_season ON player_team_assignments(season_id);

CREATE INDEX IF NOT EXISTS idx_pstats_player ON player_season_stats(player_id);

CREATE INDEX IF NOT EXISTS idx_pstats_team ON player_season_stats(team_id);

CREATE INDEX IF NOT EXISTS idx_pstats_season ON player_season_stats(season_id);

CREATE INDEX IF NOT EXISTS idx_tstats_team ON team_season_stats(team_id);

CREATE INDEX IF NOT EXISTS idx_tstats_season ON team_season_stats(season_id);

CREATE INDEX IF NOT EXISTS idx_tstats_position ON team_season_stats(position);

CREATE UNIQUE INDEX IF NOT EXISTS idx_event_scores_event_participant ON event_scores(event_id, participant_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_seasons_competition_name ON seasons(competition_id, name);

CREATE UNIQUE INDEX IF NOT EXISTS idx_standings_competition_season_team ON standings(competition_id, season_id, team_id);

CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);

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

CREATE TABLE IF NOT EXISTS competition_assets(competition_id INTEGER PRIMARY KEY REFERENCES competitions(id),logo_url TEXT,source_url TEXT,fetched_at TEXT DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS provider_event_records(provider TEXT,external_id TEXT,event_id INTEGER REFERENCES events(id),payload_json TEXT,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(provider,external_id));
CREATE TABLE IF NOT EXISTS provider_match_details(event_id INTEGER PRIMARY KEY REFERENCES events(id),payload_json TEXT,fetched_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS provider_standings(competition_id INTEGER REFERENCES competitions(id),season_id INTEGER REFERENCES seasons(id),source TEXT,payload_json TEXT,fetched_at TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(competition_id,season_id));

CREATE TABLE IF NOT EXISTS event_aliases(alias_event_id INTEGER PRIMARY KEY REFERENCES events(id),canonical_event_id INTEGER NOT NULL REFERENCES events(id),reason TEXT);

CREATE TABLE IF NOT EXISTS provider_team_ids(provider TEXT,external_id TEXT,team_id INTEGER REFERENCES teams(id),PRIMARY KEY(provider,external_id));

CREATE TABLE IF NOT EXISTS roster_coverage(team_id INTEGER PRIMARY KEY,status TEXT,players INTEGER,source TEXT,checked_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS provider_detail_checks(event_id INTEGER REFERENCES events(id),resource TEXT,status TEXT,http_status INTEGER,checked_at TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(event_id,resource));

CREATE TABLE IF NOT EXISTS canonical_team_aliases(alias_team_id INTEGER PRIMARY KEY REFERENCES teams(id),canonical_team_id INTEGER REFERENCES teams(id),reason TEXT);

CREATE INDEX IF NOT EXISTS provider_event_by_event ON provider_event_records(event_id,provider);
CREATE INDEX IF NOT EXISTS events_match_identity ON events(competition_id,home_team_id,away_team_id,start_time);
