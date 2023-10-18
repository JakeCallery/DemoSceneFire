import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GoogleAnalyticsScript from "@/app/GoogleAnalyticsScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oldschool Fire by Jake Callery",
  description: "My take on a demo scene fire effect from back in the day.",
  viewport: "width=device-width, height=device-height, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleAnalyticsScript />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
