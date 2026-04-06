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

// ── PDF (ATS-compatible, text-based via jsPDF) ──────────────────────────────

export async function downloadResumePdf(
  data: ResumeData,
  filename: string = 'JeremySpofford_Resume.pdf'
): Promise<void> {
  const { default: jsPDF } = await import('jspdf');

  const { profile, experience, education, skills, certifications } = data;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (needed: number) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const drawLine = () => {
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;
  };

  // Wrap text and return lines
  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, maxWidth);
  };

  // Header
  if (profile) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(profile.name.toUpperCase(), margin, y);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(profile.title, margin, y);
    y += 16;

    doc.setFontSize(9);
    const contactParts = [profile.email, profile.location, profile.socials?.github, profile.socials?.linkedin].filter(Boolean);
    doc.text(contactParts.join('  |  '), margin, y);
    y += 20;

    doc.setTextColor(0);
    drawLine();

    // Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('PROFESSIONAL SUMMARY', margin, y);
    y += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const bioLines = wrapText(profile.bio, contentWidth, 10);
    checkPageBreak(bioLines.length * 14);
    doc.text(bioLines, margin, y);
    y += bioLines.length * 14 + 12;

    drawLine();
  }

  // Experience
  const sortedExperience = [...experience].sort((a, b) =>
    (b.content.startDate || b.SK).localeCompare(a.content.startDate || a.SK)
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('WORK EXPERIENCE', margin, y);
  y += 18;

  for (const item of sortedExperience) {
    const exp = item.content;
    const endDate = exp.endDate === 'Present' ? 'Present' : exp.endDate;

    checkPageBreak(80);

    // Role + Company
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`${exp.role} | ${exp.company}`, margin, y);

    // Dates (right-aligned)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120);
    const dateStr = `${exp.startDate} – ${endDate}`;
    const dateWidth = doc.getTextWidth(dateStr);
    doc.text(dateStr, pageWidth - margin - dateWidth, y);
    y += 16;

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50);
    const descLines = wrapText(exp.description, contentWidth, 9);
    checkPageBreak(descLines.length * 13);
    doc.text(descLines, margin, y);
    y += descLines.length * 13 + 4;

    // Key deliverables
    if (exp.key_deliverables?.length) {
      for (const kd of exp.key_deliverables) {
        checkPageBreak(26);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(50);
        const bulletText = `${kd.title}: ${kd.description}`;
        const bulletLines = wrapText(bulletText, contentWidth - 15, 9);
        doc.text('•', margin + 5, y);
        doc.text(bulletLines, margin + 15, y);
        y += bulletLines.length * 13 + 2;
      }
    }

    // Technologies
    if (exp.technologies?.length) {
      checkPageBreak(16);
      doc.setFontSize(8);
      doc.setTextColor(140);
      doc.text(exp.technologies.join(' · '), margin, y);
      y += 14;
    }

    y += 8;
  }

  drawLine();

  // Education
  if (education.length > 0) {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text('EDUCATION', margin, y);
    y += 18;

    for (const item of education) {
      const edu = item.content;
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${edu.degree} – ${edu.institution}`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120);
      const gradWidth = doc.getTextWidth(edu.graduationDate);
      doc.text(edu.graduationDate, pageWidth - margin - gradWidth, y);
      doc.setTextColor(0);
      y += 20;
    }

    drawLine();
  }

  // Skills
  if (skills.length > 0) {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text('SKILLS', margin, y);
    y += 18;

    for (const item of skills) {
      const skill = item.content;
      checkPageBreak(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0);
      const labelWidth = doc.getTextWidth(`${skill.category}: `);
      doc.text(`${skill.category}: `, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      const itemsLines = wrapText(skill.items.join(', '), contentWidth - labelWidth, 9);
      doc.text(itemsLines, margin + labelWidth, y);
      y += itemsLines.length * 13 + 4;
    }

    drawLine();
  }

  // Certifications
  if (certifications.length > 0) {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text('CERTIFICATIONS', margin, y);
    y += 18;

    for (const item of certifications) {
      const cert = item.content;
      checkPageBreak(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0);
      doc.text(cert.name, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80);
      doc.text(` – ${cert.issuer} (${cert.date})`, margin + doc.getTextWidth(cert.name), y);
      y += 15;
    }
  }

  doc.save(filename);
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
