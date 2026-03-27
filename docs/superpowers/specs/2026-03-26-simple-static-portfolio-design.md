# Design Spec: Simple Static Portfolio (No Hugo)

Date: 2026-03-26  
Status: Approved in chat, pending implementation planning

## 1. Goal

Reformulate the personal website into the simplest possible modern "business card" experience, with:

- Minimal editorial visual direction
- One-page structure (no menu)
- Primary actions: LinkedIn, GitHub, and CV
- Bilingual content (English default, Portuguese toggle)
- No Hugo dependency

## 2. Scope

### In scope

- Replace Hugo-based setup with a plain static website
- Deliver one-page `index.html` with inline CSS and JS
- Keep avatar (chibi illustration) in hero
- Build concise sections: hero, short about, tech stack by categories, links
- Implement EN/PT text switching with persistence
- Ensure responsive layout for desktop and mobile
- Keep deployment compatible with GitHub Pages without build step

### Out of scope

- Blog/posts system
- CMS or dynamic backend
- Complex animations or heavy visual effects
- Theme framework migration (React/Vue/etc.)

## 3. Architecture

### 3.1 High-level structure

- Single document app: `index.html`
- Inline `<style>` and inline `<script>` for maximum simplicity
- Existing static assets reused where needed:
  - `assets/img/chibi-avatar.png`
  - `CV-Current.pdf` (or equivalent final CV path)

### 3.2 Runtime behavior

- Default language is `en`
- Language toggle updates UI text in place (no page reload)
- User preference is stored in `localStorage`
- Page sets `document.documentElement.lang` dynamically to reflect active language

### 3.3 Deployment model

- Push static files directly to repository
- GitHub Pages serves static content as-is
- No build pipeline required

## 4. UX and Content Model

### 4.1 Page sections (top-to-bottom)

1. Minimal topbar: name + `EN | PT` toggle
2. Hero:
   - Chibi avatar
   - Name
   - Short role headline
3. Primary actions:
   - LinkedIn
   - GitHub
   - CV (open in new tab)
4. About:
   - 3-4 short lines
5. Tech stack categories:
   - Frontend
   - Backend
   - Tools
6. Minimal footer

### 4.2 Visual direction

- Minimal editorial style
- Strong typography and clear hierarchy
- Generous whitespace
- Light and clean aesthetic
- Subtle hover/focus states only

## 5. Bilingual Strategy

### 5.1 Content source

- One JS object with two locale keys:
  - `en`
  - `pt`

Each key contains section copy, labels, and button text.

### 5.2 Language rules

- Site starts in English by default
- User can switch to Portuguese manually
- Last selected locale is persisted in `localStorage`

## 6. Accessibility and SEO Minimum

### 6.1 Accessibility

- Semantic layout: `header`, `main`, `section`, `footer`
- Keyboard-focus visible styles for all interactive elements
- Language toggle with proper `aria-label`
- Descriptive `alt` text for avatar
- Sufficient color contrast

### 6.2 SEO baseline

- Clear `<title>` (name + role)
- `<meta name="description">`
- Basic Open Graph tags:
  - `og:title`
  - `og:description`
  - `og:type`
- Correct root `lang` attribute updates when locale changes

## 7. Migration Plan (Hugo -> Static)

1. Create static one-page `index.html`
2. Move final asset references to stable static paths
3. Ensure `CNAME` remains intact if custom domain is still used
4. Stop depending on Hugo config/theme for rendering
5. Keep old material under `old/` as historical backup (no active runtime dependency)

## 8. Success Criteria

1. Website works by opening `index.html` directly
2. English appears by default
3. EN/PT toggle switches all target texts
4. Locale choice persists after refresh
5. LinkedIn/GitHub/CV links work (CV opens in new tab)
6. Layout remains clear and usable on mobile and desktop
7. No Hugo command is needed to run/publish the page

## 9. Risks and Mitigations

- Risk: Inline CSS/JS can become hard to maintain over time  
  Mitigation: Keep clear section comments and small helper functions

- Risk: Old Hugo files can create confusion for future edits  
  Mitigation: Document active architecture in README and optionally archive/remove obsolete files in a later cleanup step

- Risk: Bilingual copy drift between EN/PT  
  Mitigation: Keep keys mirrored and grouped in a single translation object

## 10. Testing Strategy (for implementation phase)

- Manual smoke checks:
  - Desktop (Chrome/Safari/Firefox)
  - Mobile viewport (responsive behavior)
- Functional checks:
  - Toggle language both directions
  - Refresh persistence
  - All external links open correctly
- Accessibility checks:
  - Tab navigation
  - Focus visibility
  - Basic semantic landmarks
