import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-reading",
});

export const metadata: Metadata = {
  title: "Multiple sources with GenAI",
  description: "Research study: learning from complementary texts with a chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} ${sourceSerif.variable} min-h-screen bg-student-canvas text-student-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
