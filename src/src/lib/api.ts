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

export async function fetchContent(section: string): Promise<ContentItem<any>[]> {
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

export async function enhanceContent(jobDescription: string, resumeContent: Record<string, any>) {
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
export async function chatWithAI(message: string) {
    if (!API_URL) return null;

    try {
        const res = await fetch(`${API_URL}/enhance`, {
            method: 'POST',
            body: JSON.stringify({ type: 'chat', message }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error("Failed to chat with AI");
        return res.json();
    } catch (error) {
        console.error("Error asking AI:", error);
        throw error;
    }
}


