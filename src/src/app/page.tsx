import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Skills } from "@/components/Skills";
// import { Projects } from "@/components/Projects"; // Removed in favor of merged timeline
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import ChatInterface from "@/components/ChatInterface";
import { fetchContent } from "@/lib/api";
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  const latestPosts = getAllPosts().slice(0, 2);

  return (
    <div className="flex flex-col w-full">
      <Hero profile={profile} certifications={certificationsData} />
      <About bio={profile?.bio} />
      <Skills items={skillsData} />
      <Certifications items={certificationsData} />
      <ExperienceTimeline items={experienceData} />
      
      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <section className="w-full max-w-4xl mx-auto p-6 md:p-12">
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Latest Thoughts</h2>
            <Link href="/blog" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm font-medium">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {latestPosts.map((post) => (
              <Link 
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group p-6 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-indigo-400 rounded-2xl transition-all shadow-lg"
              >
                <div className="text-xs text-slate-300 mb-2 font-mono">{post.date}</div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-slate-200 text-sm line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Contact profile={profile} />
      <ChatInterface />
    </div>
  );
}
