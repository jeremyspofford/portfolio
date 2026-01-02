import { Hero } from "@/components/Hero";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { fetchContent } from "@/lib/api";

export default async function Home() {
  // Fetch data in parallel
  const [profileData, experienceData, skillsData, projectsData, certificationsData] = await Promise.all([
    fetchContent("PROFILE"),
    fetchContent("EXPERIENCE"),
    fetchContent("SKILL"),
    fetchContent("PROJECT"),
    fetchContent("CERTIFICATION")
  ]);

  const profile = profileData.find((item) => item.SK === "MAIN")?.content;

  return (
    <div className="flex flex-col w-full">
      <Hero profile={profile} />
      <Projects items={projectsData} />
      <Skills items={skillsData} />
      <Certifications items={certificationsData} />
      <ExperienceTimeline items={experienceData} />
      <Contact profile={profile} />
    </div>
  );
}
