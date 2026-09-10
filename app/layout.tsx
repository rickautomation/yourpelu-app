import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Lexend_Deca } from "next/font/google";
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

// Configuración global de Lexend Deca
const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  variable: "--font-lexend-deca",
  display: "swap",
});

// Configuración de la pantalla y barras del sistema (iOS y Android)
export const viewport: Viewport = {
  themeColor: "#1b1b45", // Pinta las barras del sistema (navegación e inicio) con bg-darkBrandBlue
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Deshabilita zoom accidental en inputs para experiencia nativa
  viewportFit: "cover", // Expande la app debajo del notch y la barra de navegación
};

export const metadata: Metadata = {
  title: "YourPelu",
  description: "Gestión de peluquería",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/Your.png", type: "image/png" }],
    apple: [{ url: "/Your192.png", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "YourPelu",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="min-h-screen overflow-x-hidden bg-darkBrandBlue">
      <body
        className={`${lexendDeca.className} ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full overflow-x-hidden bg-darkBrandBlue`}
      >
        <main className="relative z-20">
          {children}
          <ServiceWorkerRegister />
        </main>
      </body>
    </html>
  );
}