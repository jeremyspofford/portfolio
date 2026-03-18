# Portfolio Content Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update portfolio content, fix inaccurate claims, elevate Nova to a featured card, add "How I Work" philosophy section, and improve copy throughout — keeping all existing colors and layout patterns.

**Architecture:** Content-only changes across 11 files. One new component (Philosophy.tsx) follows the same static-card pattern as existing sections. Nova gets promoted from NovaCard to FeaturedCard with a new architecture-diagram mockup. YAML data files get updated descriptions. No color, font, or structural changes to existing patterns.

**Tech Stack:** Next.js 16.1.1, React 19, TypeScript, Tailwind CSS, Framer Motion

---

### Task 1: Update YAML Data Files

These are pure data changes with no component dependencies.

**Files:**
- Modify: `src/data/profile/main.yml`
- Modify: `src/data/experience/vividcloud.yml`
- Modify: `src/data/experience/mmc_desktop.yml`
- Modify: `src/data/projects/2025_03_nova_ai.yml`

- [ ] **Step 1: Update `src/data/profile/main.yml` — bio text**

Replace the `bio` field (line 12). Change `8+ years` → `12+ years` and rewrite to include Nova as 9-service platform:

```yaml
bio: "Senior DevOps Engineer with 12+ years of experience driving infrastructure automation, cloud cost optimization, and CI/CD excellence. Reduced monthly GCP spend by 30% through strategic Cloud Run and review-app optimization. Architected dynamic preview environments and automated certificate management systems serving production workloads. Building Nova — a 9-service AI platform with graph-based cognitive memory, custom PyTorch re-ranker, and multi-provider LLM routing. The platform layer is where DevOps meets AI, and that's where I'm heading."
```

- [ ] **Step 2: Update `src/data/experience/vividcloud.yml` — description**

Replace the `description` field (line 8) with specific details:

```yaml
description: "30% GCP cost reduction via shared review-app infrastructure (replacing full-stack per-MR environments), Cloud Run scale-to-zero for non-production services, and build pipeline cleanup (eliminating unnecessary container builds on every commit)."
```

- [ ] **Step 3: Update `src/data/experience/mmc_desktop.yml` — description**

Replace the `description` field (line 8) with career path story. Must be multiple sentences split by periods (the ExperienceTimeline splits on `.` and shows up to 3 bullets):

```yaml
description: "Beer delivery, bouncing, electrician — then tech. Progressed from desktop support into systems engineering. The unconventional path means nothing is abstract to me; I've fixed the wiring and the infrastructure."
```

- [ ] **Step 4: Update `src/data/projects/2025_03_nova_ai.yml` — description and technologies**

Replace the `description` field (line 6) and `technologies` list (lines 7-13):

```yaml
PK: PROJECT
SK: 2025-03-NOVA
content:
  title: Nova AI Platform
  date: Mar 2025
  description: "9-service AI platform with graph-based cognitive memory, multi-provider LLM routing, custom PyTorch re-ranker, and GPU-accelerated local inference. Not a wrapper — infrastructure."
  technologies:
    - Python
    - PyTorch
    - pgvector
    - LiteLLM
    - vLLM
    - Docker
    - CUDA
    - Redis
    - FastAPI
  link: null
```

- [ ] **Step 5: Verify dev server starts without errors**

Run: `cd /Users/jeremyspofford/workspace/portfolio && npm run dev`
Expected: Server starts with no YAML parsing errors. Visit `http://localhost:3000` — data loads.

- [ ] **Step 6: Commit**

```bash
git add src/data/profile/main.yml src/data/experience/vividcloud.yml src/data/experience/mmc_desktop.yml src/data/projects/2025_03_nova_ai.yml
git commit -m "content: update YAML data — bio, VividCloud details, MMC story, Nova description"
```

---

### Task 2: Update Hero Section — Subtitle and Son's Quote

**Files:**
- Modify: `src/components/Hero.tsx` (lines 113-168 area)

- [ ] **Step 1: Add `getKidAge` helper function**

Add this function inside `Hero.tsx`, before the `Hero` component export (after line 111):

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

- [ ] **Step 2: Replace the subtitle `<p>` element**

Replace lines 164-168 (the `<p>` with "accountable" styling) with:

```tsx
            <p className="text-[#CBD5E1] text-xl leading-relaxed max-w-2xl text-left">
              12 years of making infrastructure{" "}
              <strong className="text-primary font-bold">boring on purpose</strong>.
              Now building the platform layer where DevOps meets AI.
            </p>
```

