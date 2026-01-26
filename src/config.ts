export const config = {
  features: {
    showResumeDownload: process.env.NEXT_PUBLIC_SHOW_RESUME_DOWNLOAD === 'true',
    showContributions: process.env.NEXT_PUBLIC_SHOW_CONTRIBUTIONS === 'true', // Default to false if not set
    enableAI: process.env.NEXT_PUBLIC_ENABLE_AI !== 'false', // Default to true
  },
  urls: {
    api: process.env.NEXT_PUBLIC_API_URL,
    site: process.env.NEXT_PUBLIC_SITE_URL,
    gaId: process.env.NEXT_PUBLIC_GA_ID,
  },
};
