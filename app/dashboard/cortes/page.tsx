"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPost } from "@/app/lib/apiPost";
import { useAuth } from "@/app/lib/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";

type Haircut = {
  id: string;
  createdAt: string;
  type: HaircutType;
  style?: HaircutStyle;
  client?: BarberClient;
  user?: Barber;
};

type Barber = {
  name: string;
  lastname: string;
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

type BarberClient = {
  id: string;
  name: string;
  lastname: string;
  email?: string;
  phone?: string;
  createdAt: string;
};

export default function HaircutsPage() {
  const { user } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);

  console.log("user", user)

  const [ownTypes, setOwnTypes] = useState<HaircutType[] | null>(null);
  const [styles, setStyles] = useState<HaircutStyle[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");

  const [showDropdown, setShowDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const [recentHaircuts, setRecentHaircuts] = useState<Haircut[]>([]);

  const [clients, setClients] = useState<BarberClient[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");

  // Popup modal para crear cliente
  const [showClientForm, setShowClientForm] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  console.log("haircuts: ", recentHaircuts);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const own = await apiGet<HaircutType[]>(
          `/client-haircut-types/barbershop/${activeBarbershop?.id}`,
        );
        setOwnTypes(own);

        const stylesData = await apiGet<HaircutStyle[]>(
          `/haircut-styles/barbershop/${activeBarbershop?.id}`,
        );
        setStyles(stylesData);
      } catch (err) {
        console.error("Error cargando datos", err);
      } finally {
        setLoading(false);
      }
    };

    if (activeBarbershop) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [activeBarbershop]);

    console.log("recentHaircuts", recentHaircuts);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await apiGet<BarberClient[]>(
          `/barber-clients/barbershop/${activeBarbershop?.id}`,
        );
        setClients(data);
      } catch (err) {
        console.error("Error cargando clientes", err);
      }
    };

    if (activeBarbershop?.id) {
      fetchClients();
    }
  }, [user]);

  console.log("clients: ", clients)

  //debemos buscar los cortes recientes por barberia para admins y por user para barber
 useEffect(() => {
  const fetchRecent = async () => {
    try {
      let data: Haircut[] = [];

      if (user?.rol === "admin") {
        // Admin → últimos cortes de la barbería
        data = await apiGet<Haircut[]>(
          `/haircuts/barbershop/${activeBarbershop?.id}/last`
        );
      }

      if (user?.rol === "barber") {
        // Barber → últimos cortes del barbero
        data = await apiGet<Haircut[]>(`/haircuts/user/${user?.id}/last`);
      }

      setRecentHaircuts(data);
    } catch (err) {
      console.error("Error cargando últimos cortes", err);
    }
  };

  if (user?.id && activeBarbershop) fetchRecent();
}, [user, activeBarbershop]);

  const showTempMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddHaircut = async () => {
    if (!selectedType) return;
    try {
      await apiPost(`/haircuts`, {
        userId: user?.id,
        clientId: selectedClient || null,
        clientTypeId: selectedType,
        styleId: selectedStyle || null,
        barbershopId: activeBarbershop?.id
      });
      setShowAdd(false);
      setSelectedType("");
      setSelectedStyle("");
      setSelectedClient("");
      showTempMessage("success", "Corte agregado exitosamente");
    } catch (err) {
      console.error("Error agregando corte", err);
      showTempMessage("error", "Error al agregar corte");
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost(`/barber-clients/barbershop/${activeBarbershop?.id}`, {
        name,
        lastname,
        email,
        phone,
      });

      setName("");
      setLastname("");
      setEmail("");
      setPhone("");
      setShowClientForm(false);

      const data = await apiGet<BarberClient[]>(
        `/barber-clients/barbershop/${activeBarbershop?.id}`,
      );
      setClients(data);

      showTempMessage("success", "Cliente creado exitosamente");
    } catch (err) {
      console.error("Error creando cliente", err);
      showTempMessage("error", "Error al crear cliente");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="flex flex-col space-y-4 p-4">
      {ownTypes === null ? (
        <p>...</p>
      ) : ownTypes.length === 0 ? (
        <p className="text-sm text-red-400">No tienes servicios…</p>
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
              {/* Select de clientes */}
              <div className="relative">
                <button
                  onClick={() => setShowClientDropdown(!showClientDropdown)}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white flex justify-between items-center truncate"
                >
                  <span className="truncate">
                    {selectedClient
                      ? clients?.find((c) => c.id === selectedClient)?.name +
                        " " +
                        clients?.find((c) => c.id === selectedClient)?.lastname
                      : "Selecciona un cliente"}
                  </span>
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${
                      showClientDropdown ? "rotate-180" : "rotate-0"
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

                {showClientDropdown && (
                  <ul className="absolute mt-1 w-full max-h-40 overflow-y-auto bg-gray-800 rounded shadow-lg z-10">
                    <li
                      onClick={() => {
                        setShowClientForm(true); // 👈 abre popup
                        setShowClientDropdown(false);
                      }}
                      className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                    >
                      ➕ Agregar nuevo cliente
                    </li>
                    {clients?.map((c) => (
                      <li
                        key={c.id}
                        onClick={() => {
                          setSelectedClient(c.id);
                          setShowClientDropdown(false);
                        }}
                        className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer truncate"
                      >
                        {c.name} {c.lastname}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Select de tipos */}
              <div className="relative">
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white flex justify-between items-center truncate"
                >
                  <span className="truncate">
                    {selectedType
                      ? ownTypes.find((t) => t.id === selectedType)?.name
                      : "Selecciona un tipo"}
                  </span>
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

                {showTypeDropdown && (
                  <ul className="absolute mt-1 w-full max-h-40 overflow-y-auto bg-gray-800 rounded shadow-lg z-10">
                    {ownTypes.map((t) => (
                      <li
                        key={t.id}
                        onClick={() => {
                          setSelectedType(t.id);
                          setShowTypeDropdown(false);
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
              {selectedType &&
                ownTypes
                  .find((t) => t.id === selectedType)
                  ?.name.toLowerCase() !== "barba" && (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white flex justify-between items-center truncate"
                    >
                      <span className="truncate">
                        {selectedStyle
                          ? styles.find((s) => s.id === selectedStyle)?.name
                          : "Selecciona un estilo (opcional)"}
                      </span>
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

                    {showDropdown && (
                      <ul className="absolute mt-1 w-full max-h-40 overflow-y-auto bg-gray-800 rounded shadow-lg z-10">
                        <li
                          onClick={() => {
                            setSelectedStyle("");
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
                              setShowDropdown(false);
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
                <div className="flex flex-col text-white font-medium">
                  <span>{h?.type?.name}</span>
                  {h.style && (
                    <span className="text-sm text-gray-300">
                      🎨 {h.style.name}
                    </span>
                  )}
                  <span className="text-sm text-gray-300">
                    💈 {h.user?.name + " " + h.user?.lastname}{" "}
                  </span>
                </div>
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

      {/* Popup modal para crear cliente */}
      {showClientForm && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 px-6"
          onClick={() => setShowClientForm(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // 👈 evita cerrar al click dentro
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Agregar nuevo cliente
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleCreateClient}>
              <div>
                <label className="block text-sm mb-1 text-white">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del cliente"
                  required
                  className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">
                  Apellido
                </label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Apellido del cliente"
                  required
                  className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Número de contacto"
                  className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowClientForm(false);
                    setName("");
                    setLastname("");
                    setEmail("");
                    setPhone("");
                  }}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
