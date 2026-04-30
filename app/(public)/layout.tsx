import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full flex flex-col overflow-hidden">
        <header className="pt-10">
          <Link href="/">
            <Image
              src="/yourpelu-logo.png"
              alt="Yourpelu Logo"
              width={150}
              height={150}
              className="mx-auto h-24 w-auto"
            />
          </Link>
        </header>
        <main className="flex-1 pb-4 min-h-screen">{children}</main>
      </body>
    </html>
  );
}