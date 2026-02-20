'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

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

// Fallback data if none loaded — ensures section always renders
const FALLBACK_EXPERIENCE: ExperienceItem[] = [
  {
    PK: "EXPERIENCE",
    SK: "2022-11-01",
    content: {
      company: "VividCloud",
      role: "Senior DevOps Engineer",
      startDate: "2022-11",
      endDate: "Present",
      description: "Led cloud infrastructure optimization initiatives resulting in 30% cost reduction. Enhanced CI/CD workflows with parallelized Terraform jobs and dynamic preview environments tied to GitLab merge requests.",
      technologies: ["GCP", "Terraform", "GitLab CI", "AWS", "Kubernetes"],
      key_deliverables: [
        {
          title: "Cloud Cost Optimization",
          description: "Led initiative resulting in 30% reduction in monthly infrastructure expenses across all environments.",
          technologies: ["GCP", "Terraform", "Cost Management"]
        },
        {
          title: "Dynamic Preview Environments",
          description: "Designed scalable preview environments tied to GitLab merge requests.",
          technologies: ["GitLab", "Terraform", "GCP"]
        },
        {
          title: "Certificate Management Automation",
          description: "Automated SSL certificate renewal with GCP Secret Manager and Pub/Sub.",
          technologies: ["GCP Secret Manager", "Pub/Sub", "Terraform"]
        },
      ]
    }
  },
  {
    PK: "EXPERIENCE",
    SK: "2019-06-01",
    content: {
      company: "Tyler Technologies",
      role: "DevOps Engineer",
      startDate: "2019-06",
      endDate: "2022-11",
      description: "Designed CI/CD pipelines streamlining deployment processes across teams. Architected scalable Puppet infrastructure for environment consistency. Automated user onboarding via PowerShell.",
      technologies: ["Azure", "Puppet", "PowerShell", "TeamCity", "IIS", "MS SQL Server"],
      key_deliverables: [
        {
          title: "CI/CD Pipeline Architecture",
          description: "Designed comprehensive CI/CD pipelines for multiple teams using TeamCity and Azure DevOps.",
          technologies: ["TeamCity", "Azure DevOps", "PowerShell"]
        },
        {
          title: "Infrastructure Automation",
          description: "Architected Puppet infrastructure ensuring consistency across all environments.",
          technologies: ["Puppet", "Azure", "PowerShell"]
        }
      ]
    }
  },
];

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  const rawItems = items.length > 0 ? items : FALLBACK_EXPERIENCE;

  const sortedItems = [...rawItems].sort((a, b) =>
    new Date(b.content.startDate).getTime() - new Date(a.content.startDate).getTime()
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const active = sortedItems[activeIndex];

  if (!active) return null;

  return (
    <section id="experience" className="w-full py-20 md:py-32 px-6 md:px-12 scroll-mt-20" style={{ background: "#0A0E17" }}>
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[#22D3EE] text-sm">03.</span>
            <div className="h-px flex-1 max-w-[60px] bg-[#22D3EE]/30" />
            <span className="font-mono text-[10px] text-[#8899B0] uppercase tracking-widest">experience --reverse-chron</span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4">
            Experience
          </h2>
          <p className="text-[#CBD5E1] text-lg max-w-2xl">
            12 years of infrastructure work across enterprise, cloud-native, and startup environments.
          </p>
        </div>

        {/* Tab layout — company selector + detail panel */}
        <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-0 rounded-2xl overflow-hidden border border-[#3D4F6B]">

          {/* Left: Company tabs */}
          <div
            className="border-r border-[#3D4F6B] flex md:flex-col overflow-x-auto md:overflow-visible"
            style={{ background: "#182240" }}
          >
            {/* Tab header label */}
            <div className="hidden md:block px-4 pt-4 pb-2">
              <span className="font-mono text-[9px] text-[#8899B0] uppercase tracking-widest">$ companies</span>
            </div>

            {sortedItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.SK}
                  onClick={() => setActiveIndex(index)}
                  className="relative text-left px-4 py-4 transition-all duration-200 flex-shrink-0 md:flex-shrink border-b border-[#3D4F6B] last:border-b-0 group"
                  style={{
                    background: isActive ? "#1A1F2E" : "transparent",
                    borderLeft: isActive ? "2px solid #22D3EE" : "2px solid transparent",
                  }}
                >
                  <div
                    className="font-display font-semibold text-sm leading-tight transition-colors"
                    style={{ color: isActive ? "#22D3EE" : "#94A3B8" }}
                  >
                    {item.content.company}
                  </div>
                  <div className="font-mono text-[10px] text-[#8899B0] mt-0.5 leading-tight">
                    {item.content.startDate} →{" "}
                    {item.content.endDate === "Present" ? (
                      <span style={{ color: "#10B981" }}>Present</span>
                    ) : (
                      item.content.endDate
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detail panel */}
          <div style={{ background: "#1F2B45" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22 }}
                className="p-6 md:p-8"
              >
                {/* Role + company */}
                <div className="mb-6">
                  <h3 className="font-display font-bold text-2xl text-[#F1F5F9] mb-1">
                    {active.content.role}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[#22D3EE] font-medium">@ {active.content.company}</span>
                    <div
                      className="font-mono text-xs text-[#CBD5E1] px-2.5 py-1 rounded border border-[#3D4F6B]"
                      style={{ background: "#182240" }}
                    >
                      {active.content.startDate} → {active.content.endDate}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#CBD5E1] text-sm leading-relaxed mb-6">
                  {active.content.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {active.content.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded font-mono text-xs text-[#CBD5E1] border border-[#3D4F6B]"
                      style={{ background: "#182240" }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Key deliverables — compact list */}
                {active.content.key_deliverables && active.content.key_deliverables.length > 0 && (
                  <div>
                    <div className="font-mono text-[10px] text-[#22D3EE] uppercase tracking-widest mb-4">
                      Key Deliverables
                    </div>
                    <div className="space-y-3">
                      {active.content.key_deliverables.map((deliverable, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3"
                        >
                          {/* Left accent line */}
                          <div className="w-px bg-[#1E293B] flex-shrink-0 mt-1 mb-1" />

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-[#F1F5F9]">
                                {deliverable.title}
                              </h4>
                              {deliverable.link && (
                                <a
                                  href={deliverable.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#22D3EE] hover:text-[#06B6D4] flex-shrink-0 mt-0.5"
                                >
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                            <p className="text-[#CBD5E1] text-xs leading-relaxed mb-2">
                              {deliverable.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {deliverable.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="font-mono text-[10px] uppercase text-[#8899B0] px-1.5 py-0.5 rounded border border-[#3D4F6B]"
                                  style={{ background: "#0A0E17" }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination dots — mobile indicator */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {sortedItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="transition-all duration-200 rounded-full"
              style={{
                width: index === activeIndex ? "20px" : "8px",
                height: "8px",
                background: index === activeIndex ? "#22D3EE" : "#1E293B",
              }}
              aria-label={`Go to job ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
