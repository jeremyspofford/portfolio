# Portfolio Content Redesign

**Date:** 2026-03-18
**Scope:** Content updates, structural additions, and copy improvements to jeremyspofford.dev. No color/theme changes.

## Context

The current portfolio undersells Jeremy's capabilities — particularly Nova (described as "custom AI assistant with semantic memory" when it's actually a 9-service AI infrastructure platform with PyTorch ML pipelines). VividCloud experience descriptions are vague, and some data is inaccurate ("$12K/year across 3 cloud providers" — should be AWS + GCP). The portfolio also lacks personality and the human story that makes a candidate memorable.

## Changes

### 1. Hero Section (`src/components/Hero.tsx`)

**Add son's quote** below the existing tagline (lines 164-168), before the CTA buttons:

> "Oh, that broke. That's okay — it's just part of engineering."
> — My {age}-year-old, who gets it.

Age is auto-calculated from a November 2020 birth date. Use a helper function that accounts for both month and day:

```tsx
function getKidAge(): number {
  const now = new Date();
  const birthYear = 2020;
  const birthMonth = 10; // November (0-indexed)
  let age = now.getFullYear() - birthYear;
  if (now.getMonth() < birthMonth) age--;
  return age;
}
```

**Update subtitle text.** The existing subtitle (lines 164-168) uses JSX with a styled `<span>` around "accountable" (amber color, bold italic). Replace the entire `<p>` element. In the new text, render "boring on purpose" with `<strong>` using the existing text-primary color:

From:
> "I build civic tech that holds power accountable — tracking Congress and surfacing public records, then shipping it to production without drama."

To:
> "12 years of making infrastructure **boring on purpose**. Now building the platform layer where DevOps meets AI."

### 2. Projects Section (`src/components/Projects.tsx`)

#### 2a. Elevate Nova to a full-size featured card

Nova currently uses the `NovaCard` component (a smaller standalone card, line 799 in Projects.tsx). Promote it to use the `FeaturedCard` template (same treatment as Epstein/Suppr) with a right-side mockup. Update both `PROJECT_METADATA["Nova AI Platform"]` in Projects.tsx and `src/data/projects/2025_03_nova_ai.yml`:

- **Title:** Nova
- **Label:** AI Infrastructure Platform
- **Description:** "9-service AI platform with graph-based cognitive memory, multi-provider LLM routing, custom PyTorch re-ranker, and GPU-accelerated local inference. Not a wrapper — infrastructure."
- **Problem:** "AI assistants forget everything between sessions — no memory, no personalization, no continuity."
- **Solution:** "Graph-based cognitive memory with spreading activation, Hebbian learning, and consolidation cycles. One persistent brain across Telegram, CLI, and Web."
- **Tech tags:** Python, PyTorch, pgvector, LiteLLM, vLLM, Docker, CUDA, Redis, FastAPI
- **Metric:** 9 services
- **Right-side mockup:** Architecture diagram showing the 9 services with colored dots:
  - Orchestrator (green) — agent lifecycle, task queue
  - LLM Gateway (blue) — 10+ provider routing
  - Engram Memory (purple) — graph + pgvector
  - Neural Router (orange) — PyTorch re-ranker
  - Cortex (pink) — autonomous agent loop
  - Chat API, Chat Bridge, Dashboard, Recovery
- **GitHub link:** https://github.com/arialabs/nova

#### 2b. Add "Also shipped at VividCloud" sub-section

After the main project cards, add a labeled sub-section with three smaller cards:

1. **Cloud Cost Optimization**
   - Description: "Shared review-app resources, Cloud Run scale-to-zero, build pipeline cleanup"
   - Metric: "↓ 30% monthly GCP spend"

2. **Dynamic Preview Environments**
   - Description: "PR-based staging tied to GitLab MRs with automatic teardown"
   - Metric: "Per-MR environments"

3. **Certificate Automation**
   - Description: "SSL renewal via GCP Secret Manager + Pub/Sub"
   - Metric: "Zero manual renewals"

This is a new layout pattern — the existing "Also built" section (lines 992-1005) is a simple `<ul>` with bullet points. Replace it with a 3-column grid of small cards. Each card uses:
- `rounded-xl` with `border border-[#3D4F6B]` and `bg-[#1F2B45]` (matching existing card patterns)
- Title in `font-display font-semibold text-sm`
- Description in `text-xs text-[#CBD5E1]`
- Metric in `font-mono text-xs font-bold text-[#22D3EE]` (or `text-[#10B981]` for the cost reduction)

#### 2c. Fix inaccurate claims

- Change "$12K/year across 3 cloud providers" → "Cloud cost optimization across AWS and GCP"
- Ensure all project URLs are clickable anchor links to live sites

#### 2d. Make all project URLs clickable

Ensure live site URLs (reps.arialabs.ai, epstein.arialabs.ai, suppr.arialabs.ai) are rendered as clickable links that open in new tabs.

### 3. Skills Section (`src/components/Skills.tsx`)

