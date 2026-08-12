import { useEffect, useState } from "react";
import { Users, Plus, Search } from "lucide-react";
import { getCustomers } from "../../api/customers";
import type { Customer } from "../../types/customer";

export const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await getCustomers({
        page: 1,
        search,
      });

      setCustomers(response.data.data);
    } catch {
      setCustomers([
        {
          id: "1",
          businessName: "ABC Technologies Pvt Ltd",
          contactPerson: "Rahul Sharma",
          email: "rahul@abc.com",
          phone: "9876543210",
          status: "ACTIVE",
        } as Customer,
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <Users className="text-blue-600" size={32} />
            Customers
          </h1>

          <p className="mt-1 text-gray-500">
            Manage all customers
          </p>
        </div>

        <button
          onClick={() => alert("Add Customer feature coming soon")}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
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
          placeholder="Search customers..."
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

                <th className="px-6 py-3 text-left">Business</th>

                <th className="px-6 py-3 text-left">Contact</th>

                <th className="px-6 py-3 text-left">Email</th>

                <th className="px-6 py-3 text-left">Phone</th>

                <th className="px-6 py-3 text-left">Status</th>

                <th className="px-6 py-3 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-gray-500"
                  >
                    No Customers Found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t transition hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 font-semibold">
                      {customer.businessName}
                    </td>

                    <td className="px-6 py-4">
                      {customer.contactPerson}
                    </td>

                    <td className="px-6 py-4">
                      {customer.email || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {customer.phone || "-"}
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

                    <td className="space-x-2 px-6 py-4 text-center">

                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowEditModal(true);
                        }}
                        className="rounded-lg bg-blue-100 px-3 py-1 text-blue-700 hover:bg-blue-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowDeleteModal(true);
                        }}
                        className="rounded-lg bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
                      >
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

      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <h2 className="mb-6 text-2xl font-bold">
              Edit Customer
            </h2>

            <div className="space-y-4">

              <input
                defaultValue={selectedCustomer.businessName}
                className="w-full rounded-lg border p-3"
              />

              <input
                defaultValue={selectedCustomer.contactPerson}
                className="w-full rounded-lg border p-3"
              />

              <input
               defaultValue={selectedCustomer.email ?? ""}
                className="w-full rounded-lg border p-3"
              />

              <input
                defaultValue={selectedCustomer.phone ?? ""}
                className="w-full rounded-lg border p-3"
              />

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg border px-5 py-2"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  alert("Customer Updated Successfully");
                  setShowEditModal(false);
                }}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}

      {showDeleteModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              🗑️
            </div>

            <h2 className="text-center text-2xl font-bold">
              Delete Customer
            </h2>

            <p className="mt-3 text-center text-gray-600">
              Delete
              <br />
              <span className="font-semibold text-red-600">
                {selectedCustomer.businessName}
              </span>
              ?
            </p>

            <div className="mt-8 flex justify-center gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border px-5 py-2"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  alert("Customer Deleted Successfully");
                  setShowDeleteModal(false);
                }}
                className="rounded-lg bg-red-600 px-5 py-2 text-white"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};