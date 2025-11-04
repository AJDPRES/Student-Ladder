import "./globals.css";
import "./styles.css";
import "../styles/job-pages.css";

import type { ReactNode } from "react";

import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeContext";
import PageFade from "@/components/PageFade";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="app-centered">
            <PageFade>{children}</PageFade>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
