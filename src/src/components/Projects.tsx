"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Folder, Clock } from "lucide-react";
import { ContentItem, ProjectContent } from "@/lib/api";

interface ProjectsProps {
  items: ContentItem<ProjectContent>[];
}

export function Projects({ items }: ProjectsProps) {
  if (!items || items.length === 0) return null;

  // Sort by order, then by featured, then by date
  const sortedItems = [...items].sort((a, b) => {
    if (a.content.featured && !b.content.featured) return -1;
    if (!a.content.featured && b.content.featured) return 1;
    return (a.content.order || 99) - (b.content.order || 99);
  });

  const statusColors = {
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    completed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    archived:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  };

  return (
    <section
      id="projects"
      className="w-full py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-900/50"
    >
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
            Projects
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Personal and side projects that showcase my interests beyond work.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((project, index) => (
            <motion.div
              key={project.SK}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Folder className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex gap-2">
                  {project.content.github && (
                    <a
                      href={project.content.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      aria-label="View on GitHub"
                    >
                      <Github className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </a>
                  )}
                  {project.content.link && (
                    <a
                      href={project.content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      aria-label="View live site"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {project.content.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                {project.content.description}
              </p>

              <div className="flex items-center gap-2 mb-4 text-xs text-slate-500 dark:text-slate-500">
                <Clock className="w-3 h-3" />
                <span>{project.content.startDate}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[project.content.status]}`}
                >
                  {project.content.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.content.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
                {project.content.technologies.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 text-slate-500 dark:text-slate-500">
                    +{project.content.technologies.length - 4}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
