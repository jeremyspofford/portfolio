import { Hero } from "@/components/Hero";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Philosophy } from "@/components/Philosophy";
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
  // Only show DevOps and SWE roles in the timeline
  const DEVOPS_SWE_ROLES = ['Senior DevOps Engineer', 'Software Engineer', 'DevOps Engineer'];
  const experience = (experienceData as ContentItem<ExperienceContent>[])
    .filter(item => DEVOPS_SWE_ROLES.includes(item.content.role));
  const skills = skillsData as ContentItem<SkillContent>[];
  const certifications = certificationsData as ContentItem<CertificationContent>[];
  const projects = projectsData as ContentItem<StandaloneProjectContent>[];

  return (
    <div className="flex flex-col w-full" style={{ background: "#0A0E17" }}>
      {/* 1. Hero — terminal + value proposition */}
      <Hero profile={profile} certifications={certifications} />

      {/* 2. Projects — lead with proof */}
      <div style={{ background: "#0A0E17" }}>
        <Projects items={projects} />
      </div>

      {/* 3. Skills */}
      <Skills items={skills} certifications={certifications} />

      {/* 4. Experience */}
      <div style={{ background: "#0A0E17" }}>
        <ExperienceTimeline items={experience} />
      </div>

      {/* 5. How I Work — personality before the CTA */}
      <Philosophy />

      {/* 6. Contact */}
      <Contact profile={profile} />
    </div>
  );
}
