import { useEffect, useRef, useState } from "react";
import { Users, Plus, Search, X, CheckCircle2, AlertCircle, UserX } from "lucide-react";
import { getCustomers } from "../../api/customers";
import type { Customer } from "../../types/customer";

type CustomerStatus = Customer["status"];

type ExtendedCustomer = Customer & {
  address?: string;
  gstNumber?: string;
};

type CustomerFormState = {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  status: CustomerStatus;
};

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

const emptyForm: CustomerFormState = {
  businessName: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  gstNumber: "",
  status: "ACTIVE" as CustomerStatus,
};

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

export const Customers = () => {
  const [customers, setCustomers] = useState<ExtendedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState<ExtendedCustomer | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [addForm, setAddForm] = useState<CustomerFormState>(emptyForm);
  const [editForm, setEditForm] = useState<CustomerFormState>(emptyForm);

  const [addErrors, setAddErrors] = useState<Partial<Record<keyof CustomerFormState, string>>>({});
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof CustomerFormState, string>>>({});

  const [addSaving, setAddSaving] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);

  const [toast, setToast] = useState<ToastState>(null);

  const addModalRef = useRef<HTMLDivElement>(null);
  const editModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await getCustomers({
        page: 1,
        search,
      });

      setCustomers(response.data.data as ExtendedCustomer[]);
    } catch {
      setCustomers([
        {
          id: "1",
          businessName: "ABC Technologies Pvt Ltd",
          contactPerson: "Rahul Sharma",
          email: "rahul@abc.com",
          phone: "9876543210",
          status: "ACTIVE",
        } as ExtendedCustomer,
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Close modals on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showAddModal) setShowAddModal(false);
        if (showEditModal) setShowEditModal(false);
        if (showDeleteModal) setShowDeleteModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAddModal, showEditModal, showDeleteModal]);

  const handleOutsideClick = (
  e: React.MouseEvent,
  ref: React.RefObject<HTMLDivElement | null>,
  close: () => void
) => {
  if (ref.current && e.target === ref.current.parentElement) {
    close();
  }
};

  const validateForm = (
    form: CustomerFormState
  ): Partial<Record<keyof CustomerFormState, string>> => {
    const errors: Partial<Record<keyof CustomerFormState, string>> = {};

    if (!form.businessName.trim()) {
      errors.businessName = "Business name is required";
    }

    if (!form.contactPerson.trim()) {
      errors.contactPerson = "Contact person is required";
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email address";
    }

    if (form.phone && !/^[0-9+\-\s]{7,15}$/.test(form.phone)) {
      errors.phone = "Enter a valid phone number";
    }

    return errors;
  };

  const openAddModal = () => {
    setAddForm(emptyForm);
    setAddErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (customer: ExtendedCustomer) => {
    setSelectedCustomer(customer);
    setEditForm({
      businessName: customer.businessName ?? "",
      contactPerson: customer.contactPerson ?? "",
      email: customer.email ?? "",
      phone: customer.phone ?? "",
      address: customer.address ?? "",
      gstNumber: customer.gstNumber ?? "",
      status: customer.status,
    });
    setEditErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (customer: ExtendedCustomer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleAddSave = () => {
    const errors = validateForm(addForm);
    setAddErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setAddSaving(true);

    window.setTimeout(() => {
      const newCustomer: ExtendedCustomer = {
        id: generateId(),
        businessName: addForm.businessName.trim(),
        contactPerson: addForm.contactPerson.trim(),
        email: addForm.email.trim(),
        phone: addForm.phone.trim(),
        address: addForm.address.trim(),
        gstNumber: addForm.gstNumber.trim(),
        status: addForm.status,
      } as ExtendedCustomer;

      setCustomers((prev) => [newCustomer, ...prev]);
      setAddSaving(false);
      setShowAddModal(false);
      showToast("Customer added successfully");
    }, 500);
  };

  const handleEditSave = () => {
    if (!selectedCustomer) return;

    const errors = validateForm(editForm);
    setEditErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setEditSaving(true);

    window.setTimeout(() => {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id
            ? {
                ...c,
                businessName: editForm.businessName.trim(),
                contactPerson: editForm.contactPerson.trim(),
                email: editForm.email.trim(),
                phone: editForm.phone.trim(),
                address: editForm.address.trim(),
                gstNumber: editForm.gstNumber.trim(),
                status: editForm.status,
              }
            : c
        )
      );

      setEditSaving(false);
      setShowEditModal(false);
      showToast("Customer updated successfully");
    }, 500);
  };

  const handleDeleteConfirm = () => {
    if (!selectedCustomer) return;

    setDeleteSaving(true);

    window.setTimeout(() => {
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
      setDeleteSaving(false);
      setShowDeleteModal(false);
      showToast("Customer deleted successfully");
    }, 400);
  };

  const filteredCustomers = customers.filter((customer) => {
    if (!search.trim()) return true;
    const query = search.trim().toLowerCase();

    return (
      customer.businessName?.toLowerCase().includes(query) ||
      customer.contactPerson?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.phone?.toLowerCase().includes(query)
    );
  });

  const renderFormFields = (
    form: CustomerFormState,
    setForm: React.Dispatch<React.SetStateAction<CustomerFormState>>,
    errors: Partial<Record<keyof CustomerFormState, string>>
  ) => (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          value={form.businessName}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          placeholder="e.g. ABC Technologies Pvt Ltd"
          className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 ${
            errors.businessName ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.businessName && (
          <p className="mt-1 text-xs text-red-500">{errors.businessName}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Contact Person <span className="text-red-500">*</span>
        </label>
        <input
          value={form.contactPerson}
          onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
          placeholder="e.g. Rahul Sharma"
          className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 ${
            errors.contactPerson ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.contactPerson && (
          <p className="mt-1 text-xs text-red-500">{errors.contactPerson}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="e.g. rahul@abc.com"
            className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 ${
              errors.email ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="e.g. 9876543210"
            className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 ${
              errors.phone ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Street, City, State, PIN"
          rows={2}
          className="w-full resize-none rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            GST Number
          </label>
          <input
            value={form.gstNumber}
            onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
            placeholder="e.g. 24ABCDE1234F1Z5"
            className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as CustomerStatus })
            }
            className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );

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
          onClick={openAddModal}
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
          <div className="p-10 text-center text-gray-500">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
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

              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <UserX size={40} />
                      <p className="text-base font-medium text-gray-500">
                        No Customers Found
                      </p>
                      <p className="text-sm text-gray-400">
                        {search
                          ? "Try a different search term"
                          : "Get started by adding your first customer"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
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
                        onClick={() => openEditModal(customer)}
                        className="rounded-lg bg-blue-100 px-3 py-1 text-blue-700 hover:bg-blue-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => openDeleteModal(customer)}
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

      {/* Add Customer Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
          onMouseDown={(e) => handleOutsideClick(e, addModalRef, () => setShowAddModal(false))}
        >
          <div
            ref={addModalRef}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-[scaleIn_0.15s_ease-out]"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add Customer</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {renderFormFields(addForm, setAddForm, addErrors)}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border px-5 py-2 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleAddSave}
                disabled={addSaving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addSaving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
          onMouseDown={(e) => handleOutsideClick(e, editModalRef, () => setShowEditModal(false))}
        >
          <div
            ref={editModalRef}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-[scaleIn_0.15s_ease-out]"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Customer</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {renderFormFields(editForm, setEditForm, editErrors)}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg border px-5 py-2 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleEditSave}
                disabled={editSaving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editSaving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
          onMouseDown={(e) => handleOutsideClick(e, deleteModalRef, () => setShowDeleteModal(false))}
        >
          <div
            ref={deleteModalRef}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-[scaleIn_0.15s_ease-out]"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
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
              ? This action cannot be undone.
            </p>

            <div className="mt-8 flex justify-center gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border px-5 py-2 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={deleteSaving}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteSaving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-[slideUp_0.2s_ease-out]">
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {toast.message}
          </div>
        </div>
      )}

    </div>
  );
};