const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  console.log("enhance-content invoked", JSON.stringify(event));

  // CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: "",
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { jobDescription, resumeContent } = body;

    if (!jobDescription) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Job description is required" }),
      };
    }

    const systemPrompt = `You are an expert career coach and technical recruiter with deep knowledge of DevOps, Cloud Engineering, and Infrastructure roles.

Analyze the provided job description against the candidate's resume and provide a comprehensive match analysis.

You MUST return ONLY valid JSON (no markdown, no explanation outside JSON) with this exact structure:
{
  "match_score": <number 0-100>,
  "analysis": "<2-3 sentence overall assessment of how well the candidate matches this role>",
  "suggested_summary": "<A tailored professional summary paragraph (3-4 sentences) optimized for this specific role>",
  "key_keywords_found": ["<keyword1>", "<keyword2>", ...],
  "missing_keywords": ["<keyword1>", "<keyword2>", ...],
  "relevant_experience": [
    {
      "company": "<company name>",
      "role": "<role title>",
      "relevance": "<1-2 sentence explanation of why this experience is relevant to the target role>"
    }
  ],
  "talking_points": ["<interview talking point 1>", "<talking point 2>", ...],
  "improvement_suggestions": ["<suggestion 1>", "<suggestion 2>", ...]
}`;

    const userMessage = `## Job Description:
${jobDescription}

## Candidate Resume:

**Name:** ${resumeContent?.name || "Candidate"}
**Current Title:** ${resumeContent?.title || "Not specified"}

**Summary:**
${resumeContent?.summary || resumeContent?.bio || "No summary provided"}

**Experience:**
${formatExperience(resumeContent?.experience)}

**Skills:**
${formatSkills(resumeContent?.skills)}

**Certifications:**
${formatCertifications(resumeContent?.certifications)}`;

    const input = {
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\n${userMessage}`,
          },
        ],
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const aiContent = responseBody.content[0].text;

    let result;
    try {
      // Try to extract JSON from the response (in case AI adds any text around it)
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : aiContent);
    } catch (e) {
      console.warn("Failed to parse JSON from AI response:", e);
      // Return a fallback structure with the raw analysis
      result = {
        match_score: null,
        analysis: aiContent,
        suggested_summary: null,
        key_keywords_found: [],
        missing_keywords: [],
        relevant_experience: [],
        talking_points: [],
        improvement_suggestions: [],
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function formatExperience(experience) {
  if (!experience || !Array.isArray(experience)) return "No experience provided";

  return experience
    .map((exp) => {
      const content = exp.content || exp;
      return `- **${content.role || "Role"}** at **${content.company || "Company"}** (${content.startDate || "?"} - ${content.endDate || "?"})
  ${content.description || ""}
  Technologies: ${(content.technologies || []).join(", ")}`;
    })
    .join("\n\n");
}

function formatSkills(skills) {
  if (!skills || !Array.isArray(skills)) return "No skills provided";

  return skills
    .map((skill) => {
      const content = skill.content || skill;
      return `- **${content.category || "Category"}**: ${(content.items || []).join(", ")}`;
    })
    .join("\n");
}

function formatCertifications(certifications) {
  if (!certifications || !Array.isArray(certifications))
    return "No certifications provided";

  return certifications
    .map((cert) => {
      const content = cert.content || cert;
      return `- ${content.name || "Certification"} (${content.issuer || "Issuer"}) - ${content.active ? "Active" : "Expired"}`;
    })
    .join("\n");
}
