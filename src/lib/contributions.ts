import { unstable_cache } from 'next/cache';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
const GITHUB_USERNAME = 'jeremyspofford';
const GITLAB_USERNAME = process.env.GITLAB_USERNAME || 'jeremyspofford'; // Default or env

interface GitLabEvent {
  created_at: string;
  action_name: string;
}

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

// Reuse the unstable_cache key for GitHub to avoid re-fetching too often
async function fetchGitHubData() {
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
          variables: { username: GITHUB_USERNAME },
        }),
        next: { revalidate: 3600 },
      });

      if (!response.ok) return null;
      const data: GitHubResponse = await response.json();
      return data.data?.user?.contributionsCollection?.contributionCalendar;
    } catch (error) {
      console.error('Error fetching GitHub contributions:', error);
      return null;
    }
}

async function fetchGitLabData() {
    if (!GITLAB_TOKEN) return null;

    try {
        // 1. Get User ID
        const userRes = await fetch(`https://gitlab.com/api/v4/users?username=${GITLAB_USERNAME}`, {
             headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN }
        });
        
        if (!userRes.ok) return null;
        const users = await userRes.json();
        if (!users.length) return null;
        const userId = users[0].id;

        // 2. Fetch Events (simplified for recent activity, can be paginated for full year)
        // Fetching 100 recent events as a starting point. For full accuracy, we'd need multiple pages.
        const eventsRes = await fetch(`https://gitlab.com/api/v4/users/${userId}/events?after=${getOneYearAgoDate()}&per_page=100`, {
             headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN },
             next: { revalidate: 3600 }
        });
        
        if (!eventsRes.ok) return null;
        const events = await eventsRes.json();
        
        // Map events to { date: string, count: number }
        const dailyCounts = new Map<string, number>();
        events.forEach((event: GitLabEvent) => {
            const date = event.created_at.split('T')[0];
            dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
        });

        return dailyCounts;
        
    } catch (e) {
        console.error("Error fetching GitLab data", e);
        return null;
    }
}

function getOneYearAgoDate() {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split('T')[0];
}


export const fetchCombinedContributions = unstable_cache(
  async () => {
    const [githubData, gitlabData] = await Promise.all([
        fetchGitHubData(),
        fetchGitLabData()
    ]);

    if (!githubData) return null;

    // Transform Map for merging (Date -> Count)
    const dailyCounts = new Map<string, number>();

    // 1. Process GitHub
    githubData.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
            dailyCounts.set(day.date, (dailyCounts.get(day.date) || 0) + day.contributionCount);
        });
    });

    // 2. Process GitLab
    let gitlabTotal = 0;
    if (gitlabData) {
        gitlabData.forEach((count, date) => {
             dailyCounts.set(date, (dailyCounts.get(date) || 0) + count);
             gitlabTotal += count;
        });
    }

    // 3. Convert back to array required by react-activity-calendar
    const contributions = Array.from(dailyCounts.entries()).map(([date, count]) => {
           let level = 0;
           if (count > 0) level = 1;
           if (count >= 5) level = 2;
           if (count >= 10) level = 3;
           if (count >= 20) level = 4;
           
           return { date, count, level };
    }).sort((a, b) => a.date.localeCompare(b.date));

    return {
        total: githubData.totalContributions + gitlabTotal,
        contributions
    };
  },
  ['combined-contributions'],
  { revalidate: 3600 }
);
