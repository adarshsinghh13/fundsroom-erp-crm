import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  Package,
  Boxes,
  TrendingUp,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  FileDown,
  FileWarning,
  UserPlus,
  PackagePlus,
  FileText,
  Warehouse,
  BarChart3,
  X,
  CheckCircle2,
  Inbox,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ------------------------------------------------------------------ */
/* Dummy data                                                          */
/* ------------------------------------------------------------------ */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboardStats } from "../../api/dashboard";
import { createCustomer } from "../../api/customers";
import { createProduct } from "../../api/products";
import { createChallan } from "../../api/challans";

// Hook for counting up animation
function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const COLORS = ["var(--color-accent-500)", "var(--color-ink-600)", "var(--color-ink-400)", "var(--color-ink-300)"];

type OrderStatus = "Completed" | "Pending" | "Cancelled";

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
  fieldLabel: string;
  fieldPlaceholder: string;
}

const quickActions: QuickAction[] = [
  {
    id: "add-customer",
    label: "Add Customer",
    icon: UserPlus,
    color: "bg-blue-100 text-blue-600",
    description: "Quickly register a new customer to your ERP.",
    fieldLabel: "Business Name",
    fieldPlaceholder: "e.g. ABC Technologies Pvt Ltd",
  },
  {
    id: "add-product",
    label: "Add Product",
    icon: PackagePlus,
    color: "bg-purple-100 text-purple-600",
    description: "Add a new product to your catalog.",
    fieldLabel: "Product Name",
    fieldPlaceholder: "e.g. Wireless Mouse",
  },
  {
    id: "create-challan",
    label: "Create Challan",
    icon: FileText,
    color: "bg-green-100 text-green-600",
    description: "Generate a delivery challan for a customer order.",
    fieldLabel: "Customer ID",
    fieldPlaceholder: "e.g. cus_123",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Warehouse,
    color: "bg-orange-100 text-orange-600",
    description: "Update stock levels for a product.",
    fieldLabel: "Product ID",
    fieldPlaceholder: "e.g. prod_456",
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    color: "bg-pink-100 text-pink-600",
    description: "Generate a custom business report.",
    fieldLabel: "Report Name",
    fieldPlaceholder: "e.g. Q2 Sales Summary",
  },
];

import { Skeleton } from "../../components/ui/Skeleton";
import { Badge } from "../../components/ui/Badge";
import type { BadgeVariant } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";

/* ------------------------------------------------------------------ */
/* StatCard — isolated so useCountUp is called at component top-level  */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

interface StatCardProps {
  title: string;
  targetValue: number;
  icon: LucideIcon;
  iconClass: string;
  growth: string;
  up: boolean;
  isCurrency: boolean;
  animDelay: number;
}

