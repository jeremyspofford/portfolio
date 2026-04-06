import type {
  ProfileContent,
  ExperienceContent,
  EducationContent,
  SkillContent,
  CertificationContent,
  ContentItem,
} from './api';

export interface ResumeData {
  profile?: ProfileContent;
  experience: ContentItem<ExperienceContent>[];
  education: ContentItem<EducationContent>[];
  skills: ContentItem<SkillContent>[];
  certifications: ContentItem<CertificationContent>[];
}

// ── PDF (from rendered DOM) ──────────────────────────────────────────────────

export async function downloadResumePdf(
  elementId: string,
  filename: string = 'JeremySpofford_Resume.pdf'
): Promise<void> {
  const html2pdf = (await import('html2pdf.js')).default;
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Resume element not found');

  await html2pdf().set({
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  }).from(element).save();
}

// ── Word (.docx from data) ───────────────────────────────────────────────────

export async function downloadResumeDocx(
  data: ResumeData,
  filename: string = 'JeremySpofford_Resume.docx'
): Promise<void> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx');
  const { saveAs } = await import('file-saver');

  const { profile, experience, education, skills, certifications } = data;

  const sortedExperience = [...experience].sort((a, b) =>
    (b.content.startDate || b.SK).localeCompare(a.content.startDate || a.SK)
  );

  const sectionDivider = () => new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
    spacing: { after: 200 },
  });

  const sections: InstanceType<typeof Paragraph>[] = [];

  // Header
  if (profile) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: profile.name.toUpperCase(), bold: true, size: 32, font: 'Calibri' })],
        alignment: AlignmentType.LEFT,
        spacing: { after: 40 },
      }),
      new Paragraph({
        children: [new TextRun({ text: profile.title, size: 22, color: '666666', font: 'Calibri' })],
        spacing: { after: 40 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: profile.email, size: 20, font: 'Calibri' }),
          profile.location ? new TextRun({ text: ` | ${profile.location}`, size: 20, font: 'Calibri' }) : new TextRun(''),
          profile.socials?.github ? new TextRun({ text: ` | ${profile.socials.github}`, size: 20, font: 'Calibri' }) : new TextRun(''),
          profile.socials?.linkedin ? new TextRun({ text: ` | ${profile.socials.linkedin}`, size: 20, font: 'Calibri' }) : new TextRun(''),
        ],
        spacing: { after: 100 },
      }),
      sectionDivider(),
    );

    // Summary
    sections.push(
      new Paragraph({ text: 'PROFESSIONAL SUMMARY', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
      new Paragraph({ children: [new TextRun({ text: profile.bio, size: 20, font: 'Calibri' })], spacing: { after: 200 } }),
      sectionDivider(),
    );
  }

  // Experience
  sections.push(
    new Paragraph({ text: 'WORK EXPERIENCE', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
  );

  for (const item of sortedExperience) {
    const exp = item.content;
    const endDate = exp.endDate === 'Present' ? 'Present' : exp.endDate;

    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${exp.role}`, bold: true, size: 22, font: 'Calibri' }),
          new TextRun({ text: ` | ${exp.company}`, size: 22, font: 'Calibri' }),
        ],
        spacing: { before: 160, after: 40 },
      }),
      new Paragraph({
        children: [new TextRun({ text: `${exp.startDate} – ${endDate}`, size: 20, color: '888888', font: 'Calibri' })],
        spacing: { after: 60 },
      }),
      new Paragraph({
        children: [new TextRun({ text: exp.description, size: 20, font: 'Calibri' })],
        spacing: { after: 60 },
      }),
    );

    if (exp.key_deliverables?.length) {
      for (const kd of exp.key_deliverables) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${kd.title}: `, bold: true, size: 20, font: 'Calibri' }),
              new TextRun({ text: kd.description, size: 20, font: 'Calibri' }),
            ],
            bullet: { level: 0 },
            spacing: { after: 40 },
          }),
        );
      }
    }

    if (exp.technologies?.length) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: exp.technologies.join(' · '), size: 18, color: '888888', font: 'Calibri' })],
          spacing: { after: 100 },
        }),
      );
    }
  }

  sections.push(sectionDivider());

  // Education
  if (education.length > 0) {
    sections.push(
      new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
    );

    for (const item of education) {
      const edu = item.content;
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true, size: 22, font: 'Calibri' }),
            new TextRun({ text: ` – ${edu.institution}`, size: 22, font: 'Calibri' }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: edu.graduationDate, size: 20, color: '888888', font: 'Calibri' })],
          spacing: { after: 100 },
        }),
      );
    }

    sections.push(sectionDivider());
  }

  // Skills
  if (skills.length > 0) {
    sections.push(
      new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
    );

    for (const item of skills) {
      const skill = item.content;
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${skill.category}: `, bold: true, size: 20, font: 'Calibri' }),
            new TextRun({ text: skill.items.join(', '), size: 20, font: 'Calibri' }),
          ],
          spacing: { after: 60 },
        }),
      );
    }

    sections.push(sectionDivider());
  }

  // Certifications
  if (certifications.length > 0) {
    sections.push(
      new Paragraph({ text: 'CERTIFICATIONS', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
    );

    for (const item of certifications) {
      const cert = item.content;
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 20, font: 'Calibri' }),
            new TextRun({ text: ` – ${cert.issuer}`, size: 20, font: 'Calibri' }),
            new TextRun({ text: ` (${cert.date})`, size: 20, color: '888888', font: 'Calibri' }),
          ],
          spacing: { after: 60 },
        }),
      );
    }
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
      },
      children: sections,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

// ── Plain Text ───────────────────────────────────────────────────────────────

export function downloadResumeTxt(
  data: ResumeData,
  filename: string = 'JeremySpofford_Resume.txt'
): void {
  const { profile, experience, education, skills, certifications } = data;
  const lines: string[] = [];

  if (profile) {
    lines.push(profile.name.toUpperCase());
    lines.push(profile.title);
    const contact = [profile.email, profile.location, profile.socials?.github, profile.socials?.linkedin].filter(Boolean);
    lines.push(contact.join(' | '));
    lines.push('');
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('-'.repeat(40));
    lines.push(profile.bio);
    lines.push('');
  }

  const sortedExperience = [...experience].sort((a, b) =>
    (b.content.startDate || b.SK).localeCompare(a.content.startDate || a.SK)
  );

  lines.push('WORK EXPERIENCE');
  lines.push('-'.repeat(40));

  for (const item of sortedExperience) {
    const exp = item.content;
    const endDate = exp.endDate === 'Present' ? 'Present' : exp.endDate;
    lines.push(`${exp.role} at ${exp.company} (${exp.startDate} – ${endDate})`);
    lines.push(exp.description);
    if (exp.key_deliverables?.length) {
      for (const kd of exp.key_deliverables) {
        lines.push(`  - ${kd.title}: ${kd.description}`);
      }
    }
    if (exp.technologies?.length) {
      lines.push(`  Technologies: ${exp.technologies.join(', ')}`);
    }
    lines.push('');
  }

  if (education.length > 0) {
    lines.push('EDUCATION');
    lines.push('-'.repeat(40));
    for (const item of education) {
      const edu = item.content;
      lines.push(`${edu.degree} – ${edu.institution} (${edu.graduationDate})`);
    }
    lines.push('');
  }

  if (skills.length > 0) {
    lines.push('SKILLS');
    lines.push('-'.repeat(40));
    for (const item of skills) {
      const skill = item.content;
      lines.push(`${skill.category}: ${skill.items.join(', ')}`);
    }
    lines.push('');
  }

  if (certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    lines.push('-'.repeat(40));
    for (const item of certifications) {
      const cert = item.content;
      lines.push(`${cert.name} – ${cert.issuer} (${cert.date})`);
    }
  }

  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
