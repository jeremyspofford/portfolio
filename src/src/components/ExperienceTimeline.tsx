'use client';

import { motion } from 'framer-motion';
import { Calendar, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Ensure utility exists

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
  // Sort by start date specific logic if needed, currently relying on DB order or pre-sort
  const sortedItems = [...items].sort((a, b) => 
    new Date(b.content.startDate).getTime() - new Date(a.content.startDate).getTime()
  );

  return (
    <section className="w-full py-10 md:py-24 px-4 bg-muted/30">
        <div className="container px-2 sm:px-4 md:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-8 md:mb-12 text-center">Experience</h2>
            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-2 sm:ml-3 md:ml-6 space-y-8 md:space-y-12">
                {sortedItems.map((item, index) => (
                    <motion.div
                        key={item.SK}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="mb-6 sm:mb-10 ml-4 sm:ml-6"
                    >
                        <span className="absolute flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full -left-[11px] sm:-left-3 ring-4 sm:ring-8 ring-background dark:ring-gray-900 dark:bg-blue-900">
                             <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-800 dark:text-blue-300" />
                        </span>
                        <div className="p-3 sm:p-4 bg-background border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col gap-1 sm:gap-0 sm:flex-row justify-between items-start sm:items-center mb-2">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                    {item.content.role} <span className="text-primary">@ {item.content.company}</span>
                                </h3>
                                <time className="text-xs sm:text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {item.content.startDate} - {item.content.endDate}
                                    </div>
                                </time>
                            </div>
                            <p className="mb-3 sm:mb-4 text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400">
                                {item.content.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {item.content.technologies?.map(tech => (
                                    <span key={tech} className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Key Deliverables Section */}
                            {item.content.key_deliverables && item.content.key_deliverables.length > 0 && (
                                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3 sm:mb-4">Key Deliverables</h4>
                                    <div className="grid gap-3 sm:gap-4">
                                        {item.content.key_deliverables.map((project, idx) => (
                                            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3 sm:p-4 border border-zinc-100 dark:border-zinc-800">
                                                <h5 className="font-bold text-xs sm:text-sm mb-1 text-zinc-800 dark:text-zinc-200">{project.title}</h5>
                                                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-2 sm:mb-3">{project.description}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {project.technologies.map(tech => (
                                                        <span key={tech} className="text-[9px] sm:text-[10px] uppercase font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
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
    </section>
  );
}
