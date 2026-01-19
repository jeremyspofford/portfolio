'use client';

import { useState } from 'react';
import { Briefcase, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { SkillStarChart, SkillMatch } from './SkillStarChart';
import { analyzeJobPosting, CandidateSkill, JobAnalysisResult } from '@/lib/api';

interface JobPostingMatcherProps {
  candidateSkills: CandidateSkill[];
}

export function JobPostingMatcher({ candidateSkills }: JobPostingMatcherProps) {
  const [jobPosting, setJobPosting] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!jobPosting.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeJobPosting(jobPosting, candidateSkills);
      setResult(analysisResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze job posting';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Convert JobAnalysisResult skills to SkillMatch format for the chart
  const skillMatches: SkillMatch[] = result?.skills ?? [];

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <h3 className="font-bold flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-indigo-500" />
        Job Fit Analyzer
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Paste a job posting to see how well this candidate matches the requirements.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="job-posting" className="sr-only">
            Job Posting
          </label>
          <textarea
            id="job-posting"
            aria-label="Job Posting"
            className="w-full h-48 p-3 text-sm border rounded-lg bg-background resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
            placeholder="Paste a job posting here to analyze skill match..."
            value={jobPosting}
            onChange={(e) => setJobPosting(e.target.value)}
            disabled={isAnalyzing}
            maxLength={10000}
            aria-describedby="job-posting-hint"
          />
          <p id="job-posting-hint" className="text-xs text-muted-foreground mt-1">
            {jobPosting.length.toLocaleString()} / 10,000 characters
          </p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!jobPosting.trim() || isAnalyzing}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze Match
            </>
          )}
        </button>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Failed to analyze job posting. Please try again.</span>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <SkillStarChart
              skills={skillMatches}
              overallScore={result.overallScore}
            />

            {result.summary && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-900 rounded-lg">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                  Summary
                </h4>
                <p className="text-sm text-green-800 dark:text-green-300 leading-relaxed">
                  {result.summary}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