function StatCard({ title, targetValue, icon: Icon, iconClass, growth, up, isCurrency, animDelay: _animDelay }: StatCardProps) {
  const animatedValue = useCountUp(targetValue, 900);
  return (
    <motion.div
      variants={itemVariants}
      className="card-hover glass-card rounded-xl p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{title}</p>
          <h2 className="mt-2 text-2xl font-bold tabular-data tracking-tight text-ink-900">
            {isCurrency
              ? `₹${Number(Math.floor(animatedValue)).toLocaleString("en-IN")}`
              : Math.floor(animatedValue).toLocaleString()}
          </h2>
          <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${up ? "text-success-600" : "text-danger-600"}`}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {growth}
            <span className="text-ink-400 font-normal">vs last month</span>
          </div>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass} shadow-sm`}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const getBadgeVariant = (status: OrderStatus | string): BadgeVariant => {
  switch (status) {
    case "Completed": case "CONFIRMED": return "success";
    case "Pending": case "DRAFT": return "warning";
    case "Cancelled": case "CANCELLED": return "danger";
    default: return "neutral";
  }
};

const downloadCsvReport = (salesData: any[]) => {
  const header = "Month,Sales (INR)\n";
  const rows = salesData.map((row) => `${row.month},${row.sales}`).join("\n");
  const summary = `\n\nGenerated On,${new Date().toLocaleString("en-IN")}`;
  const csvContent = header + rows + summary;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `sales-report-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export const Dashboard = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<QuickAction | null>(null);
  const [actionValue, setActionValue] = useState("");
  const [actionSaving, setActionSaving] = useState(false);
  const [time, setTime] = useState(new Date());

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const { data: dashboardData, isLoading: loading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    refetchInterval: 60_000, // Refresh every minute
  });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeAction) {
        setActiveAction(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeAction]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setActiveAction(null);
    }
  };

  const openAction = (action: QuickAction) => {
    setActiveAction(action);
    setActionValue("");
  };

  const handleActionSave = async () => {
    if (!activeAction) return;
    if (!actionValue.trim()) return;

    setActionSaving(true);
    try {
      if (activeAction.id === "add-customer") {
        await createCustomer({ name: actionValue, email: "placeholder@email.com", phone: "", address: "" });
      } else if (activeAction.id === "add-product") {
        await createProduct({ name: actionValue, sku: `SKU-${Date.now()}`, unitPrice: 0, currentStock: 0, minimumStock: 0, isActive: true });
      } else if (activeAction.id === "create-challan") {
        await createChallan({ customerId: actionValue, items: [] });
      }
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setToast(`${activeAction.label} saved successfully`);
      setActiveAction(null);
    } catch (err: any) {
      setToast(err?.message || "Failed to save");
    } finally {
      setActionSaving(false);
    }
  };

  const handleGenerateReport = () => {
    if (dashboardData?.revenueTrend) {
      downloadCsvReport(dashboardData.revenueTrend);
      setToast("Report downloaded successfully");
    }
  };

  const stats = [
    {
      title: "Today's Revenue",
      targetValue: dashboardData?.stats.todayRevenue || 0,
      icon: IndianRupee,
      iconClass: "stat-icon-blue",
      growth: "+9%",
      up: true,
      isCurrency: true,
    },
    {
      title: "Monthly Revenue",
      targetValue: dashboardData?.stats.monthlyRevenue || 0,
      icon: TrendingUp,
      iconClass: "stat-icon-purple",
      growth: "+22%",
      up: true,
      isCurrency: true,
    },
    {
      title: "Customers",
      targetValue: dashboardData?.stats.customers || 0,
      icon: Users,
      iconClass: "stat-icon-green",
      growth: "+12%",
      up: true,
      isCurrency: false,
    },
    {
      title: "Products",
      targetValue: dashboardData?.stats.products || 0,
      icon: Package,
      iconClass: "stat-icon-orange",
      growth: "+8%",
      up: true,
      isCurrency: false,
    },
    {
      title: "Inventory",
      targetValue: dashboardData?.stats.inventory || 0,
      icon: Boxes,
      iconClass: "stat-icon-teal",
      growth: "+5%",
      up: true,
      isCurrency: false,
    },
    {
      title: "Pending Challans",
      targetValue: dashboardData?.stats.pendingChallans || 0,
      icon: FileWarning,
      iconClass: "stat-icon-red",
      growth: "-4%",
      up: false,
      isCurrency: false,
    },
  ];

  const [chartRange, setChartRange] = useState<"today" | "week" | "month" | "year">("month");

  const hour = time.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="space-y-6">

      {/* Header Area */}
      <div className="relative overflow-hidden rounded-xl bg-ink-950 px-6 py-8 shadow-elevation-2 sm:px-8 sm:py-10">
        {/* Subtle mesh background */}
        <div className="absolute inset-0 opacity-40 mix-blend-color-dodge">
          <div className="absolute -left-[10%] top-[-50%] h-[150%] w-[50%] rotate-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 blur-[100px]" />
          <div className="absolute -right-[10%] top-[-20%] h-[120%] w-[40%] -rotate-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 blur-[120px]" />
        </div>
        
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {greeting}, {user.name?.split(" ")[0] || "Admin"} 👋
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-ink-300">
              {time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateReport}
              className="flex items-center justify-center gap-2 rounded-md bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 active:bg-white/10 border border-white/10 shadow-elevation-1"
            >
              <FileDown size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants} className="glass-card rounded-xl p-5">
                <Skeleton className="mb-4 h-3 w-20" />
                <Skeleton className="mb-2 h-8 w-32" />
                <Skeleton className="h-3 w-24" />
              </motion.div>
            ))
          : stats.map((item, idx) => (
              <StatCard
                key={item.title}
                title={item.title}
                targetValue={item.targetValue}
                icon={item.icon}
                iconClass={item.iconClass}
                growth={item.growth}
                up={item.up}
                isCurrency={item.isCurrency}
                animDelay={idx * 60}
              />
            ))}
      </motion.div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-elevation-1">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">Revenue Trend</h2>
            <div className="flex items-center gap-1 rounded-lg bg-ink-100 p-1">
              {(["today", "week", "month", "year"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-all ${
                    chartRange === r
                      ? "bg-white text-ink-900 shadow-elevation-1"
                      : "text-ink-500 hover:text-ink-800"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dashboardData?.revenueTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent-500)" stopOpacity={0.35} />
                    <stop offset="60%" stopColor="var(--color-accent-500)" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="var(--color-accent-500)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-ink-200)" />
                <XAxis dataKey="month" stroke="var(--color-ink-400)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--color-ink-400)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  cursor={{ stroke: 'var(--color-accent-400)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-elevation-2)',
                    fontSize: '13px',
                    color: 'var(--color-ink-900)'
                  }}
                  itemStyle={{ color: 'var(--color-accent-600)', fontWeight: 500 }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--color-accent-600)"
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                  activeDot={{ r: 5, fill: "var(--color-accent-600)", stroke: "var(--color-ink-50)", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-elevation-1">
          <h2 className="mb-5 text-sm font-semibold text-ink-900">Sales by Category</h2>

          {loading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={dashboardData?.categoryData || []}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  stroke="none"
                >
                  {(dashboardData?.categoryData || []).map((_, i) => (
                     <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-elevation-2)',
                    fontSize: '13px',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', color: 'var(--color-ink-600)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders + Recent Activities */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
          <div className="border-b border-border px-5 py-4">
             <h2 className="text-sm font-semibold text-ink-900">Recent Orders</h2>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !dashboardData?.recentOrders?.length ? (
            <EmptyState icon={Inbox} title="No recent orders" description="Orders will appear here once created." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-ink-500 bg-ink-50">
                    <th className="px-5 py-3 font-medium">Challan</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium text-right">Amount</th>
                    <th className="px-5 py-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dashboardData.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="table-row-hover"
                    >
                      <td className="px-5 py-3 font-medium text-ink-900">{order.id}</td>
                      <td className="px-5 py-3 text-ink-600">{order.customer}</td>
                      <td className="px-5 py-3 tabular-data text-right font-medium text-ink-900">{order.amount}</td>
                      <td className="px-5 py-3 text-right">
                        <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-elevation-1">
          <div className="border-b border-border px-5 py-4">
             <h2 className="text-sm font-semibold text-ink-900">Recent Activities</h2>
          </div>
          
          <div className="p-5">
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-4"><Skeleton className="h-8 w-8 rounded-full shrink-0" /><div className="space-y-2 w-full"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/4" /></div></div>
                ))}
              </div>
            ) : (
              <div className="relative space-y-6">
                {(dashboardData?.recentActivities?.length ? dashboardData.recentActivities : []).map((activity, idx) => {
                  const Icon = activity.icon;
                  const isLast = idx === dashboardData!.recentActivities.length - 1;

                  return (
                    <div key={activity.id} className="relative flex gap-4">
                      {!isLast && (
                        <span className="absolute left-[15px] top-8 h-full w-[1px] bg-border" />
                      )}
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card ${activity.color}`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="pt-1.5">
                        <p className="text-sm font-medium text-ink-900">{activity.text}</p>
                        <p className="mt-0.5 text-xs text-ink-400">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Customers + Low Stock */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card shadow-elevation-1">
          <div className="border-b border-border px-5 py-4">
             <h2 className="text-sm font-semibold text-ink-900">Top Customers</h2>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {(dashboardData?.topCustomers || []).map((customer) => (
                  <div
                    key={customer.name}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-1 ring-border group-hover:opacity-80 transition-opacity ${customer.colorClass}`}>
                        {customer.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-900">{customer.name}</p>
                        <p className="text-xs text-ink-500 tabular-data">{customer.revenue}</p>
                      </div>
                    </div>

                    <span
                      className={`text-sm font-medium ${
                        customer.growth.startsWith("-")
                          ? "text-danger-600"
                          : "text-success-600"
                      }`}
                    >
                      {customer.growth}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-elevation-1">
          <div className="border-b border-border px-5 py-4">
             <h2 className="text-sm font-semibold text-ink-900">Low Stock Alerts</h2>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="space-y-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-1.5 w-full" /></div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {(dashboardData?.lowStockItems || []).map((item) => {
                  const pct = (item.qty / item.max) * 100;
                  const barColor = pct <= 10 ? 'bg-danger-500 pulse-danger' : pct <= 25 ? 'bg-warning-500' : 'bg-success-500';
                  
                  return (
                  <div key={item.name}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-ink-900">{item.name}</span>
                      <span className="font-medium text-danger-600">{item.qty} left</span>
                    </div>

                    <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{
                          width: `${Math.min((item.qty / item.max) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )})}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-elevation-1">
        <h2 className="mb-4 text-sm font-semibold text-ink-900">Quick Actions</h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={action.id}
                onClick={() => openAction(action)}
                className="group flex flex-col sm:flex-row items-center sm:items-start gap-3 rounded-xl border border-border bg-card p-3.5 text-center sm:text-left transition-colors hover:border-ink-300 hover:bg-ink-50/50"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.color} transition-transform group-hover:scale-110 shadow-sm`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-ink-800 mt-2 sm:mt-0 sm:pt-2">
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Quick Action Modal */}
      {activeAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm fade-in"
          onMouseDown={handleOutsideClick}
        >
          <div
            ref={modalRef}
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elevation-3 scale-in"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-md ${activeAction.color}`}
                >
                  <activeAction.icon size={18} />
                </div>
                <div>
                   <h2 className="text-base font-semibold text-ink-950">{activeAction.label}</h2>
                   <p className="text-xs text-ink-500 mt-0.5">{activeAction.description}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveAction(null)}
                className="rounded-md p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
              >
                <X size={16} />
              </button>
            </div>

            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              {activeAction.fieldLabel}
            </label>
            <input
              value={actionValue}
              onChange={(e) => setActionValue(e.target.value)}
              placeholder={activeAction.fieldPlaceholder}
              className="w-full rounded-md border border-border bg-ink-50 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 transition-all"
              autoFocus
            />

            <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
              <button
                onClick={() => setActiveAction(null)}
                className="rounded-md px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
              >
                Cancel
              </button>

              <button
                onClick={handleActionSave}
                disabled={actionSaving || !actionValue.trim()}
                className="flex items-center gap-2 rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionSaving && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="slide-up fixed bottom-6 right-6 z-[60]">
          <div className="flex items-center gap-2 rounded-md border border-success-200 bg-success-50 px-4 py-3 text-sm font-medium text-success-700 shadow-elevation-2">
            <CheckCircle2 size={16} />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};