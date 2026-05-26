import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eid ul Adha Mubarak",
  description: "May this blessed day of sacrifice fill your heart with joy, your home with warmth, and your life with the peace that comes from true devotion. Taqabbal Allahu Minna wa Minkum.",
  keywords: ["Eid", "Eid ul Adha", "Mubarak", "Bakra Eid", "Eid Card", "Rana Muhammad Tayyab Atiq"],
};

export const viewport: Viewport = {
  themeColor: "#0d2218",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
