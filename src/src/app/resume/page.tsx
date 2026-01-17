'use client';

import { useState, useEffect } from 'react';
import { Download, Sparkles, Loader2, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { enhanceContent, fetchContent } from '@/lib/api';

export default function ResumePage() {
  const [jobDescription, setJobDescription] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
        const [pData, eData, eduData] = await Promise.all([
            fetchContent("PROFILE"),
            fetchContent("EXPERIENCE"),
            fetchContent("EDUCATION")
        ]);
        setProfile(pData.find((item: any) => item.SK === "MAIN")?.content);
        setExperience(eData);
        setEducation(eduData);
    }
    loadData();
  }, []);

  const handleEnhance = async () => {
    if (!jobDescription) return;
    setIsEnhancing(true);
    setAiAnalysis(null);
    try {
        const result = await enhanceContent(jobDescription, {
            summary: profile?.bio,
            experience: experience.map(e => e.content)
        });
        setAiAnalysis(result);
    } catch (error) {
        alert("Failed to generate AI insights. Check console.");
    } finally {
        setIsEnhancing(false);
    }
  };

  return (
    <div className="container py-12 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8 print:hidden">
        <div>
           <h1 className="text-3xl font-bold tracking-tight mb-2">Resume Generator</h1>
           <p className="text-muted-foreground">Tailor your resume with AI before printing.</p>
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

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        {/* Main Resume Content - Paper Sheet */}
        <div className="relative">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg print:shadow-none print:border-none p-8 md:p-12 min-h-[11in] mx-auto print:mx-0 print:p-0">
            {/* Header */}
            <header className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-8 mb-8">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 uppercase">
                        {profile?.name || "Loading..."}
                    </h2>
                    <div className="flex flex-col md:flex-row md:items-center justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                        <p className="text-lg text-zinc-900 dark:text-zinc-200">{profile?.title}</p>
                        <div className="flex flex-col md:flex-row md:gap-6 text-sm mt-2 md:mt-0">
                             <span className="hover:text-primary transition-colors">{profile?.email}</span>
                             <span className="hidden md:inline text-zinc-300 dark:text-zinc-700">|</span>
                             <span className="hover:text-primary transition-colors">github.com/jeremyspofford</span>
                             <span className="hidden md:inline text-zinc-300 dark:text-zinc-700">|</span>
                             <span>{profile?.location}</span>
                        </div>
                    </div>
            </header>
            
            <div className="space-y-8">
                    {/* AI Suggestion (Injects into view but isn't part of the "traditional" resume document structure unless desirable) */}
                    {aiAnalysis && (
                        <div className="print:hidden bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-md mb-6 animate-in slide-in-from-top-2">
                            <h3 className="text-purple-700 dark:text-purple-300 font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <Sparkles className="w-4 h-4" /> AI Suggestion
                            </h3>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                                &quot;{aiAnalysis.suggested_summary}&quot;
                            </p>
                        </div>
                    )}

                    {/* Summary */}
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                            Professional Summary
                        </h3>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
                            {profile?.bio}
                        </p>
                    </section>

                    {/* Experience */}
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                            Work Experience
                        </h3>
                        <div className="space-y-8">
                            {experience.map((item: any) => (
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
                                    {item.content.key_deliverables && (
                                        <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                                            {item.content.key_deliverables.map((del: any, idx: number) => (
                                                <li key={idx} className="pl-1">
                                                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{del.title}</span>: {del.description}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Technologies (Chips) */}
                                    {item.content.technologies && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {item.content.technologies.slice(0, 5).map((tech: string) => (
                                                 <span key={tech} className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                                                     {tech}
                                                 </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    {education.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                                Education
                            </h3>
                            <div className="space-y-4">
                                {education.map((item: any) => (
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

        {/* AI Sidebar */}
        <div className="space-y-4 print:hidden">
            <div className="sticky top-24 space-y-4">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        AI Customization
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Paste a job description to tailor your resume summary and highlight relevant skills.
                    </p>
                    <div className="space-y-3">
                        <textarea
                            className="w-full h-48 p-3 text-sm border rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                            placeholder="Paste job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                        <button
                            disabled={!jobDescription || isEnhancing}
                            onClick={handleEnhance}
                            className={cn(
                                "w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:opacity-95 transition-all",
                                (isEnhancing || !jobDescription) && "opacity-50 cursor-not-allowed shadow-none"
                            )}
                        >
                            {isEnhancing ? (
                                <> <Loader2 className="w-4 h-4 animate-spin" /> Analyzing... </>
                            ) : (
                                <> <Sparkles className="w-4 h-4" /> Tailor Resume </>
                            )}
                        </button>
                    </div>
                </div>

                {aiAnalysis && (
                    <div className="bg-background border rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                        <h4 className="font-semibold text-sm mb-3 text-green-600 flex items-center gap-2">
                             <BadgeCheck className="w-4 h-4" /> Analysis Complete
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <h5 className="text-xs font-bold uppercase text-muted-foreground mb-1">Match Analysis</h5>
                                <p className="text-sm leading-relaxed">{aiAnalysis.analysis}</p>
                            </div>
                            <div>
                                <h5 className="text-xs font-bold uppercase text-muted-foreground mb-2">Keywords Found</h5>
                                <div className="flex flex-wrap gap-1.5">
                                    {aiAnalysis.key_keywords_found?.map((k: string) => (
                                        <span key={k} className="text-[10px] font-medium px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                            {k}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
