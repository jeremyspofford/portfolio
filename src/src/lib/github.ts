import { unstable_cache } from 'next/cache';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'jeremyspofford'; // Hardcoded for now, could be env var

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: Week[];
}

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: ContributionCalendar;
      };
    };
  };
}

export const fetchGitHubContributions = unstable_cache(
  async () => {
    if (!GITHUB_TOKEN) {
      console.warn('GITHUB_TOKEN is not defined');
      return null;
    }

    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { username: USERNAME },
        }),
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data: GitHubResponse = await response.json();
      
      if (!data.data?.user) {
         console.error('GitHub API returned no user data:', JSON.stringify(data));
         return null;
      }

      const calendar = data.data.user.contributionsCollection.contributionCalendar;
      
      // Transform for react-activity-calendar
      // Needs: Array<{ date: string; count: number; level: number }>
      // Level is 0-4
      const contributions = calendar.weeks
        .flatMap((week) => week.contributionDays)
        .map((day) => {
           let level = 0;
           if (day.contributionCount > 0) level = 1;
           if (day.contributionCount >= 5) level = 2;
           if (day.contributionCount >= 10) level = 3;
           if (day.contributionCount >= 20) level = 4;
           
           return {
             date: day.date,
             count: day.contributionCount,
             level,
           };
        });

      return {
        total: calendar.totalContributions,
        contributions,
      };

    } catch (error) {
      console.error('Error fetching GitHub contributions:', error);
      return null;
    }
  },
  ['github-contributions'],
  { revalidate: 3600 }
);
