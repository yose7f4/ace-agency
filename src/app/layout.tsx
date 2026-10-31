import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col bg-[#05070D] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
