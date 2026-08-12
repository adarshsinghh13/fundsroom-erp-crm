import api from "./api";

export interface DashboardStats {
  stats: {
    customers: number;
    products: number;
    pendingChallans: number;
    inventory: number;
    todayRevenue: number;
    monthlyRevenue: number;
  };
  revenueTrend: { month: string; sales: number }[];
  categoryData: { name: string; value: number }[];
  recentOrders: {
    id: string;
    customer: string;
    product: string;
    amount: string;
    status: "Completed" | "Pending" | "Cancelled";
    date: string;
  }[];
  lowStockItems: {
    name: string;
    qty: number;
    max: number;
  }[];
  recentActivities: any[];
  topCustomers: any[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<{ data: DashboardStats }>("/dashboard/stats");
  return response.data.data;
};
