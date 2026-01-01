import { ContentItem, ProjectContent } from '@/lib/api';
import { ExternalLink, Code2 } from 'lucide-react';

interface ProjectsProps {
  items: ContentItem<ProjectContent>[];
}

export function Projects({ items }: ProjectsProps) {
  return (
    <section className="w-full py-12 md:py-24 px-4 bg-background">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter mb-12 text-center flex items-center justify-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            Projects
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((project) => (
            <div key={project.SK} className="group relative flex flex-col justify-between border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all p-6">
              <div>
                <div className="p-0 mb-4">
                  <h3 className="text-xl font-bold flex justify-between items-start">
                    {project.content.title}
                  </h3>
                </div>
                <div className="p-0 text-muted-foreground mb-6">
                  {project.content.description}
                </div>
              </div>
              
              <div className="mt-auto">
                 <div className="flex flex-wrap gap-2 mb-4">
                    {project.content.technologies.map((tech) => (
                      <span key={tech} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {tech}
                      </span>
                    ))}
                 </div>
                 {project.content.link && (
                     <a href={project.content.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center text-sm font-medium">
                         View Project <ExternalLink className="ml-1 h-3 w-3" />
                     </a>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
