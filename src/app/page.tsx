import Link from 'next/link';
import { Hero } from "@/components/Hero";
import { Contact } from "@/components/Contact";
import { fetchContent } from '@/lib/content';
import { ProfileContent } from '@/lib/api';

export default async function Home() {
  const profileData = await fetchContent("PROFILE");
  const profile = profileData.find((item) => item.SK === "MAIN")?.content as ProfileContent | undefined;

  return (
    <div className="flex flex-col w-full" style={{ background: "#0A0E17" }}>
      <Hero profile={profile} />

      {/* Navigation — funnel to the real content */}
      <section className="w-full px-6 md:px-12 py-12" style={{ background: "#0A0E17" }}>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/resume"
            className="group flex items-baseline justify-between py-5 border-b border-[#1E293B] hover:border-[#22D3EE]/40 transition-colors"
          >
            <span className="font-display font-semibold text-lg text-[#F1F5F9] group-hover:text-[#22D3EE] transition-colors">
              Resume
            </span>
            <span className="text-sm text-[#94A3B8]">
              Experience, skills, certifications
            </span>
          </Link>
          <Link
            href="/projects"
            className="group flex items-baseline justify-between py-5 border-b border-[#1E293B] hover:border-[#22D3EE]/40 transition-colors"
          >
            <span className="font-display font-semibold text-lg text-[#F1F5F9] group-hover:text-[#22D3EE] transition-colors">
              Projects
            </span>
            <span className="text-sm text-[#94A3B8]">
              Nova, Reps Dashboard, Epstein Files, and more
            </span>
          </Link>
          <Link
            href="/blog"
            className="group flex items-baseline justify-between py-5 border-b border-[#1E293B] hover:border-[#22D3EE]/40 transition-colors"
          >
            <span className="font-display font-semibold text-lg text-[#F1F5F9] group-hover:text-[#22D3EE] transition-colors">
              Blog
            </span>
            <span className="text-sm text-[#94A3B8]">
              Writing about DevOps, AI, and infrastructure
            </span>
          </Link>
        </div>
      </section>

      <Contact profile={profile} />
    </div>
  );
}
