import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Pelu",
  description: "Gestión de peluquería",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full w-full overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full overflow-x-hidden`}
      >

        {/* Main content */}
        <main className="w-full max-w-7xl mx-auto text-white">{children}</main>
      </body>
    </html>
  );
}
