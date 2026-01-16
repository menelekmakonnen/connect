'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Providers } from "./Providers";
import { TalentQuickView } from "@/components/talent/TalentQuickView";
import { DynamicFavicon } from "@/components/common/DynamicFavicon";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Public routes that should NOT show the sidebar
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/register/');

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>ICUNI Connect | Production Ops Platform</title>
        <meta name="description" content="Turn casting and crewing from chaos into an organized, trackable pipeline. The fastest way to assemble a legit lineup for Ghana's creative industry." />
        <link rel="icon" href="/favicon-active.png?v=1" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <DynamicFavicon />
        {isPublicRoute ? (
          // Public layout - no sidebar
          <Providers>
            {children}
          </Providers>
        ) : (
          // App layout - with sidebar
          <div className="app-layout">
            <Providers>
              <Sidebar />
              <main className="app-main">
                {children}
              </main>
              <TalentQuickView />
            </Providers>
          </div>
        )}
      </body>
    </html>
  );
}
