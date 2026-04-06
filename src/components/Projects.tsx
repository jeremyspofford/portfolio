"use client";

import { ExternalLink, Github, ArrowUpRight, BookOpen } from "lucide-react";
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
  docs?: string;
  accentColor?: string;
  tag?: string;
  isHero?: boolean;
}> = {
  "Reps Accountability Dashboard": {
    metric: "535",
    metricLabel: "reps tracked",
    problem: "Voting records, campaign finance, and scandals are buried across dozens of government sites — by design.",
    solution: "Real-time dashboard tracking every U.S. Congress member. Votes, bills, campaign finance, known scandals. 615 tests. Democracy shouldn't be paywalled.",
    github: "https://github.com/arialabs/accountability-dashboard",
    accentColor: "#22D3EE",
    tag: "Aria Labs POC",
    isHero: true,
  },
  "Epstein Files Explorer": {
    metric: "91%",
    metricLabel: "photo coverage",
    problem: "Court-released documents were scattered across hundreds of PDFs — no search, no structure, no accountability.",
    solution: "Full-text search engine for court documents with connection graphs, flight logs, and a 70+ person network map. Victim privacy protections built in from day one.",
    github: "https://github.com/arialabs/epstein-files",
    accentColor: "#F59E0B",
    tag: "Aria Labs POC",
  },
  "Suppr": {
    metric: "72h",
    metricLabel: "to MVP",
    problem: "Social media optimizes for outrage, not connection. People eat alone in cities full of strangers.",
    solution: "Social dining app connecting people through shared meals. Find your next dinner companion. Built for real community — not engagement metrics.",
    accentColor: "#10B981",
    tag: "Aria Labs POC",
  },
  "Nova AI Platform": {
    metric: "10",
    metricLabel: "services",
    problem: "AI assistants forget everything between sessions — no memory, no personalization, no continuity. And every \"AI wrapper\" is just an API call with a system prompt.",
    solution: "Self-directed autonomous platform. Define a goal — Nova decomposes it, executes through a 5-agent pipeline with guardrails and code review, and completes with minimal intervention. Brain-inspired Engram memory with spreading activation, Hebbian consolidation, and a working memory gate that curates context like a desk, not a transcript.",
    github: "https://github.com/arialabs/nova",
    docs: "https://arialabs.ai/nova/",
    accentColor: "#22D3EE",
    tag: "Aria Labs POC",
  },
};

// ─── PROJECT MOCKUP COMPONENTS ───────────────────────────────────────────────

