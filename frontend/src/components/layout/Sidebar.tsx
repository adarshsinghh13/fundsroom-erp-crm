import {
  Boxes,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuSections = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Business",
    items: [
      { name: "Customers", path: "/customers", icon: Users },
      { name: "Products", path: "/products", icon: Package },
      { name: "Inventory", path: "/inventory", icon: Boxes },
      { name: "Sales Challans", path: "/challans", icon: FileText },
    ],
  },
];

export function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userInitial = user.name?.charAt(0)?.toUpperCase() || "A";
  const userName = user.name || "Admin User";
  const userEmail = user.email || "admin@fundsroom.com";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col border-r border-ink-800 bg-ink-950 text-ink-300 transition-all duration-200 ease-out lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-16" : "lg:w-64"} w-64`}
      >
        {/* Logo/Brand */}
        <div className={`flex h-16 shrink-0 items-center border-b border-ink-800/60 px-4 ${collapsed ? "justify-center" : "justify-between px-5"}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-accent-600 text-white shadow-elevation-1">
                <Briefcase size={18} strokeWidth={2.5} />
              </div>
              <span className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent text-[17px] font-semibold tracking-tight whitespace-nowrap">
                FundsRoom
              </span>
            </div>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-accent-600 text-white shadow-elevation-1">
              <Briefcase size={18} strokeWidth={2.5} />
            </div>
          )}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-400 hover:bg-ink-800 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
          {menuSections.map((section, idx) => (
            <div key={idx} className={idx > 0 ? "mt-4" : ""}>
              {!collapsed && (
                <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-ink-600">
                  {section.title}
                </div>
              )}
              {collapsed && idx > 0 && (
                <div className="my-2 mx-2 border-t border-ink-800/60" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.path} className="relative group/item">
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `relative flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-all duration-150 ${
                            collapsed ? "justify-center" : ""
                          } ${
                            isActive
                              ? "nav-active-glow text-white"
                              : "text-ink-400 hover:bg-ink-900/80 hover:text-ink-100"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {/* Animated Active Indicator */}
                            {isActive && (
                              <motion.div
                                layoutId="sidebar-active"
                                className={`absolute inset-0 rounded-md bg-gradient-to-r from-accent-500/20 to-indigo-500/10 ${collapsed ? "" : "border-l-[3px] border-accent-500"}`}
                                initial={false}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                            )}
                            <Icon
                              size={18}
                              className={`relative z-10 shrink-0 transition-colors duration-150 ${
                                isActive
                                  ? "text-accent-400"
                                  : "text-ink-500 group-hover/item:text-ink-300"
                              }`}
                            />
                            {!collapsed && <span className="relative z-10">{item.name}</span>}
                          </>
                        )}
                      </NavLink>

                      {/* Collapsed tooltip */}
                      {collapsed && (
                        <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink-800 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/item:opacity-100">
                          {item.name}
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-ink-800" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden lg:flex justify-center py-2 border-t border-ink-800/60">
          <button
            onClick={onToggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-800 hover:text-white transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User footer */}
        {!collapsed && (
          <div className="shrink-0 border-t border-ink-800 p-3">
            <div className="flex w-full items-center justify-between rounded-lg bg-ink-900/50 p-2.5 transition-colors hover:bg-ink-900">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-accent-600 text-xs font-bold text-white ring-2 ring-ink-700">
                  {userInitial}
                </div>
                <div className="flex flex-col truncate">
                  <span className="truncate text-sm font-medium text-white leading-tight">{userName}</span>
                  <span className="truncate text-[11px] text-ink-500 leading-tight">{userEmail}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 flex shrink-0 items-center justify-center rounded-md p-1.5 text-ink-400 transition-colors hover:bg-danger-500/10 hover:text-danger-500"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Collapsed user avatar */}
        {collapsed && (
          <div className="shrink-0 border-t border-ink-800 p-2 flex flex-col items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-accent-600 text-xs font-bold text-white ring-2 ring-ink-700">
              {userInitial}
            </div>
            <button
              onClick={handleLogout}
              className="flex h-7 w-7 items-center justify-center rounded-md text-ink-500 hover:bg-danger-500/10 hover:text-danger-500 transition-colors"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}