type UserBalance = {
  userId: string;
  name: string;
  lastname: string;
  role: string;
  workRelation: string | null; // Ej: 'Contratista', 'Arrendador', 'Empleado' o null
  offeringTotal: number;
  adjustedTotal: number;
  commissionPercentage?: number; // Presente solo cuando es 'contratista'
};

export type BalanceResponse = {
  establishmentId: string;
  users: UserBalance[];
  totalEstablishment: number;
};