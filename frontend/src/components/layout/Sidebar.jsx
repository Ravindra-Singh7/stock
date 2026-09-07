import { BarChart3, BriefcaseBusiness, LayoutDashboard, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
  { to: "/watchlist", label: "Watchlist", icon: Star }
];

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <aside className="glass-panel hidden w-72 flex-col rounded-[2rem] border-white/10 p-6 lg:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-brand-500/20 p-3 text-brand-400">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">StockIt</p>
          <h1 className="text-xl font-bold">Stock Analyzer</h1>
        </div>
      </div>
      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 rounded-3xl border border-white/10 bg-black/10 p-4">
        <p className="text-sm font-semibold text-white">{user?.name}</p>
        <p className="mt-1 text-xs text-slate-400">{user?.email}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-4 rounded-2xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"
        >
          Logout
        </button>
      </div>
      <div className="mt-auto rounded-3xl border border-brand-400/20 bg-brand-500/10 p-5">
        <p className="text-sm font-semibold text-brand-300">Market Pulse</p>
        <p className="mt-2 text-sm text-slate-300">
          Stay on top of NSE and US names with live pricing, technical views, and portfolio tracking.
        </p>
      </div>
    </aside>
  );
}
