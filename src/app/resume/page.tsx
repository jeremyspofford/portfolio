import { fetchContent } from '@/lib/content';
import {
  ProfileContent,
  ExperienceContent,
  EducationContent,
  SkillContent,
  CertificationContent,
  ContentItem
} from '@/lib/api';
import { ResumeClient } from './ResumeClient';

export default async function ResumePage() {
  const [pData, eData, eduData, skillData, certData] = await Promise.all([
    fetchContent("PROFILE"),
    fetchContent("EXPERIENCE"),
    fetchContent("EDUCATION"),
    fetchContent("SKILLS"),
    fetchContent("CERTIFICATIONS")
  ]);

  const profileItem = pData.find((item) => item.SK === "MAIN");
  const profile = profileItem ? (profileItem.content as ProfileContent) : null;
  const experience = eData as ContentItem<ExperienceContent>[];
  const education = eduData as ContentItem<EducationContent>[];
  const skills = skillData as ContentItem<SkillContent>[];
  const certifications = certData as ContentItem<CertificationContent>[];

  return <ResumeClient 
    profile={profile} 
    experience={experience} 
    education={education} 
    skills={skills}
    certifications={certifications}
  />;
}
