import { useState, useRef, useEffect } from "react";
import { Bell, Search, Menu, Sun, Moon, Settings, LogOut, ChevronDown, X, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

interface NavbarProps {
  onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, { label: string; parent: string }> = {
  dashboard: { label: "Dashboard", parent: "Overview" },
  customers: { label: "Customers", parent: "Business" },
  products: { label: "Products", parent: "Business" },
  inventory: { label: "Inventory", parent: "Business" },
  challans: { label: "Sales Challans", parent: "Business" },
};

const MOCK_NOTIFICATIONS = [
  { id: 1, icon: AlertCircle, color: "text-danger-500 bg-danger-50", title: "Low stock alert", desc: "Wireless Mouse has only 3 units left", time: "2m ago", read: false },
  { id: 2, icon: CheckCircle2, color: "text-success-600 bg-success-50", title: "Challan confirmed", desc: "Challan #CH-0042 marked as delivered", time: "15m ago", read: false },
  { id: 3, icon: Info, color: "text-accent-600 bg-accent-50", title: "New customer added", desc: "Infosys Ltd was registered", time: "1h ago", read: true },
];

export function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const pathKey = location.pathname.split("/").filter(Boolean)[0] || "dashboard";
  const pageInfo = PAGE_TITLES[pathKey] || { label: pathKey.charAt(0).toUpperCase() + pathKey.slice(1), parent: "Overview" };

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userInitial = user.name?.charAt(0)?.toUpperCase() || "A";
  const userName = user.name || "Admin User";
  const userEmail = user.email || "admin@fundsroom.com";

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  function markAllRead() {
    setNotifications((n) => n.map((item) => ({ ...item, read: true })));
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6 shadow-elevation-1 z-30 relative">
      {/* Left: Mobile hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-sm">
          <span className="text-ink-400 hover:text-ink-700 cursor-pointer transition-colors">{pageInfo.parent}</span>
          <span className="text-ink-300">/</span>
          <span className="font-semibold text-ink-900 dark:text-ink-100">{pageInfo.label}</span>
        </div>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search bar */}
        <div className="hidden md:flex relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-ink-400 group-focus-within:text-accent-500 transition-colors">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-56 rounded-lg border border-border bg-ink-50 pl-9 pr-9 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-all"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
            <kbd className="rounded border border-border bg-card px-1.5 font-mono text-[10px] font-medium text-ink-400">⌘K</kbd>
          </div>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-all hover:border-ink-300"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-all hover:border-ink-300"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger-500 ring-2 ring-card" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-elevation-3 overflow-hidden z-50 animate-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-ink-900">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-accent-600 hover:text-accent-700 font-medium transition-colors">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="text-ink-400 hover:text-ink-700 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className={`flex gap-3 px-4 py-3 transition-colors hover:bg-ink-50 cursor-pointer ${!n.read ? "bg-accent-50/40" : ""}`}
                      onClick={() => setNotifications((prev) => prev.map((item) => item.id === n.id ? { ...item, read: true } : item))}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900 leading-tight">{n.title}</p>
                        <p className="text-xs text-ink-500 mt-0.5 line-clamp-1">{n.desc}</p>
                        <p className="text-[11px] text-ink-400 mt-1">{n.time}</p>
                      </div>
                      {!n.read && <div className="h-2 w-2 shrink-0 rounded-full bg-accent-500 mt-1.5" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
            className="flex items-center gap-2 rounded-lg border border-border bg-card pl-1 pr-2 py-1 hover:bg-ink-50 hover:border-ink-300 transition-all"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-accent-600 text-xs font-bold text-white">
              {userInitial}
            </div>
            <span className="hidden sm:block text-sm font-medium text-ink-800 max-w-[80px] truncate">{userName.split(" ")[0]}</span>
            <ChevronDown size={14} className={`text-ink-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-elevation-3 overflow-hidden z-50 animate-in">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-ink-900 truncate">{userName}</p>
                <p className="text-xs text-ink-500 truncate mt-0.5">{userEmail}</p>
              </div>
              <div className="py-1">
                <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                  <Settings size={15} className="text-ink-400" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}