import { Menu, User } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-xl font-semibold text-slate-800">
          FundsRoom ERP
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
          <User className="text-white" size={18} />
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-medium">Admin</p>
          <p className="text-xs text-slate-500">Administrator</p>
        </div>
      </div>
    </header>
  );
}