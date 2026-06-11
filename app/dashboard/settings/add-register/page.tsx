"use client";

import { useEffect, useState } from "react";
import { BsToggle2On, BsToggle2Off, BsCash } from "react-icons/bs";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { SiMercadopago } from "react-icons/si";
import { AiOutlineRight } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { apiPatch } from "@/app/lib/apiPatch";
import { apiPost } from "@/app/lib/apiPost";
import { apiGet } from "@/app/lib/apiGet";
import { FaRegMoneyBillAlt } from "react-icons/fa";

interface PaymentMethod {
  id: string;
  type: string;
  isActive: boolean;
}

export default function AddRegisterPage() {
  const { activeEstablishment, settings } = useEstablishment();
  const router = useRouter();

  // Estado local inicial desde settings
  const [clientsInOfferings, setClientsInOfferings] = useState(
    settings?.clients_in_offerings ?? false,
  );
  const [editing, setEditing] = useState(false); // controla si el toggle está habilitado
  const [tempValue, setTempValue] = useState(clientsInOfferings); // valor temporal mientras editás

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  console.log("settings: ", settings);

  const updateClientsInOfferings = async () => {
    try {
      const updated = await apiPatch(
        `/establishments/${activeEstablishment?.id}/settings`,
        { clients_in_offerings: tempValue },
      );
      console.log("Actualizado en backend:", updated);
      setClientsInOfferings(tempValue);
      setEditing(false);
      window.location.reload();
    } catch (err) {
      console.error("Error al actualizar clients_in_offerings:", err);
    }
  };

  const handleCreatePaymentMethod = async () => {
    try {
      const newPayment = await apiPost(
        `/payment-methods/${activeEstablishment?.id}`,
        { type: paymentType },
      );

      console.log("Método de pago creado:", newPayment);

      setShowPaymentModal(false);
      setPaymentType("");
      setIsActive(true);
      window.location.reload();
    } catch (err) {
      console.error("Error al crear método de pago:", err);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setTempValue(clientsInOfferings); // vuelve al valor original
    setEditing(false);
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await apiGet<PaymentMethod[]>(
          `/payment-methods/establishment/${activeEstablishment?.id}`,
        );
        setPaymentMethods(data);
      } catch (err) {
        console.error("Error al traer métodos de pago:", err);
      }
    };

    if (activeEstablishment?.id) {
      fetchPayments();
    }
  }, [activeEstablishment?.id]);

  return (
    <div className="min-h-screen text-white p-6 space-y-4">
      {/* Header */}
      <header className="border-b border-gray-700 pb-4 text-xl">
        <p>{"Settings > Register"}</p>
      </header>

      {/* Sección: Incluir clientes */}
      <section className="bg-exposeBrandBlue rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Incluir clientes</h3>

          {/* Toggle siempre visible */}
          <button
            disabled={!editing}
            onClick={() => setTempValue(!tempValue)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-2xl ${
              !editing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {tempValue ? (
              <>
                <BsToggle2On className="text-green-600 text-4xl" />
                <span>SI</span>
              </>
            ) : (
              <>
                <BsToggle2Off className="text-gray-500 text-4xl" />
                <span>NO</span>
              </>
            )}
          </button>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center gap-4 mt-3">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-pink-500 hover:bg-yellow-700 px-4 py-2 rounded"
            >
              Cambiar
            </button>
          ) : (
            <div className="flex gap-4 mt-4 w-full">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={updateClientsInOfferings}
                className="flex-1 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sección: Métodos de pago */}
      <section className="bg-exposeBrandBlue rounded-lg p-4 shadow-md">
        <h3 className="text-xl font-semibold mb-2">Métodos de pago</h3>
        <div className="px-2 text-center">
          <ul className="space-y-1 text-gray-300">
            <div className="flex items-center gap-3 text-xl">
              <BsCash className="text-green-500" />
              <li> Efectivo</li>
            </div>
            <div className="flex items-center gap-3 text-xl">
              <SiMercadopago className="text-blue-500 bg-white" />
              <li>MercadoPago</li>
            </div>

            {paymentMethods.map((pm) => (
              <div key={pm.id} className="flex items-center gap-3 text-xl">
                <FaRegMoneyBillAlt />
                <li>{pm.type}</li>
                {!pm.isActive && (
                  <span className="text-sm text-red-400">(Inactivo)</span>
                )}
              </div>
            ))}
          </ul>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Agregar
          </button>
        </div>
      </section>

      {/* Sección: Cambiar vista */}
      <section
        onClick={() => router.push(`/dashboard/settings/add-register/views`)}
        className="flex items-center justify-between bg-exposeBrandBlue rounded-lg p-4 shadow-md"
      >
        <h3 className="text-xl font-semibold mb-2">Cambiar vista</h3>
        <div className="p-1 bg-ligthBrandBlue rounded-full">
          <AiOutlineRight />
        </div>
      </section>

      {showPaymentModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-luminiBrandBlue p-6 rounded-lg w-96 shadow shadow-black">
            <h2 className="text-xl font-semibold mb-4">Nuevo método de pago</h2>

            <input
              type="text"
              placeholder="Tipo (ej: Tarjeta, Transferencia)"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-ligthBrandBlue text-white"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-ligthBrandBlue hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePaymentMethod}
                className="flex-1 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
