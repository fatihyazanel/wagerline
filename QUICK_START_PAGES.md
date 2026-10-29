# WAGERline Navigation Pages - Quick Start Guide

## File Links & Navigation Structure

All pages are cross-linked through the main navigation header.

### Pages Created

1. **Home Page** (wagerline-d1.html)
   - Main dashboard with hero, live match, leagues, predictions, rewards

2. **Live Events** (wagerline-live.html)
   - 9 live matches across 5 sports with filters
   - Sport tabs, live status, team logos, scores

3. **Sports Explorer** (wagerline-sports.html)
   - All 5 sports with league information
   - 6 football league cards
   - Quick access buttons

4. **League Detail** (wagerline-league-detail.html)
   - Premier League standings (top 5 teams)
   - Form indicators (W/D/L dots)
   - Upcoming matches and top teams

5. **Predictions** (wagerline-predictions.html)
   - 6 AI predictions with confidence scores
   - Filter by sport, confidence, timeframe
   - Probability bars and factor analysis

6. **Event Detail** (wagerline-event-detail.html)
   - Complete match analysis (Man City vs Liverpool, 2-1)
   - Statistics, timeline, prediction, news
   - 5 tabs: Overview | Timeline | Statistics | Lineups | H2H

7. **Team Detail** (wagerline-team-detail.html)
   - Manchester City team profile
   - Season stats, recent form, fixtures
   - Squad roster (10 players)

8. **News Feed** (wagerline-news.html)
   - 9 news articles across all sports
   - Featured article section
   - Filter by sport, pagination

---

## Design Specifications

**Viewport:** 1536px x 1024px (desktop reference)
**Background:** #050817 (dark navy)
**Brand Color:** #FFD400 (yellow)
**Framework:** HTML5 + CSS Grid

### Color Palette
- Primary BG: #050817
- Card BG: #0B1020, #0E1426
- Primary Text: #F7F8FA
- Secondary Text: #C7CBD5
- Muted Text: #7D8494
- Accent Yellow: #FFD400
- Status Red: #FF3038
- Success Green: #20D879

### Typography
- Page Title: 32px, weight 800
- Section Title: 18px, weight 700
- Card Title: 13-14px, weight 700
- Body: 12-13px
- Metadata: 10-11px

### Layout
- Header: Fixed 60px
- Page Padding: 15px horizontal
- Gaps: 14px between sections
- Border Radius: 10px, 12px
- Borders: 1px solid rgba(255,255,255,0.10)

---

## File Locations

All files are in `/d/wargile/figma-test/`

- wagerline-d1.html (HOME)
- wagerline-live.html (591 lines)
- wagerline-sports.html (585 lines)
- wagerline-league-detail.html (650 lines)
- wagerline-predictions.html (779 lines)
- wagerline-event-detail.html (679 lines)
- wagerline-team-detail.html (634 lines)
- wagerline-news.html (598 lines)

**Total:** ~4,500 lines of HTML/CSS, ~153 KB combined

---

## Mock Data Summary

**Live Events:** 9 matches across 5 sports
**League Standings:** Premier League (top 5 teams)
**Predictions:** 6 matches with 71-84% confidence
**News Articles:** 9 articles from major sports sources
**Teams:** Man City, Arsenal, Liverpool, Real Madrid, Barcelona, etc.
**Players:** 10+ player profiles with positions

---

## Key Features by Page

### Live Page
- Real-time sport filters
- Status indicators (LIVE 45', LIVE 67')
- Team logos and venue info
- Responsive card grid

### Sports Page
- 5 sport overview cards
- League statistics
- Direct league access
- Browse all competitions

### League Detail
- Standings table with form
- Upcoming fixtures
- Top teams featured
- Season overview

### Predictions
- Confidence badges
- Probability bars
- Factor analysis
- Prediction buttons

### Event Detail
- Complete match stats
- Timeline of events
- AI prediction analysis
- Integrated news

### Team Detail
- Squad roster
- Season statistics
- Recent form tracking
- Upcoming fixtures

### News
- Featured article
- Multi-sport coverage
- Source attribution
- Pagination

---

## Responsive Behavior

- **Desktop (1536px):** Full asymmetric grid layout
- **Tablet (1024px):** 2-column layouts
- **Mobile (<768px):** Single column, stacked content

All pages maintain consistency across breakpoints.

---

## Navigation Structure

All pages include:
- Fixed header (60px) with logo and nav
- 8 nav items: Home, Live, Sports, Leagues, Predictions, Stats, News, Rewards
- Active nav item highlighted in yellow
- Search box (top right)
- Language selector (EN/ES/AR)
- Login/SignUp buttons
- Compact footer with links

---

## Testing Checklist

Visual:
- [ ] 1536px desktop view matches d1.md
- [ ] Colors consistent across pages
- [ ] Typography hierarchy correct
- [ ] Spacing uniform (14px gaps)
- [ ] Hover effects visible

Responsive:
- [ ] Mobile layout (single column)
- [ ] Tablet layout (2-column)
- [ ] Desktop layout (full grid)

Navigation:
- [ ] Links between pages work
- [ ] Nav shows active page
- [ ] Header consistent
- [ ] Footer present on all pages

Content:
- [ ] Mock data displayed
- [ ] Images load (emoji placeholders)
- [ ] Cards arranged correctly
- [ ] Stats/tables readable

---

## Next Steps

1. Replace emoji placeholders with real logos/images
2. Connect to backend API
3. Implement live score updates
4. Add search functionality
5. Implement authentication
6. Add gamification features
7. Support EN/ES/AR languages
8. Add RTL for Arabic

---

## File References

Location: `/d/wargile/figma-test/`

All files are standalone HTML with embedded CSS. No external dependencies except Google Fonts.

Each page can be opened directly in a browser and works independently.

Cross-links between pages enable full navigation through the site structure.
