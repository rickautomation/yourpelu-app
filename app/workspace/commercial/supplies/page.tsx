// src/app/workspace/commercial/supplies/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSupplies, Supply } from "@/app/hooks/useSupplies";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { FiPlus, FiX, FiInbox } from "react-icons/fi";

export default function SuppliesPage() {
  const { activeEstablishment } = useEstablishment();
  const establishmentId = activeEstablishment?.id;

  const {
    supplies,
    loading,
    error,
    fetchSupplies,
    createSupply,
    updateSupply,
    deleteSupply,
  } = useSupplies();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (establishmentId) {
      fetchSupplies(establishmentId);
    }
  }, [establishmentId, fetchSupplies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !establishmentId) return;

    if (editingId) {
      const success = await updateSupply(editingId, {
        name,
        description,
        price: parseFloat(price),
      });
      if (success) {
        resetForm();
      }
    } else {
      const success = await createSupply({
        name,
        description,
        price: parseFloat(price),
        establishmentId,
      });
      if (success) {
        resetForm();
      }
    }
  };

  const handleEditClick = (supply: Supply) => {
    setEditingId(supply.id);
    setName(supply.name);
    setDescription(supply.description);
    setPrice(supply.price.toString());
    setShowForm(true);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setEditingId(null);
    setShowForm(false);
  };

  if (!establishmentId) {
    return (
      <div className="p-5 max-w-5xl mx-auto text-white">
        <p className="text-gray-400">Selecciona un establecimiento para gestionar los insumos.</p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-5xl mx-auto text-white space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Insumos</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-pink-600/20"
          >
            <FiPlus className="w-4 h-4" /> Agregar Insumo
          </button>
        )}
      </div>

      {/* Formulario Modal o Desplegable */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-luminiBrandBlue border border-white/10 p-5 rounded-xl shadow-xl grid gap-4 relative animate-in fade-in duration-200"
        >
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h2 className="text-lg font-semibold text-white">
              {editingId ? "Editar Insumo" : "¿Desea agregar un nuevo insumo?"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-white p-1 rounded-lg bg-gray-800/50"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">
              Precio
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${
                editingId
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-pink-600 hover:bg-pink-700"
              } text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50`}
            >
              {loading
                ? "Procesando..."
                : editingId
                  ? "Actualizar Insumo"
                  : "Guardar Insumo"}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      {/* Listado de insumos */}
      <div className="bg-luminiBrandBlue/40 border border-white/5 rounded-xl p-4 shadow-md space-y-3">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Insumos Registrados
        </h2>
        {loading && supplies.length === 0 ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : supplies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <div className="p-3 bg-gray-800/50 rounded-full text-gray-400">
              <FiInbox className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-400">No hay insumos registrados actualmente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {supplies.map((supply) => (
              <div
                key={supply.id}
                className="bg-luminiBrandBlue border border-white/10 p-3.5 rounded-xl flex justify-between items-center hover:border-white/20 transition-all"
              >
                <div>
                  <p className="font-semibold text-white">{supply.name}</p>
                  <p className="text-xs text-gray-400">{supply.description || "Sin descripción"}</p>
                  <p className="text-sm font-extrabold text-emerald-400 mt-1">
                    ${supply.price}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(supply)}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteSupply(supply.id)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}