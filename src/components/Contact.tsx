"use client";

import { Mail, MapPin, Github, Linkedin } from "lucide-react";
import { ProfileContent } from "@/lib/api";

function GitlabIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
    </svg>
  );
}

interface ContactProps {
  profile?: ProfileContent;
}

export function Contact({ profile }: ContactProps) {
  if (!profile) return null;

  return (
    <section
      id="contact"
      className="w-full py-12 md:py-16 px-6 md:px-12 scroll-mt-20"
      style={{ background: "#182240", borderTop: "1px solid #1E293B" }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Section header */}
        <div className="mb-10">
          <span className="font-mono text-xs text-[#F59E0B] tracking-widest uppercase mb-2 block">05 // contact</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4" style={{ letterSpacing: "-0.03em" }}>
            Let&apos;s build something <span className="italic text-[#94A3B8]">boring.</span>
          </h2>
          <p className="text-[#CBD5E1] text-lg max-w-xl text-left">
            Open to senior DevOps, platform engineering, and AI infrastructure roles.
            Always down to discuss interesting problems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Email card */}
          <a
            href={`mailto:${profile.email}`}
            className="group flex items-center gap-4 rounded-xl border border-[#3D4F6B] p-6 card-hover-glow"
            style={{ background: "#1F2B45" }}
          >
            <div
              className="p-3 rounded-lg border border-[#3D4F6B] group-hover:border-[#22D3EE]/40 transition-colors"
              style={{ background: "#182240" }}
            >
              <Mail className="w-5 h-5 text-[#CBD5E1] group-hover:text-[#22D3EE] transition-colors" />
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#CBD5E1] uppercase tracking-widest mb-1">Email</div>
              <div className="text-[#F1F5F9] font-medium text-sm group-hover:text-[#22D3EE] transition-colors break-all">
                {profile.email}
              </div>
            </div>
          </a>

          {/* Location card */}
          <div
            className="flex items-center gap-4 rounded-xl border border-[#3D4F6B] p-6"
            style={{ background: "#1F2B45" }}
          >
            <div
              className="p-3 rounded-lg border border-[#3D4F6B]"
              style={{ background: "#182240" }}
            >
              <MapPin className="w-5 h-5 text-[#CBD5E1]" />
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#CBD5E1] uppercase tracking-widest mb-1">Location</div>
              <div className="text-[#F1F5F9] font-medium text-sm">
                {profile.location || "Remote"}
              </div>
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-4 mt-8">
          {profile.socials?.github && (
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-3 rounded-lg border border-[#3D4F6B] text-[#CBD5E1] hover:text-[#22D3EE] hover:border-[#22D3EE]/40 transition-colors"
              style={{ background: "#1F2B45" }}
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {profile.socials?.gitlab && (
            <a
              href={profile.socials.gitlab}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitLab Profile"
              className="p-3 rounded-lg border border-[#3D4F6B] text-[#CBD5E1] hover:text-[#22D3EE] hover:border-[#22D3EE]/40 transition-colors"
              style={{ background: "#1F2B45" }}
            >
              <GitlabIcon className="w-5 h-5" />
            </a>
          )}
          {profile.socials?.linkedin && (
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-3 rounded-lg border border-[#3D4F6B] text-[#CBD5E1] hover:text-[#22D3EE] hover:border-[#22D3EE]/40 transition-colors"
              style={{ background: "#1F2B45" }}
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#3D4F6B] flex flex-col sm:flex-row justify-between gap-3 text-xs font-mono text-[#CBD5E1]">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with Next.js · Deployed on Cloudflare Pages · Designed with intention</span>
        </div>
      </div>
    </section>
  );
}
