import { useEffect, useRef, useState } from "react";
import { Plus, Search, X, CheckCircle2, AlertCircle, UserX, Trash2 } from "lucide-react";
import { getCustomers } from "../../api/customers";
import type { Customer } from "../../types/customer";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { motion } from "framer-motion";

const tableVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

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
        <label className="mb-1 block text-sm font-medium text-ink-900">
          Business Name <span className="text-danger-500">*</span>
        </label>
        <input
          value={form.businessName}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          placeholder="e.g. ABC Technologies Pvt Ltd"
          className={`w-full rounded-md border p-2 text-sm outline-none transition-all focus:ring-1 focus:ring-accent-500 bg-ink-50 focus:bg-white ${
            errors.businessName ? "border-danger-400 focus:border-danger-500 focus:ring-danger-500" : "border-border focus:border-accent-500"
          }`}
        />
        {errors.businessName && (
          <p className="mt-1 text-xs text-danger-500">{errors.businessName}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink-900">
          Contact Person <span className="text-danger-500">*</span>
        </label>
        <input
          value={form.contactPerson}
          onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
          placeholder="e.g. Rahul Sharma"
          className={`w-full rounded-md border p-2 text-sm outline-none transition-all focus:ring-1 focus:ring-accent-500 bg-ink-50 focus:bg-white ${
            errors.contactPerson ? "border-danger-400 focus:border-danger-500 focus:ring-danger-500" : "border-border focus:border-accent-500"
          }`}
        />
        {errors.contactPerson && (
          <p className="mt-1 text-xs text-danger-500">{errors.contactPerson}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-900">
            Email
          </label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="e.g. rahul@abc.com"
            className={`w-full rounded-md border p-2 text-sm outline-none transition-all focus:ring-1 focus:ring-accent-500 bg-ink-50 focus:bg-white ${
              errors.email ? "border-danger-400 focus:border-danger-500 focus:ring-danger-500" : "border-border focus:border-accent-500"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-900">
            Phone
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="e.g. 9876543210"
            className={`w-full rounded-md border p-2 text-sm outline-none transition-all focus:ring-1 focus:ring-accent-500 bg-ink-50 focus:bg-white ${
              errors.phone ? "border-danger-400 focus:border-danger-500 focus:ring-danger-500" : "border-border focus:border-accent-500"
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-danger-500">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink-900">
          Address
        </label>
        <textarea
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Street, City, State, PIN"
          rows={2}
          className="w-full resize-none rounded-md border border-border p-2 text-sm outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500 bg-ink-50 focus:bg-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-900">
            GST Number
          </label>
          <input
            value={form.gstNumber}
            onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
            placeholder="e.g. 24ABCDE1234F1Z5"
            className="w-full rounded-md border border-border p-2 text-sm outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500 bg-ink-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-900">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as CustomerStatus })
            }
            className="w-full rounded-md border border-border p-2 text-sm outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500 bg-ink-50 focus:bg-white"
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">
            Customers
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage your client directory and contact details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 shadow-elevation-1"
            />
          </div>

          <button
            onClick={openAddModal}
            className="flex h-9 items-center justify-center gap-2 rounded-md bg-accent-600 px-4 text-sm font-medium text-white transition hover:bg-accent-700 shadow-elevation-1"
          >
            <Plus size={16} />
            New Customer
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-elevation-1">

        {loading ? (
          <div className="p-5 space-y-3">
             {Array.from({ length: 5 }).map((_, i) => (
               <Skeleton key={i} className="h-10 w-full" />
             ))}
          </div>
        ) : (
          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-border bg-ink-50 text-left text-ink-500">
                <th className="px-5 py-3 font-medium">Business Name</th>
                <th className="px-5 py-3 font-medium">Contact Person</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium tabular-data">Phone</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <motion.tbody 
              variants={tableVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-border"
            >
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState 
                      icon={UserX} 
                      title="No customers found" 
                      description={search ? "Try a different search term" : "Get started by adding your first customer"}
                      action={!search ? <button onClick={openAddModal} className="text-accent-600 font-medium hover:underline text-sm">Add Customer</button> : null}
                    />
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <motion.tr
                    variants={rowVariants}
                    key={customer.id}
                    className="transition-colors hover:bg-ink-50/50 group"
                  >
                    <td className="px-5 py-3 font-medium text-ink-900">
                      {customer.businessName}
                    </td>

                    <td className="px-5 py-3 text-ink-600">
                      {customer.contactPerson}
                    </td>

                    <td className="px-5 py-3 text-ink-600">
                      {customer.email || "-"}
                    </td>

                    <td className="px-5 py-3 tabular-data text-ink-600">
                      {customer.phone || "-"}
                    </td>

                    <td className="px-5 py-3">
                      <Badge variant={customer.status === "ACTIVE" ? "success" : "neutral"}>
                        {customer.status}
                      </Badge>
                    </td>

                    <td className="px-5 py-3 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="text-ink-400 hover:text-accent-600 transition-colors"
                          title="Edit"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => openDeleteModal(customer)}
                          className="text-ink-400 hover:text-danger-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
          onMouseDown={(e) => handleOutsideClick(e, addModalRef, () => setShowAddModal(false))}
        >
          <div
            ref={addModalRef}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-elevation-3 animate-[scaleIn_0.15s_ease-out]"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink-950">Add Customer</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-md p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
              >
                <X size={18} />
              </button>
            </div>

            {renderFormFields(addForm, setAddForm, addErrors)}

            <div className="mt-8 flex justify-end gap-3 border-t border-border pt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
              >
                Cancel
              </button>

              <button
                onClick={handleAddSave}
                disabled={addSaving}
                className="flex items-center gap-2 rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-elevation-1"
              >
                {addSaving && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
          onMouseDown={(e) => handleOutsideClick(e, editModalRef, () => setShowEditModal(false))}
        >
          <div
            ref={editModalRef}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-elevation-3 animate-[scaleIn_0.15s_ease-out]"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink-950">Edit Customer</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-md p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
              >
                <X size={18} />
              </button>
            </div>

            {renderFormFields(editForm, setEditForm, editErrors)}

            <div className="mt-8 flex justify-end gap-3 border-t border-border pt-5">
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
              >
                Cancel
              </button>

              <button
                onClick={handleEditSave}
                disabled={editSaving}
                className="flex items-center gap-2 rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-elevation-1"
              >
                {editSaving && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
          onMouseDown={(e) => handleOutsideClick(e, deleteModalRef, () => setShowDeleteModal(false))}
        >
          <div
            ref={deleteModalRef}
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elevation-3 animate-[scaleIn_0.15s_ease-out]"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-50 text-danger-600 ring-4 ring-danger-50">
              <Trash2 size={24} />
            </div>

            <h2 className="text-center text-lg font-semibold text-ink-950">
              Delete Customer
            </h2>

            <p className="mt-2 text-center text-sm text-ink-500">
              Are you sure you want to delete <span className="font-medium text-ink-900">{selectedCustomer.businessName}</span>? This action cannot be undone.
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={deleteSaving}
                className="flex items-center gap-2 rounded-md bg-danger-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-danger-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-elevation-1"
              >
                {deleteSaving && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-[slideUp_0.2s_ease-out]">
          <div
            className={`flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium shadow-elevation-2 ${
              toast.type === "success"
                ? "border-success-200 bg-success-50 text-success-700"
                : "border-danger-200 bg-danger-50 text-danger-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {toast.message}
          </div>
        </div>
      )}

    </div>
  );
};