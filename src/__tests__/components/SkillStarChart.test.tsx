import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillStarChart, SkillMatch } from '@/components/SkillStarChart';

describe('SkillStarChart', () => {
  const mockSkills: SkillMatch[] = [
    { skill: 'AWS', rating: 5, description: 'Expert level match' },
    { skill: 'Kubernetes', rating: 4, description: 'Strong match' },
    { skill: 'Python', rating: 3, description: 'Moderate match' },
    { skill: 'React', rating: 2, description: 'Some experience' },
    { skill: 'Java', rating: 1, description: 'Limited experience' },
  ];

  it('renders the component title', () => {
    render(<SkillStarChart skills={mockSkills} />);
    expect(screen.getByText('Skill Match Analysis')).toBeInTheDocument();
  });

  it('renders all skill names', () => {
    render(<SkillStarChart skills={mockSkills} />);
    mockSkills.forEach(skill => {
      expect(screen.getByText(skill.skill)).toBeInTheDocument();
    });
  });

  it('renders correct number of filled stars for each skill', () => {
    render(<SkillStarChart skills={mockSkills} />);

    // Each skill row should have stars - using aria-label to identify
    const awsRow = screen.getByLabelText('AWS: 5 out of 5 stars');
    expect(awsRow).toBeInTheDocument();

    const k8sRow = screen.getByLabelText('Kubernetes: 4 out of 5 stars');
    expect(k8sRow).toBeInTheDocument();
  });

  it('renders skill descriptions', () => {
    render(<SkillStarChart skills={mockSkills} />);
    mockSkills.forEach(skill => {
      expect(screen.getByText(skill.description)).toBeInTheDocument();
    });
  });

  it('renders empty state when no skills provided', () => {
    render(<SkillStarChart skills={[]} />);
    expect(screen.getByText('No skill matches found')).toBeInTheDocument();
  });

  it('handles skills with rating of 0', () => {
    const skillsWithZero: SkillMatch[] = [
      { skill: 'Ruby', rating: 0, description: 'No experience' },
    ];
    render(<SkillStarChart skills={skillsWithZero} />);
    expect(screen.getByText('Ruby')).toBeInTheDocument();
    expect(screen.getByLabelText('Ruby: 0 out of 5 stars')).toBeInTheDocument();
  });

  it('caps rating at 5 stars maximum', () => {
    const overflowSkill: SkillMatch[] = [
      { skill: 'OverSkill', rating: 10, description: 'Should be capped' },
    ];
    render(<SkillStarChart skills={overflowSkill} />);
    // Should still say 5 out of 5, not 10
    expect(screen.getByLabelText('OverSkill: 5 out of 5 stars')).toBeInTheDocument();
  });

  it('renders overall match score when provided', () => {
    render(<SkillStarChart skills={mockSkills} overallScore={85} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Overall Match')).toBeInTheDocument();
  });

  it('applies correct styling for high-rated skills', () => {
    render(<SkillStarChart skills={mockSkills} />);
    // Check that AWS (5 stars) has the high-match visual indicator
    const awsSkill = screen.getByText('AWS').closest('[data-skill-row]');
    expect(awsSkill).toHaveAttribute('data-rating', '5');
  });
});
