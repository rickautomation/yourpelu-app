export interface UserMetricsSummary {
  totalOfferings: number;
  totalRevenue: number;
  averageTicket: number;
}

export interface MetricTopItem {
  serviceId?: string;
  categoryId?: string;
  serviceName?: string;
  categoryName?: string;
  count: number;
  totalRevenue: number;
}

export interface MetricPaymentMethod {
  paymentMethodId: string;
  paymentMethodName: string;
  count: number;
  totalAmount: number;
}

export interface MetricTopClient {
  clientId: string;
  clientName: string;
  visitCount: number;
  totalSpent: number;
}

export interface UserMetricsResponse {
  summary: UserMetricsSummary;
  topServices: MetricTopItem[];
  topCategories: MetricTopItem[];
  paymentMethodsBreakdown: MetricPaymentMethod[];
  topClients: MetricTopClient[];
}

export interface UseUserMetricsParams {
  userId: string;
  establishmentId?: string;
  startDate?: string;
  endDate?: string;
}