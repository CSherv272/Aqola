import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import "leaflet/dist/leaflet.css";
import "./components/leaflet-defaulticon-compatibility.webpack.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AQOLA",
  description: "Area Quality of Life Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/icon.png" sizes="any" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.0.0/uicons-regular-straight/css/uicons-regular-straight.css" />

      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
