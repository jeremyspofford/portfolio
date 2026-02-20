"use client";

import { ExternalLink, Github, ArrowUpRight, Terminal } from "lucide-react";
import { ContentItem, StandaloneProjectContent } from "@/lib/api";
import { motion } from "framer-motion";

interface ProjectsProps {
  items: ContentItem<StandaloneProjectContent>[];
}

// Curated project data with metrics and problem/solution framing
const PROJECT_METADATA: Record<string, {
  metric?: string;
  metricLabel?: string;
  problem?: string;
  solution?: string;
  github?: string;
  accentColor?: string;
  tag?: string;
  isHero?: boolean;
  terminalOutput?: string[];
}> = {
  "Reps Accountability Dashboard": {
    metric: "535",
    metricLabel: "reps tracked",
    problem: "Voting records, campaign finance, and scandals are buried across dozens of government sites — by design.",
    solution: "Real-time dashboard tracking every U.S. Congress member. Votes, bills, campaign finance, known scandals. 615 tests. Democracy shouldn't be paywalled.",
    github: "https://github.com/jeremyspofford",
    accentColor: "#22D3EE",
    tag: "Aria Labs",
    isHero: true,
    terminalOutput: [
      '$ curl -s https://reps.arialabs.ai/api/stats | jq',
      '{',
      '  "representatives": 535,',
      '  "votes_tracked": 48291,',
      '  "bills_indexed": 12847,',
      '  "tests_passing": 615',
      '}',
      '$ pytest tests/ -q --tb=short',
      '615 passed in 4.23s — 0 failures',
    ],
  },
  "Epstein Files Explorer": {
    metric: "91%",
    metricLabel: "photo coverage",
    problem: "Court-released documents were scattered across hundreds of PDFs — no search, no structure, no accountability.",
    solution: "Full-text search engine for court documents with connection graphs, flight logs, and a 70+ person network map. Victim privacy protections built in from day one.",
    github: "https://github.com/jeremyspofford",
    accentColor: "#22D3EE",
    tag: "Aria Labs",
  },
  "Suppr": {
    metric: "72h",
    metricLabel: "to MVP",
    problem: "Social media optimizes for outrage, not connection. People eat alone in cities full of strangers.",
    solution: "Social dining app connecting people through shared meals. Find your next dinner companion. Built for real community — not engagement metrics.",
    github: "https://github.com/jeremyspofford",
    accentColor: "#10B981",
    tag: "Aria Labs",
  },
  "Nova AI Platform": {
    metric: "3",
    metricLabel: "channels unified",
    problem: "AI assistants forget everything between sessions — no memory, no personalization, no continuity.",
    solution: "Custom AI assistant with semantic memory via pgvector. One persistent brain across Telegram, CLI, and Web. Context never lost.",
    github: "https://github.com/jeremyspofford",
    accentColor: "#22D3EE",
    tag: "Aria Labs",
  },
};

