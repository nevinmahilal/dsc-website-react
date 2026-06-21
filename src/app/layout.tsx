import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/features";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "300", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DSC | Data Solutions Inc.",
  description: "Data Solutions Inc. — insights that drive decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <div className="grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
