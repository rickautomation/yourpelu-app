"use client";

import { useState, useCallback } from "react";
import { apiPost } from "@/app/lib/apiPost";
import { apiPut } from "@/app/lib/apiPut";
import { apiDelete } from "@/app/lib/apiDelete";
import { apiGet } from "@/app/lib/apiGet";
import { useEstablishment } from "@/app/context/EstablishmentContext";

export function useSchedules() {
  const { activeEstablishment } = useEstablishment();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Obtener los horarios con sus timeRanges
  const fetchSchedulesByEstablishment = useCallback(async (establishmentId: string) => {
    try {
      setIsLoading(true);
      const data = await apiGet<any[]>(`/schedules/establishment/${establishmentId}`);
      setSchedules(data || []);
      return data;
    } catch (error) {
      console.error("Error al obtener los horarios:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Agregar los días seleccionados
  const addDays = async (days: number[]) => {
    if (!activeEstablishment?.id) {
      throw new Error("Todavía no se creó el establecimiento");
    }

    try {
      setIsSubmitting(true);
      await apiPost(`/schedules/establishment/${activeEstablishment.id}/days`, { days });
      await fetchSchedulesByEstablishment(activeEstablishment.id);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reemplazar o actualizar los intervalos de un día completo
  const updateDayIntervals = async (dayOfWeek: number, intervals: { start: string; end: string }[]) => {
    if (!activeEstablishment?.id) {
      throw new Error("Establecimiento no encontrado");
    }

    try {
      setIsSubmitting(true);
      await apiPut(`/schedules/establishment/${activeEstablishment.id}/day/${dayOfWeek}`, {
        intervals,
      });
      await fetchSchedulesByEstablishment(activeEstablishment.id);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  // NUEVO: Actualizar un rango horario individual por su ID (/time-ranges/:id)
  const updateTimeRange = async (timeRangeId: string, start: string, end: string) => {
    if (!activeEstablishment?.id) return;

    try {
      setIsSubmitting(true);
      await apiPut(`/time-ranges/${timeRangeId}`, { start, end });
      await fetchSchedulesByEstablishment(activeEstablishment.id);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  // NUEVO: Eliminar un rango horario individual por su ID (/time-ranges/:id)
  const deleteTimeRange = async (timeRangeId: string) => {
    if (!activeEstablishment?.id) return;

    try {
      setIsSubmitting(true);
      await apiDelete(`/time-ranges/${timeRangeId}`);
      await fetchSchedulesByEstablishment(activeEstablishment.id);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Borrar todos los horarios
  const clearSchedules = async () => {
    if (!activeEstablishment?.id) return;

    try {
      setIsDeleting(true);
      await apiDelete(`/schedules/establishment/${activeEstablishment.id}`);
      setSchedules([]);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    schedules,
    isLoading,
    isSubmitting,
    isDeleting,
    fetchSchedulesByEstablishment,
    addDays,
    updateDayIntervals,
    updateTimeRange,
    deleteTimeRange,
    clearSchedules,
  };
}