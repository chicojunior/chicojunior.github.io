# Design Spec: Favicon FV (Terminal Style)

Date: 2026-03-31  
Status: Approved in chat, pending implementation planning

## 1. Goal

Replace the current favicon direction with a more personal and less cold identity while keeping professional credibility for portfolio/recruiter contexts.

The approved concept is a terminal-inspired monogram that reflects Francisco Vale's frontend/dev profile.

## 2. Final Decision

### Approved direction

- Concept: `FV2` ("Codigo Elegante")
- Mark: text-based monogram `"<FV>"`
- Primary palette:
  - Background: `#F7DF1E` (JavaScript-inspired yellow)
  - Foreground text: `#1A1A1A`
- Shape: clean rounded/circular container suitable for favicon scale
- Personality target:
  - More personal than purely geometric marks
  - More professional than avatar-like illustration
  - Recognizably developer-oriented through terminal/code language

### Explicitly rejected

- Previous icon with technical lateral symbol from option B round 1
- Overly generic monogram variants without code context
- Dark-first inversion as primary variant (keep one canonical mark first)

## 3. Scope

### In scope

- Replace current favicon asset with new `FV2` visual direction
- Keep integration through HTML `<link rel="icon">`
- Preserve site's minimal editorial tone
- Ensure readability in very small sizes (16x16 and 32x32)

### Out of scope

- Full brand system redesign
- Animated favicon
- Multiple seasonal variants
- Additional logo lockups for social cards

## 4. Visual Rules

1. The monogram must read as `"<FV>"`, not just `FV`.
2. The icon should avoid extra ornaments beyond what improves recognition at small sizes.
3. Counter-space around text must be generous to avoid visual blur in browser tabs.
4. The color pair must remain high contrast and stable across light/dark browser chrome.
5. The overall result should feel modern, calm, and intentional (not playful/chibi).

## 5. Typography Strategy

Use terminal-inspired mono family preference in this order:

1. `Fira Code`
2. `JetBrains Mono`
3. `IBM Plex Mono`
4. `ui-monospace` / `monospace` fallback

Note: favicon rendering depends on browser support when text is embedded in SVG. Final implementation should prioritize shape clarity over strict font fidelity when rasterized.

## 6. Accessibility and Rendering Constraints

- Must remain identifiable at:
  - 16x16 (tab icon baseline)
  - 32x32 (bookmarks/high-density tabs)
- Avoid thin strokes that vanish on low-DPI environments.
- Prefer strong silhouette and high edge contrast.

## 7. Testing Strategy (Implementation Phase)

1. Automated acceptance checks should validate:
   - Favicon asset exists
   - `index.html` references the expected favicon path
2. Manual visual checks:
   - Chrome and Safari tab rendering
   - Light and dark browser UI contexts
   - Hard-refresh/cached favicon behavior confirmation

## 8. Risks and Mitigations

- Risk: Text-based SVG may rasterize inconsistently across environments.  
  Mitigation: Use simple, bold typography and verify in target browsers; if needed, convert glyphs to paths.

- Risk: Yellow background may feel too bright for some contexts.  
  Mitigation: Keep this as canonical v1; tune shade only if readability/brand fit issues persist after validation.

## 9. Success Criteria

1. User confirms the new favicon feels less cold and more personal.
2. Favicon is recognizably `"<FV>"` at tab size.
3. Visual language aligns with professional frontend identity.
4. Legacy blowfish association is fully removed from active site presentation.
