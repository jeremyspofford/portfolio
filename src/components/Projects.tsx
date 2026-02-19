"use client";

import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
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
  featured?: boolean;
  accentColor?: string;
}> = {
  "Rep Accountability Dashboard": {
    metric: "1,614",
    metricLabel: "reps tracked",
    problem: "How do you hold elected officials accountable when voting records are buried?",
    solution: "Built a real-time dashboard indexing every vote, bill, and statement from all U.S. representatives — searchable, sortable, shareable.",
    github: "https://github.com/jeremyspofford",
    featured: true,
    accentColor: "#22D3EE",
  },
  "Epstein Files Explorer": {
    metric: "2,100+",
    metricLabel: "documents indexed",
    problem: "Court-released documents were scattered across hundreds of PDFs with no search.",
    solution: "Processed and indexed 2,100+ pages with full-text search, letting anyone find specific mentions in seconds.",
    github: "https://github.com/jeremyspofford",
    featured: true,
    accentColor: "#22D3EE",
  },
  "Suppr": {
    metric: "72h",
    metricLabel: "build time",
    problem: "Social media shows what people want you to see — not what they actually said.",
    solution: "Built in 72 hours at a hackathon: an archive tool that captures and preserves social posts before they're deleted.",
    github: "https://github.com/jeremyspofford",
    featured: true,
    accentColor: "#10B981",
  },
  "JobHunter": {
    metric: "10x",
    metricLabel: "faster job matching",
    problem: "Job searching is a manual slog through dozens of mismatched listings.",
    solution: "AI-powered agent that parses job postings, matches them against your skills, and ranks by fit score — built with AWS Bedrock + Claude.",
    github: "https://github.com/jeremyspofford",
    featured: false,
    accentColor: "#22D3EE",
  },
  "Aria Labs Dashboard": {
    metric: "5+",
    metricLabel: "tools deployed",
    problem: "No central command for managing multiple AI assistants and civic tools.",
    solution: "Internal platform for managing deployments, monitoring assistant conversations, and aggregating metrics across all Aria Labs products.",
    github: "https://github.com/jeremyspofford",
    featured: false,
    accentColor: "#10B981",
  },
};

export function Projects({ items }: ProjectsProps) {
  const sortedItems = [...items].sort((a, b) => b.SK.localeCompare(a.SK));

  if (!sortedItems.length) return null;

  const featuredItems = sortedItems.slice(0, 3);
  const remainingItems = sortedItems.slice(3);

  return (
    <section id="projects" className="w-full py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[#22D3EE] text-sm">02.</span>
            <div className="h-px flex-1 max-w-[60px] bg-[#22D3EE]/30" />
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4">
            Projects
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl">
            The stuff I&apos;m most proud of — civic tools, AI-powered automation,
            and infrastructure built to last.
          </p>
        </div>

        {/* Featured large cards (top 3) */}
        <div className="space-y-6 mb-6">
          {featuredItems.map((item, index) => {
            const project = item.content;
            const meta = PROJECT_METADATA[project.title] || {};
            const isEven = index % 2 === 0;

            return (
              <motion.article
                key={item.SK}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl border border-[#1E293B] overflow-hidden card-hover-glow"
                style={{ background: "#1A1F2E" }}
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
                          <h3 className="font-display font-bold text-2xl md:text-3xl text-[#F1F5F9] group-hover:text-[#22D3EE] transition-colors mb-2">
                            {project.title}
                          </h3>
                          <p className="text-[#94A3B8] text-base leading-relaxed max-w-2xl">
                            {project.description}
                          </p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-[#1E293B] group-hover:text-[#22D3EE] transition-colors flex-shrink-0 mt-1" />
                      </div>

                      {/* Problem/Solution */}
                      {meta.problem && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="rounded-lg p-4 border border-[#1E293B]" style={{ background: "#111827" }}>
                            <div className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-widest mb-2">Problem</div>
                            <p className="text-[#94A3B8] text-sm leading-relaxed">{meta.problem}</p>
                          </div>
                          <div className="rounded-lg p-4 border border-[#22D3EE]/15" style={{ background: "rgba(34,211,238,0.03)" }}>
                            <div className="font-mono text-[10px] text-[#22D3EE] uppercase tracking-widest mb-2">Solution</div>
                            <p className="text-[#94A3B8] text-sm leading-relaxed">{meta.solution}</p>
                          </div>
                        </div>
                      )}

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded font-mono text-xs text-[#94A3B8] border border-[#1E293B]"
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
                            Live demo
                          </a>
                        )}
                        {meta.github && (
                          <a
                            href={meta.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#94A3B8] text-sm font-medium hover:text-[#F1F5F9] transition-colors"
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
                        <div className="font-mono text-[11px] text-[#94A3B8] uppercase tracking-widest">
                          {meta.metricLabel}
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#1E293B]">
                          <div className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-widest">
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
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {remainingItems.map((item, index) => {
              const project = item.content;
              const meta = PROJECT_METADATA[project.title] || {};

              return (
                <motion.article
                  key={item.SK}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative rounded-xl border border-[#1E293B] p-6 card-hover-glow"
                  style={{ background: "#1A1F2E" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-semibold text-xl text-[#F1F5F9] group-hover:text-[#22D3EE] transition-colors">
                      {project.title}
                    </h3>
                    {meta.metric && (
                      <span className="font-mono text-lg font-bold text-[#22D3EE] ml-4">
                        {meta.metric}
                        <span className="text-[#94A3B8] text-xs ml-1">{meta.metricLabel}</span>
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
                        className="px-2 py-0.5 rounded font-mono text-xs text-[#94A3B8] border border-[#1E293B]"
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
                        Live demo
                      </a>
                    )}
                    {meta.github && (
                      <a
                        href={meta.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#94A3B8] text-xs font-medium hover:text-[#F1F5F9] transition-colors"
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
        )}
      </div>
    </section>
  );
}
