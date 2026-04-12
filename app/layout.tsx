import type { Metadata } from "next";
import { Public_Sans, Inter } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "METU-IE Summer Practice Consultant",
  description:
    "Intelligent chatbot for METU Industrial Engineering Summer Practice queries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
