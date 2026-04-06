# Design System — Jeremy Spofford Portfolio

## Product Context
- **What this is:** Personal portfolio site for a senior DevOps engineer and AI platform founder
- **Who it's for:** Hiring managers, recruiters, engineers evaluating technical credibility
- **Space/industry:** Engineering portfolios, DevOps/infrastructure
- **Project type:** Marketing site / personal brand

## Aesthetic Direction
- **Direction:** Clean document. Light background, narrow content column, serif headings, no tricks. Feels like a well-formatted resume, not a landing page.
- **Decoration level:** Minimal. No cards, no pills, no animations, no gradients. Typography and whitespace do all the work.
- **Mood:** Professional and approachable. Like reading a well-written blog post about someone competent. Not performing design, just presenting information clearly.
- **Anti-patterns:** No dark neon palettes. No card grids. No proficiency bars. No tech pills. No decorative animations. No status bars. No typewriter effects. No centered-everything layouts.
- **Reference sites:** troyingram.net (simplicity, readability, human feel)

## Typography
- **Display/Headings:** Source Serif 4 — readable serif with personality. 600 weight for headings, italic for emphasis.
- **Body:** Inter — clean system-like sans-serif. 400/500/600 weights.
- **Code/Tech lists:** JetBrains Mono — for technology lists and technical details only.
- **Loading:** Google Fonts via `next/font/google`
- **Scale:**
  - H1 (name): 28px, serif, 600
  - H2 (section): 22px, serif, 600
  - H3 (project/company): 17px, serif, 600
  - Body: 15px
  - Small/meta: 13-14px
  - Tech lines: 11px mono
  - Labels: 11px uppercase, 0.08em tracking

## Color
- **Approach:** Near-monochrome. Almost no color. The content is the design.
- **Background:** #FAFAF9 — warm off-white (stone-50)
- **Header background:** #1C1917 — dark warm gray (stone-900)
- **Header text:** #F5F5F4 — stone-100
- **Header muted:** #A8A29E — stone-400, for subtitle and links
- **Primary text:** #1C1917 — stone-900
- **Body text:** #44403C — stone-700, for paragraphs
- **Secondary text:** #57534E — stone-600, for project descriptions
- **Muted text:** #78716C — stone-500, for roles and dates
- **Faint text:** #A8A29E — stone-400, for org labels, tech lines, group labels
- **Borders:** #E7E5E4 — stone-200
- **Links:** #1C1917 (same as text, underline on hover)
- **No accent color.** No teal, no cyan, no copper, no amber.

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable, generous vertical spacing between sections
- **Content max-width:** 720px
- **Section padding:** 48px vertical
- **Project spacing:** 28px between projects
- **Experience spacing:** 24px between entries

## Layout
- **Approach:** Single column, document-style. 720px max-width centered.
- **Header:** Full-width dark strip with initials circle, name, title, location, social links
- **Nav:** Sticky, minimal, text links with bottom border
- **Sections:** Separated by 1px stone-200 borders
- **Projects:** Two groups with uppercase labels. No cards. Just headings, descriptions, and tech lines.
- **Experience:** Company + dates on one line, role below, description paragraph
- **Skills:** Two-column text list, grouped by domain. No bars, no ratings.

## Motion
- **Approach:** None. No animations. Static page. Content loads, you read it.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-03 | Initial design system (Ink + Copper) | /design-consultation, rejected |
| 2026-04-03 | Switched to Midnight + Mint | Dark palette with teal accent, rejected |
| 2026-04-04 | Switched to clean document style | User liked troyingram.net. Simple, light, readable, no design tricks. Every dark/neon/card-based design felt AI-generated. |
| 2026-04-04 | Source Serif 4 + Inter | Serif headings for personality, Inter body for readability. Dropped Instrument Serif (too editorial), General Sans (not available on Google Fonts without workaround). |
| 2026-04-04 | No accent color | Monochrome with warm stone tones. Color was always the wrong axis to optimize on. |
| 2026-04-04 | Project grouping | "What I'm Building" (Aria Labs) / "What I've Shipped at Work" (professional). Mixing them confused the narrative. |
| 2026-04-04 | Removed Kubernetes from data | User doesn't know Kubernetes. Removed from preview_envs.yml, replaced with Cloud Run. |
