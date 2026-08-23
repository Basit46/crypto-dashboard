import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import RootLayoutContent from "./components/RootLayoutContent";
import { THEME_STORAGE_KEY } from "./utils/constant";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Figures are set in mono so columns align and digits never shift width.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CoinVista — Crypto market terminal",
    template: "%s · CoinVista",
  },
  description:
    "CoinVista is an all-in-one crypto and NFT dashboard for tracking real-time prices, portfolio performance, market trends and blockchain analytics.",
  other: {
    google: "notranslate",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c10" },
  ],
};

// Resolves the theme before first paint so the page never flashes the wrong one.
const themeBootstrap = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}
