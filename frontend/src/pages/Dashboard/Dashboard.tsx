import { LayoutDashboard, Users, Package, Boxes, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const stats = [
    {
      title: 'Total Customers',
      value: '156',
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Total Products',
      value: '89',
      icon: Package,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Stock Items',
      value: '2,341',
      icon: Boxes,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Pending Challans',
      value: '24',
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <LayoutDashboard size={32} className="text-blue-600" />
          <span>Dashboard</span>
        </h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon size={24} className={stat.textColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Challan #CH-001</span>
              <span className="text-sm font-medium text-gray-900">₹15,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Challan #CH-002</span>
              <span className="text-sm font-medium text-gray-900">₹22,500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Challan #CH-003</span>
              <span className="text-sm font-medium text-gray-900">₹18,750</span>
            </div>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Items</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Product A</span>
              <span className="text-sm font-medium text-red-600">5 units</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Product B</span>
              <span className="text-sm font-medium text-yellow-600">12 units</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Product C</span>
              <span className="text-sm font-medium text-yellow-600">8 units</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
