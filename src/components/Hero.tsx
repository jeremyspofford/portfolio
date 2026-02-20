"use client";

import { FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ContentItem, CertificationContent, ProfileContent } from "@/lib/api";

interface HeroProps {
  profile: ProfileContent | undefined;
  certifications: ContentItem<CertificationContent>[];
}

type LineType = 'command' | 'output-success' | 'output-info' | 'output-done';

interface TermLine {
  text: string;
  type: LineType;
}

const COMMAND = '$ nova run --task "audit congressional votes"';

const OUTPUT_LINES: TermLine[] = [
  { text: '→ Connecting to congressional database...', type: 'output-info' },
  { text: '→ Loading 535 representatives...', type: 'output-info' },
  { text: '→ Analyzing voting patterns (119th Congress)...', type: 'output-info' },
  { text: '→ Cross-referencing FEC financial data...', type: 'output-info' },
  { text: '→ Scanning STOCK Act disclosures...', type: 'output-info' },
  { text: '→ Running conflict-of-interest checks...', type: 'output-info' },
  { text: '✓ Accountability report generated.', type: 'output-done' },
  { text: '✓ Published to reps.arialabs.ai', type: 'output-done' },
];

const LINE_COLORS: Record<LineType, string> = {
  'command': '#22D3EE',
  'output-success': '#10B981',
  'output-info': '#94A3B8',
  'output-done': '#10B981',
};

function useTerminalAnimation() {
  // Pre-populate with first command so visitors never see a black void
  const [typedCommand, setTypedCommand] = useState(COMMAND);
  const [outputLines, setOutputLines] = useState<TermLine[]>(OUTPUT_LINES);
  const [phase, setPhase] = useState<'typing' | 'streaming' | 'idle' | 'restart-pause'>('idle');
  const cycleRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function runAnimation() {
      if (cycleRef.current === 0) {
        // First load: content pre-populated — wait 3s then clear and start loop
        await delay(3000);
        if (cancelled) return;
        setTypedCommand('');
        setOutputLines([]);
      } else {
        // Subsequent loops: small pause before retyping
        await delay(400);
        if (cancelled) return;
      }

      // Phase 1: Type command char by char at 30ms
      setTypedCommand('');
      setPhase('typing');
      for (let i = 1; i <= COMMAND.length; i++) {
        if (cancelled) return;
        setTypedCommand(COMMAND.slice(0, i));
        await delay(30);
      }

      // Pause after command
      await delay(500);
      if (cancelled) return;

      // Phase 2: Stream output lines one by one
      setPhase('streaming');
      setOutputLines([]);
      for (const line of OUTPUT_LINES) {
        if (cancelled) return;
        await delay(100);
        setOutputLines(prev => [...prev, line]);
      }

      // Wait 1s then show idle
      await delay(1000);
      if (cancelled) return;
      setPhase('idle');

      // After 3s pause, restart
      await delay(3000);
      if (cancelled) return;
      setPhase('restart-pause');

      // Reset and restart
      setTypedCommand('');
      setOutputLines([]);
      cycleRef.current += 1;
    }

    runAnimation();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleRef.current]);

  return { typedCommand, outputLines, phase };
}

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function Hero({ profile, certifications: _certifications }: HeroProps) {
  const { typedCommand, outputLines, phase } = useTerminalAnimation();

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
              <span style={{ color: "#F59E0B", fontWeight: 600, fontStyle: "italic", letterSpacing: "0.02em" }}>accountable</span>
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
                  <span className="text-[11px] font-mono text-[#4B5563]">jeremy@aria-labs — nova — 120×36</span>
                </div>
              </div>

              {/* Terminal body */}
              <div className="p-5 min-h-[320px] font-mono text-[13px] leading-relaxed overflow-hidden">
                {/* Initial comment before typing starts */}
                <div className="text-[#4B5563] mb-2"># aria-labs production — nova agent</div>

                {/* The command being typed */}
                {(typedCommand.length > 0 || phase === 'typing') && (
                  <div className="leading-relaxed" style={{ color: LINE_COLORS['command'] }}>
                    <span style={{ color: "#22D3EE" }}>$ </span>
                    <span style={{ color: "#F1F5F9" }}>
                      {typedCommand.startsWith('$ ') ? typedCommand.slice(2) : typedCommand}
                    </span>
                    {phase === 'typing' && (
                      <span
                        className="inline-block w-[2px] h-[1em] ml-0.5 align-text-bottom cursor-blink"
                        style={{ background: "#22D3EE" }}
                      />
                    )}
                  </div>
                )}

                {/* Output lines, streamed in */}
                {outputLines.map((line, i) => (
                  <div
                    key={i}
                    className="leading-relaxed mt-0.5"
                    style={{ color: LINE_COLORS[line.type] }}
                  >
                    {line.text}
                  </div>
                ))}

                {/* Idle cursor */}
                {phase === 'idle' && (
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
                  nova  utf-8
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
