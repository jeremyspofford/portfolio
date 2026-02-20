"use client";

import { FileText } from 'lucide-react';
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

export function Hero({ profile, certifications: _certifications }: HeroProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [currentTyping, setCurrentTyping] = useState<number>(0);
  const [typedText, setTypedText] = useState("");
  const [phase, setPhase] = useState<"typing" | "waiting" | "done">("typing");

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
            {/* Name + title */}
            <div className="space-y-3">
              <h1 className="font-display font-bold text-5xl text-[#F1F5F9] leading-tight">
                Jeremy Spofford
              </h1>
              <p className="font-mono text-lg text-[#94A3B8]">
                Senior DevOps Engineer · Founder of Aria Labs
              </p>
            </div>

            {/* Single sentence — left-aligned */}
            <p className="text-[#CBD5E1] text-xl leading-relaxed max-w-2xl text-left">
              I build civic tech that holds power{" "}
              <span style={{ color: "#F59E0B", fontWeight: 600 }}>accountable</span>
              {" "}— tracking Congress and surfacing public records, then shipping it to production without drama.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
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
          </div>
        </div>
      </div>
    </section>
  );
}
