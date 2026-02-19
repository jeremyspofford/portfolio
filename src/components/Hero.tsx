"use client";

import { Github, Linkedin, Mail, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ContentItem, CertificationContent, ProfileContent } from "@/lib/api";

interface HeroProps {
  profile: ProfileContent | undefined;
  certifications: ContentItem<CertificationContent>[];
}

const TERMINAL_LINES = [
  { prefix: "$ ", text: "terraform apply --auto-approve", color: "text-[#22D3EE]" },
  { prefix: "", text: "Plan: 12 to add, 3 to change, 0 to destroy.", color: "text-[#94A3B8]" },
  { prefix: "", text: "Apply complete! Resources: 12 added, 3 changed.", color: "text-[#10B981]" },
  { prefix: "$ ", text: "kubectl rollout status deploy/api-gateway", color: "text-[#22D3EE]" },
  { prefix: "", text: "deployment.apps/api-gateway successfully rolled out", color: "text-[#10B981]" },
  { prefix: "$ ", text: "aws cloudwatch get-metric-statistics --cost", color: "text-[#22D3EE]" },
  { prefix: "", text: "Monthly spend reduced by 30% ↓ $12,400 saved", color: "text-[#10B981]" },
];

const STAT_ITEMS = [
  { value: "12+", label: "Years experience" },
  { value: "30%", label: "Cloud cost reduction" },
  { value: "5+", label: "Civic tools shipped" },
  { value: "100%", label: "Infra as code" },
];

export function Hero({ profile, certifications }: HeroProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [currentTyping, setCurrentTyping] = useState<number>(0);
  const [typedText, setTypedText] = useState("");
  const [phase, setPhase] = useState<"typing" | "waiting" | "done">("typing");
  const activeCerts = certifications.map(c => c.content).filter(c => c.active);

  useEffect(() => {
    if (currentTyping >= TERMINAL_LINES.length) {
      setPhase("done");
      return;
    }

    const line = TERMINAL_LINES[currentTyping];
    const fullText = line.prefix + line.text;

    if (phase === "typing") {
      if (typedText.length < fullText.length) {
        const delay = typedText.length < line.prefix.length ? 80 : 35;
        const timer = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setPhase("waiting");
        const timer = setTimeout(() => {
          setVisibleLines(prev => [...prev, currentTyping]);
          setCurrentTyping(prev => prev + 1);
          setTypedText("");
          setPhase("typing");
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [currentTyping, typedText, phase]);

  if (!profile) return null;

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 70% 30%, rgba(34,211,238,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid lg:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-center">

          {/* Left: Text content */}
          <div className="space-y-8">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/5 text-xs font-mono text-[#22D3EE]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse inline-block" />
              Available for senior opportunities
            </div>

            {/* Main headline */}
            <div className="space-y-3">
              <h1 className="font-display font-bold text-[#F1F5F9] leading-[1.08] tracking-tight">
                <span className="block text-5xl sm:text-6xl lg:text-7xl">Building</span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl">infrastructure</span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl gradient-text-cyan">
                  without drama.
                </span>
              </h1>
            </div>

            {/* Positioning */}
            <p className="text-[#94A3B8] text-lg md:text-xl leading-relaxed max-w-lg">
              Senior DevOps Engineer · 12+ years automating cloud infrastructure,
              cutting costs, and shipping civic tools that make power accountable.
              Founder of{" "}
              <span className="text-[#22D3EE] font-medium">Aria Labs</span>.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {STAT_ITEMS.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="font-mono text-2xl font-bold text-[#22D3EE]">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#projects"
                className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#22D3EE] text-[#0A0E17] font-semibold font-display text-sm hover:bg-[#06B6D4] transition-colors"
              >
                See my work
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-[#1E293B] text-[#F1F5F9] font-medium text-sm hover:border-[#22D3EE]/50 hover:text-[#22D3EE] transition-colors bg-[#1A1F2E]/50"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Resume
              </Link>
              <Link
                href={`mailto:${profile.email}`}
                className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-[#1E293B] text-[#94A3B8] font-medium text-sm hover:border-[#22D3EE]/50 hover:text-[#22D3EE] transition-colors"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Link>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-5">
              {profile.socials?.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {profile.socials?.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {profile.socials?.gitlab && (
                <a
                  href={profile.socials.gitlab}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
                  aria-label="GitLab"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
                  </svg>
                </a>
              )}

              {/* Active cert chips */}
              {activeCerts.length > 0 && (
                <div className="ml-2 flex items-center gap-2 border-l border-[#1E293B] pl-5">
                  {activeCerts.slice(0, 2).map((cert) => (
                    <span
                      key={cert.name}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"
                    >
                      {cert.name.replace("Google Cloud ", "GCP ").replace("Certified ", "")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Terminal window */}
          <div className="hidden lg:block">
            <div
              className="rounded-xl overflow-hidden border border-[#1E293B]"
              style={{ background: "#0D1117", boxShadow: "0 0 0 1px rgba(34,211,238,0.1), 0 20px 60px rgba(0,0,0,0.5)" }}
            >
              {/* Terminal titlebar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E293B]" style={{ background: "#161B24" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <span className="ml-2 text-[11px] font-mono text-[#94A3B8]">jeremy@devops:~</span>
              </div>

              {/* Terminal body */}
              <div className="p-5 space-y-1.5 min-h-[320px] font-mono text-sm">
                {/* Completed lines */}
                {visibleLines.map((lineIdx) => {
                  const line = TERMINAL_LINES[lineIdx];
                  return (
                    <div key={lineIdx} className={`${line.color} leading-relaxed`}>
                      {line.prefix && (
                        <span className="text-[#22D3EE]">{line.prefix}</span>
                      )}
                      {line.prefix ? line.text : line.prefix + line.text}
                    </div>
                  );
                })}

                {/* Currently typing line */}
                {currentTyping < TERMINAL_LINES.length && (
                  <div className={`${TERMINAL_LINES[currentTyping].color} leading-relaxed`}>
                    {TERMINAL_LINES[currentTyping].prefix && typedText.startsWith(TERMINAL_LINES[currentTyping].prefix) ? (
                      <>
                        <span className="text-[#22D3EE]">{TERMINAL_LINES[currentTyping].prefix}</span>
                        {typedText.slice(TERMINAL_LINES[currentTyping].prefix.length)}
                      </>
                    ) : (
                      typedText
                    )}
                    <span className="border-r-2 border-[#22D3EE] ml-0.5 cursor-blink">&nbsp;</span>
                  </div>
                )}

                {/* Done state */}
                {phase === "done" && (
                  <div className="text-[#22D3EE] mt-4">
                    <span>$ </span>
                    <span className="border-r-2 border-[#22D3EE] ml-0.5 cursor-blink">&nbsp;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#94A3B8]">
        <span className="text-xs font-mono tracking-widest uppercase">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#94A3B8] to-transparent" />
      </div>
    </section>
  );
}
