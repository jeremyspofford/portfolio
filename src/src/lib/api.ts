const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ProfileContent {
  name: string;
  title: string;
  titles?: string[];
  bio: string;
  email: string;
  location?: string;
  socials: {
    github?: string;
    gitlab?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface ExperienceContent {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
  key_deliverables?: ProjectContent[];
}

export interface ProjectContent {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface SkillContent {
  category: string;
  items: string[];
  icon?: string;
  description?: string;
  proficiency?: number; // 0-100 percentage
}

export interface CertificationContent {
  name: string;
  issuer: string;
  date: string;
  issuedDate?: string;
  expirationDate?: string;
  active: boolean;
  link?: string;
  imageUrl?: string;
}

export interface EducationContent {
  degree: string;
  institution: string;
  graduationDate: string;
  gpa?: string;
  honors?: string[];
}

export interface StandaloneProjectContent {
  title: string;
  date: string;
  description: string;
  technologies: string[];
  link?: string | null;
}

export interface ContentItem<T> {
  PK: string;
  SK: string;
  content: T;
}

export async function fetchContent(section: string): Promise<ContentItem<unknown>[]> {
  if (!API_URL) {
    console.warn("API_URL is not defined");
    return [];
  }
  
  try {
    const res = await fetch(`${API_URL}/content?section=${section}`, { next: { revalidate: 60 } }); // Add revalidation
    if (!res.ok) throw new Error("Failed to fetch content");
    return res.json();
  } catch (error) {
    console.error(`Error fetching ${section}:`, error);
    return [];
  }
}

export interface ResumeContent {
    summary?: string;
    experience?: ExperienceContent[];
}

export interface EnhanceResult {
    analysis: string;
    suggested_summary: string;
    key_keywords_found: string[];
}

export async function enhanceContent(jobDescription: string, resumeContent: ResumeContent): Promise<EnhanceResult | null> {
    if (!API_URL) return null;

    try {
        const res = await fetch(`${API_URL}/enhance`, {
            method: 'POST',
            body: JSON.stringify({ jobDescription, resumeContent }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error("Failed to enhance content");
        return res.json();
    } catch (error) {
        console.error("Error enhancing content:", error);
        throw error;
    }
}

// Types for Job Posting Matcher feature
export interface SkillMatchResult {
    skill: string;
    rating: number;
    description: string;
}

export interface JobAnalysisResult {
    skills: SkillMatchResult[];
    overallScore: number;
    summary: string;
}

export interface CandidateSkill {
    category: string;
    items: string[];
    proficiency?: number;
}

export async function analyzeJobPosting(
    jobPosting: string,
    candidateSkills: CandidateSkill[]
): Promise<JobAnalysisResult> {
    if (!API_URL) {
        throw new Error("API_URL is not defined");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
        const res = await fetch(`${API_URL}/enhance`, {
            method: 'POST',
            body: JSON.stringify({
                type: 'job_match',
                jobPosting,
                candidateSkills
            }),
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("Failed to analyze job posting");
        return res.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error("Analysis timed out. Please try again.");
        }
        console.error("Error analyzing job posting:", error);
        throw error;
    }
}