// Hero Project Card — full-width, dominant visual treatment
function HeroProjectCard({ item }: { item: ContentItem<StandaloneProjectContent> }) {
  const project = item.content;
  const meta = PROJECT_METADATA[project.title] || {};

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="group relative rounded-2xl border border-[#22D3EE]/20 overflow-hidden card-hover-glow"
      style={{ background: "#1A2340" }}
    >
      {/* Top accent — stronger cyan line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent 0%, #22D3EE 30%, #06B6D4 70%, transparent 100%)" }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle at 80% 20%, rgba(34,211,238,0.06) 0%, transparent 60%)" }}
      />

      <div className="relative p-8 md:p-12">
        {/* Tag row */}
        <div className="flex items-center gap-3 mb-6">
          {meta.tag && (
            <span className="font-mono text-[10px] text-[#22D3EE] uppercase tracking-widest px-2.5 py-1 rounded border border-[#22D3EE]/20 bg-[#22D3EE]/05">
              {meta.tag}
            </span>
          )}
          <span className="font-mono text-[10px] text-[#475569] uppercase tracking-widest">
            featured project
          </span>
        </div>

        {/* Two-column layout: content + terminal panel */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12">

          {/* Left: Full content */}
          <div className="space-y-6">
            <div>
              <h3
                className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[#F1F5F9] mb-3 group-hover:text-[#22D3EE] transition-colors duration-300"
              >
                {project.title}
              </h3>
              <p className="text-[#CBD5E1] text-lg leading-relaxed max-w-xl">
                {project.description}
              </p>
            </div>

            {/* Problem / Solution — asymmetric layout */}
            {meta.problem && (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-1 rounded-full bg-[#1E293B] flex-shrink-0" />
                  <div>
                    <div className="font-mono text-[10px] text-[#CBD5E1] uppercase tracking-widest mb-1.5">Problem</div>
                    <p className="text-[#CBD5E1] text-sm leading-relaxed">{meta.problem}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 rounded-full flex-shrink-0" style={{ background: "#22D3EE" }} />
                  <div>
                    <div className="font-mono text-[10px] text-[#22D3EE] uppercase tracking-widest mb-1.5">Solution</div>
                    <p className="text-[#CBD5E1] text-sm leading-relaxed">{meta.solution}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Key stat — prominent */}
            {meta.metric && (
              <div className="flex items-baseline gap-3">
                <span
                  className="font-mono font-bold text-6xl leading-none"
                  style={{ color: "#22D3EE" }}
                >
                  {meta.metric}
                </span>
                <span className="font-mono text-sm text-[#CBD5E1] uppercase tracking-widest">{meta.metricLabel}</span>
              </div>
            )}

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded font-mono text-xs text-[#CBD5E1] border border-[#3D4F6B]"
                  style={{ background: "#111827" }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex items-center gap-4 pt-1">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#22D3EE] text-[#0A0E17] text-sm font-bold hover:bg-[#06B6D4] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live site
                </a>
              )}
              {meta.github && (
                <a
                  href={meta.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#CBD5E1] text-sm font-medium hover:text-[#F1F5F9] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  View source
                </a>
              )}
            </div>
          </div>

          {/* Right: Terminal output panel */}
          {meta.terminalOutput && (
            <div className="hidden lg:block">
              <div
                className="rounded-xl overflow-hidden h-full"
                style={{
                  background: "#141E30",
                  border: "1px solid #1E293B",
                  boxShadow: "0 0 0 1px rgba(34,211,238,0.06), inset 0 0 40px rgba(0,0,0,0.4)",
                }}
              >
                {/* Terminal title bar */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5 border-b"
                  style={{ background: "#0D1117", borderColor: "#1E293B" }}
                >
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-[10px] font-mono text-[#4B5563]">reps-api — live stats</span>
                  </div>
                  <Terminal className="w-3.5 h-3.5 text-[#22D3EE]" />
                </div>

                {/* Terminal content */}
                <div className="p-5 font-mono text-[12px] leading-relaxed">
                  {meta.terminalOutput.map((line, i) => (
                    <div
                      key={i}
                      className="leading-relaxed"
                      style={{
                        color: line.startsWith('$')
                          ? "#22D3EE"
                          : line.startsWith('{') || line.startsWith('}')
                          ? "#94A3B8"
                          : line.includes(':')
                          ? "#94A3B8"
                          : line.includes('passed')
                          ? "#10B981"
                          : "#F1F5F9",
                      }}
                    >
                      {line.startsWith('$') ? (
                        <>
                          <span style={{ color: "#22D3EE" }}>$ </span>
                          <span style={{ color: "#F1F5F9" }}>{line.slice(2)}</span>
                        </>
                      ) : (
                        line
                      )}
                    </div>
                  ))}
                  {/* idle cursor */}
                  <div className="mt-2 flex items-center" style={{ color: "#22D3EE" }}>
                    <span>$ </span>
                    <span
                      className="inline-block w-[2px] h-[1em] ml-0.5 align-text-bottom cursor-blink"
                      style={{ background: "#22D3EE" }}
                    />
                  </div>
                </div>

                {/* Status bar */}
                <div
                  className="px-4 py-2 border-t flex items-center justify-between"
                  style={{ background: "#22D3EE", borderColor: "#22D3EE" }}
                >
                  <span className="font-mono text-[10px] font-bold" style={{ color: "#0A0E17" }}>LIVE</span>
                  <span className="font-mono text-[10px]" style={{ color: "#0A0E17", opacity: 0.8 }}>reps.arialabs.ai</span>
                  <span className="font-mono text-[10px]" style={{ color: "#0A0E17", opacity: 0.8 }}>json · utf-8</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects({ items }: ProjectsProps) {
  const sortedItems = [...items].sort((a, b) => b.SK.localeCompare(a.SK));

  if (!sortedItems.length) return null;

  // Hero project — first/most prominent Aria Labs project
  const HERO_TITLE = "Reps Accountability Dashboard";
  const heroItem = sortedItems.find(item => item.content.title === HERO_TITLE);

  // Featured (large cards) — other Aria Labs projects
  const FEATURED_TITLES = ["Epstein Files Explorer", "Suppr"];
  const featuredItems = sortedItems.filter(item => FEATURED_TITLES.includes(item.content.title));
  featuredItems.sort((a, b) => FEATURED_TITLES.indexOf(a.content.title) - FEATURED_TITLES.indexOf(b.content.title));

  // Rest: Nova + corporate DevOps
  const remainingItems = sortedItems.filter(item =>
    item.content.title !== HERO_TITLE && !FEATURED_TITLES.includes(item.content.title)
  );

  return (
    <section id="projects" className="relative w-full py-12 md:py-16 px-6 md:px-12" style={{ background: "#0A0E17" }}>
      {/* Dot matrix background — subtle section texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(34,211,238,0.08) 1px, transparent 0)",
        backgroundSize: "32px 32px"
      }} />
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-xs text-[#F59E0B] tracking-widest uppercase mb-2 block">01 // projects</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4" style={{ letterSpacing: "-0.03em" }}>
            Projects
          </h2>
          <p className="text-[#CBD5E1] text-lg max-w-2xl text-left">
            Civic tools, AI platforms, and infrastructure built to matter.
            The stuff I&apos;m most proud of.
          </p>
        </motion.div>

        {/* HERO project — full-width dominant card */}
        {heroItem && (
          <div className="mb-8">
            <HeroProjectCard item={heroItem} />
          </div>
        )}

        {/* Aria Labs label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-[#22D3EE] uppercase tracking-widest px-2.5 py-1 rounded border border-[#22D3EE]/30 bg-[#22D3EE]/05">
            Aria Labs
          </span>
          <div className="h-px flex-1 bg-[#1E293B]" />
        </div>

        {/* Featured large cards — other Aria Labs projects */}
        <div className="space-y-6 mb-12">
          {featuredItems.map((item, index) => {
            const project = item.content;
            const meta = PROJECT_METADATA[project.title] || {};

            return (
              <motion.article
                key={item.SK}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl border border-[#3D4F6B] overflow-hidden card-hover-glow"
                style={{ background: "#1F2B45" }}
              >
                {/* Accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${meta.accentColor || '#22D3EE'}, transparent)` }}
                />

                <div className="p-6 md:p-8 lg:p-10">
                  <div className={`grid ${meta.metric ? 'lg:grid-cols-[1fr_auto]' : ''} gap-6 lg:gap-10 items-start`}>

                    {/* Main content */}
                    <div className="space-y-5">
                      {/* Project header */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {meta.tag && (
                              <span className="font-mono text-[10px] text-[#22D3EE] uppercase tracking-widest px-2 py-0.5 rounded border border-[#22D3EE]/20 bg-[#22D3EE]/05">
                                {meta.tag}
                              </span>
                            )}
                          </div>
                          <h3 className="font-display font-bold text-2xl md:text-3xl text-[#F1F5F9] group-hover:text-[#22D3EE] transition-colors mb-2">
                            {project.title}
                          </h3>
                          <p className="text-[#94A3B8] text-sm leading-relaxed max-w-2xl">
                            {project.description}
                          </p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-[#1E293B] group-hover:text-[#22D3EE] transition-colors flex-shrink-0 mt-1" />
                      </div>

                      {/* Problem/Solution */}
                      {meta.problem && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="rounded-lg p-4 border border-[#3D4F6B]" style={{ background: "#111827" }}>
                            <div className="font-mono text-[10px] text-[#CBD5E1] uppercase tracking-widest mb-2">Problem</div>
                            <p className="text-[#CBD5E1] text-sm leading-relaxed">{meta.problem}</p>
                          </div>
                          <div className="rounded-lg p-4 border border-[#22D3EE]/15" style={{ background: "rgba(34,211,238,0.03)" }}>
                            <div className="font-mono text-[10px] text-[#22D3EE] uppercase tracking-widest mb-2">Solution</div>
                            <p className="text-[#CBD5E1] text-sm leading-relaxed">{meta.solution}</p>
                          </div>
                        </div>
                      )}

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded font-mono text-xs text-[#CBD5E1] border border-[#3D4F6B]"
                            style={{ background: "#111827" }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-4">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-sm font-medium hover:bg-[#22D3EE]/20 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live site
                          </a>
                        )}
                        {meta.github && (
                          <a
                            href={meta.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#CBD5E1] text-sm font-medium hover:text-[#F1F5F9] transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            View source
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Metric callout */}
                    {meta.metric && (
                      <div
                        className="flex-shrink-0 rounded-xl border border-[#22D3EE]/20 p-6 text-center min-w-[160px]"
                        style={{ background: "rgba(34,211,238,0.04)" }}
                      >
                        <div
                          className="font-mono font-bold text-5xl leading-none mb-2"
                          style={{ color: meta.accentColor || '#22D3EE' }}
                        >
                          {meta.metric}
                        </div>
                        <div className="font-mono text-[11px] text-[#CBD5E1] uppercase tracking-widest">
                          {meta.metricLabel}
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#3D4F6B]">
                          <div className="font-mono text-[10px] text-[#CBD5E1] uppercase tracking-widest">
                            {project.date}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Remaining projects — smaller grid */}
        {remainingItems.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-xs text-[#475569] uppercase tracking-widest px-2.5 py-1 rounded border border-[#475569]/30">
                Infrastructure &amp; DevOps
              </span>
              <div className="h-px flex-1 bg-[#1E293B]" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {remainingItems.map((item, index) => {
                const project = item.content;
                const meta = PROJECT_METADATA[project.title] || {};

                return (
                  <motion.article
                    key={item.SK}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="group relative rounded-xl border border-[#3D4F6B] p-6 card-hover-glow"
                    style={{ background: "#1F2B45" }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display font-semibold text-xl text-[#F1F5F9] group-hover:text-[#22D3EE] transition-colors">
                        {project.title}
                      </h3>
                      {meta.metric && (
                        <span className="font-mono text-lg font-bold text-[#22D3EE] ml-4 flex-shrink-0">
                          {meta.metric}
                          <span className="text-[#CBD5E1] text-xs ml-1">{meta.metricLabel}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies?.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded font-mono text-xs text-[#CBD5E1] border border-[#3D4F6B]"
                          style={{ background: "#111827" }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#22D3EE] text-xs font-medium hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Live site
                        </a>
                      )}
                      {meta.github && (
                        <a
                          href={meta.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#CBD5E1] text-xs font-medium hover:text-[#F1F5F9] transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Source
                        </a>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
