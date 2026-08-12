import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  TrendingUp,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  FileDown,
  FileWarning,
  UserPlus,
  PackagePlus,
  FileText,
  Warehouse,
  BarChart3,
  X,
  CheckCircle2,
  ShoppingCart,
  Star,
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

const salesData = [
  { month: "Jan", sales: 0 },
  { month: "Feb", sales: 0 },
  { month: "Mar", sales: 0 },
  { month: "Apr", sales: 0 },
  { month: "May", sales: 0 },
  { month: "Jun", sales: 42800 },
];

const categoryData = [
  { name: "Electronics", value: 36 },
  { name: "Hardware", value: 15 },
  { name: "Office", value: 22 },
  { name: "Others", value: 25 },
];

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#9333ea"];

type OrderStatus = "Completed" | "Pending" | "Cancelled";

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: OrderStatus;
  date: string;
}

const recentOrders: Order[] = [
  { id: "CH-1042", customer: "ABC Technologies", product: "Laptop x3", amount: "₹1,15,000", status: "Completed", date: "12 Aug" },
  { id: "CH-1041", customer: "Sharma Traders", product: "Office Chairs x10", amount: "₹42,500", status: "Pending", date: "12 Aug" },
  { id: "CH-1040", customer: "Nexus Retail", product: "Monitors x6", amount: "₹78,900", status: "Completed", date: "11 Aug" },
  { id: "CH-1039", customer: "Patel & Sons", product: "Networking Kit", amount: "₹19,200", status: "Cancelled", date: "11 Aug" },
  { id: "CH-1038", customer: "Global Mart", product: "Keyboards x25", amount: "₹31,750", status: "Completed", date: "10 Aug" },
];