Note: `text-primary` should use the existing Tailwind config primary color. Check if defined — if not, use inline `style={{ color: "#22D3EE" }}` instead. The spec says "existing text-primary color" so check `tailwind.config.ts` for a `primary` color. If it doesn't exist, use `text-[#22D3EE]` directly.

- [ ] **Step 3: Add the son's quote below the subtitle, before CTA buttons**

Insert between the subtitle `<p>` and the CTA `<div className="flex flex-col sm:flex-row gap-3">` (before line 171):

```tsx
            <blockquote className="border-l-2 border-[#F59E0B] pl-4 py-1 max-w-xl">
              <p className="text-[#94A3B8] text-sm italic leading-relaxed">
                &ldquo;Oh, that broke. That&apos;s okay — it&apos;s just part of engineering.&rdquo;
              </p>
              <cite className="text-[#475569] text-xs font-mono not-italic mt-1 block">
                — My {getKidAge()}-year-old, who gets it.
              </cite>
            </blockquote>
```

- [ ] **Step 4: Verify in browser**

Run dev server, visit `http://localhost:3000`. Confirm:
- New subtitle shows "boring on purpose" in bold with accent color
- Son's quote appears with amber left border
- Age calculates correctly (should show 5 as of March 2026)
- CTA buttons still render below the quote

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "content: update hero subtitle and add son's engineering quote"
```

---

### Task 3: Elevate Nova to FeaturedCard with Architecture Mockup

**Files:**
- Modify: `src/components/Projects.tsx` (lines 12-59, 708-906, 910-1010)

- [ ] **Step 1: Update `PROJECT_METADATA["Nova AI Platform"]`**

Replace the Nova entry in `PROJECT_METADATA` (lines 50-58) with:

```tsx
  "Nova AI Platform": {
    metric: "9",
    metricLabel: "services",
    problem: "AI assistants forget everything between sessions — no memory, no personalization, no continuity.",
    solution: "Graph-based cognitive memory with spreading activation, Hebbian learning, and consolidation cycles. One persistent brain across Telegram, CLI, and Web.",
    github: "https://github.com/arialabs/nova",
    accentColor: "#22D3EE",
    tag: "Aria Labs",
  },
