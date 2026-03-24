import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPost } from "@/app/lib/apiPost";
import { apiDelete } from "@/app/lib/apiDelete";
import { useAuth } from "@/app/lib/useAuth";

export type BarberClient = {
  id: string;
  name: string;
  lastname: string;
  email?: string;
  phone?: string;
  createdAt: string;
};

export function useClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<BarberClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const barbershopId = user?.barbershop?.id;

  const fetchClients = async () => {
    if (!barbershopId) {
      setLoading(false);
      return;
    }
    try {
      const data = await apiGet<BarberClient[]>(
        `/barber-clients/barbershop/${barbershopId}`,
      );
      setClients(data);
    } catch (err) {
      console.error("Error cargando clientes", err);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<BarberClient, "id" | "createdAt">) => {
    try {
      const created = await apiPost(
        `/barber-clients/barbershop/${barbershopId}`,
        client,
      );
      await fetchClients();
      showTempMessage("success", "Cliente creado exitosamente");
      return created; // devolver el cliente creado con id
    } catch (err) {
      console.error("Error creando cliente", err);
      showTempMessage("error", "Error al crear cliente");
      return null;
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      await apiDelete(`/barber-clients/client/${clientId}`);
      await fetchClients();
      showTempMessage("success", "Cliente eliminado");
    } catch (err) {
      console.error("Error eliminando cliente", err);
      showTempMessage("error", "Error al eliminar cliente");
    }
  };

  const showTempMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    fetchClients();
  }, [barbershopId]);

  return {
    clients,
    loading,
    message,
    addClient,
    deleteClient,
    refetch: fetchClients,
  };
}
