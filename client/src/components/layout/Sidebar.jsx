import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, LayoutDashboard, PlusCircle, User } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add-food", label: "Add Food", icon: PlusCircle },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 84 : 260 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="hidden h-[calc(100vh-2rem)] shrink-0 rounded-2xl border border-white/20 bg-white/70 p-3 shadow-glass backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/65 md:block"
    >
      <button
        onClick={onToggle}
        className="mb-4 w-full rounded-xl border border-white/20 bg-white/50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider dark:border-slate-700 dark:bg-slate-900/60"
      >
        {collapsed ? "Expand" : "Collapse"}
      </button>
      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-all ${
                active
                  ? "bg-brand-600 text-white shadow-soft"
                  : "text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