```

- [ ] **Step 2: Replace `NovaMockup` with architecture diagram**

Replace the entire `NovaMockup` function (lines 708-795) with a new architecture-diagram mockup:

```tsx
/** Nova AI Platform architecture diagram mockup */
function NovaMockup() {
  const services = [
    { name: "Orchestrator", color: "#10B981", desc: "agent lifecycle, task queue" },
    { name: "LLM Gateway", color: "#3B82F6", desc: "10+ provider routing" },
    { name: "Engram Memory", color: "#A855F7", desc: "graph + pgvector" },
    { name: "Neural Router", color: "#F97316", desc: "PyTorch re-ranker" },
    { name: "Cortex", color: "#EC4899", desc: "autonomous agent loop" },
    { name: "Chat API", color: "#6366F1", desc: "REST interface" },
    { name: "Chat Bridge", color: "#14B8A6", desc: "Telegram + Discord" },
    { name: "Dashboard", color: "#F59E0B", desc: "monitoring UI" },
    { name: "Recovery", color: "#EF4444", desc: "failover + health" },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden w-full h-full flex flex-col"
      style={{
        background: "#080C12",
        border: "1px solid #1E293B",
        boxShadow: "0 0 0 1px rgba(34,211,238,0.06), 0 12px 40px rgba(0,0,0,0.5)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-b flex-shrink-0"
        style={{ background: "#0D1117", borderColor: "#1E293B" }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <span className="text-[11px] font-mono text-[#4B5563] ml-2">nova — architecture</span>
      </div>

      {/* Service grid */}
      <div className="flex-1 p-3 grid grid-cols-3 gap-2 content-start" style={{ color: "#94A3B8" }}>
        {services.map((svc) => (
          <div
            key={svc.name}
            className="rounded-lg p-2 border flex flex-col gap-1"
            style={{
              background: `${svc.color}08`,
              borderColor: `${svc.color}30`,
            }}
          >
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: svc.color }}
              />
              <span
                className="text-[10px] font-mono font-semibold truncate"
                style={{ color: svc.color }}
              >
                {svc.name}
              </span>
            </div>
            <span className="text-[8px] font-mono text-[#64748B] leading-tight">
              {svc.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div
        className="px-4 py-2 border-t flex items-center justify-between"
        style={{ background: "#22D3EE", borderColor: "#22D3EE" }}
      >
        <span className="font-mono text-[11px] font-bold" style={{ color: "#0A0E17" }}>9 SERVICES</span>
        <span className="font-mono text-[11px]" style={{ color: "#0A0E17", opacity: 0.8 }}>
          docker compose · GPU overlay
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add Nova to the MOCKUPS record and FEATURED_TITLES**

Update the `MOCKUPS` record (line 924) to include Nova:

```tsx
  const MOCKUPS: Record<string, React.ReactNode> = {
    "Epstein Files Explorer": <EpsteinMockup />,
    "Suppr": <SupprMockup />,
    "Nova AI Platform": <NovaMockup />,
  };
```

Update `FEATURED_TITLES` (line 918) to include Nova:

```tsx
  const FEATURED_TITLES = ["Epstein Files Explorer", "Suppr", "Nova AI Platform"];
```

- [ ] **Step 4: Remove the standalone NovaCard rendering**

Remove the `novaItem` variable (line 922) and the Nova standalone rendering block (lines 984-989):

```tsx
        {/* Nova AI Platform — promoted, standalone */}
        {novaItem && (
          <div className="mb-12">
            <NovaCard item={novaItem} />
          </div>
        )}
```

Replace it with nothing — Nova now renders via `featuredItems.map(...)` through `FeaturedCard`.

Also update `featuredItems` sort to include Nova at the end:

```tsx
  const featuredItems = sortedItems.filter(item => FEATURED_TITLES.includes(item.content.title));
  featuredItems.sort((a, b) => FEATURED_TITLES.indexOf(a.content.title) - FEATURED_TITLES.indexOf(b.content.title));
```

In the `featuredItems.map(...)` rendering, ensure Nova isn't flipped (only Epstein uses `flipped`):

The existing code `flipped={item.content.title === "Epstein Files Explorer"}` already handles this correctly.

- [ ] **Step 5: Delete the `NovaCard` component**

Remove the entire `NovaCard` function (lines 799-906) since it's no longer used.

- [ ] **Step 6: Verify Nova renders as FeaturedCard**

Run dev server, visit `http://localhost:3000/#projects`. Confirm:
- Nova shows as a large FeaturedCard with architecture diagram on the right
- 9 service boxes visible in the mockup, each with colored dot
- Metric shows "9 / services"
- GitHub link points to `https://github.com/arialabs/nova`
- Problem/Solution cards render correctly

- [ ] **Step 7: Commit**

```bash
git add src/components/Projects.tsx
git commit -m "content: elevate Nova to FeaturedCard with architecture diagram mockup"
```

---

### Task 4: Replace "Also Built" with VividCloud Cards + Fix Claims

**Files:**
- Modify: `src/components/Projects.tsx` (lines 991-1005)

- [ ] **Step 1: Replace the "Also built" section**

Replace the entire `<motion.div>` block containing the "Also built" `<ul>` (lines 992-1005) with a new VividCloud card grid:

```tsx
        {/* Also shipped at VividCloud */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="mt-4 border-t border-[#1E293B] pt-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-mono text-xs text-[#F59E0B] tracking-widest uppercase">
              Also shipped at VividCloud
            </h3>
            <div className="h-px flex-1 bg-[#1E293B]" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Cloud Cost Optimization",
                description: "Shared review-app resources, Cloud Run scale-to-zero, build pipeline cleanup",
                metric: "↓ 30% monthly GCP spend",
                metricColor: "#10B981",
              },
              {
                title: "Dynamic Preview Environments",
                description: "PR-based staging tied to GitLab MRs with automatic teardown",
                metric: "Per-MR environments",
                metricColor: "#22D3EE",
              },
              {
                title: "Certificate Automation",
                description: "SSL renewal via GCP Secret Manager + Pub/Sub",
                metric: "Zero manual renewals",
                metricColor: "#22D3EE",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-[#3D4F6B] p-4"
                style={{ background: "#1F2B45" }}
              >
                <h4 className="font-display font-semibold text-sm text-[#F1F5F9] mb-1.5">
                  {card.title}
                </h4>
                <p className="text-xs text-[#CBD5E1] leading-relaxed mb-3">
                  {card.description}
                </p>
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: card.metricColor }}
                >
                  {card.metric}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
```

This removes the inaccurate "$12K/year across 3 cloud providers" claim and replaces it with specific, factual VividCloud accomplishments.

- [ ] **Step 2: Make project live URLs clickable**

Check if `project.link` is rendered as a clickable `<a>` in `HeroProjectCard` and `FeaturedCard`. Looking at the code:
- `HeroProjectCard` (line 505-514): ✅ Already renders `project.link` as `<a href>` with `target="_blank"`
- `FeaturedCard` (line 639-653): ✅ Already renders `project.link` as `<a href>` with `target="_blank"`

URLs are already clickable. No changes needed here.

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:3000/#projects`. Confirm:
- "Also shipped at VividCloud" section shows 3 cards in a grid
- Cost Optimization card shows green metric text
- No mention of "$12K/year" or "3 cloud providers" anywhere
- Cards match existing styling patterns

- [ ] **Step 4: Commit**

```bash
git add src/components/Projects.tsx
git commit -m "content: replace 'Also built' with VividCloud cards, fix inaccurate claims"
```

---

### Task 5: Update Skills Section — Rename Tier + Add AI Skills

**Files:**
- Modify: `src/components/Skills.tsx` (lines 46-58)

- [ ] **Step 1: Update the "Familiar" tier**

Replace the third tier object in `SKILL_TIERS` (lines 46-58) with:

```tsx
  {
    tier: "Building Toward",
    label: "Building Toward",
    description: "Active projects & learning",
    color: "#475569",
    dimColor: "rgba(71,85,105,0.06)",
    borderColor: "rgba(71,85,105,0.18)",
    skills: [
      "pgvector", "PyTorch", "LLM APIs", "vLLM / Local Inference",
      "AWS CDK", "Prometheus", "Grafana", "GitHub Actions",
    ],
  },
```

Changes: tier name `Familiar` → `Building Toward`, description `Used in projects, learning` → `Active projects & learning`, removed `CloudFormation` and `Liquibase`, added `pgvector`, `PyTorch`, `vLLM / Local Inference`.

- [ ] **Step 2: Verify in browser**

Visit `http://localhost:3000/#skills`. Confirm:
- Third tier now says "Building Toward" with "Active projects & learning"
- New AI skills (pgvector, PyTorch, LLM APIs, vLLM / Local Inference) appear
- CloudFormation and Liquibase are gone
- Existing Expert and Proficient tiers unchanged

- [ ] **Step 3: Commit**

```bash
git add src/components/Skills.tsx
git commit -m "content: rename Familiar tier to Building Toward, add AI skills"
```

---

### Task 6: Create Philosophy Component ("How I Work")

**Files:**
- Create: `src/components/Philosophy.tsx`

- [ ] **Step 1: Create `src/components/Philosophy.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

const PHILOSOPHY_CARDS = [
  {
    title: "Automate everything twice-done",
    body: "If I do it more than once, it gets automated. Manual is technical debt that compounds. Review-app infra, cert renewals, Terraform docs — all automated out of existence.",
  },
  {
    title: "Boring is the goal",
    body: "Infrastructure should be predictably reliable, never exciting at 2am. The best systems are the ones nobody notices because they just work.",
  },
  {
    title: "Hands-on by nature",
    body: "Finished basement, built a shed, dual-boot PC, gave an AI its own mini-PC with LAN wake access to my GPU desktop. I tinker because I need to understand how things work.",
  },
  {
    title: "Ship, then refine",
    body: "72 hours to an MVP. 535 reps tracked. 9 microservices orchestrated. Shipping is a muscle — the portfolio is the proof.",
  },
];

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="w-full py-12 md:py-16 px-6 md:px-12 scroll-mt-20"
      style={{ background: "#182240" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-xs text-[#F59E0B] tracking-widest uppercase mb-2 block">
            04 // philosophy
          </span>
          <h2
            className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            How I Work
          </h2>
        </motion.div>

        {/* 2x2 grid of cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {PHILOSOPHY_CARDS.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl border border-[#3D4F6B] p-6"
              style={{ background: "#1F2B45" }}
            >
              <h3 className="font-display font-semibold text-lg text-[#F1F5F9] mb-3">
                {card.title}
              </h3>
              <p className="text-[#CBD5E1] text-sm leading-relaxed">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify file created**

Run: `cat src/components/Philosophy.tsx | head -5`
Expected: Shows the `"use client"` directive and import.

- [ ] **Step 3: Commit**

```bash
git add src/components/Philosophy.tsx
git commit -m "feat: add Philosophy/How I Work section component"
```

---

### Task 7: Update Contact Section — Label and CTA

**Files:**
- Modify: `src/components/Contact.tsx` (lines 31-38)

- [ ] **Step 1: Update section number**

Replace `04 // contact` (line 31) with `05 // contact`:

```tsx
          <span className="font-mono text-xs text-[#F59E0B] tracking-widest uppercase mb-2 block">05 // contact</span>
```

- [ ] **Step 2: Update CTA heading**

Replace the `<h2>` (lines 32-33) — change "Let's talk" to the new CTA:

```tsx
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4" style={{ letterSpacing: "-0.03em" }}>
            Let&apos;s build something <span className="italic text-[#94A3B8]">boring.</span>
          </h2>
```

- [ ] **Step 3: Update description**

Replace the `<p>` (lines 35-38):

```tsx
          <p className="text-[#CBD5E1] text-lg max-w-xl text-left">
            Open to senior DevOps, platform engineering, and AI infrastructure roles.
            Always down to discuss interesting problems.
          </p>
```

Note: Looking at the current code, the description text is ALREADY this exact text. Verify — if it matches, no change needed for the description.

- [ ] **Step 4: Verify in browser**

Visit `http://localhost:3000/#contact`. Confirm:
- Section shows "05 // contact"
- Heading reads: Let's build something *boring.*
- "boring." is italic and muted gray (`#94A3B8`)

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "content: update contact section number and CTA heading"
```

---

### Task 8: Update Navbar + Page Layout

**Files:**
- Modify: `src/components/Navbar.tsx` (lines 8-14)
- Modify: `src/app/page.tsx` (lines 1-54)

- [ ] **Step 1: Add Philosophy to NAV_ITEMS**

In `Navbar.tsx`, add the Philosophy entry to `NAV_ITEMS` between Experience and Blog (after line 11):

```tsx
const NAV_ITEMS = [
  { label: 'Work', href: '/#projects', sectionId: 'projects', shortcut: 'p' },
  { label: 'Skills', href: '/#skills', sectionId: 'skills', shortcut: 's' },
  { label: 'Experience', href: '/#experience', sectionId: 'experience', shortcut: 'e' },
  { label: 'Philosophy', href: '/#philosophy', sectionId: 'philosophy', shortcut: null },
  { label: 'Blog', href: '/blog', sectionId: null, shortcut: null },
  { label: 'Resume', href: '/resume', sectionId: null, shortcut: null },
];
```

No keyboard shortcut needed (spec says keep shortcuts for the 4 main: p, s, e, c).

- [ ] **Step 2: Add Philosophy component to `page.tsx`**

Add the import at the top of `page.tsx`:

```tsx
import { Philosophy } from "@/components/Philosophy";
```

Add the Philosophy section between Experience and Contact (between lines 48-51):

```tsx
      {/* 4. Experience — tabbed timeline */}
      <div style={{ background: "#0A0E17" }}>
        <ExperienceTimeline items={experience} />
      </div>

      {/* 5. How I Work — philosophy cards */}
      <Philosophy />

      {/* 6. Contact */}
      <Contact profile={profile} />
```

- [ ] **Step 3: Verify full page layout**

Visit `http://localhost:3000`. Scroll through entire page and confirm:
- Section order: Hero → Projects → Skills → Experience → **How I Work** → Contact
- Philosophy section has `#182240` background (matches Skills)
- Nav shows "Philosophy" entry between Experience and Blog
- Clicking "Philosophy" nav link scrolls to the new section
- Contact shows "05 // contact"

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/app/page.tsx
git commit -m "feat: add Philosophy section to navigation and page layout"
```

---

### Task 9: Final Verification

- [ ] **Step 1: Run the dev server and check all changes end-to-end**

Run: `npm run dev`

Walk through the entire page and verify each spec item:

1. **Hero**: New subtitle with "boring on purpose" bold + accent. Son's quote with age=5 and amber border.
2. **Projects**: Nova is a FeaturedCard with architecture diagram. 9 services. GitHub link to arialabs/nova. "Also shipped at VividCloud" 3-card grid. No "$12K/year" or "3 cloud providers" anywhere.
3. **Skills**: Third tier = "Building Toward" with "Active projects & learning". AI skills present (pgvector, PyTorch, LLM APIs, vLLM / Local Inference).
4. **Experience**: VividCloud tab shows specific cost reduction details. MMC Desktop tab shows career path story.
5. **Philosophy**: 2x2 grid with 4 cards. Section 04. "How I Work" heading.
6. **Contact**: Section 05. "Let's build something *boring.*" heading with italic muted text.
7. **Navigation**: Philosophy entry exists between Experience and Blog.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors. Static export completes.

- [ ] **Step 3: Check for TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Final commit if any cleanup needed**

If any adjustments were needed during verification, commit them:

```bash
git add -A
git commit -m "fix: final adjustments from end-to-end verification"
```
