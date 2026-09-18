import { useState, useEffect } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPatch } from "@/app/lib/apiPatch";

export type WorkRelationAttribute = {
  id: string;
  name: string;
  description?: string;
};

export type WorkRelationType = {
  id: string;
  name: string;
  description?: string;
  attributes: WorkRelationAttribute[];
};

export type WorkRelation = {
  id: string;
  amount?: number | null;
  type: WorkRelationType;
};

export type User = {
  id: string;
  name: string;
  lastname: string;
  rol: string;
  phoneNumber: string;
  email?: string;
  userProfile?: { avatarUrl?: string };
  workRelations?: WorkRelation[];
};

export function useStaffDetail(userId: string | undefined) {
  const [user, setUser] = useState<User | null>(null);
  const [availableTypes, setAvailableTypes] = useState<WorkRelationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de edición de monto
  const [editingAmountId, setEditingAmountId] = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState<number | null>(null);

  // Estados para cambiar el tipo de relación
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [selectedNewTypeId, setSelectedNewTypeId] = useState<string>("");

  const fetchUserData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await apiGet<User>(`/user/${userId}`);
      setUser(res);
    } catch (err: any) {
      setError(err?.message || "Error cargando usuario");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkRelationTypes = async () => {
    try {
      const res = await apiGet<WorkRelationType[]>("/work-relation-types");
      setAvailableTypes(res);
    } catch (err) {
      console.error("Error cargando tipos de relación", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchWorkRelationTypes();
    }
  }, [userId]);

  const handleSaveAmount = async (relationId: string) => {
    try {
      await apiPatch(`/work-relations/${relationId}`, { amount: newAmount });
      await fetchUserData();
      setEditingAmountId(null);
      setNewAmount(null);
    } catch (err) {
      console.error("Error guardando monto/comisión", err);
    }
  };

  const handleSaveType = async (relationId: string) => {
    try {
      if (!selectedNewTypeId) return;
      await apiPatch(`/work-relations/${relationId}`, { typeId: selectedNewTypeId });
      await fetchUserData();
      setEditingTypeId(null);
      setSelectedNewTypeId("");
    } catch (err) {
      console.error("Error cambiando tipo de relación laboral", err);
    }
  };

  return {
    user,
    loading,
    error,
    availableTypes,
    editingAmountId,
    setEditingAmountId,
    newAmount,
    setNewAmount,
    editingTypeId,
    setEditingTypeId,
    selectedNewTypeId,
    setSelectedNewTypeId,
    handleSaveAmount,
    handleSaveType,
    refreshUser: fetchUserData,
  };
}