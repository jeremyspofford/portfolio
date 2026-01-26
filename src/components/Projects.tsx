import { FolderGit2, Calendar, ExternalLink } from "lucide-react";
import { ContentItem, StandaloneProjectContent } from "@/lib/api";

interface ProjectsProps {
  items: ContentItem<StandaloneProjectContent>[];
}

export function Projects({ items }: ProjectsProps) {
  // Sort by date descending (newest first)
  const sortedItems = [...items].sort((a, b) => b.SK.localeCompare(a.SK));

  if (!sortedItems.length) return null;

  return (
    <section id="projects" className="py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 flex items-center gap-2 sm:gap-3">
          <FolderGit2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          Featured Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedItems.map((item) => {
            const project = item.content;
            return (
              <div
                key={item.SK}
                className="group relative flex flex-col bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border hover:shadow-md hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <FolderGit2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {project.date}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 bg-secondary text-secondary-foreground rounded-full text-[10px] sm:text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline text-sm font-medium mt-auto"
                  >
                    View Project <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
