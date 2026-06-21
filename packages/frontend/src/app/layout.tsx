"use JSX";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/navigation/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'AI Assessment Creator',
  description: 'Generate curriculum-aligned exam papers in seconds using advanced AI grounding frameworks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      {/* 📱 REMOVED global 'overflow-hidden' from body to enable flexible mobile track scrolling */}
      <body className="h-full bg-slate-50 text-slate-900 selection:bg-indigo-100 md:overflow-hidden">
        
        {/* 🛠️ Adaptive Split View Layout - Fluidly changes from top-to-bottom layout on mobile to side-by-side on desktop */}
        <div className="flex flex-col md:flex-row h-full w-full md:overflow-hidden">
          
          {/* Responsive Navigation Component Layer */}
          <Sidebar 
            schoolName="Delhi Public School" 
            location="Bokaro Steel City" 
          />

          {/* Dynamic Content Window Panel - Uses natural document scrolling on mobile tracks */}
          <main className="flex-1 h-full overflow-y-auto min-w-0 md:overflow-y-auto print:overflow-visible print:h-auto">
            {children}
          </main>
          
        </div>

      </body>
    </html>
  );
}