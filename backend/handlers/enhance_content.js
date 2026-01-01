const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  console.log("Enhance content invoked", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body);
    const { jobDescription, resumeContent } = body;

    if (!jobDescription) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Job description is required" })
        };
    }

    // Prepare prompt for Claude 3 Sonnet
    const prompt = `
    You are an expert career coach and resume writer. 
    I will provide you with a Job Description and my current Resume content.
    Your task is to:
    1. Analyze the Job Description for key skills and requirements.
    2. Suggest tailored improvements to my Resume Summary and Experience sections to better match this job.
    3. Return the response in valid JSON format with the following structure:
    {
        "analysis": "Brief analysis of the match...",
        "suggested_summary": "rewritten summary...",
        "key_keywords_found": ["keyword1", "keyword2"]
    }

    Job Description:
    ${jobDescription}

    Current Resume Summary:
    ${resumeContent?.summary || "Senior DevOps Engineer with AWS experience."}
    
    Current Experience (first role):
    ${JSON.stringify(resumeContent?.experience?.[0] || {})}

    OUTPUT JSON ONLY. Do not include markdown formatting or explanations outside the JSON.
    `;

    const input = {
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0", // Or haiku for speed/cost
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ]
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const aiContent = JSON.parse(responseBody.content[0].text);

    return {
      statusCode: 200,
      headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token"
      },
      body: JSON.stringify(aiContent),
    };

  } catch (error) {
    console.error("AI Enhance Error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to enhance content", details: error.message })
    };
  }
};
