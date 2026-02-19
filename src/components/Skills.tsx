"use client";

import { motion } from "framer-motion";
import type { SkillContent } from '@/lib/api';

interface SkillItem {
  PK: string;
  SK: string;
  content: SkillContent;
}

interface SkillsProps {
  items: SkillItem[];
}

// Static tier definitions — monochrome, compact
const SKILL_TIERS = [
  {
    tier: "Expert",
    label: "Expert",
    description: "Production-grade, 5+ years",
    color: "#22D3EE",
    dimColor: "rgba(34,211,238,0.12)",
    borderColor: "rgba(34,211,238,0.25)",
    skills: [
      "AWS", "Terraform", "Kubernetes", "Docker", "Linux",
      "CI/CD", "Python", "Bash", "Git", "CloudFormation",
      "GitHub Actions", "IAM & Security",
    ],
  },
  {
    tier: "Proficient",
    label: "Proficient",
    description: "Shipped to production, 2-4 years",
    color: "#94A3B8",
    dimColor: "rgba(148,163,184,0.08)",
    borderColor: "rgba(148,163,184,0.2)",
    skills: [
      "GCP", "Azure DevOps", "Ansible", "Prometheus", "Grafana",
      "PostgreSQL", "Redis", "TypeScript", "Next.js", "Nginx",
      "Datadog", "EKS", "GKE", "LLM APIs", "pgvector", "Semantic Search",
    ],
  },
  {
    tier: "Familiar",
    label: "Familiar",
    description: "Used in projects, learning",
    color: "#475569",
    dimColor: "rgba(71,85,105,0.06)",
    borderColor: "rgba(71,85,105,0.18)",
    skills: [
      "Rust", "Go", "Pulumi", "Vault", "Consul",
      "ArgoCD", "Istio", "ClickHouse", "Kafka", "dbt", "RAG", "Fine-tuning",
    ],
  },
];

export function Skills({ items }: SkillsProps) {
  // Build a flat skill map from API data (for proficiency %)
  const apiSkillMap: Record<string, number> = {};
  items.forEach((item) => {
    item.content.items.forEach((skill) => {
      if (item.content.proficiency) {
        apiSkillMap[skill] = item.content.proficiency;
      }
    });
  });

  return (
    <section id="skills" className="w-full py-20 md:py-32 px-6 md:px-12 scroll-mt-20" style={{ background: "#111827" }}>
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[#22D3EE] text-sm">02.</span>
            <div className="h-px flex-1 max-w-[60px] bg-[#22D3EE]/30" />
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4">
            Stack
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl">
            12+ years deep. Here&apos;s an honest breakdown of what I can do at what level.
          </p>
        </div>

        {/* Tier list */}
        <div className="space-y-6">
          {SKILL_TIERS.map((tier, tierIndex) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: tierIndex * 0.1 }}
              className="rounded-xl border overflow-hidden"
              style={{
                background: "#1A1F2E",
                borderColor: tier.borderColor,
              }}
            >
              {/* Tier header row */}
              <div
                className="flex items-center gap-4 px-5 py-4 border-b"
                style={{
                  background: tier.dimColor,
                  borderColor: tier.borderColor,
                }}
              >
                {/* Tier label */}
                <div
                  className="font-mono font-bold text-sm tracking-widest uppercase px-3 py-1 rounded"
                  style={{
                    color: tier.color,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${tier.borderColor}`,
                  }}
                >
                  {tier.label}
                </div>
                <span
                  className="font-mono text-xs"
                  style={{ color: tier.color, opacity: 0.7 }}
                >
                  {tier.description}
                </span>
              </div>

              {/* Skills row */}
              <div className="px-5 py-4 flex flex-wrap gap-2">
                {tier.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-xs px-2.5 py-1.5 rounded transition-all duration-200 cursor-default"
                    style={{
                      color: tier.color,
                      background: tier.dimColor,
                      border: `1px solid ${tier.borderColor}`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick-read summary bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 grid grid-cols-3 gap-4"
        >
          {[
            { value: "12+", label: "Years shipping infra" },
            { value: "AWS + GCP", label: "Primary cloud platforms" },
            { value: "IaC-first", label: "Philosophy" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#1E293B] p-4 text-center"
              style={{ background: "#1A1F2E" }}
            >
              <div className="font-mono font-bold text-xl text-[#22D3EE] mb-1">{stat.value}</div>
              <div className="font-mono text-[11px] text-[#94A3B8] uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
