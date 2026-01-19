const { AppConfigDataClient, StartConfigurationSessionCommand, GetLatestConfigurationCommand } = require("@aws-sdk/client-appconfigdata");

const client = new AppConfigDataClient({ region: "us-east-1" });

// Cache for configuration session token and flags
let sessionToken = null;
let cachedFlags = null;
let lastFetch = 0;
const CACHE_TTL_MS = 30000; // 30 seconds cache

exports.handler = async (event) => {
  console.log("get-feature-flags invoked", JSON.stringify(event));

  // Get environment from query param or default to production
  const environment = event.queryStringParameters?.environment || "production";

  // Validate environment
  if (!["staging", "production"].includes(environment)) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Invalid environment. Must be 'staging' or 'production'." }),
    };
  }

  try {
    const now = Date.now();

    // Check if we have cached flags that are still valid
    if (cachedFlags && (now - lastFetch) < CACHE_TTL_MS) {
      console.log("Returning cached flags");
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=30",
        },
        body: JSON.stringify(cachedFlags),
      };
    }

    // Start a new configuration session if we don't have a token
    if (!sessionToken) {
      const sessionCommand = new StartConfigurationSessionCommand({
        ApplicationIdentifier: process.env.APPCONFIG_APP_ID,
        EnvironmentIdentifier: environment,
        ConfigurationProfileIdentifier: process.env.APPCONFIG_PROFILE_ID,
      });

      const sessionResponse = await client.send(sessionCommand);
      sessionToken = sessionResponse.InitialConfigurationToken;
      console.log("Started new configuration session");
    }

    // Get the latest configuration
    const configCommand = new GetLatestConfigurationCommand({
      ConfigurationToken: sessionToken,
    });

    const configResponse = await client.send(configCommand);

    // Update session token for next call
    sessionToken = configResponse.NextPollConfigurationToken;

    // Parse the configuration if there's new content
    if (configResponse.Configuration && configResponse.Configuration.length > 0) {
      const configString = new TextDecoder().decode(configResponse.Configuration);
      const config = JSON.parse(configString);

      // Transform AppConfig feature flags format to simpler format
      const flags = {};
      if (config.values) {
        for (const [key, value] of Object.entries(config.values)) {
          flags[key] = value.enabled || false;
        }
      }

      cachedFlags = {
        environment,
        flags,
        fetchedAt: new Date().toISOString(),
      };
      lastFetch = now;

      console.log("Fetched new configuration", cachedFlags);
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=30",
      },
      body: JSON.stringify(cachedFlags || { environment, flags: {}, fetchedAt: new Date().toISOString() }),
    };
  } catch (error) {
    console.error("Error fetching feature flags:", error);

    // Reset session token on error to force new session
    sessionToken = null;

    // Return default flags on error (fail open with safe defaults)
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        environment,
        flags: {
          showAIShowcase: false,
          showContributions: true,
          showResumeDownload: false,
          enableJobFitAnalyzer: true,
          enableJobFitUrl: true,
        },
        fetchedAt: new Date().toISOString(),
        fallback: true,
      }),
    };
  }
};
