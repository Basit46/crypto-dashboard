import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import RootLayoutContent from "./components/RootLayoutContent";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins-sans",
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
      <body className={`${poppins.variable}`}>
        <RootLayoutContent children={children} />
      </body>
    </html>
  );
}
