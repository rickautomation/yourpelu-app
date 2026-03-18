"use client";
import Image from "next/image";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { useState } from "react";
import { FiClock } from "react-icons/fi";
import { LuMapPin } from "react-icons/lu";
import { IoCalendarOutline, IoGiftOutline } from "react-icons/io5";

type BarberImage = { id: string; imageUrl: string };

type ProfileData = {
  id: string;
  lema?: string;
  description?: string;
  openingHours?: string;
  adressCoordinates?: string;
  logoUrl?: string;
  websiteUrl?: string | null;
  images?: BarberImage[];
};

type Barbershop = {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  profile?: ProfileData;
};

interface Props {
  barbershop: Barbershop;
}

export default function BarbershopFeed({ barbershop }: Props) {
  const [showHours, setShowHours] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showPromos, setShowPromos] = useState(false);
  const [showTurno, setShowTurno] = useState(false);

  const profile = barbershop.profile;

  return (
    <div className="w-full min-h-screen max-w-md mx-auto text-white bg-slate-900 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center">
        {profile?.logoUrl && (
          <div className="flex justify-around w-full px-2 py-4">
            <div className="w-20 h-20 rounded-full border-4 bg-black border-white overflow-hidden shadow-lg">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${profile.logoUrl}`}
                alt={`${barbershop.name} logo`}
                width={80}
                height={80}
                className="object-contain w-full h-full"
                unoptimized
              />
            </div>
            <div className="flex flex-col text-center items-center justify-center">
              <h3 className="text-3xl font-bold">{barbershop.name}</h3>
              {profile?.lema && (
                <h2 className="text-md font-semibold text-pink-400 italic">
                  “{profile.lema}”
                </h2>
              )}
            </div>
          </div>
        )}

        {/* Historias (círculos interactivos) */}
        <div className="flex justify-center gap-4 mt-2 flex-wrap">
          {profile?.openingHours && (
            <button
              onClick={() => setShowHours(true)}
              className="flex flex-col gap-1 items-center justify-center text-pink-400 hover:bg-pink-400 hover:text-white transition"
            >
              <FiClock className="text-6xl" />
              <span className="text-xs">Horarios</span>
            </button>
          )}

          {barbershop.address && profile?.adressCoordinates && (
            <button
              onClick={() => setShowAddress(true)}
              className="flex flex-col gap-1 items-center justify-center text-pink-400 hover:bg-pink-400 hover:text-white transition"
            >
              <LuMapPin className="text-6xl" />
              <span className="text-xs">Ubicacion</span>
            </button>
          )}

          <button
            onClick={() => setShowPromos(true)}
            className="flex flex-col gap-1 items-center justify-center text-pink-400 hover:bg-pink-400 hover:text-white transition"
          >
            <IoGiftOutline className="text-6xl" />
            <span className="text-xs">Promociones</span>
          </button>

          <button
            onClick={() => setShowTurno(true)}
            className="flex flex-col gap-1 items-center justify-center text-pink-400 hover:bg-pink-400 hover:text-white transition"
          >
            <IoCalendarOutline className="text-6xl" />
            <span className="text-xs">Turnos</span>
          </button>
        </div>

        {/* Popups */}
        {showHours && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
            onClick={() => setShowHours(false)}
          >
            <div
              className="bg-gray-800 rounded-lg p-6 max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-pink-400 mb-4">Horarios</h3>
              <p className="text-gray-200">{profile?.openingHours}</p>
              <button
                onClick={() => setShowHours(false)}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {showAddress && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
            onClick={() => setShowAddress(false)}
          >
            <div
              className="bg-gray-800 rounded-lg p-6 max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-pink-400 mb-4">
                Dirección
              </h3>
              <p className="text-gray-200 mb-4">{barbershop.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${profile?.adressCoordinates}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700"
              >
                <FaMapMarkerAlt /> Abrir en Google Maps
              </a>
              <button
                onClick={() => setShowAddress(false)}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {showPromos && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
            onClick={() => setShowPromos(false)}
          >
            <div
              className="bg-gray-800 rounded-lg p-6 max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-pink-400 mb-4">
                Promociones
              </h3>
              <p className="text-gray-200">No hay promociones disponibles</p>
              <button
                onClick={() => setShowPromos(false)}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {showTurno && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
            onClick={() => setShowTurno(false)}
          >
            <div
              className="bg-gray-800 rounded-lg p-6 max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-pink-400 mb-4">
                Solicitar turno
              </h3>
              <p className="text-gray-200 mb-4">
                Contactanos por WhatsApp para reservar tu turno
              </p>
              {barbershop.phoneNumber && (
                <p className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaPhoneAlt className="text-pink-400" />{" "}
                  {barbershop.phoneNumber}
                </p>
              )}
              <a
                href={`https://wa.me/${barbershop.phoneNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FaWhatsapp /> Abrir WhatsApp
              </a>
              <button
                onClick={() => setShowTurno(false)}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Descripción más destacada */}
        {profile?.description && (
          <div className="px-6 py-4 text-center">
            <p className="text-gray-300 text-md leading-relaxed">
              {profile.description}
            </p>
          </div>
        )}
      </div>

      {/* Carrusel automático */}
      <div className="px-6 pb-6 mt-4">
        {profile?.images?.length ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
            className="rounded-lg overflow-hidden"
          >
            {profile.images.map((img) => (
              <SwiperSlide key={img.id}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${img.imageUrl}`}
                  alt="Imagen de la barbería"
                  width={400}
                  height={350}
                  className="object-cover w-full h-[350px] rounded-lg"
                  unoptimized
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="italic text-gray-400 text-center">
            Próximamente fotos de nuestros cortes
          </p>
        )}
      </div>
    </div>
  );
}
