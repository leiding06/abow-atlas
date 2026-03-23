import type { Metadata } from "next";
import { Playfair_Display, Fragment_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-playfair",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ABOW Atlas",
  description: "Ancient Boats · Overwhelmed Waters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${fragmentMono.variable}`}>
      <body style={{ fontFamily: "var(--font-mono), monospace" }}>
        {children}
      </body>
    </html>
  );
}