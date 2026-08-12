import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { motion } from "framer-motion";

const tableVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

export const Products = () => {
  const products = [
    {
      id: 1,
      name: 'Laptop',
      sku: 'LP-001',
      category: 'Electronics',
      price: '₹45,000',
      stock: 15,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Office Chair',
      sku: 'CH-001',
      category: 'Office',
      price: '₹8,500',
      stock: 32,
      status: 'Active',
    },
    {
      id: 3,
      name: 'USB Cable',
      sku: 'CB-001',
      category: 'Hardware',
      price: '₹250',
      stock: 5,
      status: 'Low Stock',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">
            Products
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage your product inventory and pricing.
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
              placeholder="Search products..."
              className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 shadow-elevation-1"
            />
          </div>

          <button className="flex h-9 items-center justify-center gap-2 rounded-md bg-accent-600 px-4 text-sm font-medium text-white transition hover:bg-accent-700 shadow-elevation-1">
            <Plus size={16} />
            New Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-elevation-1">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 border-b border-border text-left text-ink-500">
            <tr>
              <th className="px-5 py-3 font-medium">
                Name
              </th>
              <th className="px-5 py-3 font-medium">
                SKU
              </th>
              <th className="px-5 py-3 font-medium">
                Category
              </th>
              <th className="px-5 py-3 font-medium text-right tabular-data">
                Price
              </th>
              <th className="px-5 py-3 font-medium text-right tabular-data">
                Stock
              </th>
              <th className="px-5 py-3 font-medium">
                Status
              </th>
              <th className="px-5 py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <motion.tbody 
            variants={tableVariants}
            initial="hidden"
            animate="show"
            className="divide-y divide-border"
          >
            {products.map((product) => (
              <motion.tr variants={rowVariants} key={product.id} className="transition-colors hover:bg-ink-50/50 group">
                <td className="px-5 py-3 font-medium text-ink-900">
                  {product.name}
                </td>
                <td className="px-5 py-3 text-ink-500">
                  {product.sku}
                </td>
                <td className="px-5 py-3 text-ink-600">
                  {product.category}
                </td>
                <td className="px-5 py-3 font-medium text-ink-900 text-right tabular-data">
                  {product.price}
                </td>
                <td className="px-5 py-3 text-ink-600 text-right tabular-data">
                  {product.stock}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={product.status === 'Active' ? 'success' : 'warning'}>
                    {product.status}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right">
                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="text-ink-400 hover:text-accent-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="text-ink-400 hover:text-danger-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};
