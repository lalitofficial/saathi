import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Saathi by WieDigital",
  description: "Your Saathi in SEO",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html className="h-full " lang="en">
        <body className="bg-gray-50 dark:bg-gray-800">
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
