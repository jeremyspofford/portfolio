import type { Metadata } from "next";
import { Space_Grotesk, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FeatureFlagsProvider } from "@/lib/featureFlags";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const interTight = Inter_Tight({
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
  description: "Senior DevOps Engineer with 12+ years building infrastructure that scales without drama. AWS, GCP, Terraform, Kubernetes — I eliminate toil and make systems reliable.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
    >
      <body
        className={`${spaceGrotesk.variable} ${interTight.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <FeatureFlagsProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#22D3EE] focus:text-[#0A0E17] focus:rounded-md focus:outline-none"
            >
              Skip to main content
            </a>
            <Navbar />
            <ErrorBoundary>
              <main id="main-content" className="flex flex-col items-center">
                {children}
              </main>
            </ErrorBoundary>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
