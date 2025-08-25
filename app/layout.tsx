import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";
import RootLayoutContent from "./components/RootLayoutContent";

const gabarito = Gabarito({
  variable: "--font-gabarito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoinVista",
  description:
    "CoinVista is your all in one crypto and NFT dashboard for tracking real-time prices, portfolio performance, market trends, and blockchain analytics",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no">
      <body className={`${gabarito.variable} w-screen h-screen`}>
        <RootLayoutContent children={children} />
      </body>
    </html>
  );
}
