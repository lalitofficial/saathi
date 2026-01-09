import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "Saathi by WieDigital",
  description: "Your Saathi in SEO",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        className={`h-full dark ${geistSans.variable} ${geistMono.variable}`}
        lang="en"
        suppressHydrationWarning
      >
        <body className="min-h-screen bg-slate-50 bg-[radial-gradient(1200px_circle_at_15%_-10%,rgba(56,189,248,0.16),transparent_60%)] font-sans text-slate-900 antialiased dark:bg-slate-950 dark:bg-[radial-gradient(1200px_circle_at_15%_-10%,rgba(56,189,248,0.12),transparent_60%),radial-gradient(900px_circle_at_85%_10%,rgba(59,130,246,0.12),transparent_55%)] dark:text-slate-100">
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
