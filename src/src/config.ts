export const config = {
  features: {
    showResumeDownload:
      process.env.NEXT_PUBLIC_SHOW_RESUME_DOWNLOAD === "true",
    showContributions: process.env.NEXT_PUBLIC_SHOW_CONTRIBUTIONS === "true",
    enableAI: process.env.NEXT_PUBLIC_ENABLE_AI === "true",
    enableContactForm: process.env.NEXT_PUBLIC_ENABLE_CONTACT_FORM === "true",
    showProjects: process.env.NEXT_PUBLIC_SHOW_PROJECTS !== "false", // Default ON
  },
  urls: {
    api: process.env.NEXT_PUBLIC_API_URL,
    site: process.env.NEXT_PUBLIC_SITE_URL,
    gaId: process.env.NEXT_PUBLIC_GA_ID,
  },
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "production",
};
