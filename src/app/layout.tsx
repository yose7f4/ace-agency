import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { TrafficTracker } from "@/components/analytics/TrafficTracker";

export const metadata: Metadata = {
  title: "ACE Recruitment Agency | Elite Multilingual Careers & Commission Engine",
  description: "Next-generation multilingual talent acquisition platform with affiliate engine, real-time candidate pipeline, and cooling-period commission tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col bg-black text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        <Suspense fallback={null}>
          <TrafficTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
