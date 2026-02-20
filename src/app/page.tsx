import { Hero } from "@/components/Hero";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { fetchContent } from '@/lib/content';
import {
  ProfileContent,
  ExperienceContent,
  ProjectContent,
  CertificationContent,
  SkillContent,
  ContentItem,
  StandaloneProjectContent
} from '@/lib/api';

export default async function Home() {
  const [profileData, experienceData, skillsData, certificationsData, projectsData] = await Promise.all([
    fetchContent("PROFILE"),
    fetchContent("EXPERIENCE"),
    fetchContent("SKILLS"),
    fetchContent("CERTIFICATIONS"),
    fetchContent("PROJECTS"),
  ]);

  const profile = profileData.find((item) => item.SK === "MAIN")?.content as ProfileContent | undefined;
  const experience = experienceData as ContentItem<ExperienceContent>[];
  const skills = skillsData as ContentItem<SkillContent>[];
  const certifications = certificationsData as ContentItem<CertificationContent>[];
  const projects = projectsData as ContentItem<StandaloneProjectContent>[];

  return (
    <div className="flex flex-col w-full" style={{ background: "#0A0E17" }}>
      {/* 1. Hero — terminal + value proposition */}
      <Hero profile={profile} certifications={certifications} />

      {/* 2. Projects — THE CENTERPIECE, immediately after hero */}
      <div style={{ background: "#0A0E17" }}>
        <Projects items={projects} />
      </div>

      {/* 3. Skills — compact tier list + certifications integrated */}
      <Skills items={skills} certifications={certifications} />

      {/* 4. Experience — tabbed timeline */}
      <div style={{ background: "#0A0E17" }}>
        <ExperienceTimeline items={experience} />
      </div>

      {/* 5. Contact */}
      <Contact profile={profile} />
    </div>
  );
}
