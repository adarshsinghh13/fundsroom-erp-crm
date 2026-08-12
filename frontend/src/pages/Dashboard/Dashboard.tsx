import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  TrendingUp,
  IndianRupee,
  ArrowUpRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 25000 },
  { month: "Feb", sales: 42000 },
  { month: "Mar", sales: 31000 },
  { month: "Apr", sales: 58000 },
  { month: "May", sales: 49000 },
  { month: "Jun", sales: 72000 },
];

const categoryData = [
  { name: "Electronics", value: 45 },
  { name: "Hardware", value: 25 },
  { name: "Office", value: 18 },
  { name: "Others", value: 12 },
];

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#9333ea"];

export const Dashboard = () => {
  const stats = [
    {
      title: "Customers",
      value: "156",
      icon: Users,
      color: "bg-blue-500",
      growth: "+12%",
    },
    {
      title: "Products",
      value: "89",
      icon: Package,
      color: "bg-purple-500",
      growth: "+8%",
    },
    {
      title: "Inventory",
      value: "2,341",
      icon: Boxes,
      color: "bg-green-500",
      growth: "+5%",
    },
    {
      title: "Revenue",
      value: "₹7.8L",
      icon: IndianRupee,
      color: "bg-orange-500",
      growth: "+22%",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <LayoutDashboard className="text-blue-600" />
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back, here's today's overview.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
          Generate Report
        </button>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow hover:shadow-xl transition"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500">{item.title}</p>

                  <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>

                  <div className="mt-4 flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <ArrowUpRight size={16} />
                    {item.growth}
                  </div>
                </div>

                <div
                  className={`h-14 w-14 rounded-xl ${item.color} flex items-center justify-center`}
                >
                  <Icon className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">
            Monthly Revenue
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">
            Product Categories
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold mb-5">
            Recent Sales
          </h2>

          {[
            ["CH-001", "₹15,000"],
            ["CH-002", "₹23,500"],
            ["CH-003", "₹8,400"],
            ["CH-004", "₹44,000"],
          ].map((sale) => (
            <div
              key={sale[0]}
              className="flex justify-between border-b py-3"
            >
              <span>{sale[0]}</span>

              <span className="font-semibold text-green-600">
                {sale[1]}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold mb-5">
            Low Stock Alerts
          </h2>

          {[
            ["Mouse", 5],
            ["Keyboard", 8],
            ["Monitor", 2],
            ["CPU Cabinet", 3],
          ].map((item) => (
            <div key={item[0]} className="mb-5">
              <div className="flex justify-between mb-2">
                <span>{item[0]}</span>

                <span className="text-red-600 font-semibold">
                  {item[1]} left
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{
                    width: `${(item[1] as number) * 10}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};