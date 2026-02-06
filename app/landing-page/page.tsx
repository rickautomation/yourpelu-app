import Image from "next/image";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-blue-950 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-3 bg-blue-900">
        <Image
          src="/yourpelu-logo.png"
          alt="YourPelu Logo"
          width={120}
          height={80}
        />
        <nav className="space-x-6 hidden md:flex">
          <a href="#features" className="hover:text-pink-400">Beneficios</a>
          <a href="#about" className="hover:text-pink-400">Sobre la App</a>
          <a href="#contact" className="hover:text-pink-400">Contacto</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Organiza tu barbería con estilo
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-6">
          YourPelu es la app pensada para barberos y clientes: gestiona turnos,
          organiza tu equipo y lleva tu barbería al siguiente nivel.
        </p>
        <a
          href="#contact"
          className="bg-pink-500 px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
        >
          Empezar ahora
        </a>
      </section>

      {/* Features */}
      <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-12 text-center">
        <div className="bg-blue-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">📅 Turnos fáciles</h2>
          <p>Agenda y confirma citas en segundos, sin confusiones.</p>
        </div>
        <div className="bg-blue-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">👥 Gestión de clientes</h2>
          <p>Historial, preferencias y contacto directo con tus clientes.</p>
        </div>
        <div className="bg-blue-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">💈 Administración del equipo</h2>
          <p>Coordina barberos, horarios y recursos de forma transparente.</p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">¿Por qué YourPelu?</h2>
        <p className="max-w-2xl mx-auto">
          Porque sabemos que cada barbería es más que un negocio: es un espacio
          de encuentro, estilo y confianza. Nuestra app convierte la gestión en
          un ritual sencillo y moderno.
        </p>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Contactanos</h2>
        <p className="mb-6">Sumate a la comunidad de barberías organizadas.</p>
        <div className="flex justify-center space-x-6 text-3xl">
          <a
            href="mailto:info@yourpelu.com"
            className="hover:text-pink-400"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://instagram.com/yourpelu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/5492610000000"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400"
          >
            <FaWhatsapp />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-blue-900 p-6 text-center text-sm text-gray-400">
        © 2026 YourPelu — Hecho en Rivadavia, Mendoza
      </footer>
    </main>
  );
}