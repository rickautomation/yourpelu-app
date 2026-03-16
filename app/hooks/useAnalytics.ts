"use client";
import { useState, useEffect } from "react";
import { apiGet } from "@/app/lib/apiGet";

export type SummaryReport = { servicesCount: number; totalRevenue: number };
export type PaymentMethodReport = {
  method: string;
  count: number;
  totalPrice: number;
};
export type TopCategoryReport = {
  category: string;
  type: string;
  count: number;
};
export type CategorySummary = {
  categoryId: string;
  categoryName: string;
  typeId: string;
  typeName: string;
  count: number;
};
export type CategoryReport = {
  id: string;
  name: string;
  types: Record<string, { count: number; totalPrice: number }>;
  totalCount: number;
  totalPrice: number;
};

export type DateRange = { fromDate?: string; toDate?: string };

export type ClientSummaryReport = {
  clientId: string;
  clientName: string;
  servicesCount: number;
  totalRevenue: number;
};

export type UserSummaryReport = {
  userId: string;
  userName: string;
  servicesCount: number;
  totalRevenue: number;
};

export function useAnalytics(barbershopId?: string, dateRange?: DateRange) {
  const [usersSummary, setUsersSummary] = useState<UserSummaryReport[]>([]);
  const [summary, setSummary] = useState<SummaryReport | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodReport[]>(
    [],
  );
  const [topCategories, setTopCategories] = useState<TopCategoryReport[]>([]);
  const [categoriesSummary, setCategoriesSummary] = useState<CategorySummary[]>(
    [],
  );
  const [categories, setCategories] = useState<CategoryReport[]>([]);
    const [clientsSummary, setClientsSummary] = useState<ClientSummaryReport[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildQuery = (dateRange?: DateRange) => {
    if (!dateRange) return "";
    const params = new URLSearchParams();
    if (dateRange.fromDate) params.append("fromDate", dateRange.fromDate);
    if (dateRange.toDate) params.append("toDate", dateRange.toDate);
    return `?${params.toString()}`;
  };

  const fetchSummary = async () => {
    if (!barbershopId) return;
    setLoading(true);
    try {
      const data = await apiGet<SummaryReport>(
        `/analytics/reports/summary/${barbershopId}${buildQuery(dateRange)}`,
      );
      //console.log("📊 Summary report:", data);
      setSummary(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    if (!barbershopId) return;
    try {
      const data = await apiGet<PaymentMethodReport[]>(
        `/analytics/reports/payment-methods/${barbershopId}${buildQuery(dateRange)}`,
      );
      //console.log("💳 Payment methods report:", data);
      setPaymentMethods(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchClientsSummary = async () => {
    if (!barbershopId) return;
    try {
      const data = await apiGet<ClientSummaryReport[]>(
        `/analytics/reports/clients-summary/${barbershopId}${buildQuery(dateRange)}`,
      );
      setClientsSummary(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchUsersSummary = async () => {
    if (!barbershopId) return;
    try {
      const data = await apiGet<UserSummaryReport[]>(
        `/analytics/reports/users-summary/${barbershopId}${buildQuery(dateRange)}`,
      );
      setUsersSummary(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchTopCategories = async () => {
    if (!barbershopId) return;
    try {
      const data = await apiGet<TopCategoryReport[]>(
        `/analytics/reports/top-categories/${barbershopId}${buildQuery(dateRange)}`,
      );
      //console.log("🏆 Top categories report:", data);
      setTopCategories(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchCategories = async () => {
    if (!barbershopId) return;
    try {
      const data = await apiGet<CategoryReport[]>(
        `/analytics/reports/categories/${barbershopId}${buildQuery(dateRange)}`,
      );
      //console.log("📂 Categories report:", data);
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 🔹 useEffect interno: se dispara automáticamente con barbershopId y dateRange
  useEffect(() => {
    if (!barbershopId) return;
    fetchSummary();
    fetchPaymentMethods();
    fetchTopCategories();
    fetchCategories();
    fetchClientsSummary(); // 👈 nuevo
    fetchUsersSummary();
  }, [barbershopId, dateRange?.fromDate, dateRange?.toDate]);

  return {
    summary,
    paymentMethods,
    topCategories,
    categoriesSummary,
    categories,
    clientsSummary, // 👈 nuevo
    usersSummary,
    loading,
    error,
  };
}
