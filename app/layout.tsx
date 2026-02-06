import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YourPelu",
  description: "Gestión de peluquería",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ]
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="min-h-screen overflow-x-hidden bg-gray-950">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full overflow-x-hidden bg-gray-950`}
      >

        {/* Main content */}
        <main className="relative z-20 bg-gray-950 h-full">{children}</main>
      </body>
    </html>
  );
}