**Rename "Familiar" tier** → "Building Toward" with description: "Active projects & learning"

**Update skills in that tier** to include AI-specific tools:
- Add: pgvector, PyTorch, LLM APIs, vLLM / Local Inference
- Keep existing: AWS CDK, Prometheus, Grafana, GitHub Actions

### 4. Experience Section (`src/components/ExperienceTimeline.tsx`, `src/data/experience/vividcloud.yml`)

**VividCloud description** — replace vague "Led an initiative resulting in a 30% reduction" with specific details:
> "30% GCP cost reduction via shared review-app infrastructure (replacing full-stack per-MR environments), Cloud Run scale-to-zero for non-production services, and build pipeline cleanup (eliminating unnecessary container builds on every commit)."

**MMC Desktop entry** (`src/data/experience/mmc_desktop.yml`) — add context about the unconventional career path. Structure as multiple sentences so the ExperienceTimeline bullet-point renderer (splits on periods, shows up to 3) formats them properly:
> "Beer delivery, bouncing, electrician — then tech. Progressed from desktop support into systems engineering. The unconventional path means nothing is abstract to me; I've fixed the wiring and the infrastructure."

### 5. New Section: "How I Work" (`src/components/Philosophy.tsx`)

Add a new section between Experience and Contact. Section number: `04 // philosophy`. Title: "How I Work".

This is a fully static component — no props, no YAML data source, no `fetchContent` integration. Just a React component with hardcoded content.

Four cards in a 2x2 grid (`md:grid-cols-2 gap-6`), using the existing card styling patterns (`rounded-xl border border-[#3D4F6B] bg-[#1F2B45] p-6`). Section background matches Skills section (`bg-[#182240]`):

1. **Automate everything twice-done**
   "If I do it more than once, it gets automated. Manual is technical debt that compounds. Review-app infra, cert renewals, Terraform docs — all automated out of existence."

2. **Boring is the goal**
   "Infrastructure should be predictably reliable, never exciting at 2am. The best systems are the ones nobody notices because they just work."

3. **Hands-on by nature**
   "Finished basement, built a shed, dual-boot PC, gave an AI its own mini-PC with LAN wake access to my GPU desktop. I tinker because I need to understand how things work."

4. **Ship, then refine**
   "72 hours to an MVP. 535 reps tracked. 9 microservices orchestrated. Shipping is a muscle — the portfolio is the proof."

### 6. Contact Section (`src/components/Contact.tsx`)

**Update section label** from `04 // contact` to `05 // contact`.

**Update CTA heading** to: "Let's build something *boring.*" — render "boring." wrapped in `<span className="italic text-[#94A3B8]">` to visually soften it.

**Update description** to: "Open to senior DevOps, platform engineering, and AI infrastructure roles. Always down to discuss interesting problems."

### 7. Navigation Updates (`src/components/Navbar.tsx`)

Add a "How I Work" entry to the `NAV_ITEMS` array between Experience and Contact:
```ts
{ label: 'Philosophy', sectionId: 'philosophy', href: '#philosophy' }
```
No keyboard shortcut needed (keep shortcuts for the 4 main sections: p, s, e, c). The existing About.tsx component is not imported in page.tsx and is unused — Philosophy.tsx supersedes it.

### 8. Profile Data (`src/data/profile/main.yml`)

Update bio to:
> "Senior DevOps Engineer with 12+ years of experience driving infrastructure automation, cloud cost optimization, and CI/CD excellence. Reduced monthly GCP spend by 30% through strategic Cloud Run and review-app optimization. Architected dynamic preview environments and automated certificate management systems serving production workloads. Building Nova — a 9-service AI platform with graph-based cognitive memory, custom PyTorch re-ranker, and multi-provider LLM routing. The platform layer is where DevOps meets AI, and that's where I'm heading."

### 9. Page Layout (`src/app/page.tsx`)

Add the new Philosophy/How I Work section component between the Experience and Contact sections. Update section IDs and nav scroll targets accordingly.

## Files to Create

- `src/components/Philosophy.tsx` — new "How I Work" section

## Files to Modify

- `src/components/Hero.tsx` — quote, subtitle
- `src/components/Projects.tsx` — Nova card, VividCloud sub-section, fix claims, clickable URLs
- `src/components/Skills.tsx` — rename Familiar → Building Toward, add AI skills
- `src/components/ExperienceTimeline.tsx` — VividCloud details, MMC story
- `src/components/Contact.tsx` — CTA heading, description
- `src/components/Navbar.tsx` — add Philosophy nav entry
- `src/app/page.tsx` — add Philosophy component between Experience and Contact
- `src/data/experience/vividcloud.yml` — updated description
- `src/data/experience/mmc_desktop.yml` — career path story
- `src/data/profile/main.yml` — updated bio
- `src/data/projects/2025_03_nova_ai.yml` — updated description and technologies

## Out of Scope

- Color scheme changes
- Font changes
- Layout/structural changes to existing sections (hero terminal stays, tab-based experience stays, etc.)
- Responsive design changes
- Animation changes
