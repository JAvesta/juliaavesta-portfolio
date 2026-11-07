import type { Metadata, Viewport } from "next";
import { Pixelify_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--nf-pixel", display: "swap" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--nf-body", display: "swap" });

export const metadata: Metadata = { title: "JuliaOS · Julia Avesta", description: "Product design portfolio of Julia Avesta." };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pixel.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
