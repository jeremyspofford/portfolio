'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import {
  fetchContent,
  ProfileContent,
  ExperienceContent,
  EducationContent,
  SkillContent,
  ContentItem,
  CandidateSkill
} from '@/lib/api';
import { JobPostingMatcher } from '@/components/JobPostingMatcher';

// Type for deliverable items
interface DeliverableContent {
  title: string;
  description: string;
}

export default function ResumePage() {
  const [profile, setProfile] = useState<ProfileContent | null>(null);
  const [experience, setExperience] = useState<ContentItem<ExperienceContent>[]>([]);
  const [education, setEducation] = useState<ContentItem<EducationContent>[]>([]);
  const [skills, setSkills] = useState<ContentItem<SkillContent>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [pData, eData, eduData, skillData] = await Promise.all([
          fetchContent("PROFILE"),
          fetchContent("EXPERIENCE"),
          fetchContent("EDUCATION"),
          fetchContent("SKILL")
        ]);

        const profileItem = pData.find((item) => item.SK === "MAIN");
        if (profileItem) {
          setProfile(profileItem.content as ProfileContent);
        }
        setExperience(eData as ContentItem<ExperienceContent>[]);
        setEducation(eduData as ContentItem<EducationContent>[]);
        setSkills(skillData as ContentItem<SkillContent>[]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Convert skills to CandidateSkill format for the JobPostingMatcher
  const candidateSkills: CandidateSkill[] = skills.map(s => ({
    category: s.content.category,
    items: s.content.items,
    proficiency: s.content.proficiency
  }));

  return (
    <div className="container py-12 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Resume</h1>
          <p className="text-muted-foreground">Professional experience and qualifications.</p>
        </div>
        <div className="flex gap-4">
          {process.env.NEXT_PUBLIC_SHOW_RESUME_DOWNLOAD === 'true' && (
            <a
              href="/resume.pdf"
              download="JeremySpofford_Resume.pdf"
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          )}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 shadow-sm"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Main Resume Content - Paper Sheet */}
        <div className="relative">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg print:shadow-none print:border-none p-8 md:p-12 min-h-[11in] mx-auto print:mx-0 print:p-0">
            {/* Header */}
            <header className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-8 mb-8">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-4" />
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
                </div>
              ) : (
                <>
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 uppercase">
                    {profile?.name || "Name"}
                  </h2>
                  <div className="flex flex-col md:flex-row md:items-center justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                    <p className="text-lg text-zinc-900 dark:text-zinc-200">{profile?.title}</p>
                    <div className="flex flex-col md:flex-row md:gap-6 text-sm mt-2 md:mt-0">
                      <span className="hover:text-primary transition-colors">{profile?.email}</span>
                      {profile?.socials?.github && (
                        <>
                          <span className="hidden md:inline text-zinc-300 dark:text-zinc-700">|</span>
                          <span className="hover:text-primary transition-colors">{profile.socials.github}</span>
                        </>
                      )}
                      {profile?.location && (
                        <>
                          <span className="hidden md:inline text-zinc-300 dark:text-zinc-700">|</span>
                          <span>{profile.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </header>

            <div className="space-y-8">
              {/* Summary */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  Professional Summary
                </h3>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full mb-2" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6" />
                  </div>
                ) : (
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
                    {profile?.bio}
                  </p>
                )}
              </section>

              {/* Experience */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  Work Experience
                </h3>
                <div className="space-y-8">
                  {isLoading ? (
                    <div className="animate-pulse space-y-6">
                      {[1, 2].map(i => (
                        <div key={i}>
                          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 mb-2" />
                          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full mb-2" />
                          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-4/5" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    experience.map((item) => (
                      <div key={item.SK} className="group">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                          <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            {item.content.role} <span className="font-normal text-zinc-500">at</span> {item.content.company}
                          </h4>
                          <span className="text-sm font-mono text-zinc-500 shrink-0 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                            {item.content.startDate} — {item.content.endDate}
                          </span>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                          {item.content.description}
                        </p>

                        {/* Key Deliverables (if any) */}
                        {item.content.key_deliverables && item.content.key_deliverables.length > 0 && (
                          <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                            {item.content.key_deliverables.map((del: DeliverableContent, idx: number) => (
                              <li key={idx} className="pl-1">
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{del.title}</span>: {del.description}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Technologies (Chips) */}
                        {item.content.technologies && item.content.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {item.content.technologies.slice(0, 5).map((tech: string) => (
                              <span key={tech} className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Education */}
              {education.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    Education
                  </h3>
                  <div className="space-y-4">
                    {education.map((item) => (
                      <div key={item.SK}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                          <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            {item.content.degree}
                          </h4>
                          <span className="text-sm font-mono text-zinc-500 shrink-0 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                            {item.content.graduationDate}
                          </span>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 mb-1">
                          {item.content.institution}
                        </p>
                        {item.content.gpa && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            GPA: {item.content.gpa}
                          </p>
                        )}
                        {item.content.honors && item.content.honors.length > 0 && (
                          <ul className="list-disc list-outside ml-4 mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                            {item.content.honors.map((honor: string, idx: number) => (
                              <li key={idx} className="pl-1">{honor}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Recruiter Job Fit Analyzer - Sidebar */}
        <div className="print:hidden">
          <div className="sticky top-24">
            <JobPostingMatcher candidateSkills={candidateSkills} />
          </div>
        </div>
      </div>
    </div>
  );
}
