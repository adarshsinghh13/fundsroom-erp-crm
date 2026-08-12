import { Boxes, Plus, ArrowUp, ArrowDown } from 'lucide-react';

export const Inventory = () => {
  const movements = [
    {
      id: 1,
      product: 'Laptop',
      type: 'IN',
      quantity: 10,
      reason: 'Stock Purchase',
      date: '2026-08-11',
    },
    {
      id: 2,
      product: 'Office Chair',
      type: 'OUT',
      quantity: 5,
      reason: 'Sales Challan #CH-001',
      date: '2026-08-10',
    },
    {
      id: 3,
      product: 'USB Cable',
      type: 'IN',
      quantity: 50,
      reason: 'Stock Adjustment',
      date: '2026-08-09',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Boxes size={32} className="text-blue-600" />
            <span>Inventory Management</span>
          </h1>
          <p className="text-gray-600 mt-2">Track stock movements and levels.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Movement</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors flex items-center space-x-3">
          <div className="bg-green-500 p-3 rounded-lg">
            <ArrowUp size={24} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Stock In</p>
            <p className="text-sm text-gray-600">Add inventory</p>
          </div>
        </button>
        <button className="bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors flex items-center space-x-3">
          <div className="bg-red-500 p-3 rounded-lg">
            <ArrowDown size={24} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Stock Out</p>
            <p className="text-sm text-gray-600">Remove inventory</p>
          </div>
        </button>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Movements</h2>
        </div>
        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {movement.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1 w-fit ${
                        movement.type === 'IN'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {movement.type === 'IN' ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )}
                      <span>{movement.type}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {movement.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {movement.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {movement.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
