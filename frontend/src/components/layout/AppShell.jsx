import { motion } from "framer-motion";
import { BriefcaseBusiness, LayoutDashboard, Star } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import AnimatedBackdrop from "../shared/AnimatedBackdrop";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const mobileItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
  { to: "/watchlist", label: "Watchlist", icon: Star }
];

export default function AppShell() {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <Sidebar />
        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="scrollbar-thin relative overflow-hidden rounded-[2rem] border border-white/5 bg-slate-950/70 p-5 md:p-8"
        >
          <AnimatedBackdrop />
          <div className="relative z-10">
          <Topbar />
          <nav className="mb-6 grid grid-cols-3 gap-3 lg:hidden">
            {mobileItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `glass-panel flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm ${
                    isActive ? "text-white" : "text-slate-400"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
