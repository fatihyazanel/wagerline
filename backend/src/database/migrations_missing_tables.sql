-- ============================================================================
-- EKSIK TABLOLARI OLUŞTUR - Canlı Platform için Gerekli
-- ============================================================================

-- 1. BAHIS ORANILARI
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

CREATE INDEX IF NOT EXISTS idx_betting_odds_event ON betting_odds(event_id);
CREATE INDEX IF NOT EXISTS idx_betting_odds_created ON betting_odds(created_at);

-- 2. BAHIS ORANILARI TARİHÇESİ
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

CREATE INDEX IF NOT EXISTS idx_betting_history_odds ON betting_odds_history(betting_odds_id);

-- 3. YARALANMA RAPORLARI
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

CREATE INDEX IF NOT EXISTS idx_injury_player ON injury_reports(player_id);
CREATE INDEX IF NOT EXISTS idx_injury_team ON injury_reports(team_id);
CREATE INDEX IF NOT EXISTS idx_injury_status ON injury_reports(status);
CREATE INDEX IF NOT EXISTS idx_injury_created ON injury_reports(created_at);

-- 4. YARALANMA TARİHÇESİ
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

CREATE INDEX IF NOT EXISTS idx_injury_history_report ON injury_history(injury_report_id);

-- 5. TRANSFER HABERLERİ
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

CREATE INDEX IF NOT EXISTS idx_transfer_player ON transfer_news(player_id);
CREATE INDEX IF NOT EXISTS idx_transfer_from_team ON transfer_news(from_team_id);
CREATE INDEX IF NOT EXISTS idx_transfer_to_team ON transfer_news(to_team_id);
CREATE INDEX IF NOT EXISTS idx_transfer_status ON transfer_news(status);

-- 6. TRANSFER TARİHÇESİ
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

CREATE INDEX IF NOT EXISTS idx_transfer_history_news ON transfer_history(transfer_id);

-- 7. CANLI MAÇ VERİLERİ
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

CREATE INDEX IF NOT EXISTS idx_live_events_status ON live_events(status);
CREATE INDEX IF NOT EXISTS idx_live_events_updated ON live_events(last_update);

-- 8. MAÇ OLAYLARI (GOL, KART, OYUNCU DEĞİŞİKLİĞİ)
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

CREATE INDEX IF NOT EXISTS idx_match_events_event ON match_events(event_id);
CREATE INDEX IF NOT EXISTS idx_match_events_player ON match_events(player_id);
CREATE INDEX IF NOT EXISTS idx_match_events_type ON match_events(event_type);
CREATE INDEX IF NOT EXISTS idx_match_events_time ON match_events(minute);

-- 9. MAÇ KADROLARI
CREATE TABLE IF NOT EXISTS event_lineups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  position TEXT, -- GK, DEF, MID, FWD, SUB
  shirt_number INTEGER,
  formation_position TEXT,
  is_starting_lineup BOOLEAN DEFAULT 1,
  is_substitute BOOLEAN DEFAULT 0,
  bench_position INTEGER,
  substituted_out_at INTEGER, -- minute substituted out
  substituted_in_at INTEGER, -- minute substituted in
  UNIQUE(event_id, team_id, player_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lineups_event ON event_lineups(event_id);
CREATE INDEX IF NOT EXISTS idx_lineups_team ON event_lineups(team_id);
CREATE INDEX IF NOT EXISTS idx_lineups_player ON event_lineups(player_id);

-- 10. MAÇ SEYIRÇI BİLGİSİ
CREATE TABLE IF NOT EXISTS event_attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER UNIQUE NOT NULL,
  attendance INTEGER,
  stadium_capacity INTEGER,
  occupancy_percentage REAL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attendance_event ON event_attendance(event_id);

-- 11. OYUNCU-TAKIMI ATAMALARI (SEZON BAŞINA)
CREATE TABLE IF NOT EXISTS player_team_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  season_id INTEGER NOT NULL,
  position TEXT,
  shirt_number INTEGER,
  joined_date DATE,
  left_date DATE,
  is_loaned BOOLEAN DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, loaned, left
  appearances INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, team_id, season_id),
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pta_player ON player_team_assignments(player_id);
CREATE INDEX IF NOT EXISTS idx_pta_team ON player_team_assignments(team_id);
CREATE INDEX IF NOT EXISTS idx_pta_season ON player_team_assignments(season_id);
CREATE INDEX IF NOT EXISTS idx_pta_status ON player_team_assignments(status);

-- 12. OYUNCU SEZON İSTATİSTİKLERİ
CREATE TABLE IF NOT EXISTS player_season_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  season_id INTEGER NOT NULL,
  position TEXT,
  appearances INTEGER DEFAULT 0,
  appearances_as_substitute INTEGER DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  own_goals INTEGER DEFAULT 0,
  penalties_scored INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  shots INTEGER DEFAULT 0,
  shots_on_target INTEGER DEFAULT 0,
  tackles INTEGER DEFAULT 0,
  interceptions INTEGER DEFAULT 0,
  passes INTEGER DEFAULT 0,
  pass_accuracy_percent REAL,
  crosses INTEGER DEFAULT 0,
  fouls_committed INTEGER DEFAULT 0,
  fouls_drawn INTEGER DEFAULT 0,
  offsides INTEGER DEFAULT 0,
  clearances INTEGER DEFAULT 0,
  dribbles INTEGER DEFAULT 0,
  rating REAL,
  market_value INTEGER,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, team_id, season_id),
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pstats_player ON player_season_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_pstats_team ON player_season_stats(team_id);
CREATE INDEX IF NOT EXISTS idx_pstats_season ON player_season_stats(season_id);

-- 13. TAKIMI SEZON İSTATİSTİKLERİ
CREATE TABLE IF NOT EXISTS team_season_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL,
  season_id INTEGER NOT NULL,
  competition_id INTEGER,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  position INTEGER,
  clean_sheets INTEGER DEFAULT 0,
  failed_to_score INTEGER DEFAULT 0,
  average_possession_percent REAL,
  average_goals_scored REAL,
  average_goals_conceded REAL,
  form TEXT, -- Last 5 matches: W/D/L
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, season_id),
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tstats_team ON team_season_stats(team_id);
CREATE INDEX IF NOT EXISTS idx_tstats_season ON team_season_stats(season_id);
CREATE INDEX IF NOT EXISTS idx_tstats_position ON team_season_stats(position);

-- 14. BAŞA BAŞ İSTATİSTİKLERİ
CREATE TABLE IF NOT EXISTS match_head_to_head (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team1_id INTEGER NOT NULL,
  team2_id INTEGER NOT NULL,
  season_id INTEGER,
  competition_id INTEGER,
  played INTEGER DEFAULT 0,
  team1_wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  team2_wins INTEGER DEFAULT 0,
  team1_goals_for INTEGER DEFAULT 0,
  team1_goals_against INTEGER DEFAULT 0,
  team2_goals_for INTEGER DEFAULT 0,
  team2_goals_against INTEGER DEFAULT 0,
  last_match_date DATE,
  last_match_result TEXT, -- W/D/L from team1 perspective
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team1_id, team2_id, season_id),
  FOREIGN KEY (team1_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (team2_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE SET NULL,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_h2h_team1 ON match_head_to_head(team1_id);
CREATE INDEX IF NOT EXISTS idx_h2h_team2 ON match_head_to_head(team2_id);

-- ============================================================================
-- KONTROL: Tüm tablolar oluşturuldu mu?
-- ============================================================================
-- Çalıştıktan sonra kontrol:
-- SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
