"use client";
import Image from "next/image";

type BarberImage = {
  id: string;
  imageUrl: string;
};

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
  deletedAt?: string | null;
  profile?: ProfileData;
};

interface Props {
  barbershop: Barbershop;
}

export default function BarbershopProfileCard({ barbershop }: Props) {
  const profile = barbershop.profile;

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 text-white shadow-xl rounded-lg overflow-hidden">
      {/* Header con logo */}
      <div className="flex flex-col items-center p-6 bg-gray-800">
        <h2 className="mt-4 text-3xl font-bold">{barbershop.name}</h2>
        <p className="text-gray-400">{barbershop.address}</p>
        <p className="text-gray-400">📞 {barbershop.phoneNumber}</p>
                {profile?.logoUrl && (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${profile.logoUrl}`}
            alt={`${barbershop.name} logo`}
            width={120}
            height={120}
            className="rounded-full border-4 border-pink-500 shadow-md"
            unoptimized
          />
        )}
      </div>

      {/* Perfil */}
      {profile && (
        <div className="p-6 space-y-3">
          <p><span className="font-semibold text-pink-400">Lema:</span> {profile.lema}</p>
          <p><span className="font-semibold text-pink-400">Descripción:</span> {profile.description}</p>
          <p><span className="font-semibold text-pink-400">Horario:</span> {profile.openingHours}</p>
          <p><span className="font-semibold text-pink-400"></span> {profile.adressCoordinates}</p>
        </div>
      )}

      {/* Galería */}
      {profile?.images && profile.images.length > 0 && (
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-center text-pink-400">Galería</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profile.images.map((img) => (
              <div key={img.id} className="relative group">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${img.imageUrl}`}
                  alt="Barbershop image"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover transform group-hover:scale-105 transition duration-300 shadow-lg"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}