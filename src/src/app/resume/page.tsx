'use client';

import { useState, useEffect } from 'react';
import { Download, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { enhanceContent, fetchContent } from '@/lib/api';

export default function ResumePage() {
  const [jobDescription, setJobDescription] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [experience, setExperience] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
        const [pData, eData] = await Promise.all([
            fetchContent("PROFILE"),
            fetchContent("EXPERIENCE")
        ]);
        setProfile(pData.find((item: any) => item.SK === "MAIN")?.content);
        setExperience(eData);
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
    <div className="container max-w-4xl py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Resume Generator</h1>
        <div className="flex gap-4">
          {process.env.NEXT_PUBLIC_SHOW_RESUME_DOWNLOAD === 'true' && (
            <a
              href="/resume.pdf"
              download="JeremySpofford_Resume.pdf"
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          )}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        {/* Main Resume Content */}
        <div className="bg-card text-card-foreground border rounded-lg p-8 shadow-sm print:shadow-none print:border-none print:p-0">
           <div className="text-center border-b pb-6 mb-6">
                <h2 className="text-3xl font-bold">{profile?.name || "Loading..."}</h2>
                <p className="text-muted-foreground">{profile?.title}</p>
                <div className="text-sm mt-2 space-x-2 text-muted-foreground">
                    <span>{profile?.email}</span>
                    <span className="print:hidden">•</span>
                    <span className="print:hidden">github.com/jeremyspofford</span>
                </div>
           </div>
           
           <div className="space-y-6">
                {aiAnalysis && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-md mb-6">
                        <h3 className="text-purple-700 dark:text-purple-300 font-semibold mb-2 flex items-center gap-2">
                             <Sparkles className="w-4 h-4" /> AI Suggestion
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                            "{aiAnalysis.suggested_summary}"
                        </p>
                    </div>
                )}

                <section>
                    <h3 className="font-bold text-lg border-b mb-2">Summary</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {profile?.bio}
                    </p>
                </section>

                <section>
                    <h3 className="font-bold text-lg border-b mb-2">Experience</h3>
                    <div className="space-y-6">
                         {experience.map((item: any) => (
                             <div key={item.SK}>
                                <div className="flex justify-between font-semibold">
                                    <span>{item.content.role}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {item.content.startDate} - {item.content.endDate}
                                    </span>
                                </div>
                                <p className="text-sm italic mb-1">{item.content.company}</p>
                                <p className="text-sm text-muted-foreground">
                                    {item.content.description}
                                </p>
                             </div>
                         ))}
                    </div>
                </section>
           </div>
        </div>

        {/* AI Sidebar */}
        <div className="space-y-4 print:hidden">
          <div className="bg-card border rounded-lg p-4 sticky top-20">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Customize with AI
            </h3>
            <div className="space-y-2">
                <label className="text-xs font-medium">Paste Job Description:</label>
                <textarea
                    className="w-full h-40 p-2 text-sm border rounded-md bg-background resize-none focus:ring-1 focus:ring-primary"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
            </div>
            
            <button
                disabled={!jobDescription || isEnhancing}
                onClick={handleEnhance}
                className={cn(
                    "w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:opacity-90 transition-opacity",
                    (isEnhancing || !jobDescription) && "opacity-50 cursor-not-allowed"
                )}
            >
                {isEnhancing ? (
                    <> <Loader2 className="w-4 h-4 animate-spin" /> Analyzing... </>
                ) : (
                    <> <Sparkles className="w-4 h-4" /> Tailor Resume </>
                )}
            </button>
            
            {aiAnalysis && (
                <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm mb-2">Analysis Match</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                        {aiAnalysis.analysis}
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {aiAnalysis.key_keywords_found?.map((k: string) => (
                            <span key={k} className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full dark:bg-green-900 dark:text-green-300">
                                {k}
                            </span>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
