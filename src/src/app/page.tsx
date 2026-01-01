import { Hero } from "@/components/Hero";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { fetchContent } from "@/lib/api";

export default async function Home() {
  // Fetch data in parallel
  const [profileData, experienceData, skillsData, projectsData] = await Promise.all([
    fetchContent("PROFILE"),
    fetchContent("EXPERIENCE"),
    fetchContent("SKILL"),
    fetchContent("PROJECT")
  ]);

  const profile = profileData.find((item) => item.SK === "MAIN")?.content;

  return (
    <div className="flex flex-col w-full">
      <Hero profile={profile} />
      <Projects items={projectsData} />
      <Skills items={skillsData} />
      <ExperienceTimeline items={experienceData} />
    </div>
  );
}
