import { Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Track stock movements and levels.
          </p>
        </div>

        <button className="flex h-9 items-center justify-center gap-2 rounded-md bg-accent-600 px-4 text-sm font-medium text-white transition hover:bg-accent-700 shadow-elevation-1">
          <Plus size={16} />
          New Movement
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="group rounded-lg border border-border bg-card p-5 text-left shadow-elevation-1 transition-all hover:border-success-300 hover:bg-success-50">
          <div className="flex items-center gap-4">
             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-success-100 text-success-600 transition-colors group-hover:bg-success-200">
                <ArrowUp size={20} />
             </div>
             <div>
                <p className="text-sm font-semibold text-ink-900 group-hover:text-success-900">Stock In</p>
                <p className="text-xs text-ink-500 group-hover:text-success-700">Add new inventory</p>
             </div>
          </div>
        </button>

        <button className="group rounded-lg border border-border bg-card p-5 text-left shadow-elevation-1 transition-all hover:border-danger-300 hover:bg-danger-50">
          <div className="flex items-center gap-4">
             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-danger-100 text-danger-600 transition-colors group-hover:bg-danger-200">
                <ArrowDown size={20} />
             </div>
             <div>
                <p className="text-sm font-semibold text-ink-900 group-hover:text-danger-900">Stock Out</p>
                <p className="text-xs text-ink-500 group-hover:text-danger-700">Remove from inventory</p>
             </div>
          </div>
        </button>
      </div>

      {/* Movements Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-elevation-1">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-ink-900">Recent Movements</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-ink-50 border-b border-border text-left text-ink-500">
            <tr>
              <th className="px-5 py-3 font-medium">
                Product
              </th>
              <th className="px-5 py-3 font-medium">
                Type
              </th>
              <th className="px-5 py-3 font-medium text-right tabular-data">
                Quantity
              </th>
              <th className="px-5 py-3 font-medium">
                Reason
              </th>
              <th className="px-5 py-3 font-medium tabular-data">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {movements.map((movement) => (
              <tr key={movement.id} className="transition-colors hover:bg-ink-50/50">
                <td className="px-5 py-3 font-medium text-ink-900">
                  {movement.product}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={movement.type === 'IN' ? 'success' : 'danger'}>
                    <div className="flex items-center gap-1">
                       {movement.type === 'IN' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                       {movement.type}
                    </div>
                  </Badge>
                </td>
                <td className="px-5 py-3 font-medium text-ink-900 text-right tabular-data">
                  {movement.quantity}
                </td>
                <td className="px-5 py-3 text-ink-600">
                  {movement.reason}
                </td>
                <td className="px-5 py-3 text-ink-600 tabular-data">
                  {movement.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
