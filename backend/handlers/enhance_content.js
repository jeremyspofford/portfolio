const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  console.log("Handler invoked", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body);
    const mode = body.type || 'enhance'; // 'job_match', 'enhance', or legacy 'chat'

    let systemPrompt = "";
    let userMessage = "";
    let modelId = "anthropic.claude-3-sonnet-20240229-v1:0";

    if (mode === 'job_match') {
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
    if (mode === 'enhance' || mode === 'job_match') {
       try {
           finalBody = JSON.parse(aiContent);
       } catch (e) {
           console.warn("Failed to parse JSON from AI, returning raw text", e);
           // For job_match, return a fallback structure if parsing fails
           if (mode === 'job_match') {
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
