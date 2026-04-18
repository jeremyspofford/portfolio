import { ContentItem, StandaloneProjectContent } from "@/lib/api";

interface ProjectsProps {
  items: ContentItem<StandaloneProjectContent>[];
}

const ARIA_LABS_TITLES = [
  "Nova AI Platform",
  "Reps Accountability Dashboard",
];

function ProjectList({ items }: { items: ContentItem<StandaloneProjectContent>[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-7">
      {items.map((item) => {
        const p = item.content;
        return (
          <article key={item.SK}>
            <h3 className="font-display font-semibold text-[17px] text-text-primary">
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-4"
                >
                  {p.title}
                </a>
              ) : (
                p.title
              )}
            </h3>
            {p.description && (
              <p className="mt-1.5 text-[15px] leading-relaxed text-text-body max-w-[65ch]">
                {p.description}
              </p>
            )}
            {p.technologies && p.technologies.length > 0 && (
              <p className="mt-1.5 font-mono text-[11px] text-text-faint">
                {p.technologies.join(' · ')}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}

export function Projects({ items }: ProjectsProps) {
  if (!items.length) return null;

  const ariaItems = items
    .filter(i => ARIA_LABS_TITLES.includes(i.content.title))
    .sort(
      (a, b) =>
        ARIA_LABS_TITLES.indexOf(a.content.title) -
        ARIA_LABS_TITLES.indexOf(b.content.title)
    );
  const workItems = items
    .filter(i => !ARIA_LABS_TITLES.includes(i.content.title))
    .sort((a, b) => b.SK.localeCompare(a.SK));

  return (
    <section id="projects" className="w-full">
      <div className="mx-auto max-w-doc px-6 py-12 border-t border-border-primary space-y-12">
        {ariaItems.length > 0 && (
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-faint mb-5">
              What I&apos;m Building
            </h2>
            <ProjectList items={ariaItems} />
          </div>
        )}
        {workItems.length > 0 && (
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-faint mb-5">
              What I&apos;ve Shipped at Work
            </h2>
            <ProjectList items={workItems} />
          </div>
        )}
      </div>
    </section>
  );
}
