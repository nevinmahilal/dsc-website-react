import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Footer, Header, AnalyticsScripts } from "@/components/features";
import { getSiteData } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "300", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const site = getSiteData()
  return buildMetadata({
    title: site.defaultSeo.title,
    description: site.defaultSeo.description,
    canonicalPath: '/',
  })
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <AnalyticsScripts />
        <Header />
        <div className="grow pt-16">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
