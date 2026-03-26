"use client";
import Image from "next/image";
import EditableFieldRow from "./EditableFieldRow";

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

export default function BarbershopProfileCardEditable({ barbershop }: Props) {
  const profile = barbershop.profile;

  const getImageSrc = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) {
      return url; // Producción: Cloudinary u otra URL pública
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`; // Local: concatenar API_URL
  };

  return (
    <div className="max-w-3xl mx-auto text-white overflow-hidden  bg-gray-900">
      {/* Header */}
      <div className="flex flex-col items-center p-6 bg-gray-800">
        {profile?.logoUrl ? (
          <Image
            src={getImageSrc(profile?.logoUrl)}
            alt={`${barbershop.name} logo`}
            width={120}
            height={120}
            className=" border-4 border-pink-500 shadow-md"
            unoptimized
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center rounded-full border-4 border-dashed border-pink-500 text-gray-400">
            Logo pendiente
          </div>
        )}
        <h2 className="mt-4 text-3xl font-bold">{barbershop.name}</h2>
        <p className="text-gray-400">
          {barbershop.address || "📍 Dirección pendiente"}
        </p>
        <p className="text-gray-400">
          📞 {barbershop.phoneNumber || "Teléfono pendiente"}
        </p>
      </div>

      {/* Información general */}
      <div className="flex flex-col space-y-2 px-4">
        <EditableFieldRow
          label="Lema"
          value={profile?.lema}
          placeholder="Agrega un lema"
        />
        <EditableFieldRow
          label="Descripción"
          value={profile?.description}
          placeholder="Agrega una descripción"
          multiline
        />
        <EditableFieldRow
          label="Horario"
          value={profile?.openingHours}
          placeholder="Agrega un horario"
        />
        <EditableFieldRow
          label="Ubicación"
          value={profile?.adressCoordinates}
          placeholder="Agrega una ubicación"
        />
      </div>

      {/* Galería */}
      <div className="px-6 py-4">
        <h3 className="text-xl font-semibold mb-4 text-pink-400">Galería</h3>
        {profile?.images?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profile.images.map((img) => (
              <Image
                key={img.id}
                src={getImageSrc(img.imageUrl)}
                alt="Barbershop image"
                width={300}
                height={200}
                className="rounded-lg object-cover shadow-lg"
                unoptimized
              />
            ))}
          </div>
        ) : (
          <p className="italic text-gray-400">No hay imágenes cargadas</p>
        )}
      </div>
    </div>
  );
}
