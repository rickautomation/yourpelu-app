export type UserBalance = {
  userId: string;
  name: string;
  lastname: string;
  role: string;
  workRelation: string | null; // Ej: 'Contratista', 'Arrendador', 'Empleado' o null
  isArrendador: boolean;
  offeringTotal: number;
  adjustedTotal: number;
  commissionPercentage?: number;
  rentFee?: number;      // 👈 Agregado
  salary?: number;       // 👈 Agregado
  fixedExpense?: number; // 👈 Agregado
};

export type BalanceResponse = {
  establishmentId: string;
  isFullMonthPeriod?: boolean; // 👈 Nuevo: indica si el período evaluado es mensual completo o parcial
  users: UserBalance[];
  realEstablishmentRevenue: number; // 👈 Nuevo: Recaudación Neta/Real del local
  grossProcessedTotal: number; // 👈 Nuevo: Total bruto procesado en caja (bruto)
  totalEstablishment?: number; // Opcional por compatibilidad previa
};