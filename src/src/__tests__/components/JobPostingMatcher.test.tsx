import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobPostingMatcher } from '@/components/JobPostingMatcher';
import * as api from '@/lib/api';

// Mock the API
vi.mock('@/lib/api', () => ({
  analyzeJobPosting: vi.fn(),
  analyzeJobPostingFromUrl: vi.fn(),
}));

describe('JobPostingMatcher', () => {
  const mockCandidateSkills = [
    { category: 'Cloud', items: ['AWS', 'GCP', 'Azure'], proficiency: 90 },
    { category: 'DevOps', items: ['Kubernetes', 'Docker', 'Terraform'], proficiency: 85 },
    { category: 'Languages', items: ['Python', 'JavaScript', 'Go'], proficiency: 80 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the job posting input area', () => {
    render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);
    expect(screen.getByText('Job Fit Analyzer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/paste a job posting/i)).toBeInTheDocument();
  });

  it('renders the analyze button', () => {
    render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);
    expect(screen.getByRole('button', { name: /analyze match/i })).toBeInTheDocument();
  });

  it('disables analyze button when textarea is empty', () => {
    render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);
    const button = screen.getByRole('button', { name: /analyze match/i });
    expect(button).toBeDisabled();
  });

  it('enables analyze button when textarea has content', async () => {
    const user = userEvent.setup();
    render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

    const textarea = screen.getByPlaceholderText(/paste a job posting/i);
    await user.type(textarea, 'Senior DevOps Engineer needed');

    const button = screen.getByRole('button', { name: /analyze match/i });
    expect(button).not.toBeDisabled();
  });

  it('shows loading state while analyzing', async () => {
    const user = userEvent.setup();

    // Mock slow API response
    vi.mocked(api.analyzeJobPosting).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        skills: [],
        overallScore: 0,
        summary: ''
      }), 1000))
    );

    render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

    const textarea = screen.getByPlaceholderText(/paste a job posting/i);
    await user.type(textarea, 'DevOps Engineer');

    const button = screen.getByRole('button', { name: /analyze match/i });
    await user.click(button);

    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
  });

  it('displays skill matches after successful analysis', async () => {
    const user = userEvent.setup();

    const mockResponse = {
      skills: [
        { skill: 'AWS', rating: 5, description: 'Excellent match' },
        { skill: 'Kubernetes', rating: 4, description: 'Strong match' },
      ],
      overallScore: 88,
      summary: 'Strong candidate for this role'
    };

    vi.mocked(api.analyzeJobPosting).mockResolvedValue(mockResponse);

    render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

    const textarea = screen.getByPlaceholderText(/paste a job posting/i);
    await user.type(textarea, 'Looking for AWS and K8s expert');

    const button = screen.getByRole('button', { name: /analyze match/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Skill Match Analysis')).toBeInTheDocument();
    });

    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Kubernetes')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();
    expect(screen.getByText('Strong candidate for this role')).toBeInTheDocument();
  });

  it('displays error message on API failure', async () => {
    const user = userEvent.setup();

    vi.mocked(api.analyzeJobPosting).mockRejectedValue(new Error('API Error'));

    render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

    const textarea = screen.getByPlaceholderText(/paste a job posting/i);
    await user.type(textarea, 'Some job posting');

    const button = screen.getByRole('button', { name: /analyze match/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Should display the actual error message from the API
    expect(screen.getByText('API Error')).toBeInTheDocument();
  });

  it('clears previous results when new analysis starts', async () => {
    const user = userEvent.setup();

    const mockResponse = {
      skills: [{ skill: 'AWS', rating: 5, description: 'Match' }],
      overallScore: 90,
      summary: 'First analysis'
    };

    vi.mocked(api.analyzeJobPosting).mockResolvedValue(mockResponse);

    render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

    const textarea = screen.getByPlaceholderText(/paste a job posting/i);
    await user.type(textarea, 'First job');

    const button = screen.getByRole('button', { name: /analyze match/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('First analysis')).toBeInTheDocument();
    });

    // Start new analysis
    await user.clear(textarea);
    await user.type(textarea, 'Second job');

    // Mock slow second response
    vi.mocked(api.analyzeJobPosting).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        skills: [],
        overallScore: 0,
        summary: 'Second analysis'
      }), 500))
    );

    await user.click(button);

    // Old results should be cleared while loading
    expect(screen.queryByText('First analysis')).not.toBeInTheDocument();
  });

  it('has accessible textarea with proper label', () => {
    render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);
    const textarea = screen.getByRole('textbox', { name: /job posting/i });
    expect(textarea).toBeInTheDocument();
  });

  it('passes candidate skills to the API', async () => {
    const user = userEvent.setup();

    vi.mocked(api.analyzeJobPosting).mockResolvedValue({
      skills: [],
      overallScore: 0,
      summary: ''
    });

    render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

    const textarea = screen.getByPlaceholderText(/paste a job posting/i);
    await user.type(textarea, 'Job posting text');

    const button = screen.getByRole('button', { name: /analyze match/i });
    await user.click(button);

    await waitFor(() => {
      expect(api.analyzeJobPosting).toHaveBeenCalledWith(
        'Job posting text',
        mockCandidateSkills
      );
    });
  });

  // URL Mode Tests
  describe('URL Input Mode', () => {
    it('renders toggle buttons for text and URL modes', () => {
      render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);
      expect(screen.getByRole('button', { name: /paste text/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /from url/i })).toBeInTheDocument();
    });

    it('switches to URL input when URL mode is selected', async () => {
      const user = userEvent.setup();
      render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

      const urlModeButton = screen.getByRole('button', { name: /from url/i });
      await user.click(urlModeButton);

      expect(screen.getByPlaceholderText(/linkedin.com\/jobs/i)).toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/paste a job posting/i)).not.toBeInTheDocument();
    });

    it('disables analyze button for invalid URLs', async () => {
      const user = userEvent.setup();
      render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

      const urlModeButton = screen.getByRole('button', { name: /from url/i });
      await user.click(urlModeButton);

      const urlInput = screen.getByPlaceholderText(/linkedin.com\/jobs/i);
      await user.type(urlInput, 'not-a-valid-url');

      const analyzeButton = screen.getByRole('button', { name: /analyze match/i });
      expect(analyzeButton).toBeDisabled();
    });

    it('enables analyze button for valid URLs', async () => {
      const user = userEvent.setup();
      render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

      const urlModeButton = screen.getByRole('button', { name: /from url/i });
      await user.click(urlModeButton);

      const urlInput = screen.getByPlaceholderText(/linkedin.com\/jobs/i);
      await user.type(urlInput, 'https://linkedin.com/jobs/12345');

      const analyzeButton = screen.getByRole('button', { name: /analyze match/i });
      expect(analyzeButton).not.toBeDisabled();
    });

    it('calls analyzeJobPostingFromUrl when in URL mode', async () => {
      const user = userEvent.setup();

      vi.mocked(api.analyzeJobPostingFromUrl).mockResolvedValue({
        skills: [{ skill: 'AWS', rating: 5, description: 'Great match' }],
        overallScore: 85,
        summary: 'Good fit for the role'
      });

      render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

      const urlModeButton = screen.getByRole('button', { name: /from url/i });
      await user.click(urlModeButton);

      const urlInput = screen.getByPlaceholderText(/linkedin.com\/jobs/i);
      await user.type(urlInput, 'https://linkedin.com/jobs/12345');

      const analyzeButton = screen.getByRole('button', { name: /analyze match/i });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(api.analyzeJobPostingFromUrl).toHaveBeenCalledWith(
          'https://linkedin.com/jobs/12345',
          mockCandidateSkills
        );
      });
    });
  });

  // Error Message Display Tests
  describe('Error Message Display', () => {
    it('displays specific error message from API', async () => {
      const user = userEvent.setup();

      const specificError = 'Bedrock model access denied. Please enable Claude in AWS console.';
      vi.mocked(api.analyzeJobPosting).mockRejectedValue(new Error(specificError));

      render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

      const textarea = screen.getByPlaceholderText(/paste a job posting/i);
      await user.type(textarea, 'Some job posting');

      const button = screen.getByRole('button', { name: /analyze match/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Should display the specific error message, not a generic one
      expect(screen.getByText(specificError)).toBeInTheDocument();
    });

    it('displays timeout error message', async () => {
      const user = userEvent.setup();

      const timeoutError = 'Analysis timed out. Please try again.';
      vi.mocked(api.analyzeJobPosting).mockRejectedValue(new Error(timeoutError));

      render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

      const textarea = screen.getByPlaceholderText(/paste a job posting/i);
      await user.type(textarea, 'Some job posting');

      const button = screen.getByRole('button', { name: /analyze match/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText(timeoutError)).toBeInTheDocument();
      });
    });

    it('displays URL-specific error when URL fetch fails', async () => {
      const user = userEvent.setup();

      const urlError = 'Could not extract sufficient content from the URL. The page may require JavaScript or authentication.';
      vi.mocked(api.analyzeJobPostingFromUrl).mockRejectedValue(new Error(urlError));

      render(<JobPostingMatcher candidateSkills={mockCandidateSkills} />);

      const urlModeButton = screen.getByRole('button', { name: /from url/i });
      await user.click(urlModeButton);

      const urlInput = screen.getByPlaceholderText(/linkedin.com\/jobs/i);
      await user.type(urlInput, 'https://example.com/job');

      const analyzeButton = screen.getByRole('button', { name: /analyze match/i });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(screen.getByText(urlError)).toBeInTheDocument();
      });
    });
  });
});
