"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { SkillContent, CertificationContent } from '@/lib/api';
import type { ContentItem } from '@/lib/api';

interface SkillItem {
  PK: string;
  SK: string;
  content: SkillContent;
}

interface SkillsProps {
  items: SkillItem[];
  certifications?: ContentItem<CertificationContent>[];
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

export function Skills({ items, certifications = [] }: SkillsProps) {
  const activeCerts = certifications.filter(c => c.content.active);
  const allCerts = [...certifications].sort((a, b) => b.SK.localeCompare(a.SK));

  return (
    <section id="skills" className="w-full py-12 md:py-16 px-6 md:px-12 scroll-mt-20" style={{ background: "#182240" }}>
      <div className="max-w-7xl mx-auto">

        {/* Section header — terminal style */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[#22D3EE] text-sm">02.</span>
            <div className="h-px flex-1 max-w-[60px] bg-[#22D3EE]/30" />
            <span className="font-mono text-[10px] text-[#475569] uppercase tracking-widest">stack --honest</span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4" style={{ letterSpacing: "-0.03em" }}>
            Stack
          </h2>
          <p className="text-[#CBD5E1] text-lg max-w-2xl">
            12+ years deep. Here&apos;s an honest breakdown of what I can do at what level.
          </p>
        </motion.div>

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
                background: "#1F2B45",
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

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { value: "12+", label: "Years shipping infra" },
            { value: "AWS + GCP", label: "Primary cloud platforms" },
            { value: "IaC-first", label: "Philosophy" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#3D4F6B] p-4 text-center"
              style={{ background: "#1F2B45" }}
            >
              <div className="font-mono font-bold text-xl text-[#22D3EE] mb-1">{stat.value}</div>
              <div className="font-mono text-[11px] text-[#CBD5E1] uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Certifications — integrated as badges */}
        {allCerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-10"
          >
            {/* Divider with terminal label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-[#1E293B]" />
              <span className="font-mono text-[10px] text-[#475569] uppercase tracking-widest px-3">
                certifications --verified
              </span>
              <div className="h-px flex-1 bg-[#1E293B]" />
            </div>

            <div className="flex flex-wrap gap-4">
              {allCerts.map((item, index) => {
                const cert = item.content;
                return (
                  <motion.div
                    key={item.SK}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 rounded-xl border px-4 py-3 card-hover-glow relative overflow-hidden"
                    style={{
                      background: "#1F2B45",
                      borderColor: cert.active ? "rgba(16,185,129,0.3)" : "#1E293B",
                    }}
                  >
                    {/* Active accent line */}
                    {cert.active && (
                      <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: "linear-gradient(90deg, transparent, #10B981, transparent)" }}
                      />
                    )}

                    {/* Shield icon */}
                    <div
                      className="p-2 rounded-lg border border-[#3D4F6B] flex-shrink-0"
                      style={{ background: "#182240" }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                        className="w-4 h-4"
                        style={{ color: cert.active ? "#10B981" : "#475569" }}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>

                    <div>
                      <div className="font-display font-semibold text-sm text-[#F1F5F9] leading-tight">{cert.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-[#CBD5E1]">{cert.issuer} · {cert.date}</span>
                        <span
                          className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                            cert.active
                              ? "text-[#10B981] border-[#10B981]/30 bg-[#10B981]/08"
                              : "text-[#475569] border-[#475569]/30"
                          }`}
                        >
                          {cert.active ? "Active" : "Expired"}
                        </span>
                      </div>
                    </div>

                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 flex-shrink-0 font-mono text-[10px] text-[#22D3EE] hover:underline flex items-center gap-0.5"
                      >
                        Verify <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
