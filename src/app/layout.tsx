import type { Metadata } from "next";
import "./globals.css";
import { PlayerProvider } from "@/lib/PlayerContext";
import AudioPlayer from "@/components/player/AudioPlayer";

export const metadata: Metadata = {
  title: "BEATVAULT — Exclusive DJ Music Pool",
  description:
    "Fuel your mix with exclusive DJ tracks. Browse House, Techno, Hip-Hop and more. Professional quality, DJ license included.",
  keywords: ["DJ music", "house music", "techno", "hip-hop", "music pool", "beatvault"],
  authors: [{ name: "BEATVAULT" }],
  openGraph: {
    title: "BEATVAULT — Exclusive DJ Music Pool",
    description: "Fuel your mix with exclusive DJ tracks.",
    type: "website",
  },
};

import { CartProvider } from "@/lib/CartContext";
import { SearchProvider } from "@/lib/SearchContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-base text-white antialiased">
        <PlayerProvider>
          <CartProvider>
            <SearchProvider>
              {children}
              <AudioPlayer />
            </SearchProvider>
          </CartProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
