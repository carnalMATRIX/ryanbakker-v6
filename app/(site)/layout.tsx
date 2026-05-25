import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  style: ["normal", "italic"],
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
  style: ["normal", "italic"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SERVER_URL || "https://ryanbakker.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ryan Bakker | Full Stack Developer & Digital Artist",
    template: "%s | Ryan Bakker",
  },
  description:
    "Portfolio of Ryan Bakker, a Full Stack Developer and Digital Artist specializing in building modern web applications and digital experiences.",
  keywords: [
    "Ryan Bakker",
    "Full Stack Developer",
    "Digital Artist",
    "Web Development",
    "React",
    "Next.js",
    "Portfolio",
  ],
  authors: [{ name: "Ryan Bakker", url: siteUrl }],
  creator: "Ryan Bakker",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "Ryan Bakker",
    title: "Ryan Bakker | Full Stack Developer & Digital Artist",
    description:
      "Portfolio of Ryan Bakker, a Full Stack Developer and Digital Artist specializing in building modern web applications and digital experiences.",
    images: [
      {
        url: "/hero_img.png",
        width: 1200,
        height: 630,
        alt: "Ryan Bakker Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryan Bakker | Full Stack Developer & Digital Artist",
    description:
      "Portfolio of Ryan Bakker, a Full Stack Developer and Digital Artist specializing in building modern web applications and digital experiences.",
    images: ["/hero_img.png"],
    creator: "@Ryan_Bakker_",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "h6rwsFmLvUDMraGKOrSUzUJbg57HbkOMtiLkGHatpt4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        crimsonPro.variable,
        "font-sans",
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
