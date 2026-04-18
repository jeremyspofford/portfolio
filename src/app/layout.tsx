import type { Metadata } from "next";
import { Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FeatureFlagsProvider } from "@/lib/featureFlags";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { fetchContent } from "@/lib/content";
import { ProfileContent } from "@/lib/api";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Jeremy Spofford',
    default: 'Jeremy Spofford | Senior DevOps Engineer',
  },
  description: "Senior DevOps Engineer with 8+ years building infrastructure that scales without drama. AWS, GCP, Terraform — I eliminate toil and make systems reliable.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jeremyspofford.dev',
    siteName: 'Jeremy Spofford Portfolio',
    images: [
      {
        url: 'https://jeremyspofford.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jeremy Spofford - Senior DevOps Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jeremy Spofford | Senior DevOps Engineer',
    description: "Building infrastructure that scales without drama.",
    creator: '@jeremyspofford',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profileData = await fetchContent("PROFILE");
  const profile = profileData.find((item) => item.SK === "MAIN")?.content as ProfileContent | undefined;

  return (
    <html
      lang="en"
      className="light"
      suppressHydrationWarning
    >
      <body
        className={`${sourceSerif.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <FeatureFlagsProvider>
            <div className="flex min-h-screen flex-col">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-header-bg focus:text-header-fg focus:rounded focus:outline-none"
              >
                Skip to main content
              </a>
              <SiteHeader profile={profile} />
              <Navbar />
              <ErrorBoundary>
                <main id="main-content" className="flex-1 flex flex-col items-center w-full">
                  {children}
                </main>
              </ErrorBoundary>
              <Footer profile={profile} />
            </div>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
