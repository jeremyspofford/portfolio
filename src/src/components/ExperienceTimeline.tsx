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
    <section className="w-full py-12 md:py-24 px-4 bg-muted/30">
        <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter mb-12 text-center">Experience</h2>
            <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 md:ml-6 space-y-12">
                {sortedItems.map((item, index) => (
                    <motion.div 
                        key={item.SK}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="mb-10 ml-6"
                    >
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-background dark:ring-gray-900 dark:bg-blue-900">
                             <Building2 className="w-3 h-3 text-blue-800 dark:text-blue-300" />
                        </span>
                        <div className="p-4 bg-background border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {item.content.role} <span className="text-primary">@ {item.content.company}</span>
                                </h3>
                                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 sm:mb-0">
                                    <div className="flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {item.content.startDate} - {item.content.endDate}
                                    </div>
                                </time>
                            </div>
                            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                {item.content.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {item.content.technologies?.map(tech => (
                                    <span key={tech} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
}
