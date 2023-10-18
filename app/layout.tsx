import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GoogleAnalyticsScript from "@/app/GoogleAnalyticsScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://fire.jakecallery.com"),
  title: "Fire by Jake Callery",
  description: "My take on a demo scene fire effect from back in the day.",
  creator: "Jake Callery",
  openGraph: {
    title: "Fire By Jake Callery",
    description: "My take on a demo scene fire effect from back in the day.",
    url: "https://fire.jakecallery.com",
    siteName: "Fire by Jake Callery",
    images: [
      {
        url: "https://fire.jakecallery.com/fireOpenGraphImage.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fire by Jake Callery",
    description: "My take on a demo scene fire effect from back in the day.",
    creator: "@jakecallery",
    images: ["https://fire.jakecallery.com/fireOpenGraphImage.png"],
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
