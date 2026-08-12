import { FileText, Plus, Search } from 'lucide-react';

export const Challans = () => {
  const challans = [
    {
      id: 1,
      number: 'CH-20260811-00001',
      customer: 'ABC Traders',
      date: '2026-08-11',
      amount: '₹45,000',
      status: 'Confirmed',
    },
    {
      id: 2,
      number: 'CH-20260810-00001',
      customer: 'XYZ Enterprises',
      date: '2026-08-10',
      amount: '₹62,500',
      status: 'Draft',
    },
    {
      id: 3,
      number: 'CH-20260809-00001',
      customer: 'Global Imports',
      date: '2026-08-09',
      amount: '₹38,750',
      status: 'Confirmed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <FileText size={32} className="text-blue-600" />
            <span>Sales Challans</span>
          </h1>
          <p className="text-gray-600 mt-2">Create and manage sales challans.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>New Challan</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search challans..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Challan #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {challans.map((challan) => (
              <tr key={challan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                  {challan.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {challan.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {challan.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {challan.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      challan.status === 'Confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {challan.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    View
                  </button>
                  <button className="text-red-600 hover:text-red-700 font-medium">
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
