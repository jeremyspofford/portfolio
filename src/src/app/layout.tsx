import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Jeremy Spofford',
    default: 'Jeremy Spofford | Senior DevOps Engineer',
  },
  description: "Senior DevOps Engineer specialized in AWS, Terraform, Kubernetes, and building the Ultimate AI Smart Home.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.jeremyspofford.com',
    siteName: 'Jeremy Spofford Portfolio',
    images: [
      {
        url: 'https://www.jeremyspofford.com/og-image.png', // Placeholder
        width: 1200,
        height: 630,
        alt: 'Jeremy Spofford - Senior DevOps Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jeremy Spofford | Senior DevOps Engineer',
    description: "DevOps Expert & Home Assistant Enthusiast",
    creator: '@jeremyspofford', // Replace if different
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleAnalytics />
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <Navbar />
          <main className="flex flex-col items-center">
              {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
