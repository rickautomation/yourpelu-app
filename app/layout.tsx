import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "./components/ServiceWorkerRegister";

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
    icon: [{ url: "/Your.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="min-h-screen overflow-x-hidden bg-gray-950">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1800ad" />

        {/* iOS support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full overflow-x-hidden bg-gray-950`}
      >
        <main className="relative z-20 bg-gray-950 h-full">
          {children} 
          <ServiceWorkerRegister />
        </main>
      </body>
    </html>
  );
}
