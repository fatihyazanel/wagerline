-- ===== THESPORTSDB INTEGRATION MIGRATIONS =====
-- Bu migration dosyası eksik olan tabloları ve alanları oluşturur

-- ===== 1. COUNTRIES TABLE (Ülkeler) =====
CREATE TABLE IF NOT EXISTS countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE,
  flag_emoji TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== 2. VENUES TABLE (Stadyumlar) =====
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

-- ===== 3. REFEREES TABLE (Hakemler) =====
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

-- ===== 4. EVENT_LINEUPS TABLE (Maç Kadroları) =====
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

-- ===== 5. PLAYER_TEAM_ASSIGNMENTS TABLE (Oyuncu-Takım Atamaları) =====
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

-- ===== 6. EVENT_ATTENDANCE TABLE (Maç Seyirci Bilgileri) =====
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

-- ===== 7. TEAM_EXTENDED_INFO TABLE (Takım Ek Bilgileri) =====
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

-- ===== 8. PLAYER_EXTENDED_INFO TABLE (Oyuncu Ek Bilgileri) =====
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

-- ===== 9. MATCH_HEAD_TO_HEAD TABLE (Maç Geçmiş Verileri) =====
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

-- ===== 10. TEAM_SEASON_STATS TABLE (Takım Sezon İstatistikleri) =====
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

-- ===== 11. PLAYER_SEASON_STATS TABLE (Oyuncu Sezon İstatistikleri) =====
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

-- ===== INDEXES FOR PERFORMANCE =====

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

-- ===== REFERENCE DATA: POPULATE COUNTRIES =====
INSERT OR IGNORE INTO countries (name, code, flag_emoji) VALUES
('England', 'EN', '🇬🇧'),
('Spain', 'ES', '🇪🇸'),
('Italy', 'IT', '🇮🇹'),
('Germany', 'DE', '🇩🇪'),
('France', 'FR', '🇫🇷'),
('Turkey', 'TR', '🇹🇷'),
('Netherlands', 'NL', '🇳🇱'),
('Portugal', 'PT', '🇵🇹'),
('Brazil', 'BR', '🇧🇷'),
('Argentina', 'AR', '🇦🇷'),
('Belgium', 'BE', '🇧🇪'),
('Poland', 'PL', '🇵🇱'),
('Ukraine', 'UA', '🇺🇦'),
('Russia', 'RU', '🇷🇺'),
('Mexico', 'MX', '🇲🇽'),
('USA', 'US', '🇺🇸'),
('Japan', 'JP', '🇯🇵'),
('South Korea', 'KR', '🇰🇷'),
('Norway', 'NO', '🇳🇴'),
('Sweden', 'SE', '🇸🇪'),
('Denmark', 'DK', '🇩🇰'),
('Greece', 'GR', '🇬🇷'),
('Austria', 'AT', '🇦🇹'),
('Switzerland', 'CH', '🇨🇭'),
('Serbia', 'RS', '🇷🇸'),
('Croatia', 'HR', '🇭🇷'),
('Romania', 'RO', '🇷🇴'),
('Czech Republic', 'CZ', '🇨🇿'),
('Hungary', 'HU', '🇭🇺'),
('Slovenia', 'SI', '🇸🇮');
