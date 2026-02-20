"use client";

import { motion } from "framer-motion";

interface AboutProps {
  bio: string;
}

const PHILOSOPHY = [
  "Infrastructure should be boring — predictably reliable, not exciting to fix at 2am.",
  "Automation is a force multiplier. Eliminate toil before it eliminates you.",
  "Civic tools are infrastructure too. Power needs to be auditable and accountable.",
];

export function About({ bio }: AboutProps) {
  const startYear = 2014;
  const yearsOfExperience = new Date().getFullYear() - startYear;

  return (
    <section className="w-full py-20 md:py-32 px-6 md:px-12" style={{ background: "#141C2F" }}>
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[#22D3EE] text-sm">01.</span>
            <div className="h-px flex-1 max-w-[60px] bg-[#22D3EE]/30" />
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4">
            About
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr_280px] gap-10 items-start">

          {/* Bio */}
          <div className="space-y-6">
            <p className="text-[#94A3B8] text-lg leading-relaxed">
              {bio}
            </p>

            {/* Engineering philosophy */}
            <div
              className="rounded-xl border border-[#1E293B] p-6"
              style={{ background: "#1A1F2E" }}
            >
              <div className="font-mono text-[10px] text-[#22D3EE] uppercase tracking-widest mb-4">
                Engineering Philosophy
              </div>
              <div className="space-y-3">
                {PHILOSOPHY.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3"
                  >
                    <span className="font-mono text-[#22D3EE] text-sm mt-0.5 flex-shrink-0">›</span>
                    <p className="text-[#94A3B8] text-sm leading-relaxed">{point}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats sidebar */}
          <div className="space-y-3">
            {[
              { value: `${yearsOfExperience}+`, label: "Years in the field" },
              { value: "30%", label: "Cloud cost reduction" },
              { value: "AWS + GCP", label: "Primary cloud platforms" },
              { value: "IaC-first", label: "Infrastructure philosophy" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-lg border border-[#1E293B] p-4"
                style={{ background: "#1A1F2E" }}
              >
                <div className="font-mono font-bold text-2xl text-[#22D3EE] leading-none mb-1">
                  {stat.value}
                </div>
                <div className="font-mono text-[11px] text-[#94A3B8] uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
