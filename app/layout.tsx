import { Toaster } from "sonner";
import type { Viewport } from "next";
import { Comfortaa, Rubik } from "next/font/google";

import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const viewport: Viewport = {
  viewportFit: "cover",
  initialScale: 1,
  userScalable: false,
  themeColor: "#2C3238",
};

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Triptrackr",
  description: "Your travel planner",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

const comfortaa = Comfortaa({
  subsets: ["latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${comfortaa.variable} ${rubik.variable}`}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="assets/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="assets/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="assets/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="assets/safari-pinned-tab.svg"
          color="#2C3238"
        />
        <meta name="msapplication-TileColor" content="#2C3238" />
        <meta name="theme-color" content="#2C3238" />
      </head>
      <body>
        <Toaster expand position="bottom-center" richColors />
        <main className="relative mx-auto min-h-screen w-full max-w-7xl">
          {children}
        </main>
      </body>
    </html>
  );
}
