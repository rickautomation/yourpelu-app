"use client";

import { useParams } from "next/navigation";
import { GiComb } from "react-icons/gi";
import { RiScissorsCutFill } from "react-icons/ri";

export default function UnderConstructionPage() {

  return (
    <div className="flex flex-col items-center justify-center text-white px-6">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold tracking-wide flex items-center space-x-3">
          <RiScissorsCutFill className="w-20 h-20"/>
          <GiComb className="w-20 h-20" />
        </h1>
          <span className="text-3xl">Sección en construcción</span>

        <p className="text-lg text-gray-300 max-w-md text-center mb-8">
          Estamos trabajando para traer esta funcionalidad. 
          Muy pronto vas a poder explorarla como parte de la experiencia YourPelu.
        </p>
      </div>
    </div>
  );
}