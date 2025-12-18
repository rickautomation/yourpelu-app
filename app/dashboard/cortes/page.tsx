"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPost } from "@/app/lib/apiPost";
import { useFakeAuth } from "@/app/lib/useFakeAuth";

type Haircut = {
  id: string;
  createdAt: string;
  type: HaircutType;
  style?: HaircutStyle;
};

type HaircutType = {
  id: string;
  name: string;
  description?: string;
  price?: number;
};

type HaircutStyle = {
  id: string;
  name: string;
  description?: string;
  barbershopId?: string;
};

export default function HaircutsPage() {
  const { user } = useFakeAuth();
  const [ownTypes, setOwnTypes] = useState<HaircutType[]>([]);
  const [styles, setStyles] = useState<HaircutStyle[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");

  const [showDropdown, setShowDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const [recentHaircuts, setRecentHaircuts] = useState<Haircut[]>([]);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const own = await apiGet<HaircutType[]>(
        `/client-haircut-types/barbershop/${user?.barbershop?.id}`
      );
      setOwnTypes(own);

      const stylesData = await apiGet<HaircutStyle[]>(
        `/haircut-styles/barbershop/${user?.barbershop?.id}`
      );
      setStyles(stylesData);
    } catch (err) {
      console.error("Error cargando datos", err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.barbershop?.id) {
    fetchData();
  } else {
    // 👇 si no hay barbería, igual desactivamos loading
    setLoading(false);
  }
}, [user]);

  const showTempMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await apiGet<Haircut[]>(`/haircuts/user/${user?.id}/last`);
        console.log("Últimos cortes recibidos:", data);
        setRecentHaircuts(data);
      } catch (err) {
        console.error("Error cargando últimos cortes", err);
      }
    };
    if (user?.id) fetchRecent();
  }, [user]);

  const handleAddHaircut = async () => {
    if (!selectedType) return;
    try {
      await apiPost(`/haircuts`, {
        userId: user?.id,
        clientTypeId: selectedType, // 👈 ahora mandamos el id del tipo propio
        styleId: selectedStyle || null,
      });
      setShowAdd(false);
      setSelectedType("");
      setSelectedStyle("");
      showTempMessage("success", "Corte agregado exitosamente");
    } catch (err) {
      console.error("Error agregando corte", err);
      showTempMessage("error", "Error al agregar corte");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="flex flex-col space-y-4">
      {ownTypes.length === 0 ? (
        <p className="text-sm text-red-400">
          No tienes tipos propios de cortes. Debes agregarlos primero en
          “Servicios”.
        </p>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-white">Agregar corte</p>
            {!showAdd && (
              <button
                onClick={() => setShowAdd(true)}
                className="w-10 h-10 flex items-center justify-center bg-pink-400 text-white rounded-md hover:bg-pink-500 transition-colors text-xl font-bold"
              >
                +
              </button>
            )}
          </div>

          {showAdd && (
            <div className="flex flex-col gap-2">
              {/* Select de tipos */}
              <div className="relative">
                {/* Botón que abre/cierra el menú */}
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white flex justify-between items-center truncate"
                >
                  <span className="truncate">
                    {selectedType
                      ? ownTypes.find((t) => t.id === selectedType)?.name
                      : "Selecciona un tipo"}
                  </span>

                  {/* Icono de flecha */}
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${
                      showTypeDropdown ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Menú desplegable controlado por estado */}
                {showTypeDropdown && (
                  <ul className="absolute mt-1 w-full max-h-40 overflow-y-auto bg-gray-800 rounded shadow-lg z-10">
                    {ownTypes.map((t) => (
                      <li
                        key={t.id}
                        onClick={() => {
                          setSelectedType(t.id);
                          setShowTypeDropdown(false); // cerrar al elegir
                        }}
                        className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer truncate"
                        title={`${t.name}${t.price ? ` - $${t.price}` : ""}`}
                      >
                        {`${t.name}${t.price ? ` - $${t.price}` : ""}`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Select de estilos */}
              {/* Select de estilos (solo si el tipo no es "Barba") */}
              {selectedType &&
                ownTypes
                  .find((t) => t.id === selectedType)
                  ?.name.toLowerCase() !== "barba" && (
                  <div className="relative">
                    {/* Botón que abre/cierra el menú */}
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white flex justify-between items-center truncate"
                    >
                      <span className="truncate">
                        {selectedStyle
                          ? styles.find((s) => s.id === selectedStyle)?.name
                          : "Selecciona un estilo (opcional)"}
                      </span>

                      {/* Icono de flecha */}
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${
                          showDropdown ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Menú desplegable controlado por estado */}
                    {showDropdown && (
                      <ul className="absolute mt-1 w-full max-h-40 overflow-y-auto bg-gray-800 rounded shadow-lg z-10">
                        {/* Opción Ninguno */}
                        <li
                          onClick={() => {
                            setSelectedStyle(""); // 👈 resetea estilo
                            setShowDropdown(false);
                          }}
                          className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                        >
                          Ninguno
                        </li>

                        {styles.map((s) => (
                          <li
                            key={s.id}
                            onClick={() => {
                              setSelectedStyle(s.id);
                              setShowDropdown(false); // cerrar al elegir
                            }}
                            className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer truncate"
                            title={`${s.name}${
                              s.description ? ` — ${s.description}` : ""
                            }`}
                          >
                            {`${s.name}${
                              s.description ? ` — ${s.description}` : ""
                            }`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

              <div className="flex gap-2">
                <button
                  onClick={handleAddHaircut}
                  className="flex-1 bg-pink-400 text-white px-3 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => {
                    setShowAdd(false);
                    setSelectedType("");
                    setSelectedStyle("");
                  }}
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Últimos cortes */}
      {recentHaircuts.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-3">
          <p className="text-xl font-semibold text-white">Últimos cortes</p>
          <div className="flex flex-col gap-3">
            {recentHaircuts.map((h) => (
              <div
                key={h.id}
                className="bg-gray-700 rounded-md p-3 flex justify-between items-center shadow"
              >
                {/* Tipo y estilo en columna */}
                <div className="flex flex-col text-white font-medium">
                  <span>{h.type.name}</span>
                  {h.style && (
                    <span className="text-sm text-gray-300">
                      🎨 {h.style.name}
                    </span>
                  )}
                </div>

                {/* Fecha y hora en columna */}
                <span className="text-sm text-gray-400 flex flex-col items-end">
                  <span>{new Date(h.createdAt).toLocaleDateString()}</span>
                  <span>
                    {new Date(h.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
