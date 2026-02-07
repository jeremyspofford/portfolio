
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { AIShowcase } from "@/components/AIShowcase";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { Contributions } from "@/components/Contributions";
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
import { getAllPosts } from "@/lib/blog";
import { fetchCombinedContributions } from "@/lib/contributions";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { config } from "@/config";

export default async function Home() {
  // Fetch data in parallel
  const [profileData, experienceData, skillsData, certificationsData, projectsData, contributionsData] = await Promise.all([
    fetchContent("PROFILE"),
    fetchContent("EXPERIENCE"),
    fetchContent("SKILLS"),
    fetchContent("CERTIFICATIONS"),
    fetchContent("PROJECTS"),
    config.features.showContributions ? fetchCombinedContributions() : Promise.resolve(null)
  ]);

  // Cast to proper types
  const profile = profileData.find((item) => item.SK === "MAIN")?.content as ProfileContent | undefined;
  const experience = experienceData as ContentItem<ExperienceContent>[];
  const skills = skillsData as ContentItem<SkillContent>[];
  const certifications = certificationsData as ContentItem<CertificationContent>[];
  const projects = projectsData as ContentItem<StandaloneProjectContent>[];
  const latestPosts = getAllPosts().slice(0, 2);

  return (
    <div className="flex flex-col w-full">
      <Hero profile={profile} certifications={certifications} />

      <div className="container max-w-4xl mx-auto px-6 md:px-12 space-y-12">
        <About bio={profile?.bio ?? ''} />
        {config.features.showContributions && contributionsData && (
           <Contributions data={contributionsData.contributions} total={contributionsData.total} />
        )}
      </div>

      {/* AI Engineering Journey Section */}
      <AIShowcase />

      <div id="skills" className="scroll-mt-20">
        <Skills items={skills} />
      </div>
      <Certifications items={certifications} />
      <div id="experience" className="scroll-mt-20">
        <ExperienceTimeline items={experience} />
      </div>
      <Projects items={projects} />

      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <section className="w-full max-w-4xl mx-auto p-6 md:p-12">
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Latest Thoughts</h2>
            <Link href="/blog" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm font-medium">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group p-6 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-500 rounded-2xl transition-all shadow-sm hover:shadow-lg"
              >
                <div className="text-xs text-slate-500 mb-2 font-mono">{post.date}</div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div id="contact" className="scroll-mt-20 w-full">
        <Contact profile={profile} />
      </div>
    </div>
  );
}
