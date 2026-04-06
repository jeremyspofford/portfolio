import { Metadata } from 'next';
import { Projects } from '@/components/Projects';
import { fetchContent } from '@/lib/content';
import { ContentItem, StandaloneProjectContent } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Civic tools, AI platforms, and infrastructure. Nova, Reps Dashboard, Epstein Files, and more from Aria Labs.',
};

export default async function ProjectsPage() {
  const projectsData = await fetchContent("PROJECTS");
  const projects = projectsData as ContentItem<StandaloneProjectContent>[];

  return (
    <div className="flex flex-col w-full pt-16" style={{ background: "#0A0E17" }}>
      <Projects items={projects} />
    </div>
  );
}
