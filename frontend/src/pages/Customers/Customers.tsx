import { useEffect, useState } from "react";
import { Users, Plus, Search } from "lucide-react";

import { getCustomers } from "../../api/customers";
import type { Customer } from "../../types/customer";

export const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await getCustomers({
        page: 1,
        limit: 10,
        search,
      });

      setCustomers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <Users className="text-blue-600" size={32} />
            Customers
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all customers
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer..."
          className="w-full rounded-lg border py-2 pl-10 pr-4 outline-none focus:border-blue-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">

        {loading ? (
          <div className="p-10 text-center">
            Loading customers...
          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-6 py-3 text-left">
                  Business
                </th>

                <th className="px-6 py-3 text-left">
                  Contact Person
                </th>

                <th className="px-6 py-3 text-left">
                  Email
                </th>

                <th className="px-6 py-3 text-left">
                  Phone
                </th>

                <th className="px-6 py-3 text-left">
                  Status
                </th>

                <th className="px-6 py-3 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {customers.length === 0 ? (
                <tr>

                  <td
                    colSpan={6}
                    className="py-8 text-center text-gray-500"
                  >
                    No customers found
                  </td>

                </tr>
              ) : (
                customers.map((customer) => (

                  <tr
                    key={customer.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 font-medium">
                      {customer.businessName}
                    </td>

                    <td className="px-6 py-4">
                      {customer.contactPerson}
                    </td>

                    <td className="px-6 py-4">
                      {customer.email ?? "-"}
                    </td>

                    <td className="px-6 py-4">
                      {customer.phone ?? "-"}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          customer.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {customer.status}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-center">

                      <button className="mr-4 text-blue-600 hover:underline">
                        Edit
                      </button>

                      <button className="text-red-600 hover:underline">
                        Delete
                      </button>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>
        )}

      </div>
    </div>
  );
};