interface Activity {
  id: string;
  text: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

const recentActivities: Activity[] = [
  { id: "a1", text: "New challan CH-1042 created for ABC Technologies", time: "10 min ago", icon: FileText, color: "bg-blue-500" },
  { id: "a2", text: "Rahul Sharma added as a new customer", time: "45 min ago", icon: UserPlus, color: "bg-green-500" },
  { id: "a3", text: "Inventory updated: Monitors stock replenished", time: "2 hr ago", icon: Warehouse, color: "bg-orange-500" },
  { id: "a4", text: "Invoice for CH-1038 marked as paid", time: "4 hr ago", icon: CheckCircle2, color: "bg-purple-500" },
  { id: "a5", text: "Low stock alert triggered for Mouse", time: "6 hr ago", icon: FileWarning, color: "bg-red-500" },
];

interface TopCustomer {
  name: string;
  revenue: string;
  growth: string;
  initials: string;
}

const topCustomers: TopCustomer[] = [
  { name: "ABC Technologies Pvt Ltd", revenue: "₹4,82,000", growth: "+18%", initials: "AT" },
  { name: "Nexus Retail", revenue: "₹3,64,500", growth: "+11%", initials: "NR" },
  { name: "Global Mart", revenue: "₹2,91,200", growth: "+6%", initials: "GM" },
  { name: "Sharma Traders", revenue: "₹1,78,900", growth: "-3%", initials: "ST" },
];

interface LowStockItem {
  name: string;
  qty: number;
  max: number;
}

const lowStockItems: LowStockItem[] = [
  { name: "Mouse", qty: 5, max: 50 },
  { name: "Keyboard", qty: 8, max: 50 },
  { name: "Monitor", qty: 2, max: 50 },
  { name: "CPU Cabinet", qty: 3, max: 50 },
];

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
    color: "bg-blue-500",
    description: "Quickly register a new customer to your ERP.",
    fieldLabel: "Business Name",
    fieldPlaceholder: "e.g. ABC Technologies Pvt Ltd",
  },
  {
    id: "add-product",
    label: "Add Product",
    icon: PackagePlus,
    color: "bg-purple-500",
    description: "Add a new product to your catalog.",
    fieldLabel: "Product Name",
    fieldPlaceholder: "e.g. Wireless Mouse",
  },
  {
    id: "create-challan",
    label: "Create Challan",
    icon: FileText,
    color: "bg-green-500",
    description: "Generate a delivery challan for a customer order.",
    fieldLabel: "Customer Name",
    fieldPlaceholder: "e.g. Nexus Retail",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Warehouse,
    color: "bg-orange-500",
    description: "Update stock levels for a product.",
    fieldLabel: "Product Name",
    fieldPlaceholder: "e.g. Monitor",
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    color: "bg-pink-500",
    description: "Generate a custom business report.",
    fieldLabel: "Report Name",
    fieldPlaceholder: "e.g. Q2 Sales Summary",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const statusStyles: Record<OrderStatus, string> = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

const downloadCsvReport = () => {
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
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [toast, setToast] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<QuickAction | null>(null);
  const [actionValue, setActionValue] = useState("");
  const [actionSaving, setActionSaving] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleActionSave = () => {
    if (!activeAction) return;
    if (!actionValue.trim()) return;

    setActionSaving(true);

    window.setTimeout(() => {
      setActionSaving(false);
      setActiveAction(null);
      setToast(`${activeAction.label} saved successfully`);
    }, 500);
  };

  const handleGenerateReport = () => {
    downloadCsvReport();
    setToast("Report downloaded successfully");
  };

  const stats = [
    {
      title: "Today's Revenue",
      value: "₹42,800",
      icon: IndianRupee,
      color: "bg-blue-500",
      growth: "+9%",
      up: true,
    },
    {
      title: "Monthly Revenue",
      value: "₹42800",
      icon: TrendingUp,
      color: "bg-orange-500",
      growth: "+22%",
      up: true,
    },
    {
      title: "Customers",
      value: "15",
      icon: Users,
      color: "bg-indigo-500",
      growth: "+12%",
      up: true,
    },
    {
      title: "Products",
      value: "12",
      icon: Package,
      color: "bg-purple-500",
      growth: "+8%",
      up: true,
    },
    {
      title: "Inventory",
      value: "95",
      icon: Boxes,
      color: "bg-green-500",
      growth: "+5%",
      up: true,
    },
    {
      title: "Pending Challans",
      value: "3",
      icon: FileWarning,
      color: "bg-red-500",
      growth: "-4%",
      up: false,
    },
  ];

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        .fade-in { animation: fadeIn 0.35s ease-out; }
        .scale-in { animation: scaleIn 0.2s ease-out; }
        .slide-up { animation: slideUp 0.25s ease-out; }
        .skeleton {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%);
          background-size: 800px 100px;
          animation: shimmer 1.4s linear infinite;
        }
      `}</style>

      {/* Gradient Header */}
      <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <LayoutDashboard />
            Dashboard
          </h1>
          <p className="mt-2 text-blue-100">
            Welcome back, here&apos;s today&apos;s overview.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 rounded-xl bg-white/15 px-4 py-3 backdrop-blur-sm">
            <Calendar size={18} />
            <div className="text-sm">
              <p className="font-semibold">
                {now.toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="flex items-center gap-1 text-blue-100">
                <Clock size={12} />
                {now.toLocaleTimeString("en-IN")}
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            className="flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2 font-medium text-blue-700 transition hover:bg-blue-50 active:scale-95"
          >
            <FileDown size={18} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow">
                <div className="skeleton mb-4 h-4 w-24 rounded" />
                <div className="skeleton mb-4 h-8 w-32 rounded" />
                <div className="skeleton h-4 w-16 rounded" />
              </div>
            ))
          : stats.map((item, idx) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="fade-in group rounded-2xl bg-white p-6 shadow transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500">{item.title}</p>

                      <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>

                      <div
                        className={`mt-4 flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold ${
                          item.up
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.up ? (
                          <ArrowUpRight size={16} />
                        ) : (
                          <ArrowDownRight size={16} />
                        )}
                        {item.growth}
                      </div>
                    </div>

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.color} transition duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
          <h2 className="mb-5 text-xl font-semibold">Monthly Revenue</h2>

          {loading ? (
            <div className="skeleton h-[300px] w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" tickLine={false} axisLine={false} />
                <Tooltip
  formatter={(value) => [
    `₹${Number(value).toLocaleString("en-IN")}`,
    "Sales",
  ]}
/>
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#revenueFill)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
          <h2 className="mb-5 text-xl font-semibold">Product Categories</h2>

          {loading ? (
            <div className="skeleton h-[300px] w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders + Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
            <ShoppingCart size={20} className="text-blue-600" />
            Recent Orders
          </h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-gray-400">
              <Inbox size={32} />
              <p>No recent orders</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">Challan</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-0 transition hover:bg-gray-50"
                    >
                      <td className="py-3 font-medium text-gray-700">{order.id}</td>
                      <td className="py-3 text-gray-600">{order.customer}</td>
                      <td className="py-3 font-semibold text-gray-800">{order.amount}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
          <h2 className="mb-5 text-xl font-semibold">Recent Activities</h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="relative space-y-6 pl-2">
              {recentActivities.map((activity, idx) => {
                const Icon = activity.icon;
                const isLast = idx === recentActivities.length - 1;

                return (
                  <div key={activity.id} className="relative flex gap-4 pl-8">
                    {!isLast && (
                      <span className="absolute left-[15px] top-8 h-full w-px bg-gray-200" />
                    )}
                    <div
                      className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${activity.color} text-white shadow`}
                    >
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{activity.text}</p>
                      <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Customers + Low Stock */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
            <Star size={20} className="text-orange-500" />
            Top Customers
          </h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {topCustomers.map((customer) => (
                <div
                  key={customer.name}
                  className="flex items-center justify-between rounded-xl p-2 transition hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                      {customer.initials}
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">{customer.name}</p>
                      <p className="text-sm text-gray-400">{customer.revenue}</p>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      customer.growth.startsWith("-")
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {customer.growth}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
          <h2 className="mb-5 text-xl font-semibold">Low Stock Alerts</h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            lowStockItems.map((item) => (
              <div key={item.name} className="mb-5 last:mb-0">
                <div className="mb-2 flex justify-between">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-semibold text-red-600">{item.qty} left</span>
                </div>

                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-red-500 transition-all duration-500"
                    style={{
                      width: `${Math.min((item.qty / item.max) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
        <h2 className="mb-5 text-xl font-semibold">Quick Actions</h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.id}
                onClick={() => openAction(action)}
                className="flex flex-col items-center gap-3 rounded-xl border border-gray-100 p-4 text-center transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md active:scale-95"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${action.color} text-white`}
                >
                  <Icon size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Action Modal */}
      {activeAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm fade-in"
          onMouseDown={handleOutsideClick}
        >
          <div
            ref={modalRef}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl scale-in"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${activeAction.color} text-white`}
                >
                  <activeAction.icon size={20} />
                </div>
                <h2 className="text-xl font-bold">{activeAction.label}</h2>
              </div>

              <button
                onClick={() => setActiveAction(null)}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-4 text-sm text-gray-500">{activeAction.description}</p>

            <label className="mb-1 block text-sm font-medium text-gray-700">
              {activeAction.fieldLabel}
            </label>
            <input
              value={actionValue}
              onChange={(e) => setActionValue(e.target.value)}
              placeholder={activeAction.fieldPlaceholder}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500"
              autoFocus
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveAction(null)}
                className="rounded-lg border px-5 py-2 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleActionSave}
                disabled={actionSaving || !actionValue.trim()}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionSaving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
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
          <div className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
            <CheckCircle2 size={18} />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};