import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Certifications } from "@/components/Certifications";
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
      {/* 1. Hero — value proposition + terminal */}
      <Hero profile={profile} certifications={certifications} />

      {/* 2. About + Philosophy */}
      <About bio={profile?.bio ?? ''} />

      {/* 3. Projects — THE CENTERPIECE */}
      <div style={{ background: "#0A0E17" }}>
        <Projects items={projects} />
      </div>

      {/* 4. Skills */}
      <Skills items={skills} />

      {/* 5. Experience */}
      <div style={{ background: "#0A0E17" }}>
        <ExperienceTimeline items={experience} />
      </div>

      {/* 6. Certifications */}
      <Certifications items={certifications} />

      {/* 7. Contact */}
      <Contact profile={profile} />
    </div>
  );
}
