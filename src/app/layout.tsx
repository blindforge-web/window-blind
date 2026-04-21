import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { getSiteSettings } from "@/lib/data";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings?.brandName || "Website",
    description: settings?.tagline || "Dynamic site powered by Supabase.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const settings = await getSiteSettings();

  const themeStyle = {
    "--color-page": settings?.pageColor || "#F5F7FA",
    "--color-surface": settings?.surfaceColor || "#FFFFFF",
    "--color-accent": settings?.accentColor || "#F5F5F5",
    "--color-ink": settings?.inkColor || "#0F172A",
    "--color-muted": settings?.mutedColor || "#475569",
    "--color-line": settings?.lineColor || "rgba(10, 37, 64, 0.12)",
    "--color-primary": settings?.primaryColor || "#0A2540",
    "--color-secondary": settings?.secondaryColor || "#D4AF37",
  } as CSSProperties;

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full scroll-smooth`}
    >
      <body
        style={themeStyle}
        className="min-h-full bg-[var(--color-page)] text-[var(--color-ink)] antialiased"
      >
        {children}
      </body>
    </html>
  );
}
