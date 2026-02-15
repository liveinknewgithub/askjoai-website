import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { Agentation } from "agentation";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "jo - Find Any Note, Email, or Photo in Seconds",
  description:
    "jo is a local AI for Mac that searches your notes, photos, emails, and messages instantly. Just ask a question. 100% private. Runs entirely on your Mac.",
  openGraph: {
    title: "jo - Your AI Sidekick. 100% Private.",
    description:
      "50,000+ photos. 100,000+ emails. Years of notes. jo surfaces what matters before you think to search. Runs entirely on your Mac. No subscription.",
    images: [
      {
        url: "https://liveinknewgithub.github.io/askjoai-website/og-image-v7.png?v=12",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "jo - Your AI Sidekick. 100% Private.",
    description:
      "50,000+ photos. 100,000+ emails. Years of notes. jo surfaces what matters before you think to search.",
    images: ["https://liveinknewgithub.github.io/askjoai-website/og-image-v7.png?v=12"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${dmSans.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
