const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  console.log("Handler invoked", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body);
    const mode = body.type || 'enhance'; // 'chat' or 'enhance'

    let systemPrompt = "";
    let userMessage = "";
    let modelId = "anthropic.claude-3-sonnet-20240229-v1:0";

    if (mode === 'chat') {
        modelId = "anthropic.claude-3-haiku-20240307-v1:0"; // Faster for chat
        systemPrompt = `You are a helpful AI Assistant for Jeremy Spofford's portfolio website. 
        Your goal is to answer questions about Jeremy based on his professional background.
        
        Context about Jeremy:
        - Senior DevOps Engineer with 10+ years experience.
        - Expert in AWS, GCP, Terraform, Kubernetes, and CI/CD (GitHub Actions/GitLab CI).
        - Passionate about "automating everything that moves".
        - Currently building an "Ultimate AI Smart Home".
        - Verify claims by checking his resume or projects sections.
        
        Keep responses concise, professional, yet friendly. If asked about something not in his background, politely state you don't know but suggest contacting him directly.`;
        
        // Append history if needed, or just take the current message
        userMessage = body.message;
    } else {
        // ENHANCE MODE
        const { jobDescription, resumeContent } = body;
        if (!jobDescription) throw new Error("Job description is required");

        systemPrompt = `You are an expert career coach. Analyze the Job Description and Jeremy's Resume.
        Return ONLY valid JSON with fields: analysis, suggested_summary, key_keywords_found.`;
        
        userMessage = `Job Description:\n${jobDescription}\n\nResume Summary:\n${resumeContent?.summary}\n\nExperience:\n${JSON.stringify(resumeContent?.experience?.[0] || {})}`;
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

    // For enhance mode, we expect JSON. For chat, just text.
    let finalBody = aiContent;
    if (mode === 'enhance') {
       try {
           finalBody = JSON.parse(aiContent);
       } catch (e) {
           console.warn("Failed to parse JSON from AI, returning raw text", e);
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
