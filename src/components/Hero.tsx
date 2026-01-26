"use client";

import { Github, Linkedin, Mail, FileText, Gitlab } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Typewriter } from "./Typewriter";

import { ContentItem, CertificationContent, ProfileContent } from "@/lib/api";

interface HeroProps {
  profile: ProfileContent | undefined;
  certifications: ContentItem<CertificationContent>[];
}

export function Hero({ profile, certifications }: HeroProps) {
  const [bootSequenceComplete, setBootSequenceComplete] = useState(false);
  const [bootLog, setBootLog] = useState<string[]>([]);
  
  // Filter active certifications
  const activeCerts = certifications
      .map(c => c.content)
      .filter(c => c.active);

  useEffect(() => {
    const sequence = [
      "> INITIALIZING KERNEL...",
      "> LOADING MODULES...",
      "> MOUNTING VOLUMES...",
      "> CONNECTING TO CLOUD...",
      "> SYSTEM READY."
    ];
    
    let delay = 0;
    sequence.forEach((line, index) => {
        delay += Math.floor(Math.random() * 300) + 200;
        setTimeout(() => {
            setBootLog(prev => [...prev, line]);
            if (index === sequence.length - 1) {
                setTimeout(() => setBootSequenceComplete(true), 500);
            }
        }, delay);
    });
  }, []);

  if (!profile) return null;

  if (!bootSequenceComplete) {
      return (
          <section className="w-full min-h-[100dvh] flex items-center justify-center bg-black font-mono text-green-500 p-4 sm:p-8 overflow-hidden">
              <div className="w-full max-w-2xl text-sm sm:text-base">
                  {bootLog.map((line, i) => (
                      <div key={i} className="mb-2">{line}</div>
                  ))}
                  <div className="animate-pulse">_</div>
              </div>
          </section>
      );
  }

  return (
    <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 flex flex-col items-center text-center px-4">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              {profile.name}
            </h1>
            <div className="h-7 sm:h-8 md:h-10 text-lg sm:text-xl md:text-2xl lg:text-3xl font-mono text-gray-500 dark:text-gray-400">
                <span className="mr-1 sm:mr-2">&gt;</span>
                <Typewriter words={profile.titles || [profile.title]} />
            </div>

            {/* Roles Open To */}
            <div className="text-xs sm:text-sm text-gray-400 mt-2 font-mono">
                <span className="text-primary mr-1 sm:mr-2">[OPEN_TO]:</span>
                <span className="hidden sm:inline">{profile.titles?.join(" | ")}</span>
                <span className="sm:hidden">{profile.titles?.[0]}</span>
            </div>

            <p className="mx-auto max-w-[700px] text-sm sm:text-base text-gray-500 md:text-lg dark:text-gray-400">
              {profile.bio}
            </p>

            {/* Career Direction / AI Roadmap */}
            <div className="mt-4 sm:mt-6 px-4 py-3 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 dark:from-violet-500/20 dark:to-indigo-500/20 border border-violet-200 dark:border-violet-800/50 rounded-lg max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
                <span className="text-violet-600 dark:text-violet-400">Career Direction:</span>
                <span className="text-gray-700 dark:text-gray-300">Senior Platform AI Engineer</span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                Bridging DevOps expertise with AI/ML infrastructure
              </p>
            </div>

            {/* Active Certifications Chips */}
            {activeCerts.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                    {activeCerts.map((cert) => (
                        <span key={cert.name} className="inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                            {cert.name}
                        </span>
                    ))}
                </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/resume"
              className={cn(
                "inline-flex h-10 sm:h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Resume
            </Link>
             <Link
              href={`mailto:${profile.email}`}
              className={cn(
                "inline-flex h-10 sm:h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </Link>
          </div>
           <div className="flex space-x-5 sm:space-x-4 mt-4">
            {profile.socials?.github && (
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-1">
                    <Github className="h-6 w-6" />
                </a>
            )}
             {profile.socials?.linkedin && (
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-1">
                    <Linkedin className="h-6 w-6" />
                </a>
            )}
             {profile.socials?.gitlab && (
                <a href={profile.socials.gitlab} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-1">
                    <Gitlab className="h-6 w-6" />
                </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
