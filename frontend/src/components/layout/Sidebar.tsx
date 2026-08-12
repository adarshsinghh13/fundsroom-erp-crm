import {
  Boxes,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    name: "Products",
    path: "/products",
    icon: Package,
  },
  {
    name: "Inventory",
    path: "/inventory",
    icon: Boxes,
  },
  {
    name: "Sales Challans",
    path: "/challans",
    icon: FileText,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-slate-900 text-white transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-6">
          <h1 className="text-xl font-bold">FundsRoom ERP</h1>

          <button
            onClick={onClose}
            className="lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-700 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-red-600 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}