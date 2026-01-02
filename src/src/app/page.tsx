import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Skills } from "@/components/Skills";
// import { Projects } from "@/components/Projects"; // Removed in favor of merged timeline
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import ChatInterface from "@/components/ChatInterface";
import { fetchContent } from "@/lib/api";

export default async function Home() {
  // Fetch data in parallel
  const [profileData, experienceData, skillsData, certificationsData] = await Promise.all([
    fetchContent("PROFILE"),
    fetchContent("EXPERIENCE"),
    fetchContent("SKILL"),
    // fetchContent("PROJECT"), // Removed
    fetchContent("CERTIFICATION")
  ]);

  const profile = profileData.find((item) => item.SK === "MAIN")?.content;

  return (
    <div className="flex flex-col w-full">
      <Hero profile={profile} certifications={certificationsData} />
      <About bio={profile?.bio} />
      <Skills items={skillsData} />
      <Certifications items={certificationsData} />
      <ExperienceTimeline items={experienceData} />
      <Contact profile={profile} />
      <ChatInterface />
    </div>
  );
}
