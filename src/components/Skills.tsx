"use client";

import { motion } from "framer-motion";
import {
  Terminal, Cloud, Database, Cpu, Globe, Code, Layers, Shield, Box, Server, Workflow
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SkillContent } from '@/lib/api';

interface SkillItem {
  PK: string;
  SK: string;
  content: SkillContent;
}

interface SkillsProps {
  items: SkillItem[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  cloud: Cloud,
  terminal: Terminal,
  database: Database,
  cpu: Cpu,
  globe: Globe,
  code: Code,
  layers: Layers,
  shield: Shield,
  box: Box,
  server: Server,
  workflow: Workflow,
};

function getIcon(name?: string): LucideIcon {
  return (name && ICON_MAP[name.toLowerCase()]) || Server;
}

export function Skills({ items }: SkillsProps) {
  return (
    <section id="skills" className="w-full py-20 md:py-32 px-6 md:px-12 scroll-mt-20" style={{ background: "#111827" }}>
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[#22D3EE] text-sm">03.</span>
            <div className="h-px flex-1 max-w-[60px] bg-[#22D3EE]/30" />
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4">
            Technical Skills
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl">
            12+ years deep in infrastructure, automation, and cloud. Here&apos;s the toolkit.
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((skill, index) => {
            const Icon = getIcon(skill.content.icon);
            return (
              <motion.div
                key={skill.SK}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="group rounded-xl border border-[#1E293B] p-6 card-hover-glow"
                style={{ background: "#1A1F2E" }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg border border-[#1E293B]" style={{ background: "#111827" }}>
                    <Icon className="w-5 h-5 text-[#94A3B8] group-hover:text-[#22D3EE] transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-[#F1F5F9] text-base truncate">
                      {skill.content.category}
                    </h3>
                    {skill.content.proficiency && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "#1E293B" }}>
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${skill.content.proficiency}%`,
                              background: "linear-gradient(90deg, #22D3EE, #06B6D4)",
                            }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-[#94A3B8] flex-shrink-0">
                          {skill.content.proficiency}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {skill.content.description && (
                  <p className="text-[#94A3B8] text-xs leading-relaxed mb-4">
                    {skill.content.description}
                  </p>
                )}

                {/* Skill chips — monochrome */}
                <div className="flex flex-wrap gap-2">
                  {skill.content.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded font-mono text-xs text-[#94A3B8] border border-[#1E293B] hover:border-[#22D3EE]/40 hover:text-[#F1F5F9] transition-colors cursor-default"
                      style={{ background: "#111827" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
