import { Plus, Search, Eye, XCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">
            Sales Challans
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Create and manage sales challans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              type="text"
              placeholder="Search challans..."
              className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 shadow-elevation-1"
            />
          </div>

          <button className="flex h-9 items-center justify-center gap-2 rounded-md bg-accent-600 px-4 text-sm font-medium text-white transition hover:bg-accent-700 shadow-elevation-1">
            <Plus size={16} />
            New Challan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-elevation-1">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 border-b border-border text-left text-ink-500">
            <tr>
              <th className="px-5 py-3 font-medium">
                Challan #
              </th>
              <th className="px-5 py-3 font-medium">
                Customer
              </th>
              <th className="px-5 py-3 font-medium tabular-data">
                Date
              </th>
              <th className="px-5 py-3 font-medium text-right tabular-data">
                Amount
              </th>
              <th className="px-5 py-3 font-medium">
                Status
              </th>
              <th className="px-5 py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {challans.map((challan) => (
              <tr key={challan.id} className="transition-colors hover:bg-ink-50/50 group">
                <td className="px-5 py-3 font-mono text-sm font-medium text-ink-900">
                  {challan.number}
                </td>
                <td className="px-5 py-3 text-ink-600">
                  {challan.customer}
                </td>
                <td className="px-5 py-3 text-ink-600 tabular-data">
                  {challan.date}
                </td>
                <td className="px-5 py-3 font-medium text-ink-900 text-right tabular-data">
                  {challan.amount}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={challan.status === 'Confirmed' ? 'success' : 'warning'}>
                    {challan.status}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="text-ink-400 hover:text-accent-600 transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="text-ink-400 hover:text-danger-600 transition-colors"
                      title="Cancel"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
