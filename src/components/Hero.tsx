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
  { prefix: "$ ", text: "terraform apply --auto-approve", delay: 40, color: "#22D3EE" },
  { prefix: "", text: "Apply complete! Resources: 12 added, 0 destroyed.", delay: 0, color: "#10B981" },
  { prefix: "$ ", text: "kubectl rollout status deploy/reps-api", delay: 40, color: "#22D3EE" },
  { prefix: "", text: "✓ deployment \"reps-api\" successfully rolled out", delay: 0, color: "#10B981" },
  { prefix: "$ ", text: "pytest tests/ -q --tb=short", delay: 40, color: "#22D3EE" },
  { prefix: "", text: "615 passed in 4.23s ─── 0 failures, 0 warnings", delay: 0, color: "#10B981" },
  { prefix: "$ ", text: "curl -s https://reps.arialabs.ai/api/stats | jq", delay: 35, color: "#22D3EE" },
  { prefix: "", text: '{ "representatives": 535, "votes_tracked": 48291 }', delay: 0, color: "#94A3B8" },
  { prefix: "$ ", text: "docker compose up --build -d", delay: 40, color: "#22D3EE" },
  { prefix: "", text: "[+] Running 5/5  ✓ api ✓ worker ✓ db ✓ cache ✓ proxy", delay: 0, color: "#10B981" },
];

