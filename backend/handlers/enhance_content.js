const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const https = require('https');
const http = require('http');

const client = new BedrockRuntimeClient({ region: "us-east-1" });

/**
 * Fetches content from a URL and extracts text
 * @param {string} url - The URL to fetch
 * @returns {Promise<string>} - The extracted text content
 */
async function fetchUrlContent(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobAnalyzer/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 15000
    };

    const req = protocol.get(url, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).toString();
        return fetchUrlContent(redirectUrl).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch URL: HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        // Extract text content from HTML
        const textContent = extractTextFromHtml(data);
        if (textContent.length < 100) {
          reject(new Error('Could not extract sufficient content from the URL. The page may require JavaScript or authentication.'));
          return;
        }
        resolve(textContent);
      });
    });

    req.on('error', (e) => reject(new Error(`Failed to fetch URL: ${e.message}`)));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('URL fetch timed out'));
    });
  });
}

/**
 * Extracts readable text content from HTML
 * @param {string} html - The HTML content
 * @returns {string} - Extracted text
 */
function extractTextFromHtml(html) {
  // Remove script, style, and other non-content tags
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    // Convert common elements to readable format
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    // Remove all remaining HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Decode common HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&bull;/g, '•')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Limit to ~8000 characters to leave room for other prompt content
  return text.substring(0, 8000);
}

exports.handler = async (event) => {
  console.log("Handler invoked", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body);
    const mode = body.type || 'enhance'; // 'job_match', 'job_match_url', 'enhance', or legacy 'chat'

    let systemPrompt = "";
    let userMessage = "";
    let modelId = "anthropic.claude-3-sonnet-20240229-v1:0";

    if (mode === 'job_match_url') {
        // JOB MATCH FROM URL MODE - Fetch URL content and analyze
        const { jobUrl, candidateSkills } = body;
        if (!jobUrl) throw new Error("Job URL is required");

        // Validate URL
        try {
            new URL(jobUrl);
        } catch (e) {
            throw new Error("Invalid URL format");
        }

        // Fetch content from URL
        console.log("Fetching content from URL:", jobUrl);
        const jobPosting = await fetchUrlContent(jobUrl);
        console.log("Fetched content length:", jobPosting.length);

        systemPrompt = `You are an expert technical recruiter analyzing job fit.

Given a job posting (extracted from a webpage) and a candidate's skills, you must:
1. Extract the key required skills from the job posting
2. Compare each required skill against the candidate's skills
3. Rate each skill match from 0-5 stars:
   - 5 stars: Expert level, exact match with high proficiency
   - 4 stars: Strong match, relevant experience
   - 3 stars: Moderate match, some related experience
   - 2 stars: Basic match, tangentially related
   - 1 star: Minimal match, limited relevance
   - 0 stars: No match found
4. Calculate an overall match percentage (0-100)
5. Write a brief summary of the candidate's fit

Return ONLY valid JSON with this exact structure:
{
  "skills": [
    { "skill": "Skill Name", "rating": 5, "description": "Brief explanation of match" }
  ],
  "overallScore": 85,
  "summary": "2-3 sentence summary of overall fit"
}

Focus on the most important 5-8 skills mentioned in the job posting.
Note: The content was extracted from a webpage, so ignore any navigation or unrelated text.`;

        const skillsFormatted = candidateSkills?.map(s =>
            `${s.category} (${s.proficiency || 'N/A'}% proficiency): ${s.items.join(', ')}`
        ).join('\n') || 'No skills provided';

        userMessage = `JOB POSTING (from ${jobUrl}):
${jobPosting}

CANDIDATE SKILLS:
${skillsFormatted}

Analyze the match and return the JSON response.`;

    } else if (mode === 'job_match') {
        // JOB MATCH MODE - Analyze job posting against candidate skills
        const { jobPosting, candidateSkills } = body;
        if (!jobPosting) throw new Error("Job posting is required");

        systemPrompt = `You are an expert technical recruiter analyzing job fit.

Given a job posting and a candidate's skills, you must:
1. Extract the key required skills from the job posting
2. Compare each required skill against the candidate's skills
3. Rate each skill match from 0-5 stars:
   - 5 stars: Expert level, exact match with high proficiency
   - 4 stars: Strong match, relevant experience
   - 3 stars: Moderate match, some related experience
   - 2 stars: Basic match, tangentially related
   - 1 star: Minimal match, limited relevance
   - 0 stars: No match found
4. Calculate an overall match percentage (0-100)
5. Write a brief summary of the candidate's fit

Return ONLY valid JSON with this exact structure:
{
  "skills": [
    { "skill": "Skill Name", "rating": 5, "description": "Brief explanation of match" }
  ],
  "overallScore": 85,
  "summary": "2-3 sentence summary of overall fit"
}

Focus on the most important 5-8 skills mentioned in the job posting.`;

        const skillsFormatted = candidateSkills?.map(s =>
            `${s.category} (${s.proficiency || 'N/A'}% proficiency): ${s.items.join(', ')}`
        ).join('\n') || 'No skills provided';

        userMessage = `JOB POSTING:
${jobPosting}

CANDIDATE SKILLS:
${skillsFormatted}

Analyze the match and return the JSON response.`;

    } else if (mode === 'enhance') {
        // ENHANCE MODE
        const { jobDescription, resumeContent } = body;
        if (!jobDescription) throw new Error("Job description is required");

        systemPrompt = `You are an expert career coach. Analyze the Job Description and Jeremy's Resume.
        Return ONLY valid JSON with fields: analysis, suggested_summary, key_keywords_found.`;

        userMessage = `Job Description:\n${jobDescription}\n\nResume Summary:\n${resumeContent?.summary}\n\nExperience:\n${JSON.stringify(resumeContent?.experience?.[0] || {})}`;
    } else {
        // Legacy chat mode (deprecated but kept for backwards compatibility)
        modelId = "anthropic.claude-3-haiku-20240307-v1:0";
        systemPrompt = `You are a helpful AI assistant. Keep responses concise and professional.`;
        userMessage = body.message || "Hello";
    }

    const input = {
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        system: mode === 'chat' ? systemPrompt : undefined, // Chat uses system field
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: mode === 'chat' ? userMessage : `${systemPrompt}\n\n${userMessage}` // Legacy prompt structure for enhance
              }
            ]
          }
        ]
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const aiContent = responseBody.content[0].text;

    // For enhance and job_match modes, we expect JSON. For chat, just text.
    let finalBody = aiContent;
    if (mode === 'enhance' || mode === 'job_match' || mode === 'job_match_url') {
       try {
           finalBody = JSON.parse(aiContent);
       } catch (e) {
           console.warn("Failed to parse JSON from AI, returning raw text", e);
           // For job_match modes, return a fallback structure if parsing fails
           if (mode === 'job_match' || mode === 'job_match_url') {
               finalBody = {
                   skills: [],
                   overallScore: 0,
                   summary: "Unable to analyze job posting. Please try again."
               };
           }
       }
    } else {
        finalBody = { message: aiContent };
    }

    return {
      statusCode: 200,
      headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token"
      },
      body: JSON.stringify(finalBody),
    };

  } catch (error) {
    console.error("AI Error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message })
    };
  }
};
