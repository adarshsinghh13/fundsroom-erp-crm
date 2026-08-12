import { prisma } from "../lib/prisma.js";

export class DashboardService {
  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      customersCount,
      productsCount,
      pendingChallansCount,
      inventoryCountRes,
      todayRevenueRes,
      monthlyRevenueRes,
      recentChallans,
      lowStockProducts,
    ] = await Promise.all([
      // Customers
      prisma.customer.count({ where: { status: "ACTIVE" } }),
      
      // Products
      prisma.product.count({ where: { isActive: true } }),
      
      // Pending Challans
      prisma.salesChallan.count({ where: { status: "DRAFT" } }),
      
      // Total Inventory
      prisma.product.aggregate({
        _sum: { currentStock: true },
        where: { isActive: true },
      }),

      // Today's Revenue
      prisma.salesChallan.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: "CONFIRMED",
          createdAt: { gte: today },
        },
      }),

      // Monthly Revenue
      prisma.salesChallan.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: "CONFIRMED",
          createdAt: { gte: firstDayOfMonth },
        },
      }),

      // Recent Orders
      prisma.salesChallan.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          challanNumber: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          customer: {
            select: {
              businessName: true,
            },
          },
        },
      }),

      // Low Stock
      prisma.product.findMany({
        where: {
          isActive: true,
          currentStock: { lte: prisma.product.fields.minimumStock },
        },
        take: 5,
        orderBy: { currentStock: "asc" },
        select: {
          id: true,
          name: true,
          currentStock: true,
          minimumStock: true,
        },
      }),
    ]);

    // Format revenue data (Needs group by month for trend, hardcoding for now)
    const revenueTrend = [
      { month: "Jan", sales: 0 },
      { month: "Feb", sales: 0 },
      { month: "Mar", sales: 0 },
      { month: "Apr", sales: 0 },
      { month: "May", sales: 0 },
      { month: "Jun", sales: monthlyRevenueRes._sum.totalAmount?.toNumber() || 0 },
    ];
    
    // Category Data
    const categoryData = [
      { name: "Electronics", value: 36 },
      { name: "Hardware", value: 15 },
      { name: "Office", value: 22 },
      { name: "Others", value: 25 },
    ];

    return {
      stats: {
        customers: customersCount,
        products: productsCount,
        pendingChallans: pendingChallansCount,
        inventory: inventoryCountRes._sum.currentStock || 0,
        todayRevenue: todayRevenueRes._sum.totalAmount?.toNumber() || 0,
        monthlyRevenue: monthlyRevenueRes._sum.totalAmount?.toNumber() || 0,
      },
      revenueTrend,
      categoryData,
      recentOrders: recentChallans.map((c) => ({
        id: c.challanNumber,
        customer: c.customer.businessName,
        product: "Multiple Items", // Simplification
        amount: `₹${Number(c.totalAmount).toLocaleString("en-IN")}`,
        status: c.status,
        date: c.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      })),
      lowStockItems: lowStockProducts.map((p) => ({
        name: p.name,
        qty: p.currentStock,
        max: p.minimumStock > 0 ? p.minimumStock * 2 : 50, // Fallback for UI
      })),
      recentActivities: [], // To be implemented later with activity log
      topCustomers: [] // To be implemented later with aggregations
    };
  }
}
