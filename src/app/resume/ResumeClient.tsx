'use client';

import { useState, useMemo } from 'react';
import { Download, Printer, ChevronDown, FileText, FileDown, Loader2, Eye } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  ProfileContent,
  ExperienceContent,
  EducationContent,
  SkillContent,
  CertificationContent,
  ContentItem,
  CandidateSkill
} from '@/lib/api';
import { JobPostingMatcher } from '@/components/JobPostingMatcher';
import { downloadResumePdf, downloadResumeDocx, downloadResumeTxt, type ResumeData } from '@/lib/resumeDownload';

// Type for deliverable items
interface DeliverableContent {
  title: string;
  description: string;
}

interface ResumeClientProps {
    profile: ProfileContent | null;
    experience: ContentItem<ExperienceContent>[];
    education: ContentItem<EducationContent>[];
    skills: ContentItem<SkillContent>[];
    certifications: ContentItem<CertificationContent>[];
}

export function ResumeClient({ profile, experience, education, skills, certifications }: ResumeClientProps) {
  // We no longer need loading state for content since it's passed from server
  // But JobPostingMatcher might have its own state.

  // Convert skills to CandidateSkill format for the JobPostingMatcher
  const candidateSkills: CandidateSkill[] = skills.map(s => ({
    category: s.content.category,
    items: s.content.items,
    proficiency: s.content.proficiency
  }));

  const [downloading, setDownloading] = useState<string | null>(null);

  // Roles considered "legacy" — hidden by default but togglable
  const LEGACY_ROLES = ['Desktop Support Specialist', 'Systems Administrator', 'Conversion Developer'];

  // Track which experience entries are visible (by SK key)
  const [hiddenExperience, setHiddenExperience] = useState<Set<string>>(() => {
    const hidden = new Set<string>();
    for (const item of experience) {
      if (LEGACY_ROLES.includes(item.content.role)) {
        hidden.add(item.SK);
      }
    }
    return hidden;
  });

  const toggleExperience = (sk: string) => {
    setHiddenExperience(prev => {
      const next = new Set(prev);
      if (next.has(sk)) next.delete(sk);
      else next.add(sk);
      return next;
    });
  };

  const visibleExperience = useMemo(
    () => experience.filter(item => !hiddenExperience.has(item.SK)),
    [experience, hiddenExperience]
  );

  // Pass only visible experience to download functions
  const resumeData: ResumeData = { profile: profile || undefined, experience: visibleExperience, education, skills, certifications };

  const handleDownload = async (format: string, fn: () => Promise<void> | void) => {
    setDownloading(format);
    try {
      await fn();
    } catch (err) {
      console.error(`Download ${format} failed:`, err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="container pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Resume</h1>
          <p className="text-muted-foreground">Professional experience and qualifications.</p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 shadow-sm text-sm"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 shadow-sm text-sm">
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Download
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[220px] rounded-lg p-1.5 shadow-xl border"
                style={{ background: '#1F2B45', borderColor: '#3D4F6B' }}
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Label className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#94A3B8]">
                  Generated from data
                </DropdownMenu.Label>

                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#F1F5F9] rounded-md cursor-pointer hover:bg-[#22D3EE]/10 hover:text-[#22D3EE] outline-none"
                  onSelect={() => handleDownload('pdf', () => downloadResumePdf(resumeData))}
                  disabled={downloading !== null}
                >
                  <FileDown className="w-4 h-4" />
                  {downloading === 'pdf' ? 'Generating...' : 'PDF (ATS-friendly)'}
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#F1F5F9] rounded-md cursor-pointer hover:bg-[#22D3EE]/10 hover:text-[#22D3EE] outline-none"
                  onSelect={() => handleDownload('docx', () => downloadResumeDocx(resumeData))}
                  disabled={downloading !== null}
                >
                  <FileDown className="w-4 h-4" />
                  {downloading === 'docx' ? 'Generating...' : 'Word (ATS-friendly)'}
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#F1F5F9] rounded-md cursor-pointer hover:bg-[#22D3EE]/10 hover:text-[#22D3EE] outline-none"
                  onSelect={() => handleDownload('txt', () => downloadResumeTxt(resumeData))}
                  disabled={downloading !== null}
                >
                  <FileDown className="w-4 h-4" />
                  Download Text
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-px my-1.5 mx-2" style={{ background: '#3D4F6B' }} />

                <DropdownMenu.Label className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#94A3B8]">
                  Original files
                </DropdownMenu.Label>

                <DropdownMenu.Item asChild>
                  <a
                    href="/assets/JeremySpoffordSeniorDevOpsEngineer.pdf"
                    download
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#F1F5F9] rounded-md cursor-pointer hover:bg-[#22D3EE]/10 hover:text-[#22D3EE] outline-none"
                  >
                    <FileText className="w-4 h-4" />
                    Original Resume (PDF)
                  </a>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <a
                    href="/assets/Jeremy-Spofford-Senior DevOps Engineer.docx"
                    download
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#F1F5F9] rounded-md cursor-pointer hover:bg-[#22D3EE]/10 hover:text-[#22D3EE] outline-none"
                  >
                    <FileText className="w-4 h-4" />
                    Original Resume (Word)
                  </a>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Experience toggles */}
      <div className="mb-6 p-4 rounded-lg border border-[#1E293B] print:hidden" style={{ background: '#111827' }}>
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-[#94A3B8]" />
          <span className="text-sm font-medium text-[#F1F5F9]">Include in resume</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {[...experience].sort((a, b) => {
            const dateA = a.content.startDate || '';
            const dateB = b.content.startDate || '';
            return dateB.localeCompare(dateA);
          }).map((item) => (
            <label key={item.SK} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={!hiddenExperience.has(item.SK)}
                onChange={() => toggleExperience(item.SK)}
                className="rounded border-[#3D4F6B] bg-[#1F2B45] text-[#22D3EE] focus:ring-[#22D3EE] focus:ring-offset-0"
              />
              <span className={hiddenExperience.has(item.SK) ? 'text-[#475569]' : 'text-[#CBD5E1]'}>
                {item.content.role} <span className="text-[#475569]">@ {item.content.company}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Main Resume Content - Paper Sheet */}
        <div className="relative">
          <div id="resume-paper" className="bg-white border border-zinc-200 shadow-lg print:shadow-none print:border-none p-6 md:p-10 min-h-[11in] mx-auto print:mx-0 print:p-0 text-[13px]">
            {/* Header */}
            <header className="border-b-2 border-zinc-900 pb-4 mb-6">
                <>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 mb-2 uppercase">
                    {profile?.name || "Name"}
                  </h2>
                  <div className="flex flex-col md:flex-row md:items-center justify-between text-zinc-600 font-medium">
                    <p className="text-sm text-zinc-900">{profile?.title}</p>
                    <div className="flex flex-col md:flex-row md:gap-4 text-xs mt-1 md:mt-0">
                      <span className="hover:text-primary transition-colors">{profile?.email}</span>
                      {profile?.socials?.github && (
                        <>
                          <span className="hidden md:inline text-zinc-300">|</span>
                          <span className="hover:text-primary transition-colors">{profile.socials.github}</span>
                        </>
                      )}
                      {profile?.location && (
                        <>
                          <span className="hidden md:inline text-zinc-300">|</span>
                          <span>{profile.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </>
            </header>

            <div className="space-y-5">
              {/* Summary */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-100 pb-1.5">
                  Professional Summary
                </h3>
                  <p className="text-zinc-700 leading-relaxed max-w-3xl">
                    {profile?.bio}
                  </p>
              </section>

              {/* Experience */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-100 pb-1.5">
                  Work Experience
                </h3>
                <div className="space-y-5">
                    {[...visibleExperience].sort((a, b) => {
                      const dateA = a.content.startDate || '';
                      const dateB = b.content.startDate || '';
                      return dateB.localeCompare(dateA);
                    }).map((item) => (
                      <div key={item.SK} className="group">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                          <h4 className="text-sm font-bold text-zinc-900">
                            {item.content.role} <span className="font-normal text-zinc-500">at</span> {item.content.company}
                          </h4>
                          <span className="text-xs text-zinc-500 shrink-0">
                            {item.content.startDate} — {item.content.endDate}
                          </span>
                        </div>
                        <p className="text-zinc-700 leading-relaxed mb-2 text-[13px]">
                          {item.content.description}
                        </p>

                        {/* Key Deliverables (if any) */}
                        {item.content.key_deliverables && item.content.key_deliverables.length > 0 && (
                          <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-zinc-600">
                            {item.content.key_deliverables.map((del: DeliverableContent, idx: number) => (
                              <li key={idx} className="pl-1">
                                <span className="font-semibold text-zinc-800">{del.title}</span>: {del.description}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Technologies */}
                        {item.content.technologies && item.content.technologies.length > 0 && (
                          <p className="text-[11px] text-zinc-500 mt-2">
                            {item.content.technologies.join(' \u00B7 ')}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </section>

              {/* Education */}
              {education.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-100 pb-1.5">
                    Education
                  </h3>
                  <div className="space-y-4">
                    {education.map((item) => (
                      <div key={item.SK}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                          <h4 className="text-sm font-bold text-zinc-900">
                            {item.content.degree}
                          </h4>
                          <span className="text-xs text-zinc-500 shrink-0">
                            {item.content.graduationDate}
                          </span>
                        </div>
                        <p className="text-zinc-700 mb-1">
                          {item.content.institution}
                        </p>
                        {item.content.gpa && (
                          <p className="text-sm text-zinc-600">
                            GPA: {item.content.gpa}
                          </p>
                        )}
                        {item.content.honors && item.content.honors.length > 0 && (
                          <ul className="list-disc list-outside ml-4 mt-2 space-y-1 text-sm text-zinc-600">
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

              {/* Skills */}
              {skills.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-100 pb-1.5">
                    Skills
                  </h3>
                  <div className="space-y-2">
                    {skills.map((skill) => (
                      <p key={skill.SK} className="text-[13px] text-zinc-700">
                        <span className="font-bold text-zinc-900">{skill.content.category}:</span>{' '}
                        {skill.content.items.join(", ")}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                 <section>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-100 pb-1.5">
                     Certifications
                   </h3>
                   <div className="space-y-4">
                     {certifications.map((cert) => (
                       <div key={cert.SK} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                         <div>
                           <h4 className="text-sm font-bold text-zinc-900">
                             {cert.content.name}
                           </h4>
                           <p className="text-xs text-zinc-600">
                             {cert.content.issuer}
                           </p>
                         </div>
                         <div className="text-xs text-zinc-500 mt-1 sm:mt-0">
                           {cert.content.date}
                         </div>
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
