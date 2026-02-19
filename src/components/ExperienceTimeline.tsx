'use client';

import { motion } from 'framer-motion';

interface ExperienceContent {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
  key_deliverables?: {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
}

interface ExperienceItem {
  PK: string;
  SK: string;
  content: ExperienceContent;
}

interface ExperienceTimelineProps {
  items: ExperienceItem[];
}

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  const sortedItems = [...items].sort((a, b) =>
    new Date(b.content.startDate).getTime() - new Date(a.content.startDate).getTime()
  );

  return (
    <section id="experience" className="w-full py-20 md:py-32 px-6 md:px-12 scroll-mt-20" style={{ background: "#0A0E17" }}>
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[#22D3EE] text-sm">03.</span>
            <div className="h-px flex-1 max-w-[60px] bg-[#22D3EE]/30" />
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4">
            Experience
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl">
            12 years of infrastructure work across enterprise, cloud-native, and startup environments.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, #22D3EE, #1E293B 80%)" }}
          />

          <div className="space-y-12 pl-10">
            {sortedItems.map((item, index) => (
              <motion.div
                key={item.SK}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div
                  className="absolute -left-[41px] top-5 w-3 h-3 rounded-full border-2 border-[#22D3EE] z-10"
                  style={{ background: "#0A0E17" }}
                />

                <div
                  className="group rounded-xl border border-[#1E293B] p-6 md:p-8 card-hover-glow"
                  style={{ background: "#1A1F2E" }}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-[#F1F5F9]">
                        {item.content.role}
                      </h3>
                      <span className="text-[#22D3EE] font-medium">@ {item.content.company}</span>
                    </div>
                    <div className="font-mono text-xs text-[#94A3B8] px-3 py-1.5 rounded border border-[#1E293B] self-start whitespace-nowrap" style={{ background: "#111827" }}>
                      {item.content.startDate} → {item.content.endDate}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#94A3B8] text-sm leading-relaxed mb-5">
                    {item.content.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {item.content.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded font-mono text-xs text-[#94A3B8] border border-[#1E293B]"
                        style={{ background: "#111827" }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Key deliverables */}
                  {item.content.key_deliverables && item.content.key_deliverables.length > 0 && (
                    <div className="pt-5 border-t border-[#1E293B]">
                      <div className="font-mono text-[10px] text-[#22D3EE] uppercase tracking-widest mb-4">
                        Key Deliverables
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {item.content.key_deliverables.map((deliverable, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg p-4 border border-[#1E293B]"
                            style={{ background: "#111827" }}
                          >
                            <h4 className="font-semibold text-sm text-[#F1F5F9] mb-1.5">
                              {deliverable.title}
                            </h4>
                            <p className="text-[#94A3B8] text-xs leading-relaxed mb-3">
                              {deliverable.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {deliverable.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="font-mono text-[10px] uppercase text-[#94A3B8] px-1.5 py-0.5 rounded border border-[#1E293B]"
                                  style={{ background: "#0A0E17" }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