/** Browser chrome wrapper used by multiple mockups */
function BrowserChrome({
  url,
  children,
  accentColor = "#22D3EE",
}: {
  url: string;
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden w-full h-full flex flex-col"
      style={{
        background: "#0D1117",
        border: "1px solid #1E293B",
        boxShadow: "0 0 0 1px rgba(34,211,238,0.06), 0 12px 40px rgba(0,0,0,0.5)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-b flex-shrink-0"
        style={{ background: "#161B27", borderColor: "#1E293B" }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        </div>
        {/* URL bar */}
        <div
          className="flex-1 mx-2 px-3 py-1 rounded text-[11px] font-mono flex items-center gap-1.5"
          style={{ background: "#0A0E17", color: "#94A3B8", border: "1px solid #1E293B" }}
        >
          <span style={{ color: accentColor, opacity: 0.8 }}>🔒</span>
          {url}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/** Reps Accountability Dashboard mockup */
function RepsMockup() {
  const reps = [
    { name: "Nancy Pelosi", party: "D", state: "CA", grade: "B+" },
    { name: "Mitch McConnell", party: "R", state: "KY", grade: "C-" },
    { name: "AOC", party: "D", state: "NY", grade: "A-" },
    { name: "Ted Cruz", party: "R", state: "TX", grade: "D+" },
  ];

  return (
    <BrowserChrome url="reps.arialabs.ai" accentColor="#0F766E">
      <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
        {/* Header */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between" style={{ background: "#fff", borderBottom: "1px solid #E2E8F0" }}>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded" style={{ background: "#0F766E" }} />
            <span className="font-semibold text-[12px]" style={{ color: "#0F766E", fontFamily: "Georgia, serif" }}>
              Reps Accountability
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "#0F766E", color: "#fff" }}>
            LIVE
          </span>
        </div>

        {/* Search bar */}
        <div className="px-3 pt-2 pb-1.5">
          <div
            className="w-full px-3 py-1.5 rounded text-[11px] flex items-center gap-2"
            style={{ background: "#fff", border: "1px solid #CBD5E1", color: "#94A3B8" }}
          >
            <span>🔍</span>
            <span>Search representatives…</span>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden px-3 pb-2">
          <table className="w-full text-[10px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                <th className="text-left py-1 font-mono uppercase tracking-wider" style={{ color: "#64748B", fontSize: "9px" }}>Name</th>
                <th className="text-left py-1 font-mono uppercase tracking-wider" style={{ color: "#64748B", fontSize: "9px" }}>Party</th>
                <th className="text-left py-1 font-mono uppercase tracking-wider" style={{ color: "#64748B", fontSize: "9px" }}>State</th>
                <th className="text-right py-1 font-mono uppercase tracking-wider" style={{ color: "#64748B", fontSize: "9px" }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {reps.map((rep) => (
                <tr key={rep.name} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td className="py-1.5" style={{ color: "#1E293B", fontSize: "10px", fontFamily: "Georgia, serif" }}>{rep.name}</td>
                  <td className="py-1.5">
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                      style={{
                        background: rep.party === "D" ? "#DBEAFE" : "#FEE2E2",
                        color: rep.party === "D" ? "#1D4ED8" : "#DC2626",
                      }}
                    >
                      {rep.party}
                    </span>
                  </td>
                  <td className="py-1.5 font-mono" style={{ color: "#64748B", fontSize: "9px" }}>{rep.state}</td>
                  <td className="py-1.5 text-right">
                    <span
                      className="font-bold text-[11px]"
                      style={{
                        color: rep.grade.startsWith("A") ? "#0F766E" : rep.grade.startsWith("B") ? "#0369A1" : rep.grade.startsWith("C") ? "#B45309" : "#DC2626",
                      }}
                    >
                      {rep.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mini stats bar */}
        <div
          className="px-3 py-2 flex items-center justify-between"
          style={{ background: "#0F766E", color: "#fff" }}
        >
          <span className="text-[9px] font-mono">535 reps · 48,291 votes</span>
          <div className="flex gap-1">
            {[40, 60, 35, 75, 50].map((h, i) => (
              <div
                key={i}
                className="w-2 rounded-sm"
                style={{ height: `${h * 0.18}rem`, background: "rgba(255,255,255,0.6)", alignSelf: "flex-end" }}
              />
            ))}
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

/** Epstein Files Explorer mockup */
function EpsteinMockup() {
  const people = [
    { name: "Jeffrey Epstein", role: "Central" },
    { name: "Ghislaine Maxwell", role: "Associate" },
    { name: "Alan Dershowitz", role: "Attorney" },
    { name: "Prince Andrew", role: "Associate" },
  ];

  // Simple connection graph using SVG
  const nodes = [
    { id: 0, x: 80, y: 60, label: "JE", main: true },
    { id: 1, x: 160, y: 30, label: "GM", main: false },
    { id: 2, x: 170, y: 90, label: "AD", main: false },
    { id: 3, x: 80, y: 110, label: "PA", main: false },
    { id: 4, x: 30, y: 40, label: "BG", main: false },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3],
  ];

  return (
    <BrowserChrome url="epstein.arialabs.ai" accentColor="#F59E0B">
      <div className="h-full flex" style={{ background: "#0C0F14" }}>
        {/* Sidebar */}
        <div className="w-28 flex-shrink-0 border-r flex flex-col" style={{ borderColor: "#1A2234" }}>
          <div className="px-2 py-2 border-b" style={{ borderColor: "#1A2234" }}>
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#F59E0B" }}>Network</span>
          </div>
          {people.map((p) => (
            <div
              key={p.name}
              className="px-2 py-1.5 border-b"
              style={{ borderColor: "#0F1420" }}
            >
              <div className="text-[10px] leading-tight" style={{ color: "#E2E8F0" }}>{p.name}</div>
              <div className="text-[9px] font-mono" style={{ color: "#F59E0B", opacity: 0.7 }}>{p.role}</div>
            </div>
          ))}
        </div>

        {/* Connection graph area */}
        <div className="flex-1 flex flex-col">
          <div className="px-2 py-1.5 border-b flex items-center gap-2" style={{ borderColor: "#1A2234" }}>
            <span className="text-[9px] font-mono" style={{ color: "#94A3B8" }}>Connection graph · 70+ persons</span>
          </div>
          <div className="flex-1 flex items-center justify-center p-2">
            <svg width="200" height="130" viewBox="0 0 200 130">
              {/* Edges */}
              {edges.map(([a, b], i) => (
                <line
                  key={i}
                  x1={nodes[a].x}
                  y1={nodes[a].y}
                  x2={nodes[b].x}
                  y2={nodes[b].y}
                  stroke="#F59E0B"
                  strokeWidth="0.8"
                  strokeOpacity="0.3"
                />
              ))}
              {/* Nodes */}
              {nodes.map((n) => (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.main ? 14 : 9}
                    fill={n.main ? "#F59E0B" : "#1A2234"}
                    stroke={n.main ? "#F59E0B" : "#F59E0B"}
                    strokeWidth={n.main ? 0 : 1}
                    strokeOpacity={n.main ? 1 : 0.5}
                  />
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={n.main ? "7" : "6"}
                    fill={n.main ? "#0C0F14" : "#F59E0B"}
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="px-2 py-1.5 border-t flex items-center gap-3" style={{ borderColor: "#1A2234" }}>
            <span className="text-[9px] font-mono" style={{ color: "#F59E0B" }}>Full-text search</span>
            <span className="text-[9px] font-mono" style={{ color: "#475569" }}>· flight logs · court docs</span>
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

/** Suppr phone mockup */
function SupprMockup() {
  return (
    <div className="flex items-center justify-center h-full py-2">
      {/* Phone frame */}
      <div
        className="relative rounded-[28px] overflow-hidden flex-shrink-0"
        style={{
          width: "180px",
          height: "320px",
          background: "#1E293B",
          border: "6px solid #334155",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Dynamic island */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full z-10"
          style={{ width: "60px", height: "12px", background: "#0A0E17" }}
        />

        {/* Screen */}
        <div className="w-full h-full overflow-hidden" style={{ background: "#FEFCE8" }}>
          {/* Status bar */}
          <div className="pt-6 px-3 flex justify-between items-center">
            <span className="text-[8px] font-bold" style={{ color: "#1E293B" }}>9:41</span>
            <div className="flex gap-1">
              <span style={{ color: "#1E293B", fontSize: "8px" }}>●●●●</span>
            </div>
          </div>

          {/* App header */}
          <div className="px-3 pt-2 pb-1.5 flex items-center justify-between">
            <span className="font-bold text-[14px]" style={{ color: "#1E293B", fontFamily: "Georgia, serif" }}>suppr</span>
            <span className="text-[10px]">🍽️</span>
          </div>

          {/* Subtitle */}
          <div className="px-3 mb-2">
            <span className="text-[9px]" style={{ color: "#78716C" }}>Near you · Tonight</span>
          </div>

          {/* Meal card */}
          <div className="mx-3 rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E7E5E4", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            {/* Food image area */}
            <div
              className="w-full flex items-center justify-center"
              style={{ height: "80px", background: "linear-gradient(135deg, #FED7AA, #FDBA74)", fontSize: "36px" }}
            >
              🥘
            </div>

            {/* Card body */}
            <div className="p-2.5">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="font-semibold text-[11px]" style={{ color: "#1E293B", fontFamily: "Georgia, serif" }}>
                    Spanish Paella Night
                  </div>
                  <div className="text-[9px]" style={{ color: "#78716C" }}>Hosted by Maria S.</div>
                </div>
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "#DCFCE7", color: "#16A34A" }}
                >
                  4 spots left
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[8px]" style={{ color: "#78716C" }}>📍 Brooklyn, NY</span>
                <span className="text-[8px]" style={{ color: "#78716C" }}>· Sat 7pm</span>
              </div>

              <button
                className="mt-2 w-full py-1.5 rounded-lg text-[10px] font-bold"
                style={{ background: "#10B981", color: "#fff" }}
              >
                Join dinner →
              </button>
            </div>
          </div>

          {/* Bottom tabs */}
          <div
            className="absolute bottom-0 left-0 right-0 flex justify-around py-2 border-t"
            style={{ background: "#fff", borderColor: "#F1F5F9" }}
          >
            {["🏠", "🔍", "💬", "👤"].map((icon, i) => (
              <span key={i} style={{ fontSize: "14px", opacity: i === 0 ? 1 : 0.4 }}>{icon}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HERO PROJECT CARD ────────────────────────────────────────────────────────

function HeroProjectCard({ item, mockup }: { item: ContentItem<StandaloneProjectContent>; mockup?: React.ReactNode }) {
  const project = item.content;
  const meta = PROJECT_METADATA[project.title] || {};

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="group relative rounded-2xl border border-[#22D3EE]/20 overflow-hidden card-hover-glow card-depth"
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

        {/* Two-column layout: content + mockup */}
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

            {/* Problem / Solution */}
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

            {/* Key stat */}
            {meta.metric && (
              <div className="flex items-baseline gap-3">
                <span className="font-mono font-bold text-6xl leading-none" style={{ color: "#22D3EE" }}>
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
              {meta.docs && (
                <a
                  href={meta.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#22D3EE]/40 text-[#22D3EE] text-sm font-bold hover:bg-[#22D3EE]/10 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Docs
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

          {/* Right: mockup */}
          {mockup && (
            <div className="hidden lg:flex flex-col" style={{ minHeight: "340px" }}>
              {mockup}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── FEATURED PROJECT CARD (Epstein + Suppr) ─────────────────────────────────

function FeaturedCard({
  item,
  index,
  mockup,
  flipped = false,
}: {
  item: ContentItem<StandaloneProjectContent>;
  index: number;
  mockup: React.ReactNode;
  flipped?: boolean;
}) {
  const project = item.content;
  const meta = PROJECT_METADATA[project.title] || {};

  const textContent = (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {meta.tag && (
              <span
                className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border"
                style={{
                  color: meta.accentColor || '#22D3EE',
                  borderColor: `${meta.accentColor || '#22D3EE'}33`,
                  background: `${meta.accentColor || '#22D3EE'}0D`,
                }}
              >
                {meta.tag}
              </span>
            )}
          </div>
          <h3
            className="font-display font-bold text-2xl md:text-3xl text-[#F1F5F9] transition-colors mb-2"
            style={{ ['--tw-text-opacity' as string]: 1 }}
          >
            <span className="group-hover:text-[var(--accent)]" style={{ ['--accent' as string]: meta.accentColor || '#22D3EE' } as React.CSSProperties}>
              {project.title}
            </span>
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
          <div
            className="rounded-lg p-4 border"
            style={{
              background: `${meta.accentColor || '#22D3EE'}08`,
              borderColor: `${meta.accentColor || '#22D3EE'}25`,
            }}
          >
            <div
              className="font-mono text-[10px] uppercase tracking-widest mb-2"
              style={{ color: meta.accentColor || '#22D3EE' }}
            >
              Solution
            </div>
            <p className="text-[#CBD5E1] text-sm leading-relaxed">{meta.solution}</p>
          </div>
        </div>
      )}

      {/* Metric */}
      {meta.metric && (
        <div className="flex items-baseline gap-3">
          <span className="font-mono font-bold text-4xl leading-none" style={{ color: meta.accentColor || '#22D3EE' }}>
            {meta.metric}
          </span>
          <span className="font-mono text-xs text-[#CBD5E1] uppercase tracking-widest">{meta.metricLabel}</span>
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
            style={{
              background: `${meta.accentColor || '#22D3EE'}1A`,
              borderColor: `${meta.accentColor || '#22D3EE'}4D`,
              color: meta.accentColor || '#22D3EE',
            }}
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
  );

  const mockupContent = (
    <div className="hidden lg:block" style={{ height: "340px" }}>
      {mockup}
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl border border-[#3D4F6B] overflow-hidden card-hover-glow card-depth"
      style={{ background: "#1F2B45" }}
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${meta.accentColor || '#22D3EE'}, transparent)` }}
      />

      <div className="p-6 md:p-8 lg:p-10">
        {flipped ? (
          <div className="grid lg:grid-cols-[360px_1fr] gap-6 lg:gap-10 items-start">
            {mockupContent}
            {textContent}
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-10 items-start">
            {textContent}
            {mockupContent}
          </div>
        )}
      </div>
    </motion.article>
  );
}

/** Nova AI Platform architecture diagram mockup */
function NovaMockup() {
  const services = [
    { name: "Orchestrator", color: "#10B981", desc: "5-agent pipeline, MCP" },
    { name: "LLM Gateway", color: "#3B82F6", desc: "12+ providers, WoL" },
    { name: "Memory", color: "#A855F7", desc: "engram graph, pgvector" },
    { name: "Neural Router", color: "#F97316", desc: "PyTorch re-ranker" },
    { name: "Cortex", color: "#EC4899", desc: "autonomous drives" },
    { name: "Chat API", color: "#6366F1", desc: "WebSocket streaming" },
    { name: "Chat Bridge", color: "#14B8A6", desc: "Telegram + Discord" },
    { name: "Recovery", color: "#EF4444", desc: "backup + health" },
    { name: "Dashboard", color: "#F59E0B", desc: "React admin UI" },
    { name: "Website", color: "#8B5CF6", desc: "docs + landing" },
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
      <div className="flex-1 p-3 grid grid-cols-5 gap-1.5 content-start" style={{ color: "#94A3B8" }}>
        {services.map((svc) => (
          <div
            key={svc.name}
            className="rounded-lg p-2 border flex flex-col gap-1"
            style={{
              background: `${svc.color}08`,
              borderColor: `${svc.color}30`,
            }}
          >
            <div className="flex items-center gap-1">
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: svc.color }}
              />
              <span
                className="text-[8px] font-mono font-semibold truncate"
                style={{ color: svc.color }}
              >
                {svc.name}
              </span>
            </div>
            <span className="text-[7px] font-mono text-[#64748B] leading-tight">
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
        <span className="font-mono text-[11px] font-bold" style={{ color: "#0A0E17" }}>10 SERVICES</span>
        <span className="font-mono text-[11px]" style={{ color: "#0A0E17", opacity: 0.8 }}>
          docker compose · GPU overlay
        </span>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function Projects({ items }: ProjectsProps) {
  const sortedItems = [...items].sort((a, b) => b.SK.localeCompare(a.SK));

  if (!sortedItems.length) return null;

  const HERO_TITLE = "Nova AI Platform";
  const heroItem = sortedItems.find(item => item.content.title === HERO_TITLE);

  const FEATURED_TITLES = ["Reps Accountability Dashboard", "Epstein Files Explorer", "Suppr"];
  const featuredItems = sortedItems.filter(item => FEATURED_TITLES.includes(item.content.title));
  featuredItems.sort((a, b) => FEATURED_TITLES.indexOf(a.content.title) - FEATURED_TITLES.indexOf(b.content.title));

  // Work projects = everything that isn't Aria Labs
  const ARIA_LABS_TITLES = [HERO_TITLE, ...FEATURED_TITLES];
  const workItems = sortedItems.filter(item => !ARIA_LABS_TITLES.includes(item.content.title));

  const MOCKUPS: Record<string, React.ReactNode> = {
    "Reps Accountability Dashboard": <RepsMockup />,
    "Epstein Files Explorer": <EpsteinMockup />,
    "Suppr": <SupprMockup />,
    "Nova AI Platform": <NovaMockup />,
  };

  return (
    <section id="projects" className="relative w-full py-12 md:py-16 px-6 md:px-12" style={{ background: "#0A0E17" }}>
      {/* Dot matrix background */}
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

        {/* Aria Labs POC label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-[#22D3EE] uppercase tracking-widest px-2.5 py-1 rounded border border-[#22D3EE]/30 bg-[#22D3EE]/05">
            Aria Labs POC
          </span>
          <div className="h-px flex-1 bg-[#1E293B]" />
        </div>

        {/* Nova hero card */}
        {heroItem && (
          <div className="mb-6">
            <HeroProjectCard item={heroItem} mockup={MOCKUPS[heroItem.content.title]} />
          </div>
        )}

        {/* Featured cards — Reps, Epstein, Suppr */}
        <div className="space-y-6 mb-16">
          {featuredItems.map((item, index) => (
            <FeaturedCard
              key={item.SK}
              item={item}
              index={index}
              mockup={MOCKUPS[item.content.title]}
              flipped={item.content.title === "Epstein Files Explorer"}
            />
          ))}
        </div>

        {/* Professional Work label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-[#F59E0B] uppercase tracking-widest px-2.5 py-1 rounded border border-[#F59E0B]/30 bg-[#F59E0B]/05">
            Professional Work
          </span>
          <div className="h-px flex-1 bg-[#1E293B]" />
        </div>

        {/* Work project cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {workItems.map((item, index) => (
            <motion.article
              key={item.SK}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-xl border border-[#3D4F6B] p-6 card-hover-glow card-depth"
              style={{ background: "#1F2B45" }}
            >
              <h3 className="font-display font-semibold text-lg text-[#F1F5F9] mb-2">
                {item.content.title}
              </h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
                {item.content.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.content.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded font-mono text-[11px] text-[#CBD5E1] border border-[#3D4F6B]"
                    style={{ background: "#111827" }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
