# WAGERline Design System & Implementation Guide

**Version:** 1.0  
**Status:** Production Ready  
**Last Updated:** August 22, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Components](#components)
5. [Layout & Spacing](#layout--spacing)
6. [Multi-Language Implementation](#multi-language-implementation)
7. [RTL Support](#rtl-support)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [File Structure](#file-structure)

---

## 🎨 Overview

WAGERline is a modern, global sports intelligence platform. The design system ensures:

- **Consistent visual identity** across all platforms (Web, Mobile)
- **Multi-language support** (EN, ES, AR)
- **RTL compatibility** for Arabic and future RTL languages
- **Accessible, inclusive design** following WCAG 2.1 AA standards
- **Responsive layouts** from mobile (375px) to desktop (1440px+)
- **Modern, sporty aesthetic** that feels professional, not like a betting site

---

## 🎨 Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary Blue** | `#1E40AF` | 30, 64, 175 | Main brand color, buttons, highlights |
| **Primary Light** | `#3B82F6` | 59, 130, 246 | Hover states, lighter backgrounds |
| **Primary Dark** | `#1E3A8A` | 30, 58, 138 | Dark mode, emphasis |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Secondary Orange** | `#F97316` | 249, 115, 22 | CTAs, energy, action |
| **Secondary Light** | `#FB923C` | 251, 146, 60 | Hover states |

### Accent Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Accent Cyan** | `#06B6D4` | 6, 182, 212 | Live indicators, dynamic elements |
| **Accent Light** | `#22D3EE` | 34, 211, 238 | Supporting accents |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success Green** | `#10B981` | Correct predictions, wins, positive states |
| **Danger Red** | `#EF4444` | Errors, live indicators, alerts |
| **Warning Amber** | `#F59E0B` | Warnings, challenges, items |

### Neutral Colors

| Shade | Hex | Usage |
|-------|-----|-------|
| **50** | `#F9FAFB` | Page background |
| **100** | `#F3F4F6` | Section backgrounds |
| **200** | `#E5E7EB` | Borders, dividers |
| **500** | `#6B7280` | Secondary text |
| **700** | `#374151` | Tertiary text |
| **900** | `#111827` | Primary text, dark mode background |

---

## 📝 Typography

### Font Family
- **Primary:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Mono:** `'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace`

### Font Sizes

| Size | Value | Usage |
|------|-------|-------|
| **xs** | 0.75rem (12px) | Small labels, captions |
| **sm** | 0.875rem (14px) | Secondary text, badges |
| **base** | 1rem (16px) | Body text, default |
| **lg** | 1.125rem (18px) | Section subtitles |
| **xl** | 1.25rem (20px) | Card titles |
| **2xl** | 1.5rem (24px) | Section titles |
| **3xl** | 1.875rem (30px) | Page subtitles |
| **4xl** | 2.25rem (36px) | Page titles |
| **5xl** | 3rem (48px) | Hero titles |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Disabled states |
| Normal | 400 | Body text |
| Medium | 500 | Emphasis text |
| Semibold | 600 | Labels, captions |
| Bold | 700 | Headings, strong emphasis |
| Extrabold | 800 | Section titles |
| Black | 900 | Page titles, hero text |

### Line Heights

| Type | Value | Usage |
|------|-------|-------|
| Tight | 1.2 | Headings |
| Normal | 1.5 | Default |
| Relaxed | 1.75 | Body text, lists |
| Loose | 2 | Captions |

---

## 🧩 Components

### Buttons

#### Primary Button
```html
<button class="btn btn-primary">Explore Today</button>
```
- Background: `#1E40AF`
- Text: White
- Padding: `0.875rem 1.75rem`
- Border Radius: `8px`
- Hover: Background lightens to `#3B82F6`, shadow added, slight lift

#### Secondary Button
```html
<button class="btn btn-secondary">View Predictions</button>
```
- Background: `#F97316`
- Text: White
- Hover: Background lightens to `#FB923C`

#### Outline Button
```html
<button class="btn btn-outline">Learn More</button>
```
- Background: White
- Border: 2px `#1E40AF`
- Text: `#1E40AF`
- Hover: Background lightens to `#F3F4F6`

#### Button Sizes
- **Small:** `0.5rem 1rem`
- **Default:** `0.875rem 1.75rem`
- **Large:** `1rem 2rem`

#### Button States
- **Normal:** Full color
- **Hover:** Lighter background, shadow, slight lift
- **Active:** Darker background
- **Disabled:** Opacity 0.5, no pointer

### Cards

```html
<div class="card">
  <div class="card-title">Event Title</div>
  <div class="card-subtitle">Subtitle</div>
  <p>Content</p>
</div>
```

- Background: White
- Border: 1px `#E5E7EB`
- Border Radius: `12px`
- Padding: `1.5rem`
- Shadow: `0 1px 3px rgba(0,0,0,0.05)`
- Hover: Border color to primary, shadow grows, transform lift

### Badges

```html
<span class="badge badge-primary">Label</span>
```

- **Primary:** Background `#DBEAFE`, text `#1E40AF`
- **Success:** Background `#DCFCE7`, text `#10B981`
- **Warning:** Background `#FEF3C7`, text `#F59E0B`
- **Danger:** Background `#FEE2E2`, text `#EF4444`
- Padding: `0.4rem 0.8rem`
- Border Radius: `20px`
- Font Weight: `600`

### Alerts

```html
<div class="alert alert-info">
  <div class="alert-icon">ℹ️</div>
  <div>Alert content</div>
</div>
```

- **Info:** Background `#ECF8FF`, border `#06B6D4`
- **Success:** Background `#ECFDF5`, border `#10B981`
- **Warning:** Background `#FFFBEB`, border `#F59E0B`
- **Danger:** Background `#FEF2F2`, border `#EF4444`
- Padding: `1rem`
- Border Left: `4px` solid
- Border Radius: `8px`

### Forms

```html
<div class="form-group">
  <label class="form-label">Label</label>
  <input type="text" />
</div>
```

- **Input Styles:**
  - Padding: `0.75rem 1rem`
  - Border: `1px #D1D5DB`
  - Border Radius: `8px`
  - Font Size: `1rem`
  - Focus: Border `#1E40AF`, ring `3px rgba(30, 64, 175, 0.1)`

### Tables

```html
<table class="table">
  <thead>
    <tr>
      <th>Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell</td>
    </tr>
  </tbody>
</table>
```

- Header Background: `#F3F4F6`
- Header Font Weight: `600`
- Borders: `1px #E5E7EB`
- Row Hover: Background `#F3F4F6`

---

## 📏 Layout & Spacing

### Spacing Scale

```
0: 0
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
10: 2.5rem (40px)
12: 3rem (48px)
16: 4rem (64px)
20: 5rem (80px)
24: 6rem (96px)
32: 8rem (128px)
```

### Grid System

- **12-column grid** on desktop
- **8-column grid** on tablet
- **4-column grid** on mobile
- **Gap:** 1.5rem (24px)
- **Container Max Width:** 1440px
- **Container Padding:** 2rem (desktop), 1rem (mobile)

### Breakpoints

```
Mobile:  375px
Tablet:  768px
Desktop: 1024px
Large:   1440px
```

### Border Radius

```
sm:   4px
base: 6px
md:   8px
lg:   12px
xl:   16px
2xl:  20px
full: 9999px
```

---

## 🌍 Multi-Language Implementation

### i18n Architecture

**Directory Structure:**
```
/i18n
  /en
    common.json
    sports.json
    competitions.json
    predictions.json
    gamification.json
  /es
    common.json
    sports.json
    competitions.json
    predictions.json
    gamification.json
  /ar
    common.json
    sports.json
    competitions.json
    predictions.json
    gamification.json
```

### Translation Keys

```json
{
  "nav": {
    "home": "Home",
    "live": "Live",
    "predictions": "Predictions"
  },
  "sports": {
    "football": "Football",
    "basketball": "Basketball"
  },
  "gamification": {
    "xp": "Experience Points",
    "level": "Level",
    "streak": "Streak"
  }
}
```

### Usage in Components

```jsx
// React example
import { useTranslation } from 'i18next';

function HomeHero() {
  const { t } = useTranslation();
  
  return (
    <h1>{t('home.title')}</h1> // "TODAY'S SPORTS INTELLIGENCE"
  );
}
```

### Supported Languages

| Language | Code | Direction | Variant |
|----------|------|-----------|---------|
| English | en | LTR | Default |
| Spanish | es | LTR | Spain & LATAM |
| Arabic | ar | RTL | Modern Standard Arabic |

### Future Languages
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Japanese (ja)
- Chinese (zh-CN, zh-TW)

---

## 🔄 RTL Support

### RTL Implementation

When language is set to Arabic, HTML element receives:
```html
<html dir="rtl" lang="ar">
```

### CSS Logical Properties

Use logical properties instead of physical directions:

```css
/* Instead of: margin-left */
margin-inline-start: 1rem;

/* Instead of: padding-right */
padding-inline-end: 1rem;

/* Instead of: float: left */
float: inline-start;
```

### Flex Direction Reversal

```css
html[dir="rtl"] .flex-row {
  flex-direction: row-reverse;
}

html[dir="rtl"] .flex-column {
  flex-direction: column;
}
```

### Text Alignment

```css
html[dir="rtl"] body {
  text-align: right;
}

html[dir="ltr"] body {
  text-align: left;
}
```

### RTL-Specific Assets

- Logos may need horizontal mirroring
- Icons may need adjustment (e.g., arrows)
- Dates typically stay in same format
- Numbers typically stay numeric

### Testing RTL

```html
<!-- Quick test -->
<button onclick="document.documentElement.dir = 'rtl'">
  Test RTL
</button>
```

---

## 📱 Responsive Design

### Mobile-First Approach

Design starts at 375px, then enhances for larger screens.

### Layout Breakpoints

#### Mobile (< 768px)
- Single column layout
- Full-width cards
- Stacked navigation
- Larger touch targets (44px min)
- Simplified data presentation

#### Tablet (768px - 1023px)
- 2-column grid where applicable
- Optimized spacing
- Some menu collapsing

#### Desktop (1024px+)
- 3-4 column layouts
- Full feature set
- Sidebar navigation
- Advanced visualizations

### Responsive Images

```html
<img 
  src="image.jpg" 
  srcset="
    image-small.jpg 375w,
    image-medium.jpg 768w,
    image-large.jpg 1440w
  "
  sizes="
    (max-width: 768px) 100vw,
    (max-width: 1440px) 50vw,
    1440px
  "
  alt="Description"
/>
```

### Responsive Text

```css
/* Using rem units, relative to 16px base */
h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
}

body {
  font-size: 1rem; /* 16px */
}

@media (max-width: 640px) {
  body { font-size: 0.938rem; } /* 15px */
}
```

---

## ♿ Accessibility

### WCAG 2.1 Compliance Level: AA

### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18px+)
- All buttons have sufficient contrast

### Keyboard Navigation
- All interactive elements accessible via Tab
- Focus visible (outline or ring)
- No keyboard traps
- Logical tab order

### Screen Readers
- Semantic HTML (`<button>`, `<nav>`, `<header>`)
- ARIA labels where needed
- Form labels associated with inputs
- Image alt text (decorative images have empty alt)

### Motion
- Reduced motion respected
- Animations optional
- No autoplaying videos with sound

### Focus Management
```css
:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Or using box-shadow for modern browsers */
:focus-visible {
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}
```

### ARIA Examples

```html
<!-- Live region for real-time updates -->
<div aria-live="polite" aria-atomic="true">
  Score: 2-1
</div>

<!-- Form group -->
<div class="form-group">
  <label for="username">Username</label>
  <input id="username" required aria-required="true" />
</div>

<!-- Button with icon -->
<button aria-label="Close prediction">×</button>
```

---

## 📁 File Structure

### HTML Files Created

```
figma-test/
├── wagerline-home.html          # Home page mockup
├── wagerline-admin.html         # Admin dashboard
├── wagerline-components.html    # Component library
├── wagerline-i18n.html          # Multi-language & RTL demo
├── design-tokens.json           # Design tokens (JSON)
├── WAGERLINE-DESIGN-GUIDE.md    # This file
└── ...
```

### Component Usage Guide

#### Home Page
**File:** `wagerline-home.html`

Shows:
- Header with language selector
- Sport selector tabs
- Hero section
- Live events cards
- Featured event card
- Top events section
- AI insights cards
- News cards
- Rankings table
- Footer

**Key Features:**
- Responsive grid
- Color-coded sections
- Interactive language switching
- Live event animations

#### Admin Dashboard
**File:** `wagerline-admin.html`

Shows:
- Sidebar navigation
- Key metrics cards
- Data sources table
- Sync controls
- Featured events management
- Prediction statistics
- News management
- User statistics

**Key Features:**
- Tabbed navigation
- Real-time status indicators
- Loading animations
- Admin-specific components

#### Components Library
**File:** `wagerline-components.html`

Shows:
- All button variants
- Badge colors
- Card styles
- Alert types
- Form elements
- Progress bars
- Statistics cards
- Skeleton loaders
- Tabs
- Pagination
- Rating component

**Key Features:**
- Interactive examples
- All component states
- Size variations
- Hover effects

#### Multi-Language Demo
**File:** `wagerline-i18n.html`

Shows:
- Language switcher (EN/ES/AR)
- Live event cards in all languages
- Statistics section (translated)
- Rankings table (localized)
- Technical implementation details
- RTL layout demonstration

**Key Features:**
- Real-time language switching
- RTL layout for Arabic
- Translated content samples
- Architecture documentation

---

## 🚀 Implementation Checklist

### Before Launch

- [ ] All color values verified in design tokens
- [ ] Typography tested across all font sizes
- [ ] All components tested in Chrome, Firefox, Safari, Edge
- [ ] Responsive design verified at all breakpoints
- [ ] RTL layout tested in Arabic (ar-SA)
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Performance: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] All images optimized and responsive
- [ ] Form validation and error states designed
- [ ] Loading states and skeleton screens designed
- [ ] Dark mode considered (optional for MVP)

### Component Implementation Notes

1. **Buttons:** Use semantic `<button>` elements, never `<div>` with click handlers
2. **Forms:** Always label inputs, use `<label>` with `for` attribute
3. **Tables:** Scope headers, use `<thead>`/`<tbody>` structure
4. **Navigation:** Use `<nav>` element, test keyboard navigation
5. **Images:** Always include meaningful alt text
6. **Colors:** Don't rely on color alone to convey meaning (use icons/text too)
7. **Motion:** Respect `prefers-reduced-motion` media query

---

## 📚 Resources

### Design Files
- Figma: [Link to design file]
- Storybook: [Link to component library]

### Documentation
- Component API: See individual component files
- Accessibility: [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- i18n: [i18next Documentation](https://www.i18next.com/)

### Testing Tools
- Lighthouse: Browser DevTools
- WAVE: Web Accessibility Evaluation Tool
- axe DevTools: Accessibility checker
- ColorOracle: Color blindness simulator

---

## 📝 Changelog

### v1.0 (Initial Release)
- Complete design system specification
- All core components defined
- Multi-language support architecture
- RTL implementation guide
- Responsive design breakpoints
- Accessibility guidelines
- 4 demo HTML files (Home, Admin, Components, i18n)

---

## 👥 Contact & Support

For design system questions or contributions:
- Design Lead: [Contact]
- Engineering Lead: [Contact]
- Documentation: [GitHub Issues]

---

**Last Updated:** August 22, 2026  
**Version:** 1.0  
**Status:** Production Ready ✓
