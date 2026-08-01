import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./product.css";
import { MotionSystem } from "@/components/motion-system";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Verity — See the story behind every file",
  description:
    "Inspect content credentials, trace edit history, and verify the provenance of digital media.",
  openGraph: {
    title: "Verity — Digital content provenance",
    description:
      "Inspect credentials, trace edit history, and understand where digital media comes from.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verity — Digital content provenance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${mono.variable}`}>
        <MotionSystem>{children}</MotionSystem>
      </body>
    </html>
  );
}