const STAT_ITEMS = [
  { value: "12+", label: "Yrs experience" },
  { value: "535", label: "Reps tracked" },
  { value: "615", label: "Tests green" },
  { value: "IaC", label: "Everything as code" },
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
        const charDelay = line.prefix && typedText.length < line.prefix.length ? 80 : (line.delay || 0);
        const timer = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, charDelay || 30);
        return () => clearTimeout(timer);
      } else {
        setPhase("waiting");
        const pauseTime = line.prefix ? 500 : 200;
        const timer = setTimeout(() => {
          setVisibleLines(prev => [...prev, currentTyping]);
          setCurrentTyping(prev => prev + 1);
          setTypedText("");
          setPhase("typing");
        }, pauseTime);
        return () => clearTimeout(timer);
      }
    }
  }, [currentTyping, typedText, phase]);

  if (!profile) return null;

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden" style={{ background: "#0A0E17" }}>
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow — top left */}
      <div
        className="absolute top-0 left-0 w-[700px] h-[700px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.07) 0%, transparent 65%)",
        }}
      />
      {/* Radial glow — bottom right */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at 80% 80%, rgba(34,211,238,0.04) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid lg:grid-cols-[1fr_500px] gap-10 lg:gap-16 items-center">

          {/* Left: Text content */}
          <div className="space-y-8">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/5 text-xs font-mono text-[#22D3EE]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse inline-block" />
              Founder · Aria Labs &mdash; open to senior eng roles
            </div>

            {/* Main headline */}
            <div className="space-y-2">
              <h1 className="font-display font-bold text-[#F1F5F9] leading-[1.06] tracking-tight">
                <span className="block text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5rem]">Building systems</span>
                <span className="block text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5rem]">that hold power</span>
                <span
                  className="block text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5rem]"
                  style={{
                    background: "linear-gradient(135deg, #22D3EE 0%, #06B6D4 50%, #0EA5E9 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  accountable.
                </span>
              </h1>
            </div>

            {/* Positioning */}
            <p className="text-[#94A3B8] text-lg md:text-xl leading-relaxed max-w-xl">
              Founder of{" "}
              <span className="text-[#22D3EE] font-medium">Aria Labs</span>
              {" "}— building civic tech that tracks Congress, surfaces public records,
              and connects communities. 12+ years shipping infrastructure without drama.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              {STAT_ITEMS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-[#1E293B] p-3"
                  style={{ background: "#1F2B45" }}
                >
                  <div className="font-mono text-2xl font-bold text-[#22D3EE] leading-none mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-mono leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="#projects"
                className="inline-flex items-center justify-center h-11 px-6 rounded-lg font-semibold font-display text-sm transition-all duration-200"
                style={{
                  background: "#22D3EE",
                  color: "#0A0E17",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#06B6D4")}
                onMouseLeave={e => (e.currentTarget.style.background = "#22D3EE")}
              >
                See my work ↓
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center justify-center h-11 px-6 rounded-lg border font-medium text-sm transition-all duration-200 text-[#F1F5F9] hover:text-[#22D3EE] hover:border-[#22D3EE]/50"
                style={{ borderColor: "#1E293B", background: "#1F2B45" }}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Resume
              </Link>
              <Link
                href={`mailto:${profile.email}`}
                className="inline-flex items-center justify-center h-11 px-6 rounded-lg border font-medium text-sm text-[#94A3B8] hover:text-[#22D3EE] hover:border-[#22D3EE]/50 transition-all duration-200"
                style={{ borderColor: "#1E293B" }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Link>
            </div>

            {/* Social links + cert chips */}
            <div className="flex items-center gap-5 flex-wrap">
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
              {activeCerts.length > 0 && (
                <div className="ml-1 flex items-center gap-2 border-l border-[#1E293B] pl-5">
                  {activeCerts.slice(0, 2).map((cert) => (
                    <span
                      key={cert.name}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border"
                      style={{
                        background: "rgba(16,185,129,0.08)",
                        color: "#10B981",
                        borderColor: "rgba(16,185,129,0.2)",
                      }}
                    >
                      {cert.name.replace("Google Cloud ", "GCP ").replace("Certified ", "")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Terminal window — visible md+ */}
          <div className="hidden md:block">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "#080C12",
                border: "1px solid #1E293B",
                boxShadow: "0 0 0 1px rgba(34,211,238,0.08), 0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(34,211,238,0.04)",
              }}
            >
              {/* Terminal titlebar */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ background: "#0D1117", borderColor: "#1E293B" }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] font-mono text-[#4B5563]">jeremy@aria-labs — zsh — 120×36</span>
                </div>
              </div>

              {/* Terminal body */}
              <div className="p-5 min-h-[380px] font-mono text-[13px] leading-relaxed overflow-hidden">
                {/* Prompt line before animation */}
                {visibleLines.length === 0 && currentTyping === 0 && phase === "typing" && typedText === "" && (
                  <div className="text-[#4B5563]"># aria-labs production — session started</div>
                )}

                {/* Completed lines */}
                {visibleLines.map((lineIdx) => {
                  const line = TERMINAL_LINES[lineIdx];
                  return (
                    <div key={lineIdx} className="leading-relaxed" style={{ color: line.color }}>
                      {line.prefix && (
                        <span style={{ color: "#22D3EE" }}>{line.prefix}</span>
                      )}
                      {line.text}
                    </div>
                  );
                })}

                {/* Currently typing line */}
                {currentTyping < TERMINAL_LINES.length && (
                  <div className="leading-relaxed" style={{ color: TERMINAL_LINES[currentTyping].color }}>
                    {TERMINAL_LINES[currentTyping].prefix && typedText.startsWith(TERMINAL_LINES[currentTyping].prefix) ? (
                      <>
                        <span style={{ color: "#22D3EE" }}>{TERMINAL_LINES[currentTyping].prefix}</span>
                        {typedText.slice(TERMINAL_LINES[currentTyping].prefix.length)}
                      </>
                    ) : (
                      typedText
                    )}
                    <span
                      className="inline-block w-[2px] h-[1em] ml-0.5 align-text-bottom cursor-blink"
                      style={{ background: "#22D3EE" }}
                    />
                  </div>
                )}

                {/* Done state — idle prompt */}
                {phase === "done" && (
                  <div className="mt-2" style={{ color: "#22D3EE" }}>
                    <span>$ </span>
                    <span
                      className="inline-block w-[2px] h-[1em] align-text-bottom cursor-blink"
                      style={{ background: "#22D3EE" }}
                    />
                  </div>
                )}
              </div>

              {/* Terminal footer status bar */}
              <div
                className="px-4 py-2 border-t flex items-center justify-between"
                style={{ background: "#22D3EE", borderColor: "#22D3EE" }}
              >
                <span className="font-mono text-[11px] font-bold" style={{ color: "#0A0E17" }}>NORMAL</span>
                <span className="font-mono text-[11px]" style={{ color: "#0A0E17", opacity: 0.8 }}>
                  jeremyspofford.dev
                </span>
                <span className="font-mono text-[11px]" style={{ color: "#0A0E17", opacity: 0.8 }}>
                  bash  utf-8
                </span>
              </div>
            </div>

            {/* Below terminal: uptime badge */}
            <div className="mt-4 flex items-center justify-end gap-4">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-xs"
                style={{
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  color: "#10B981",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse inline-block" />
                arialabs.ai · 99.9% uptime
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#94A3B8]">
        <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#94A3B8]/60 to-transparent" />
      </div>
    </section>
  );
}
