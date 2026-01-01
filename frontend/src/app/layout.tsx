import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Providers } from "./Providers";
import { TalentQuickView } from "@/components/talent/TalentQuickView";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ICUNI Connect | Production Ops Platform",
  description: "Turn casting and crewing from chaos into an organized, trackable pipeline. The fastest way to assemble a legit lineup for Ghana's creative industry.",
  keywords: ["Ghana", "film production", "talent directory", "casting", "crew booking", "music video", "production"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <div className="app-layout">
          <Providers>
            <Sidebar />
            <main className="app-main">
              {children}
            </main>
            <TalentQuickView />
          </Providers>
        </div>
      </body>
    </html>
  );
}
