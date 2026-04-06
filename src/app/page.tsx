import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import { Hero } from "@/components/Hero";
import { fetchContent } from '@/lib/content';
import { ProfileContent } from '@/lib/api';

function GitlabIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
    </svg>
  );
}

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

      {/* Slim footer */}
      <footer className="w-full px-6 md:px-12 py-8 border-t border-[#1E293B]" style={{ background: "#0A0E17" }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-[#94A3B8]">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-[#22D3EE] transition-colors">
                {profile.email}
              </a>
            )}
            {profile?.location && (
              <span>{profile.location}</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-[#94A3B8]">
            {profile?.socials?.github && (
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-[#22D3EE] transition-colors">
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile?.socials?.github_org && (
              <a href={profile.socials.github_org} target="_blank" rel="noopener noreferrer" aria-label="Aria Labs GitHub" className="hover:text-[#22D3EE] transition-colors" title="Aria Labs">
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile?.socials?.gitlab && (
              <a href={profile.socials.gitlab} target="_blank" rel="noopener noreferrer" aria-label="GitLab" className="hover:text-[#22D3EE] transition-colors">
                <GitlabIcon className="w-5 h-5" />
              </a>
            )}
            {profile?.socials?.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#22D3EE] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-6 text-xs font-mono text-[#475569]">
          &copy; {new Date().getFullYear()} {profile?.name || 'Jeremy Spofford'}
        </div>
      </footer>
    </div>
  );
}
